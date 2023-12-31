const db = require("../db");
const {hash, compare} = require('bcrypt');
const { BCRYPT_WORK_FACTOR } = require("../config");
const Message = require("./message");

/** User class for message.ly */



/** User of the site. */

class User {

  constructor({username, first_name, last_name, phone, join_at, last_login_at}) {
    this.username = username;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
    this.join_at = join_at;
    this.last_login_at = last_login_at;
  }

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) {
    try {
      const hashedPassword = await hash(password, BCRYPT_WORK_FACTOR);
      const result = await db.query(
        `INSERT INTO users
        (username, password, first_name, last_name, phone)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING username, password, first_name, last_name, phone, last_login_at, join_at`,
        [username, hashedPassword, first_name, last_name, phone]
      );
      return new User(result.rows[0]);
    } catch (err) {
      throw err
    }
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {
    try {
      const result = await db.query(
        `SELECT password
        FROM users
        WHERE username = $1`,
        [username]
      )
      return result.rowCount === 1 && await compare(password, result.rows[0].password);
    } catch (err) {
      throw err
    }
  }

  /** Update last_login_at for user */

  async updateLoginTimestamp() {
    const result = await db.query(
      `UPDATE users
      SET last_login_at = current_timestamp
      WHERE username = $1
      RETURNING username, last_login_at`,
      [this.username]
    );
    this.last_login_at = result.rows[0].last_login_at;
    return this;
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const result = await db.query(
    `
      SELECT username, first_name, last_name, phone, last_login_at, join_at
      FROM users
    `);
    return result.rows.map(u => new User(u));
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) {
    const result = await db.query(
      `SELECT username, first_name, last_name, phone, join_at, last_login_at
      FROM users
      WHERE username = $1`,
      [username]
    );
    return new User(result.rows[0]);
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  async messagesFrom() {
    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              JSON_BUILD_OBJECT(
                'username', u.username,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'phone', u.phone
              ) to_user,
              m.from_username,
              m.to_username
      FROM messages AS m
      JOIN users AS u ON m.to_username = u.username
      WHERE m.from_username = $1
      ORDER BY m.sent_at DESC`,
      [this.username]
    )
    return result.rows.map(m => new Message(m))
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  async messagesTo() {
    const result = await db.query(
      `SELECT m.id,
              m.body,
              m.sent_at,
              m.read_at,
              JSON_BUILD_OBJECT(
                'username', u.username,
                'first_name', u.first_name,
                'last_name', u.last_name,
                'phone', u.phone
              ) from_user,
              from_username,
              to_username
      FROM messages AS m
      JOIN users AS u ON m.from_username = u.username
      WHERE m.to_username = $1
      ORDER BY m.sent_at DESC`,
      [this.username]
    )
    return result.rows.map(m => new Message(m))
  }

  async updatePassword(currentPassword, newPassword) {
    const dbPassword = await db.query(`SELECT password FROM users WHERE username = $1`, [this.username]);
    const validPassword = await compare(currentPassword, dbPassword.rows[0].password);
    if (!validPassword) {
      throw new ExpressError(`Invalid password`, 400);
    }

    const hashedPassword = await hash(newPassword, BCRYPT_WORK_FACTOR);
    const result = await db.query(
      `UPDATE users
      SET password = $1
      WHERE username = $2
      RETURNING username`,
      [hashedPassword, this.username]
    );
    return this
  }
}


module.exports = User;