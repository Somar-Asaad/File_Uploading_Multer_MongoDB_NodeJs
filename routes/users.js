const express = require("express");
const multer = require("multer");
const router = express.Router();
const db = require('../data/database');

router.get("/", async function (req, res) {
  const result = await db.getDb().collection("users").find().toArray();
  console.log(result);
  res.render("profiles", { result: result });
});

router.get("/new-user", function (req, res) {
  res.render("new-user");
});

const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploaded-images");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });

router.post("/profiles", upload.single("image"), async function (req, res) {
  const uploadedImageFile = req.file;
  const userName = req.body.username;
  await db.getDb().collection("users").insertOne({
    name: userName,
    imagePath: uploadedImageFile.path,
  });

  res.redirect("/");
});

module.exports = router;
