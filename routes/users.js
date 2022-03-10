
const express = require("express");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth");
const User = require("../models/user");


const router = express.Router();

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const newUser = await User.register({ ...req.body });
        console.log(newUser)
        return res.json({Welcome: newUser.first_name});
      } 
     catch (err) {
      return next(err);
    }
  });

router.get("/",ensureLoggedIn, async function (req, res, next) {
    try {
      const users = await User.findAll();
      return res.json({ users });
    } catch (err) {
      return next(err);
    }
  });

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });
router.get("/:username/messagesto", ensureCorrectUser, async function (req, res, next) {
    try {
      const user = await User.messagesTo(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });
router.get("/:username/messagesfrom", ensureCorrectUser, async function (req, res, next) {
    try {
      const user = await User.messagesFrom(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  });





/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/


/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/
 function getCurrentDate() {
    const t = new Date();
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${date}-${month}-${year}`;
  }
 module.exports = router;