const router = require("express").Router();
const User = require('../models/user');
const { ensureLoggedIn, ensureCorrectUser } = require('../middleware/auth');
module.exports = router;

/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/
router.get('/', async (req, res) => {
  const users = await User.all();
  return res.json({ users });
})

/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/
router.get('/:username', async (req, res) => {
  const {username} = req.params;
  const user = await User.get(username);
  return res.json({ user });
})

/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/to', ensureCorrectUser, async (req, res) => {
  const {username} = req.params;
  const user = await User.get(username);

  const messages = await user.messagesTo(username);
  return res.json({ messages });
})

/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
router.get('/:username/from', ensureCorrectUser, async (req, res) => {
  const {username} = req.params;
  const user = await User.get(username);

  const messages = await user.messagesFrom(username);

  return res.json({ messages });
})

router.post('/password/update', ensureLoggedIn, async (req, res) => {
  const { username } = req.user
  const { current_password, new_password } = req.body

  const user = await User.get(username)

  try {
    await user.updatePassword(current_password, new_password)
    return res.json({ success: true })
  } catch (err) {
    return res.status(400).json({ error: err.message })
  }
})