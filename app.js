const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/users");

mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://mousearts:" +
    process.env.MONGO_ATLAS_PW +
    "@node-learn-shard-00-00-uss3v.mongodb.net:27017,node-learn-shard-00-01-uss3v.mongodb.net:27017,node-learn-shard-00-02-uss3v.mongodb.net:27017/test?ssl=true&replicaSet=node-learn-shard-0&authSource=admin",
  {
    useMongoClient: true
  }
);

// Use morgan first
app.use(morgan("dev"));

// Make path accessible
app.use("/uploads/", express.static("uploads"));
app.use(bodyParser.urlencoded({ encoded: false, extended: true }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Controll-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// Route which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);

  res.json({
    error: {
      message: error.message
    }
  });
});

// app.use((req, res, next) => {
//     res.status(200).json({
//         message: 'It works!'
//     });
// });

module.exports = app;
