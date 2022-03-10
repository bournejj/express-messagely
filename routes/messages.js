
const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const message = require("../models/message");


const router = express.Router();

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


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

 router.post("/", ensureLoggedIn, async function (req, res, next) {
    try {
        const sent_at = new Date();
        const userMessage = await message.create({ ...req.body, sent_at });
        return res.json({userMessage});
      } 
     catch (err) {
      return next(err);
    }
  });
 router.get("/", async function (req, res, next) {
    try {
   
        const userMessages = await message.findAll();
        console.log(userMessages)
        return res.json({userMessages});
      } 
     catch (err) {
      return next(err);
    }
  });
 router.get("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
      let username = req.user.username;
        const message = await message.get(req.params.id);
        return res.json({message});
      } 
     catch (err) {
      return next(err);
    }
  });


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

 module.exports = router;

