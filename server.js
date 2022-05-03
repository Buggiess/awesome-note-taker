const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid =
    Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
const db = require("./db/db.json")
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) =>{
    res.sendFile(path.join()(__dirname, '/public/index.html'));
  })
  
  app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  })
  
  app.route("/api/notes")
      .get(function (req, res) {
          res.json(db);
      })
      .post(function (req, res) {
          let jsonFilePath = path.join(__dirname, "/db/db.json");
          let newNotes = req.body;
          let maxId = 99;
          for (let i = 0; i < db.length; i++) {
              let seperateNotes = db[i];
              if (seperateNotes.id > maxId) {
                  maxId = seperateNotes.id;
              }
          }
          newNotes.id = maxId + 1;
          db.push(newNotes)
          fs.writeFile(jsonFilePath, JSON.stringify(db), function (err) {
              if (err) {
                  return console.log(err);
              }
              console.log("Your note was saved!");
          });
          res.json(newNotes);
      });
  
      app.delete("/api/notes/:id", function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        for (let i = 0; i < db.length; i++) {
            if (db[i].id == req.params.id) {
                db.splice(i, 1);
                break;
            }
        }
        fs.writeFileSync(jsonFilePath, JSON.stringify(db), function (err) {
    
            if (err) {
                return console.log(err);
            } else {
                console.log("Your note was deleted!");
            }
        });
        res.json(db);
    });

//PORT
app.listen(PORT, () => {
    console.log(`App is listening at http://localhost:${PORT}`);
});