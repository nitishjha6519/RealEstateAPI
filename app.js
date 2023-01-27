const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;
const URL = `mongodb+srv://${process.env.MONGOUSER}:${process.env.MONGOPASS}@cluster0.eqvbavg.mongodb.net/RealEstate?retryWrites=true&w=majority`;
mongoose.connect(
  URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.log("err " + err);
    } else {
      console.log("connected to DB");
    }
  }
);

const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");

const loginRoute = require("./routes/loginRoutes");
// const dashboardRoute = require("./routes/dashboard");
const propertyRoute = require("./routes/property");

const secret = process.env.secret;
const app = express();
// middlewares
app.use(cors());
app.use(bodyparser.json());
app.use("/", loginRoute);
//jwt verification
app.use("/property", async (req, res, next) => {
  if (req.headers.authorization) {
    const bearerToken = req.headers.authorization;
    const token = bearerToken.split(" ")[1];

    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        return res.status(400).json({ status: "Failed", message: err.message });
      }
      // console.log(decoded.data);
      req.id = decoded.data;
      next();
    });
  } else {
    res.status(409).json({
      status: "failed",
      message: "Authentication required",
    });
  }
});

// app.use("/dashboard", dashboardRoute);
app.use("/property", propertyRoute);

// in the routes we have user.js and login routes are definedthere
app.listen(PORT, () => console.log("Server is up at 5000"));
