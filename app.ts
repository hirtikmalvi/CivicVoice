import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("<h1>CivikVoice</h1>");
});

app.listen(5000, () => console.log("Working Fine"));
