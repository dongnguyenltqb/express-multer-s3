import express from "express";
import multer from "multer";
import S3MulterStorage from "./multer-s3";

const storage = new S3MulterStorage("profile", (name) => name);

const uploader = multer({
  storage,
});

const app = express();

app.post("/upload", uploader.single("avatar"), function (req, res, next) {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any
  console.log(req.file);
  res.send(req.file.path);
});

const port = 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
