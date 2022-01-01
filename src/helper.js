const readStoreFiles = (dir, fs) => {
	return new Promise((resolve, reject) => {
		fs.readdir(dir, (err, files) => {
			if (err) {
				reject(err);
			}
			resolve(files);
		});
	});
};
module.exports = { readStoreFiles };
