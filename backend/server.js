const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const limiter = require("./security");
const admin = require("./controller/adminController");
const user = require("./controller/userController");
const { databaseConnection } = require("./DBHandler/databaseConnection");
const filter = require("./controller/filter");
const comment = require("./controller/addComment");
const login = require("./controller/login");

const app = express();
app.use(express.json());
app.use(limiter);
app.use(cors());
app.use(
  session({
    secret: "iamironman",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(admin);
app.use(user);
app.use(filter);
app.use(login);
app.use(comment);

databaseConnection();

if (cluster.isMaster) {
  console.log(`Master process ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died, restarting...`);
    cluster.fork();
  });
} else {
  app.get("/", (req, res) => {
    res.send(
      "<html><body><center><h1>Welcome to AM Library!</h1></center></body></html>"
    );
  });

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} is listening on port 3000`);
  });
}
