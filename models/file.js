import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
	originalName: {
		type: String,
		required: true,
	},
	path: {
		type: String,
		required: true,
	},
	password: String,
	downloadCount: {
		type: String,
		required: true,
		default: 0,
	},
});

mongoose.model("File", fileSchema);

export default mongoose.model("File");