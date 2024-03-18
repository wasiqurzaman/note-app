const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as agrument");
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://wasiqurz011:${password}@cluster0.bnexivz.mongodb.net/noteApp?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

// eslint-disable-next-line quotes
const Note = mongoose.model("Note", noteSchema);

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// });

// note.save().then(result => {
//   console.log('note saved!');
//   mongoose.connection.close();
// });

Note.find({}).then(result => {
  result.forEach(note => {
    console.log(note);
  });
  mongoose.connection.close();
});