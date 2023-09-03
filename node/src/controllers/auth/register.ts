import { NextFunction, Request, Response } from "express";
import { client } from "../../util/helpers/prismaClient";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AppError, BadRequestError } from "../../util/error/ErrorHandlers";

export const register = async (
  req: Request<any, any, { email: string; password: string }>,
  res: Response,
  next: NextFunction
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
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        next(new BadRequestError("test"));
        // return res.status(400).json({
        //   ok: false,
        //   message: "User is registered",
        // });
      }
    } else {
      res.status(500).json({
        ok: false,
        message: "Something went wrong (!user not unique or other error)",
      });
    }
  }
};
