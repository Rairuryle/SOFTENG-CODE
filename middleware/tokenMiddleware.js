// // tokenMiddleware.js

// const jwt = require('jsonwebtoken');
// const { JWT_SECRET } = process.env; // Make sure the JWT_SECRET is correctly loaded from your environment variables

// function checkToken(req, res, next) {
//   const token = req.cookies.jwt; // Assuming you're storing the token in a cookie

//   if (token) {
//     try {
//       const decoded = jwt.verify(token, JWT_SECRET);
//       req.token = decoded; // Attach the decoded token to the request object
//     } catch (error) {
//       // Handle token verification errors (e.g., token expired, invalid, etc.)
//     }
//   }

//   next(); // Continue with the next middleware or route
// }

// module.exports = checkToken;
