import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";

import { newUser } from "../types/newUser";
import {
  registerToDb,
  findUserFromDb,
  updateLastestLoginToDb,
  getProfileFromDb,
} from "../databases/auth.db";

const SECRET_KEY: Secret = process.env.SECRET_KEY;

const register = async (req: Request, res: Response) => {
  const newUser: newUser = {
    ...req.body,
    created_at: new Date(),
    last_logged_in: new Date(),
  };

  const salt = await bcrypt.genSalt(10);
  newUser.password = await bcrypt.hash(newUser.password, salt);

  await registerToDb(newUser);

  return res.json({
    message: "Register successfully",
  });
};

const login = async (req: Request, res: Response) => {
  const email: string = req.body.email;
  const { user, hasUser } = await findUserFromDb(email);

  if (hasUser) {
    const isPassword = await bcrypt.compare(
      req.body.password,
      user.rows[0].password
    );

    if (isPassword) {
      await updateLastestLoginToDb(email);

      const token = jwt.sign(
        {
          id: user.rows[0].user_id,
          username: user.rows[0].username,
          email: user.rows[0].email,
        },
        SECRET_KEY
        // In case of needed expire (Token will change every 15 mins if uncomment.)
        // ,{
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
  const userId = req.params.userId;
  const result = await getProfileFromDb(userId);

  return res.json({
    data: result.rows[0],
  });
};

export { register, login, getProfile };
