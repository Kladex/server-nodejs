import { registerUser } from "../types/newUser";
import { pool } from "./database";

const registerToDb = async (newUser: registerUser) => {
  await pool.query(
    `
        insert into users (username, email, password, created_at, last_logged_in)
        values ($1, $2, $3, $4, $5)
      `,
    [
      newUser.username,
      newUser.email,
      newUser.password,
      newUser.created_at,
      newUser.last_logged_in,
    ]
  );
};

const findUserFromDb = async (email: string) => {
  const user = await pool.query(`select * from users where email=$1`, [email]);
  const hasUser = user.rows[0] !== undefined;

  return { user, hasUser };
};

const updateLastestLoginToDb = async (email: string) => {
  await pool.query(
    `UPDATE users SET last_logged_in=$1 where email=$2 returning user_id, username, email`,
    [new Date(), email]
  );
};

const getProfileFromDb = async (userId: string | number) => {
  const result = await pool.query(
    "select user_id, username, email from users where user_id=$1",
    [userId]
  );

  return result;
};

export {
  registerToDb,
  findUserFromDb,
  updateLastestLoginToDb,
  getProfileFromDb,
};
