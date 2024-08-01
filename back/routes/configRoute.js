const fs = require("fs");
const express = require("express");

const router = express.Router();

router.post("/upload-config", (req, res) => {
  const configData = req.body;
  fs.writeFileSync("./configs/petri-net.json", JSON.stringify(configData));
  res.status(200).send("Configuration uploaded successfully.");
});

router.get("/get-config/:name", (req, res) => {
  const configName = req.params.name;
  console.log("hello", configName);
  const configData = fs.readFileSync(`./config/${configName}.json`, "utf-8");
  res.json(JSON.parse(configData));
});

module.exports = router;
