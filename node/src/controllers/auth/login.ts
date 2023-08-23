import { Request, Response } from "express";
import { client } from "../../util/helpers/prismaClient";

export const login = async (
  req: Request<any, any, { email: string }>,
  res: Response
) => {
  try {
    const user = await client.user.findFirst({
      where: {
        email: req.body.email,
      },
    });

    if (user == null) {
      return res.status(400).json({
        ok: false,
        message: "No user",
      });
    }

    res.cookie("user", user.email);
    res.status(200).json({
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
