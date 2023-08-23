import { login, register } from "../../../controllers";
import { Router } from "express";

const router = Router();

router.post("/log", login);
router.post("/reg", register);

export default router;
