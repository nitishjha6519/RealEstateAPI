const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const PORT = process.env.PORT || 5000;

//Database connection
// mongoose.connect("mongodb://127.0.0.1/prt",err=>{
//     if(err){
//         console.log(err)
//     }else{
//         console.log("connected to DB")
//     }
// })
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

app.listen(PORT, () => console.log("Server is up at 5000"));
