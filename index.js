require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { PORT } = process.env;
const videoRoutes = require("./routes/videos");

app.use(express.static("./public"));
app.use(cors());

// Middleware

// app.use((req, res, next) => {
//     console.log();
//     if (req.query.apiKey !== "FaTcAt") {
//       return res.status(404).json({
//         error: {
//           message: "invalid api key",
//           statusCode: 401,
//         },
//       });
//     }
//     next();
//   });

// Middleware so we can acess the request body, converts to json

app.use(express.json());

app.use("/videos", videoRoutes);

app.listen(PORT, () => {
  console.log("running on", PORT);
});
