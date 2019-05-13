const fs = require('fs');

/**
 * Generates post mapping
 */
const postMapping = function () {
	var postsFolder = 'src/posts/';
	var writingFile = 'src/pages/posts/post_map.js';

	fs.writeFile(writingFile, "", function (err) {
		if (err) return console.log(err)
	});

	var pen = fs.createWriteStream(writingFile, {
		flags: 'a' // 'a' means appending (old data will be preserved)
	})

	let generateHeaders = function (files) {
		pen.write("import { h } from 'preact'\r")

		return Promise.all(files.map(file => {
			return new Promise(function (resolve, reject) {
				let str = `import ${file.replace('.js', '').replace(/\b\w/g, l => l.toUpperCase())} from "../../posts/${file}"`;
				str = str + "\r";
				resolve(str);
			})
		}));
	}

	let generateData = function (files) {

		pen.write("{")

		return Promise.all(files.map(file => {
			return new Promise(function (resolve, reject) {
				let str = ""
				let title = file.replace('.js', '')
				str = str + "\r\t\t\"" + title + "\": {"
				str = str + '\r\t\t\t"name": "' + file + '",'
				str = str + '\r\t\t\t"jsx": ' + title.replace(/\b\w/g, l => l.toUpperCase()) + ','
				str = str + "\r\t\t}"
				resolve(str);
			})
		}));
	}

	fs.readdir(postsFolder, (err, files) => {
		generateHeaders(files)
			.then(words => pen.write(words.join('')))
			.then(() => {
				pen.write("export default function() {\r")
				pen.write("\t return ")
			})
			.then(() => generateData(files))
			.then(words => pen.write(words.join(',')))
			.then(() => pen.write('\r\t}\r}'))
	});
}

/**
 * Generates post data
 */
const postData = function () {
	var postsFolder = 'src/posts/';
	var writingFile = 'data/posts.json';

	fs.writeFile(writingFile, "", function (err) {
		if (err) return console.log(err)
	});

	var pen = fs.createWriteStream(writingFile, {
		flags: 'a' // 'a' means appending (old data will be preserved)
	})

	let generateData = function (files) {

		pen.write("{\r\t\"posts\": [")

		return Promise.all(files.map(file => {
			return new Promise(function (resolve, reject) {
				let str = ""
				let title = file.replace('.js', '')
				str = str + "\r\t\t\{"
				str = str + '\r\t\t\t"title": "' + title + '",'
				str = str + '\r\t\t\t"path": "' + file + '"'
				str = str + "\r\t\t}"
				resolve(str);
			})
		}));
	}


	fs.readdir(postsFolder, (err, files) => {
		generateData(files)
			.then(words => pen.write(words.join('')))
			.then(() => pen.write('\r\t]\r}'))
	});
}
postMapping();
postData();
