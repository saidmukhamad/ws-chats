import { Request, Response } from "express";
import { client } from "../../util/helpers/prismaClient";

export const register = async (
  req: Request<any, any, { email: string; password: string }>,
  res: Response
) => {
  try {
    const user = await client.user.create({
      data: {
        email: req.body.email,
        password: req.body.password,
      },
    });

    res.cookie("user", user.email);

    res.status(201).json({
      ok: true,
      data: user,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      ok: false,
      message: "Something went wrong (!user not unique or other error)",
    });
  }
};
