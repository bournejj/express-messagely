
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/user");
const { DB_URI, BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const ExpressError = require("../expressError");



const router = express.Router();

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post("/login", async function (req,res,next) {

  try {
    const {username, password} = req.body;
    // console.log(username)
    const user = await User.authenticate(username, password)
 
  
    if(user){
      if (await bcrypt.compare(password, user[0].password) == true) {
         const token = jwt.sign({username}, SECRET_KEY);
         return res.json({token})
      
    }
  }
   
 

  } catch (err) {
    return next(err)
  }
});



/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

 router.post("/register", async function (req, res, next) {
    try {
        const join_at = new Date();
        const newUser = await User.register({ ...req.body, join_at });
        console.log(newUser)
        return res.json({Welcome: newUser});
      } 
     catch (err) {
      return next(err);
    }
  });

  function getCurrentDate() {
    const t = new Date();
    const date = ('0' + t.getDate()).slice(-2);
    const month = ('0' + (t.getMonth() + 1)).slice(-2);
    const year = t.getFullYear();
    return `${date}-${month}-${year}`;
  }

 module.exports = router;