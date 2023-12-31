const router = require("express").Router();
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const Message = require('../models/message');
const User = require("../models/user");
const { sendSMS } = require("../services/notification");
module.exports = router;

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/
router.get('/:id', ensureLoggedIn, async (req, res) => {
  const {id} = req.params;
  const message = await Message.get(id);
  if (message.to_user.username === req.user.username || message.from_user.username === req.user.username) {
    return res.json({ message });
  } else {
    return res.status(400).json({ error: 'Unauthorized' });
  }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/
router.post('/', ensureLoggedIn, async (req, res) => {
  const {to_username, body} = req.body;
  const from_username = req.user.username;
  const message = await Message.create({from_username, to_username, body});
  const toUser = await User.get(to_username);

  sendSMS(toUser.phone, `New message from @${from_username}`);
  return res.json({ message });

})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/
router.post('/:id/read', ensureLoggedIn, async (req, res) => {
  const {id} = req.params;
  const message = await Message.get(id);
  if (message.to_user.username === req.user.username) {
    await message.markRead(id);
    return res.json({ message: 'read' });
  } else {
    return res.status(400).json({ error: 'Unauthorized' });
  }
  
})