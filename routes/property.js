const express = require("express");
const propertyModel = require("../models/property");
const router = express.Router();

function PPDCreation(DataCount) {
  let count = String(DataCount);
  let PPD = "";
  if (count.length == 1) {
    PPD = "PPD" + "111" + count;
    return PPD;
  } else if (count.length == 2) {
    PPD = "PPD" + "11" + count;
    return PPD;
  } else if (count.length == 3) {
    PPD = "PPD" + "1" + count;
    return PPD;
  } else {
    PPD = "PPD" + count;
    return PPD;
  }
}

router.post("/new", async (req, res) => {
  const details = req.body;

  console.log(req.id);
  //PPD Creation
  let DataCount = await propertyModel.count();
  PPDid = PPDCreation(DataCount);
  let posted = await propertyModel.create({
    ...details,
    ppdid: PPDid,
    user: req.id,
  });

  res.status(200).json({
    status: "ok",
    posted: details,
    PPDid,
    user: req.id,
  });
});

router.get("/propertydetails", async (req, res) => {
  try {
    console.log(req.id);

    //populate is used to fetch user property details from login model, as user is ref to "login"
    let allData = await propertyModel.find({ user: req.id }).populate("user");
    //console.log(allData);
    res.json({
      status: "success",
      allData,
    });
  } catch (e) {
    res.status(500).json({
      status: "Failed",
      message: e.message,
    });
  }
});

module.exports = router;
