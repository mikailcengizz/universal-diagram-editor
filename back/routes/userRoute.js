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
    const userId = req.query.userId; // Ensure this is being parsed correctly
    console.log("User ID:", userId); // Debugging log
    if (!userId) {
      return cb(new Error("User ID not provided"));
    }
    cb(null, `profile-${userId}${ext}`); // Ensures file is overwritten if it already exists
  },
});

const upload = multer({
  storage: storage,
});

const router = express.Router();

router.post("/", async (req, res) => {
  const { firstname, lastname, email, password, phone } = req.body;

  const user = await User.findOne({ where: { email: email } });

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
  } else {
    res.json({ error: "User already exists", status: 409 });
  }
});

router.post("/login", async (req, res) => {
  console.log("Login request body", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email: email } });

  if (!user || user === null) {
    res.json({ error: "User doesn't exist", status: 404 });
  } else {
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
});

router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const userId = req.query.userId; // Make sure this is being passed correctly
    if (!userId) {
      return res.status(400).send("User ID is required.");
    }

    const filePath = `/uploads/${req.file.filename}`;
    console.log("File path:", filePath); // Debugging log

    // Update the user's profile picture path in the database
    await User.update({ profilePic: filePath }, { where: { id: userId } });

    res.send({
      message: "File uploaded successfully",
      filePath: filePath,
    });
  } catch (error) {
    console.error("Upload error: ", error);
    res.status(500).send("Error uploading file: " + error.message);
  }
});

module.exports = router;
