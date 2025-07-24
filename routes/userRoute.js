import express from "express"
import { bookAppointment, getProfile, listAppointment, loginUser, registeruser, updateProfile } from "../controllers/userController.js";
import authUser from "../middelwares/authUser.js";
import upload from "../middelwares/multer.js";

const userRouter = express.Router();
userRouter.post("/register", registeruser);

userRouter.post("/login", loginUser);


userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile);
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
export default userRouter