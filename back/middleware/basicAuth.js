const basicAuth = (req, res, next) => {
    // The 'Authorization' header is encoded in base64 as 'username:password'
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      return res.status(401).send('Authentication required'); // No auth header
    }
  
    const encodedCredentials = authHeader.split(' ')[1]; // Get the encoded part
    const buffer = Buffer.from(encodedCredentials, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');
  
    // Replace 'admin' and 'password' with your actual admin credentials
    if (username === 'test@hotmail.com' && password === 'test123') {
      return next(); // Credentials are correct, proceed to the route
    } else {
      return res.status(403).send('Access Denied'); // Access denied
    }
  };
  
module.exports = basicAuth;