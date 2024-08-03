const basicAuth = (req, res, next) => {
  // the 'Authorization' header is encoded in base64 as 'username:password'
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Authentication required"); // no auth header
  }

  const encodedCredentials = authHeader.split(" ")[1]; // get the encoded part
  const buffer = Buffer.from(encodedCredentials, "base64");
  const [username, password] = buffer.toString("utf-8").split(":");

  if (username === "test@hotmail.com" && password === "test123") {
    return next(); // credentials are correct, proceed to the route
  } else {
    return res.status(403).send("Access Denied"); // access denied
  }
};

module.exports = basicAuth;
