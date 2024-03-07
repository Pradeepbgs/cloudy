import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = Router();

router.route('/').post(verifyJWT, upload.single("image"), uploadFile)


export default router;