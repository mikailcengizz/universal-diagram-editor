"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const express = require("express");
const path = require("path");
const router = express.Router();
const multer = require("multer");
const configDir = "./diagram-configs";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, configDir);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname + ".json" || "default-config-name.json";
        cb(null, originalName);
    },
});
const upload = multer({ storage });
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    res.status(200).send("Configuration uploaded successfully.");
});
// Endpoint to get config by 'name' field inside the configuration file
router.get("/get-config-by-name/:name", (req, res) => {
    const requestedName = req.params.name;
    // Read all config files in the directory
    fs.readdir(configDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to read configurations.");
        }
        for (const file of files) {
            const filePath = path.join(configDir, file);
            const content = fs.readFileSync(filePath, "utf-8");
            const config = JSON.parse(content);
            // Check if the 'name' field in the config matches the requested name
            if (config.name === requestedName) {
                return res.json(config); // Return the config if name matches
            }
        }
        // If no config is found with the matching name
        res.status(404).send(null);
    });
});
// Save configuration or update an existing one
router.post("/save", (req, res) => {
    const { name, notations } = req.body;
    if (!name || !notations) {
        return res.status(400).send("Configuration name or notations are missing.");
    }
    // Check if a file with the same "name" exists inside the configuration file
    let configFileFound = false;
    let configFilename = "";
    fs.readdir(configDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to save configuration.");
        }
        for (const file of files) {
            const filePath = path.join(configDir, file);
            const content = fs.readFileSync(filePath, "utf-8");
            const config = JSON.parse(content);
            if (config.name === name) {
                // Match found, update this file
                configFileFound = true;
                configFilename = file;
                break;
            }
        }
        const newConfig = {
            name,
            notations,
        };
        if (configFileFound) {
            // Update the existing file
            fs.writeFileSync(path.join(configDir, configFilename), JSON.stringify(newConfig, null, 2));
            return res
                .status(200)
                .send(`Configuration "${name}" updated successfully.`);
        }
        else {
            // Create a new configuration file
            const newFilename = `${name.replace(/\s+/g, "_").toLowerCase()}.json`; // Create a filename from the config name
            fs.writeFileSync(path.join(configDir, newFilename), JSON.stringify(newConfig, null, 2));
            return res
                .status(201)
                .send(`Configuration "${name}" saved successfully.`);
        }
    });
});
router.get("/list", (req, res) => {
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
router.get("/get-config-by-filename/:name", (req, res) => {
    const configName = req.params.name;
    console.log("Finding config with name", configName);
    const configData = fs.readFileSync(`./${configDir}/${configName}`, "utf-8");
    console.log("Returning config data", JSON.parse(configData));
    res.json(JSON.parse(configData));
});
exports.default = router;
