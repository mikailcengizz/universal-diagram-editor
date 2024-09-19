import { Router, Request, Response } from "express";
import type { Callback, MetaModelFile, ModelFileType, RepresentationModelFile, EPackage } from "../types/types";

const fs = require("fs");
const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");

const configDir = "./diagram-configs";

const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Callback) => {
    cb(null, configDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb: Callback) => {
    const originalName =
      file.originalname + ".json" || "default-config-name.json";
    cb(null, originalName);
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  res.status(200).send("Configuration uploaded successfully.");
});

// Endpoint to get config by 'name' field inside the configuration file
router.get("/get-meta-config-by-name/:name", (req: Request, res: Response) => {
  const requestedName = req.params.name;

  // Read all config files in the directory
  fs.readdir(configDir, (err: any, files: string[]) => {
    if (err) {
      return res.status(500).send("Unable to read configurations.");
    }

    for (const file of files) {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const config: MetaModelFile = JSON.parse(content);

      // Check if the 'name' field in the config matches the requested name
      if (config.name === requestedName && config.type === "meta") {
        return res.json(config); // Return the config if name matches
      }
    }

    // If no config is found with the matching name
    res.status(404).send(null);
  });
});

router.get("/get-representation-config-by-name/:name", (req: Request, res: Response) => {
  const requestedName = req.params.name;

  // Read all config files in the directory
  fs.readdir(configDir, (err: any, files: string[]) => {
    if (err) {
      return res.status(500).send("Unable to read configurations.");
    }

    for (const file of files) {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const config: RepresentationModelFile = JSON.parse(content);

      // Check if the 'name' field in the config matches the requested name
      if (config.name === requestedName && config.type === "representation") {
        return res.json(config); // Return the config if name matches
      }
    }

    // If no config is found with the matching name
    res.status(404).send(null);
  });
});


// Save configuration by type or update an existing one by type
router.post("/save", (req: Request, res: Response) => {
  const { name, type, ePackages } = req.body;

  if (!name || !ePackages) {
    return res.status(400).send("Configuration name or ePackages are missing.");
  }

  // Check if a file with the same "name" exists inside the configuration file
  let configFileFound = false;
  let configFilename = "";

  fs.readdir(configDir, (err: any, files: string[]) => {
    if (err) {
      return res.status(500).send("Unable to save configuration.");
    }

    for (const file of files) {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const config: MetaModelFile = JSON.parse(content);

      if (config.name === name && config.type === type) {
        // Match found, update this file
        configFileFound = true;
        configFilename = file;
        break;
      }
    }

    const newConfig: MetaModelFile = {
      name,
      type,
      ePackages: ePackages,
    };

    if (configFileFound) {
      // Update the existing file
      fs.writeFileSync(
        path.join(configDir, configFilename),
        JSON.stringify(newConfig, null, 2)
      );
      return res
        .status(200)
        .send(`Configuration "${name}" updated successfully.`);
    } else {
      // Create a new configuration file
      const newFilename = `${name.replace(/\s+/g, "_").toLowerCase()}.json`; // Create a filename from the config name
      fs.writeFileSync(
        path.join(configDir, newFilename),
        JSON.stringify(newConfig, null, 2)
      );
      return res
        .status(201)
        .send(`Configuration "${name}" saved successfully.`);
    }
  });
});

router.get("/list", (req: Request, res: Response) => {
  fs.readdir(configDir, (err: any, files: Express.Multer.File[]) => {
    if (err) {
      return res.status(500).send("Unable to list configurations.");
    }
    let configs = files.map((file: Express.Multer.File) => {
      const content = fs.readFileSync(`${configDir}/${file}`, "utf-8");
      const config: MetaModelFile = JSON.parse(content);
      if (config.type === "meta") {
        return { filename: file, name: config.name };
      } 
    });
    configs = configs.filter((config: any) => config !== undefined);
    console.log("Returning config list", configs);
    res.json(configs);
  });
});

router.get("/get-config-by-filename/:name", (req: Request, res: Response) => {
  const configName = req.params.name;
  console.log("Finding config with name", configName);
  const configData = fs.readFileSync(`./${configDir}/${configName}`, "utf-8");
  console.log("Returning config data", JSON.parse(configData));
  res.json(JSON.parse(configData));
});

export default router;
