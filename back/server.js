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
const activityRoute = require("./routes/activityRoute");
const teamRoute = require("./routes/teamRoute");
const notificationRoute = require("./routes/notificationRoute");

// routers
app.use("/user", basicAuth, userRoute);
app.use("/activity", basicAuth, activityRoute);
app.use("/team", basicAuth, teamRoute);
app.use("/notification", basicAuth, notificationRoute);
app.use("/uploads", express.static("uploads"));

// db setup
const port = process.env.PORT || 8080;
const db = require("./models");
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
