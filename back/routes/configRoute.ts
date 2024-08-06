import { Router, Request, Response } from "express";
import type { Callback } from '../types/types';

const fs = require("fs");
const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Callback) => {
    cb(null, "./diagram-configs");
  },
  filename: (req: Request, file: Express.Multer.File, cb: Callback) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send("Configuration uploaded successfully.");
});

router.get("/list", (req: Request, res: Response) => {
  const configDir = "./diagram-configs";
  fs.readdir(configDir, (err: any, files: Express.Multer.File[]) => {
    if (err) {
      return res.status(500).send("Unable to list configurations.");
    }
    const configs = files.map((file: Express.Multer.File) => {
      const content = fs.readFileSync(`${configDir}/${file}`, "utf-8");
      const config = JSON.parse(content);
      return { filename: file, name: config.name };
    });
    res.json(configs);
  });
});

router.get("/get-config/:name", (req: Request, res: Response) => {
  const configName = req.params.name;
  console.log("Finding config with name", configName);
  const configData = fs.readFileSync(
    `./diagram-configs/${configName}`,
    "utf-8"
  );
  console.log("Returning config data", JSON.parse(configData));
  res.json(JSON.parse(configData));
});

export default router;
