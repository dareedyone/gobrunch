const express = require("express");
const cors = require("cors");
const formidable = require("formidable");
const fs = require("fs");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.sendFile("public/index.html", { root: __dirname });
});

app.post("/api/upload_svg", (req, res) => {
	// parse a file upload
	const form = formidable({ multiples: false });

	form.parse(req, (err, fields, files) => {
		if (err) return res.status(400).send(err);

		// res.writeHead(200, { "content-type": "text/plain" });
		fs.readFile(files.svg.filepath, function (err, data) {
			if (err) return res.status(400).send(err);
			return res.send(data);
		});
	});
});

// for development
// const PORT = process.env.PORT || 3007;
// app.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}.`);
// });

module.exports = app;
