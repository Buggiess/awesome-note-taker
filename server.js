const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');
const uuid =
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/notes", (req, res) => {
  console.log("return notes.html");
  res.sendFile(path.join(__dirname, "/public", "notes.html"));
});

app.get("/", (req, res) => {
  console.log("return index.html");
  res.sendFile(path.join(__dirname, "/public", "index.html"));
});

app.get("/api/notes", (req, res) => {
  console.log("return notes as json");
  fs.readFile("./db/db.json", "utf-8", function (err, data) {
    res.send(JSON.parse(data));
  });
});

app.post("/api/notes", (req, res) => {
  if (req.body) {
    const newNote = {
      id: uuid(),
      title: req.body.title,
      text: req.body.text,
    };

    updatedNotesDB(addNote, newNote);
    res.send("add successful");
  }
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE note with id: " + req.params.id);
  updatedNotesDB(removeNote, req.params.id);
  res.send("delete successful");
});