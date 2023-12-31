const router = require("express").Router();
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config')
const User = require('../models/user')

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post("/login", async function (req, res) {
  try {
    const { username, password } = req.body;
    const isAuthenticated = await User.authenticate(username, password);
    if (isAuthenticated) {
      const token = jwt.sign({ username }, SECRET_KEY);
      const user = await User.get(username);
      await user.updateLoginTimestamp();
      return res.json({ token });
    } else {
      res.status(400).json({error: 'Unauthorized'})
    }
  } catch (err) {
    res.status(400).json({error: err.message})
  }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async function (req, res) {
  try {
    const { username, password, first_name, last_name, phone } = req.body;
    const user = await User.register({ username, password, first_name, last_name, phone });
    const token = jwt.sign({ username }, SECRET_KEY, {});
    await user.updateLoginTimestamp();
    return res.json({ token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
})

module.exports = router;
