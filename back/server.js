const express = require("express");
const app = express();
const cors = require("cors");
const basicAuth = require("./middleware/basicAuth");

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// include route files
const userRoute = require("./routes/userRoute");

// routers
app.use("/user", basicAuth, userRoute);
app.use("/uploads", express.static("uploads"));

// db setup
const port = process.env.PORT || 8080;
const db = require("./models");
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
