const express = require("express");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(cors());
const fs = require("fs");
const path = require("path");

app.get("/", async (req, res) => {
  res.send("Success!!!!!!");
});

app.listen(5000, () => {
  console.log("Server Started");
});

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const imageName = req.file.filename;
    res.json({ status: "ok", data: imageName });
  } catch (error) {
    res.json({ status: error });
  }
});

app.get("/get-image/:filename", async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(
      "./images/",
      filename
    );
    if (fs.existsSync(filePath)) {
      const fileBuffer = fs.readFileSync(filePath);
      res.set("Content-Type", "image/jpeg");
      res.send(fileBuffer);
    } else {
      res.status(404).json({ status: "error", message: "Image not found" });
    }
  } catch (error) {
    res.json({ status: error });
  }
});
