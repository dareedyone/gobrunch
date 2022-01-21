const express = require("express");
const cors = require("cors");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { readStoreFiles } = require("./helper");
const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile("public/index.html", { root: __dirname });
});

app.post("/api/process_svg", (req, res) => {
	// parse a file upload
	const form = formidable({ multiples: false });

	form.parse(req, (err, fields, files) => {
		if (err) return res.status(400).send(err);

		// res.writeHead(200, { "content-type": "text/plain" });

		fs.readFile(files.svg.filepath, function (err, data) {
			if (err) return res.status(400).send(err);
			// res.writeHead(200, { "Content-Type": "image/jpeg" });
			return res.end(data);
		});
	});
});
app.post("/api/save_svg", async (req, res) => {
	try {
		const { fileName, rawVg } = req.body;
		// strip ext from incoming file if added
		const fileWithoutExt = fileName.split(".svg")[0];
		let fileWithExt = fileWithoutExt + ".svg";
		const repeatedFile = fileWithoutExt + "(1).svg";
		const storeDir = path.join(__dirname, "../public/store/");
		// console.log("the store", storeDir);
		const files = await readStoreFiles(storeDir, fs);

		files.every((file) => {
			if (file === fileWithExt || file === repeatedFile) {
				fileWithExt = file.split(".svg")[0] + "(1).svg";
				return false;
			}
			return true;
		});

		fs.writeFile(`${storeDir}/${fileWithExt}`, rawVg, (err, data) => {
			if (err) return res.status(400).send("oops something went wrong !");
			res.status(200).json({ fileName: fileWithExt });
		});
	} catch (error) {
		console.log("Unable to scan directory: " + error);
		res.status(400).send({ error });
	}
});

const PORT = process.env.PORT || 3008;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}.`);
});

// module.exports = app;
