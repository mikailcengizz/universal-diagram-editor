"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send("Authentication required"); // no auth header
    }
    const encodedCredentials = authHeader.split(" ")[1]; // get the encoded part
    const buffer = Buffer.from(encodedCredentials, "base64");
    const [username, password] = buffer.toString("utf-8").split(":");
    if (username === "test@hotmail.com" && password === "test123") {
        return next(); // credentials are correct, proceed to the route
    }
    else {
        return res.status(403).send("Access Denied");
    }
};
exports.default = basicAuth;
