const express = require("express");
const app = express();
var cors = require("cors");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["*"],
  },
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("dist"));
app.use(express.static("media"));

const PORT = process.env.PORT || 3333;

// Route Setup
const apiRoute = require("./routes/api/route");

app.use((req, res, next) => {
  if (req.url.substring(0, 4) !== "/api") {
    return res.sendFile(__dirname + "/dist");
  }
  next();
});

app.use("/api/v1", apiRoute);

io.on("connection", (socket) => {
  
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("leave_room", (data) => {
    socket.leave(data);
  });

  socket.on("receive_text", () => {
    // socket.to(data.room).emit("receive_message", data);
    console.log("message recieved");
  });
});

// Server listening to port 3000
server.listen(PORT, () => {
  console.log("REST API is Running on", PORT);
});
