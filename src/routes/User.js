const auth = require("../middlewares/auth");
const express = require("express");
const multer = require("multer");
const sharp = require("sharp");

const {
  sendWelcomeEmail,
  sendCancellationEmail
} = require("../emails/account");
const User = require("../models/User");

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/))
      return cb(new Error("File should be jpg or jpeg"));
    cb(undefined, true);
  }
});

const router = new express.Router();

router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    console.log(user);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ error: "Unable to login" });
  }
});

router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      token => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.post(
  "/user/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const buffer = await sharp(req.file.buffer)
        .resize({ width: 250, height: 250 })
        .png()
        .toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.send();
    } catch (e) {
      res.status(404).send(e);
    }
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get("/user/me", auth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (e) {
    res.status(404).send();
  }
});

router.get("/user/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error({ error: "User not found" });
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
    // res.send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});

router.patch("/user/me", auth, async (req, res) => {
  const allowedUpdates = ["name", "email", "age", "password"];
  const updates = Object.keys(req.body);
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) res.status(404).send({ error: "Invalid Updates" });
  try {
    updates.forEach(update => (req.user[update] = req.body[update]));
    await req.user.save();
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/user/me/avatar", auth, async (req, res) => {
  try {
    console.log(req.user);
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    sendCancellationEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
