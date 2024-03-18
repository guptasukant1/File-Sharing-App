import multer from "multer";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import File from "./models/file.js";
dotenv.config();

const upload = multer({ dest: "uploads" });

mongoose.connect(process.env.MONGO_URL);

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/upload", upload.single("file"), async (req, res) => {
	const fileData = {
		path: req.file.path,
		originalName: req.file.originalname,
	};
	if (req.body.password !== null && req.body.password !== "") {
		fileData.password = await bcrypt.hash(req.body.password, 10);
	} else {
		fileData.password = null;
	}
	// $ Create a new file in the database
	const file = await File.create(fileData);
	console.log(file);

	res.render("index", { fileLink: `${req.headers.origin}/file/${file._id}` });
});

// $ Route to get the file with a string id of the specific file.
app
	.route("/file/:id")
	.get(handleDownload)
	.post(handleDownload);
// app.get("/file/:id", handleDownload)
// app.post("/file/:id", handleDownload)

async function handleDownload(req, res) {
	// res.send(req.params.id);
	const downloadFile = await File.findById(req.params.id);

	if (downloadFile.password != null) {
		if (req.body.password == null) {
			res.render("password");
			return;
		}

		if (!(await bcrypt.compare(req.body.password, downloadFile.password))) {
			res.render("password", { error: true });
			return;
		}
	}

	downloadFile.downloadCount++;
	// $ Save the file to the database
	await downloadFile.save();
	console.log(downloadFile.downloadCount, downloadFile.originalName);
	// $ Download the file
	res.download(downloadFile.path, downloadFile.originalName);
}

app.listen(process.env.PORT);