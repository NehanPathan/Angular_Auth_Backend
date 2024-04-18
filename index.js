const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'none'"],
        fontSrc: ["'self'", "data:"],
      },
    },
  })
);

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4200"],
  })
);
// pathannehan28
// 7xzcjDDQU8smHy6O
// mongodb+srv://pathannehan28:NJejTg53WMc1ULvv@cluster0.gkvm8bh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
// mongodb+srv://pathannehan28:<password>@cluster0.gkvm8bh.mongodb.net/
app.use(cookieParser());
app.use(express.json());
app.use("/api", routes);

mongoose
  .connect("mongodb+srv://pathannehan28:NJejTg53WMc1ULvv@cluster0.gkvm8bh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to the database");
    app.listen(5000, () => {
      console.log("App is listening on port 5000");
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit the process if there is an error connecting to the database
  });
