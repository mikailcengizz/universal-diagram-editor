import { Router, Request, Response } from "express";
import type {
  Callback,
  MetaModel,
  RepresentationMetaModel,
} from "../types/types";

import fs from "fs";
import express from "express";
import path from "path";
const router = express.Router();
import multer from "multer";

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

router.get("/get-meta-config-by-uri/:uri", (req: Request, res: Response) => {
  const requestedUri = decodeURIComponent(req.params.uri);

  console.log("Requested URI", requestedUri);

  fs.readdir(configDir, (err: any, files: string[]) => {
    if (err) {
      return res.status(500).send("Unable to read configurations.");
    }

    files = files.filter((file: any) => file.startsWith("meta"));

    for (const file of files) {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const config: MetaModel = JSON.parse(content);

      // check if 'name' field in the config matches requested name
      if (config.package && config.package.uri === requestedUri) {
        return res.json(config);
      }
    }

    res.status(404).send(null);
  });
});

router.get(
  "/get-representation-config-by-uri/:uri",
  (req: Request, res: Response) => {
    const requestedUri = decodeURIComponent(req.params.uri);

    console.log("Requested URI", requestedUri);

    // read all config files in directory
    fs.readdir(configDir, (err: any, files: string[]) => {
      if (err) {
        return res.status(500).send("Unable to read configurations.");
      }

      files = files.filter((file: any) =>
        file.startsWith("representation-meta")
      );

      for (const file of files) {
        const filePath = path.join(configDir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const config: RepresentationMetaModel = JSON.parse(content);

        // check if 'name' field in config matches requested name
        if (config.package && config.package.uri === requestedUri) {
          return res.json(config);
        }
      }

      res.status(404).send(null);
    });
  }
);

// save meta model file by type or update an existing one by type
router.post("/save-meta-model-file", (req: Request, res: Response) => {
  const { name, uri, elements } = (req.body as MetaModel).package;

  if (!name || !uri || !elements) {
    return res.status(400).send("Configuration uri or elements are missing.");
  }

  // check if file with the same "name" exists inside configuration file
  let configFileFound = false;
  let configFilename = "";

  fs.readdir(configDir, (err: any, files: string[]) => {
    if (err) {
      return res.status(500).send("Unable to save configuration.");
    }

    files = files.filter((file: any) => file.startsWith("meta"));

    for (const file of files) {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const config: MetaModel = JSON.parse(content);

      if (config.package && config.package.uri === uri) {
        // match found, update this file
        configFileFound = true;
        configFilename = file;
        break;
      }
    }

    const newConfig: MetaModel = {
      package: {
        name: name,
        uri: uri,
        elements: elements,
      },
    };

    if (configFileFound) {
      // update existing meta file
      fs.writeFileSync(
        path.join(configDir, configFilename),
        JSON.stringify(newConfig, null, 2)
      );
      return res
        .status(200)
        .send(`Configuration "${name}" updated successfully.`);
    } else {
      // create new meta file
      const newFilename = `meta-model-${name
        .replace(/\s+/g, "-")
        .toLowerCase()}.json`; // create filename from config name
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

// save representation meta model file by type or update existing one by type
router.post(
  "/save-representation-meta-model-file",
  (req: Request, res: Response) => {
    const { name, uri, elements } = (req.body as RepresentationMetaModel)
      .package;

    if (!name || !uri || !elements) {
      return res.status(400).send("Configuration uri or elements are missing.");
    }

    // check if file with same "name" exists inside configuration file
    let configFileFound = false;
    let configFilename = "";

    fs.readdir(configDir, (err: any, files: string[]) => {
      if (err) {
        return res.status(500).send("Unable to save configuration.");
      }

      files = files.filter((file: any) =>
        file.startsWith("representation-meta")
      );

      for (const file of files) {
        const filePath = path.join(configDir, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const config: RepresentationMetaModel = JSON.parse(content);

        if (config.package && config.package.uri === uri) {
          // match found, update file
          configFileFound = true;
          configFilename = file;
          break;
        }
      }

      const newConfig: RepresentationMetaModel = {
        package: {
          name: name,
          uri: uri,
          elements: elements,
        },
      };

      if (configFileFound) {
        // update existing representation meta file
        fs.writeFileSync(
          path.join(configDir, configFilename),
          JSON.stringify(newConfig, null, 2)
        );
        return res
          .status(200)
          .send(`Configuration "${name}" updated successfully.`);
      } else {
        // create new representation meta file
        const newFilename = `representation-meta-model-${name
          .replace(/\s+/g, "-")
          .toLowerCase()}.json`; // create filename from config name
        fs.writeFileSync(
          path.join(configDir, newFilename),
          JSON.stringify(newConfig, null, 2)
        );
        return res
          .status(201)
          .send(`Configuration "${name}" saved successfully.`);
      }
    });
  }
);

router.get("/list", (req: Request, res: Response) => {
  fs.readdir(configDir, (err: any, files: any) => {
    if (err) {
      return res.status(500).send("Unable to list configurations.");
    }

    files = files.filter((file: any) => file.startsWith("meta"));

    let configs = files.map((file: Express.Multer.File) => {
      if ((file as any).startsWith("meta")) {
        const content = fs.readFileSync(`${configDir}/${file}`, "utf-8");
        const config: MetaModel = JSON.parse(content);
        if (config.package && config.package.name) {
          return {
            filename: file,
            name: config.package.name,
            uri: config.package.uri,
          };
        }
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

// delete meta model file and representation meta model file by uri
router.delete("/delete-config/:uri", (req: Request, res: Response) => {
  const requestedUri = decodeURIComponent(req.params.uri);

  console.log("Requested URI", requestedUri);

  // read all config files in directory
  fs.readdir(configDir, (err: any, files: string[]) => {
    if (err) {
      return res.status(500).send("Unable to read configurations.");
    }

    for (const file of files) {
      const filePath = path.join(configDir, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const config: MetaModel | RepresentationMetaModel = JSON.parse(content);

      // check if 'name' field in the config matches requested name
      if (config.package) {
        if (config.package.uri === requestedUri) {
          fs.unlinkSync(filePath);
          return res
            .status(200)
            .send("Configuration deleted successfully: " + requestedUri);
        } else if (config.package.uri === requestedUri + "-representation") {
          fs.unlinkSync(filePath);
          return res
            .status(200)
            .send("Configuration deleted successfully: " + requestedUri);
        }
      }
    }

    res.status(404).send(null);
  });
});

export default router;
