import multer from "multer";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
dotenv.config();
const app = express();

const upload = multer({ dest: "uploads" });

mongoose.connect(process.env.MONGO_URL);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
	res.render("index");
});

app.post("/upload", upload.single("file"), (req, res) => {
	const fileData = {
		path: req.file.path,
		originalName: req.file.originalname,
	};
	if ((req.body.password !== null) & (req.body.password !== "")) {
		fileData.password = bcrypt.hash(req.body.password, 10);
	}
});

app.listen(process.env.PORT);