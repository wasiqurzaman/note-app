require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
// const mongoose = require("mongoose");
const Note = require("./models/note");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());

// middleware for logging
const requestLogger = (request, response, next) => {
  console.log("Method: ", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("----------------------");
  next();
};

app.use(requestLogger);

app.get("/", (request, response) => {
  response.send("<h1>Hello World.</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => {
      next(error);
    });
});

app.post("/api/notes", (request, response, next) => {
  const body = request.body;
  const note = new Note({
    content: body.content,
    important: body.important || false,
  });

  note.save().then(savedNote => {
    response.json(savedNote);
  })
    .catch(error => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log(result);
      response.status(204).end();
    })
    .catch(error => next(error));

});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;
  const note = { content, important, };

  Note.findByIdAndUpdate(request.params.id, note, { new: true, runValidators: true, context: "query" })
    .then(updatedNote => {
      response.json(updatedNote);
    })
    .catch(error => next(error));
});

// unknown endpoint handler middleware
const unknownEndpoint = (req, res, next) => {
  res.status(404).send({ error: "unkown endpoint" });
  next();
};

app.use(unknownEndpoint);

// Error handler middleware
const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

// this has to be the last loaded middleware, also all the routes should be registered before this.
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
