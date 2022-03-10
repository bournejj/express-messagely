/** User class for message.ly */
const db = require("../db");
const { DB_URI, BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const ExpressError = require("../expressError");



/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone, join_at}) {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const result = await db.query(`INSERT INTO users
    (username,
     password,
     first_name,
     last_name,
     phone,
     join_at)
    VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      username,
          hashedPassword,
          first_name,
          last_name,
          phone,
          join_at
    ]
    );
    const user = result.rows;

    return result;
   
   }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username,password) {
    const results = await db.query("SELECT * FROM users WHERE username = $1", 
    [username] 

);
const user = results.rows

return user

   }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) {
  const result = await db.query(`UPDATE users SET last_login_at = current_timestamp
  wHERE username = $1 RETURNING username`,
  [username]);

  if(!result.rows[0]) {
    throw new ExpressError(`no such user: ${username}`, 404)
  }
   }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

   static async findAll() {
    const result = await db.query(
          `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  phone
           FROM users
           ORDER BY username`,
    );

    return result.rows;
  }

  static async get(username) { 
    const result = await db.query(
      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              phone
       FROM users
       WHERE username = $1`,
       [username]
);

return result.rows[0]

  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) {
    const result = await db.query(
      `SELECT id,
              to_username,
              body,
              sent_at,
              read_at
       FROM messages
       WHERE from_username = $1`,
       [username]
);
return result.rows

   }
  static async messagesTo(username) {
    const result = await db.query(
      `SELECT id,
              from_username,
              body,
              sent_at,
              read_at
       FROM messages
       WHERE to_username = $1`,
       [username]
);
return result.rows

   }
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

 


module.exports = User;