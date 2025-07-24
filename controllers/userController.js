
import validator from "validator"
import bcrypt from "bcrypt"
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

const registeruser = async (req, res) => {

    try {

        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" })
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password" })
        }



        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        const data = {
            name,
            email,
            password: hashedPassword
        }
        const newUser = new userModel(data);

        const user = await newUser.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({ success: true, token })


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}
//api for user login 

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.json({ success: false, message: "user does not exist" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {

            res.json({ success: false, message: "Invalid credentials" })
        }



    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })
    }


}


//api to get user profile data

const getProfile = async (req, res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}


// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        const imageFile = req.file;

        // Check required fields
        if (!name || !phone || !dob || !gender) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Parse address safely
        let parsedAddress = {};
        if (address) {
            try {
                parsedAddress = typeof address === 'string' ? JSON.parse(address) : address;
            } catch (parseError) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid address format. Address must be valid JSON.",
                });
            }
        }

        // Update user basic info
        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: parsedAddress,
            dob,
            gender,
        });

        // Upload image if provided
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: 'image',
            });

            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, {
                image: imageURL,
            });
        }

        res.status(200).json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// book appopintment 
const bookAppointment = async (req, res) => {
    try {
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select("-password");
        if (!docData.available) {
            return res.json({ success: true, message: "Doctor not available" });
        }

        let slots_booked = docData.slots_booked;

        // Checking for slot availability
        if (slots_booked[slotDate]) {
            // If the slot date exists, check if the slot time is available
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: true, message: "Slot not available" });
            } else {
                // Slot is available, add it
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            // If the slot date doesn't exist, add it and then push the slot time
            slots_booked[slotDate] = [slotTime];
        }

        const userData = await userModel.findById(userId).select('-password');
        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // Save new slots data in doctor model
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: "Appointment booked" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }
};

// api to get user appointment  for frontend my-appointment page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body;
        const appointments = await appointmentModel.find({ userId })
        res.json({ success: true, appointments })
    } catch (error) {

        console.error(error);
        res.status(500).json({ success: false, message: "Server error: " + error.message });
    }

}


export { registeruser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment }