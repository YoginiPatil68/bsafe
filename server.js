const cors = require("cors");
const express = require("express");
const { createServer } = require("http"); // you can use https as well
const { PORT, DBURL } = require("./config");
const errorHandler = require("./middleware/errorHandler");
const router = require("./routes");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const server = createServer(app);
const io = socketIo(server);
module.exports = io;
app.use(cookieParser());
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://localhost:19002",
    "http://192.168.0.108:19002",
    "http://192.168.0.108:3000",
    "https://besafeadmin.mehulgawhale.me",
  ],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

mongoose.connect(DBURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Db Connected"));

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", router);
app.use((req, res, next) => {
  req.io = io;
  return next();
});

app.use(express.json());

app.use(errorHandler);

const port = PORT || "5000";

server.listen(port, () => console.log(`Server started!`));

app.set("socketio", io);
