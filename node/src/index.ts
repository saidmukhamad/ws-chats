import express from "express";
import { Middlewares } from "./middlewares/middlewares";

const app = express();

new Middlewares(app);
