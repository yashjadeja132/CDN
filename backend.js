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
		const filePath = path.join("./images/", filename);
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

app.delete("/delete-image/:filename", upload.single("image"), async (req, res) => {
	try {
		const filename = req.params.filename;

		const filePath = path.join(
			"./images/",
			filename
		);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
			res.status(200).json({
				status: "ok",
				message: "Files Deleted successfully!",
			});
		} else {
			res.status(201).json({ status: "error", message: "File not found" });
		}
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});

app.put("/update-image/:filename", upload.single("image"), async (req, res) => {
	try {
		const filename = req.params.filename;

		const filePath = path.join(
			"./images/",
			filename
		);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
			const uploadedFiles = req.file.filename;
			res.status(200).json({
				status: "ok",
				message: "Files Updated successfully!",
				files: uploadedFiles,
			});
		} else {
			res.status(201).json({ status: "error", message: "File not found" });
		}
	} catch (error) {
		res.status(500).json({ status: "error", message: error.message });
	}
});
