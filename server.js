const express = require("express");
const app = express()
const port = 8080
const cors = require("cors")
require('dotenv').config()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
const CONSTANTS = require("./Utils/Constants")
const userRoute = require("./Routes/UserRoute")
const carRoute = require("./Routes/CarRoute")
const runRoute = require("./Routes/RunRoute")
const sensorRoute = require("./Routes/SensorRoute")
const adminRoute = require("./Routes/AdminRoute")

// route for handling 404 requests(unavailable routes)
// app.use((req, res, next) => {
//     res.status(404).send({
//         code: CONSTANTS.APP_ERROR_CODE.NOT_FOUND,
//         description: CONSTANTS.ERROR_DESC.NO_RESOURCE,
//     });
// });

// Routes
app.use("/api/user", userRoute);
app.use("/api/car", carRoute);
app.use("/api/run", runRoute)
app.use("/api/sensor", sensorRoute)
app.use("/api/admin", adminRoute)

const server = app.listen(port, () => {
    console.log(`Server listening on port: ${port}`)
})

// // Handle errors on backend
// const exitHandler = () => {
//     if (server) {
//         server.close(() => {
//             // Eventually replace with logs
//             console.log("Server closed");
//             process.exit(1);
//         });
//     } else {
//         process.exit(1);
//     }
// };

// const unexpectedErrorHandler = error => {
//     console.log(error)
//     exitHandler();
// };

// process.on("uncaughtException", unexpectedErrorHandler);
// process.on("unhandledRejection", unexpectedErrorHandler);

// process.on("SIGTERM", () => {
//     logger.info("SIGTERM received");
//     if (server) {
//         server.close();
//     }
// });

module.exports = app;
