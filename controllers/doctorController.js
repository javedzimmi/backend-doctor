import doctorModel from "../models/doctorModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;

    if (!docId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const docData = await doctorModel.findById(docId);
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    await doctorModel.findByIdAndUpdate(docId, { available: !docData.available });

    res.status(200).json({ success: true, message: "Availability Changed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const doctorsList = async (req, res) => {

  try {
    const doctors = await doctorModel.find({}).select(['-password', '-email'])
    console.log(doctors)
    res.status(200).json({ success: true, doctors })


  } catch (error) {
    res.status(200).json({ success: false, message: error })
  }

}

export { changeAvailability, doctorsList };
