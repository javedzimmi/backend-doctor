import express from "express";
import upload from "../middelwares/multer.js";
import { addDoctor, allDoctors, LoginAdmin } from "../controllers/adminController.js";
import authAdmin from "../middelwares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";




const adminRouter = express.Router();

adminRouter.post("/add-doctor",authAdmin,upload.single(`image`) ,addDoctor);
adminRouter.post("/login",LoginAdmin);
adminRouter.post("/all-doctors",authAdmin,allDoctors);
adminRouter.post("/change-availability",authAdmin,changeAvailability);
export default adminRouter;
