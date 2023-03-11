const express = require("express");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const bodyparser = require("body-parser");

const loginRoute = require("./routes/loginRoutes");
// const dashboardRoute = require("./routes/dashboard");
const propertyRoute = require("./routes/property");

const secret = "MongoTest";
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
module.exports = app;
