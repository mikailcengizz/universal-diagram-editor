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
router.get("/get-meta-config-by-uri/:uri", (req, res) => {
    const requestedUri = req.params.uri;
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
            if (config.package.uri === requestedUri) {
                return res.json(config); // Return the config if name matches
            }
        }
        // If no config is found with the matching name
        res.status(404).send(null);
    });
});
router.get("/get-representation-config-by-uri/:uri", (req, res) => {
    const requestedUri = req.params.uri;
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
            if (config.package.uri === requestedUri) {
                return res.json(config); // Return the config if name matches
            }
        }
        // If no config is found with the matching name
        res.status(404).send(null);
    });
});
// Save configuration by type or update an existing one by type
router.post("/save", (req, res) => {
    const { name, uri, elements } = req.body;
    if (!uri || !elements) {
        return res.status(400).send("Configuration uri or elements are missing.");
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
            if (config.package.uri === uri) {
                // Match found, update this file
                configFileFound = true;
                configFilename = file;
                break;
            }
        }
        const newConfig = {
            package: {
                name: name,
                uri: uri,
                elements: elements,
            },
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
        let configs = files.map((file) => {
            if (file.startsWith("meta")) {
                const content = fs.readFileSync(`${configDir}/${file}`, "utf-8");
                const config = JSON.parse(content);
                console.log("Config", config);
                if (config.package && config.package.name) {
                    return { filename: file, name: config.package.name };
                }
            }
        });
        configs = configs.filter((config) => config !== undefined);
        console.log("Returning config list", configs);
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
