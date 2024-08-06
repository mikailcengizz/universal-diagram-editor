import { Router, Request, Response } from "express";
import { Callback } from "../types/types";

const express = require("express");
const { User } = require("../models");
const bcrypt = require("bcrypt");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, cb: Callback) {
    cb(null, "./uploads");
  },
  filename: function (req: Request, file: Express.Multer.File, cb: Callback) {
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

router.post("/", async (req: Request, res: Response) => {
  const { firstname, lastname, email, password, phone } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user || user === null) {
    // create a user
    bcrypt.hash(password, 10).then((hash: any) => {
      User.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: hash,
        phone: phone,
      });
      res.json("User created");
    });
  } else {
    res.json({ error: "User already exists", status: 409 });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  console.log("Login request body", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user || user === null) {
    res.json({ error: "User doesn't exist", status: 404 });
  } else {
    bcrypt.compare(password, user.password).then((match: any) => {
      if (!match) {
        res.json({ error: "Wrong email or password" });
      }

      res.json({
        isCorrectLogin: true,
        user: user,
      });
    });
  }
});

router.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
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

    await User.update({ profilePic: filePath }, { where: { id: userId } });

    res.send({
      message: "File uploaded successfully",
      filePath: filePath,
    });
  } catch (error: any) {
    console.error("Upload error: ", error);
    res.status(500).send("Error uploading file: " + error.message);
  }
});

export default router;  
