"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const cors = require("cors");
const basicAuth_1 = __importDefault(require("./middleware/basicAuth"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const configRoute_1 = __importDefault(require("./routes/configRoute"));
const models_1 = __importDefault(require("./models"));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// routers
app.use("/user", basicAuth_1.default, userRoute_1.default);
app.use("/config", basicAuth_1.default, configRoute_1.default);
app.use("/uploads", express.static("uploads"));
// db setup
const port = process.env.PORT || 8080;
models_1.default.sequelize.sync().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
});
