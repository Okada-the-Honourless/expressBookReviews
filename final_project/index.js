const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // 1. Grab the token from the session
    const token = req.session.authorization?.access_token;
  
    // 2. If there's no token, deny access immediately
    if (!token) {
      return res.status(403).json({ message: "User not logged in" });
    }
  
    // 3. Verify the token is valid and not tampered with
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "User not authenticated" });
      }
      // 4. Token is valid — attach the decoded user data to the request
      //    so downstream routes can use it
      req.user = decoded;
      next(); // Let the request continue to the actual route handler
    });
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
