const express = require("express");
const app = express();
const cors = require("cors");
import basicAuth from "./middleware/basicAuth";
import userRoute from "./routes/userRoute";
import configRoute from "./routes/configRoute";
import db from "./models";

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routers
app.use("/user", basicAuth, userRoute);
app.use("/config", basicAuth, configRoute);
app.use("/uploads", express.static("uploads"));

// db setup
const port = process.env.PORT || 8080;
db.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
