import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

let notes = [];

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/view", (req, res) => {
  res.render("view.ejs", { notes: notes });
});

app.post("/submit", (req, res) => {
  const title = req.body["title"];
  const note = req.body["note"];
  const lastNoteIndex = notes.length - 1;
  let message = "Your note was added!";
  if (notes.length > 0) {
    if (notes[lastNoteIndex].note !== note) {
      message = "Your note was added!";
      notes.push({ title: title, note: note, isEdited: false });
    } else {
      message =
        "Note is identical with the previous one submitted by you. It has not been added";
    }
  } else {
    message = "Your note was added!";
    notes.push({ title: title, note: note, isEdited: false });
  }
  res.render("index.ejs", { title: title, note: note, message: message });
});

app.post("/delete", (req, res) => {
  const indexArr = Object.keys(req.body);
  const noteIndex = Number(indexArr[0]);
  const newNotes = notes.filter((item, index) => index !== noteIndex);
  notes = newNotes;
  res.render("view.ejs", { notes: notes });
});

app.post("/edit", (req, res) => {
  const indexArr = Object.keys(req.body);
  const noteIndex = Number(indexArr[0]);
  const newNotes = notes.map((item, index) => {
    if (index === noteIndex) {
      item.isEdited = true;
    }
    return item;
  });
  notes = newNotes;
  res.render("view.ejs", { notes: notes });
});

app.post("/save", (req, res) => {
  const changedTitle = req.body["changedTitle"];
  const changedNote = req.body["changedNote"];
  const indexArr = Object.keys(req.body);
  const noteIndex = Number(indexArr[0]);
  notes.map((item, index) => {
    if (index === noteIndex) {
      item.title = changedTitle;
      item.note = changedNote;
      item.isEdited = false;
    }
    return item;
  });
  res.render("view.ejs", { notes: notes });
});

app.listen(3000, () => {
  console.log(`Listening on ${port} port`);
});
