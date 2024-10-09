"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("multer"));
const configDir = "./diagram-configs";
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, configDir);
    },
    filename: (req, file, cb) => {
        const originalName = file.originalname + ".json" || "default-config-name.json";
        cb(null, originalName);
    },
});
const upload = (0, multer_1.default)({ storage });
router.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).send("No file uploaded.");
    }
    res.status(200).send("Configuration uploaded successfully.");
});
// Endpoint to get config by 'name' field inside the configuration file
router.get("/get-meta-config-by-uri/:uri", (req, res) => {
    const requestedUri = decodeURIComponent(req.params.uri);
    console.log("Requested URI", requestedUri);
    // Read all config files in the directory
    fs_1.default.readdir(configDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to read configurations.");
        }
        files = files.filter((file) => file.startsWith("meta"));
        for (const file of files) {
            const filePath = path_1.default.join(configDir, file);
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            const config = JSON.parse(content);
            // Check if the 'name' field in the config matches the requested name
            if (config.package && config.package.uri === requestedUri) {
                return res.json(config); // Return the config if name matches
            }
        }
        // If no config is found with the matching name
        res.status(404).send(null);
    });
});
router.get("/get-representation-config-by-uri/:uri", (req, res) => {
    const requestedUri = decodeURIComponent(req.params.uri);
    console.log("Requested URI", requestedUri);
    // Read all config files in the directory
    fs_1.default.readdir(configDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to read configurations.");
        }
        files = files.filter((file) => file.startsWith("representation-meta"));
        for (const file of files) {
            const filePath = path_1.default.join(configDir, file);
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            const config = JSON.parse(content);
            // Check if the 'name' field in the config matches the requested name
            if (config.package && config.package.uri === requestedUri) {
                return res.json(config); // Return the config if name matches
            }
        }
        // If no config is found with the matching name
        res.status(404).send(null);
    });
});
// Save meta model file by type or update an existing one by type
router.post("/save-meta-model-file", (req, res) => {
    const { name, uri, elements } = req.body.package;
    if (!name || !uri || !elements) {
        return res.status(400).send("Configuration uri or elements are missing.");
    }
    // Check if a file with the same "name" exists inside the configuration file
    let configFileFound = false;
    let configFilename = "";
    fs_1.default.readdir(configDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to save configuration.");
        }
        files = files.filter((file) => file.startsWith("meta"));
        for (const file of files) {
            const filePath = path_1.default.join(configDir, file);
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            const config = JSON.parse(content);
            if (config.package && config.package.uri === uri) {
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
            // Update the existing meta file
            fs_1.default.writeFileSync(path_1.default.join(configDir, configFilename), JSON.stringify(newConfig, null, 2));
            return res
                .status(200)
                .send(`Configuration "${name}" updated successfully.`);
        }
        else {
            // Create a new meta file
            const newFilename = `meta-model-${name.replace(/\s+/g, "-").toLowerCase()}.json`; // Create a filename from the config name
            fs_1.default.writeFileSync(path_1.default.join(configDir, newFilename), JSON.stringify(newConfig, null, 2));
            return res
                .status(201)
                .send(`Configuration "${name}" saved successfully.`);
        }
    });
});
// Save representation meta model file by type or update an existing one by type
router.post("/save-representation-meta-model-file", (req, res) => {
    const { name, uri, elements } = req.body.package;
    if (!name || !uri || !elements) {
        return res.status(400).send("Configuration uri or elements are missing.");
    }
    // Check if a file with the same "name" exists inside the configuration file
    let configFileFound = false;
    let configFilename = "";
    fs_1.default.readdir(configDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to save configuration.");
        }
        files = files.filter((file) => file.startsWith("representation-meta"));
        for (const file of files) {
            const filePath = path_1.default.join(configDir, file);
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            const config = JSON.parse(content);
            if (config.package && config.package.uri === uri) {
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
            // Update the existing representation meta file
            fs_1.default.writeFileSync(path_1.default.join(configDir, configFilename), JSON.stringify(newConfig, null, 2));
            return res
                .status(200)
                .send(`Configuration "${name}" updated successfully.`);
        }
        else {
            // Create a new representation meta file
            const newFilename = `representation-meta-model-${name
                .replace(/\s+/g, "-")
                .toLowerCase()}.json`; // Create a filename from the config name
            fs_1.default.writeFileSync(path_1.default.join(configDir, newFilename), JSON.stringify(newConfig, null, 2));
            return res
                .status(201)
                .send(`Configuration "${name}" saved successfully.`);
        }
    });
});
router.get("/list", (req, res) => {
    fs_1.default.readdir(configDir, (err, files) => {
        if (err) {
            return res.status(500).send("Unable to list configurations.");
        }
        files = files.filter((file) => file.startsWith("meta"));
        let configs = files.map((file) => {
            if (file.startsWith("meta")) {
                const content = fs_1.default.readFileSync(`${configDir}/${file}`, "utf-8");
                const config = JSON.parse(content);
                if (config.package && config.package.name) {
                    return { filename: file, name: config.package.name, uri: config.package.uri };
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
    const configData = fs_1.default.readFileSync(`./${configDir}/${configName}`, "utf-8");
    console.log("Returning config data", JSON.parse(configData));
    res.json(JSON.parse(configData));
});
exports.default = router;
