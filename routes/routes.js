const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = Router();

router.post("/register", async (req, res) => {
  console.log("Register endpoint reached");

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const record = await User.findOne({ email: req.body.email });

    if (record) {
      return res.status(400).send({
        message: "Email is already registered",
      });
    } else {
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      const result = await user.save();
      const { _id } = await result.toJSON();
      const token = jwt.sign({ _id: _id }, "secret");

      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.send({
        message: "success",
      }); 
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  console.log("Login endpoint reached");
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send({
        message: "User not found",
      });
    }

    if (!(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(400).send({
        message: "Password is Incorrect",
      });
    }

    const token = jwt.sign({ _id: user._id }, "secret");

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.send({ message: "success" });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
});

router.get("/user", async (req, res) => {
  try {
    const cookie = req.cookies["jwt"];
    const claims = jwt.verify(cookie, "secret");

    if (!claims) {
      return res.status(401).send({ message: "unauthenticated" });
    }

    const user = await User.findOne({ _id: claims._id });
    const { password, ...data } = await user.toJSON();

    res.send(data);
  } catch (error) {
    return res.status(401).send({ message: "unauthenticated" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.send({ message: "success" });
});


module.exports = router;
