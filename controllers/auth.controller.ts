import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { pool } from "../databases/database";

type newUser = {
  username: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
  last_logged_in: Date;
};
const SECRET_KEY: Secret = process.env.SECRET_KEY;

const register = async (req: Request, res: Response) => {
  const newUser: newUser = {
    ...req.body,
    created_at: new Date(),
    last_logged_in: new Date(),
  };
  console.log(newUser);
  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

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

  return res.json({
    message: "Register successfully",
  });
};

const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const user = await pool.query(`select * from users where email=$1`, [email]);
  const hasUser = user.rows[0] !== undefined;

  if (hasUser) {
    const isPassword = await bcrypt.compare(
      req.body.password,
      user.rows[0].password
    );

    if (isPassword) {
      const data = await pool.query(
        `UPDATE users SET last_logged_in=$1 where email=$2 returning user_id, username, email`,
        [new Date(), email]
      );
      const token = jwt.sign(
        {
          id: user.rows[0].user_id,
          username: user.rows[0].username,
          email: user.rows[0].email,
        },
        SECRET_KEY
        // In case of needed expire (Token will change every 15 mins if uncomment.)
        // {
        //   expiresIn: "900000",
        // }
      );
      return res.status(200).json({
        message: "Login successfully",
        token,
      });
    }

    if (!isPassword) {
      return res.status(404).json({
        message: "Incorrect password",
      });
    }
  }

  if (!hasUser) {
    return res.status(404).json({
      message: "Please, register before logging in",
    });
  }
};

const getProfile = async (req: Request, res: Response) => {
  const user_Id = req.params.userId;
  const result = await pool.query(
    "select user_id, username, email from users where user_id=$1",
    [user_Id]
  );

  return res.json({
    data: result.rows[0],
  });
};

export { register, login, getProfile };
