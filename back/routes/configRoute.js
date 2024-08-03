const fs = require("fs");
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./diagram-configs");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send("Configuration uploaded successfully.");
});

router.get("/list", (req, res) => {
  const configDir = "./diagram-configs";
  fs.readdir(configDir, (err, files) => {
    if (err) {
      return res.status(500).send("Unable to list configurations.");
    }
    const configs = files.map((file) => {
      const content = fs.readFileSync(`${configDir}/${file}`, "utf-8");
      const config = JSON.parse(content);
      return { filename: file, name: config.name };
    });
    res.json(configs);
  });
});

router.get("/get-config/:name", (req, res) => {
  const configName = req.params.name;
  console.log("Finding config with name", configName);
  const configData = fs.readFileSync(
    `./diagram-configs/${configName}`,
    "utf-8"
  );
  console.log("Returning config data", JSON.parse(configData));
  res.json(JSON.parse(configData));
});

module.exports = router;
