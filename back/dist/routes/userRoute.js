"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const userId = req.query.userId;
        console.log("User ID:", userId);
        if (!userId) {
            return cb(new Error("User ID not provided"));
        }
        cb(null, `profile-${userId}${ext}`);
    },
});
const upload = multer({
    storage: storage,
});
const router = express.Router();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstname, lastname, email, password, phone } = req.body;
    const user = yield User.findOne({ where: { email: email } });
    if (!user || user === null) {
        // create a user
        bcrypt.hash(password, 10).then((hash) => {
            User.create({
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: hash,
                phone: phone,
            });
            res.json("User created");
        });
    }
    else {
        res.json({ error: "User already exists", status: 409 });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Login request body", req.body);
    const { email, password } = req.body;
    const user = yield User.findOne({ where: { email: email } });
    if (!user || user === null) {
        res.json({ error: "User doesn't exist", status: 404 });
    }
    else {
        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                res.json({ error: "Wrong email or password" });
            }
            res.json({
                isCorrectLogin: true,
                user: user,
            });
        });
    }
}));
router.post("/upload", upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).send("User ID is required.");
        }
        const filePath = `/uploads/${req.file.filename}`;
        console.log("File path:", filePath);
        yield User.update({ profilePic: filePath }, { where: { id: userId } });
        res.send({
            message: "File uploaded successfully",
            filePath: filePath,
        });
    }
    catch (error) {
        console.error("Upload error: ", error);
        res.status(500).send("Error uploading file: " + error.message);
    }
}));
exports.default = router;
