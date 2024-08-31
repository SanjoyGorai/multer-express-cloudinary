import express from "express";
import multer from "multer";
const app = express();
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

function createDir(req, res, next) {
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }
  next();
}

async function uploadCloudinary(filePath) {
  cloudinary.config({
    cloud_name: "dlfeignva",
    api_key: "649861394575192",
    api_secret: "fLLGbpeYCoZv8AvhAZ550-Oko24",
  });

  const uploadReasult = await cloudinary.uploader
    .upload(filePath)
    .catch((error) => {
      console.log(error);
    });
  console.log(uploadReasult);
  return uploadReasult;
}

app.post(
  "/profile",
  createDir,
  upload.single("avatar"),
  async (req, res, next) => {
    if (!req.file) {
      return res.status(404).send("No file specified");
    } else {
      const cloudinaryResponse = await uploadCloudinary(req.file.path);
      return res
        .status(200)
        .send({ localFile: req.file, cloudinary: cloudinaryResponse });
    }
  }
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Example app listening on port port!", PORT);
});

//Run app, then load http://localhost:port in a browser to see the output.
