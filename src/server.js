require("dotenv").config();
const cors = require("cors");
const express = require("express");
const fs = require("fs/promises");
const multer = require("multer");
const { AssemblyAI } = require("assemblyai");

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

const app = express();
app.use(express.json());
app.use(cors());

// Set file upload destination for temp storage.
// Must use dest, otherwise files will be stored in memory.
const upload = multer({ dest: "temp" });

app.post("/transcript", async (req, res) => {
  try {
    const transcript = await client.transcripts.transcribe({
      audio: req.body.audio_url,
    });
    if (transcript.status === "error") {
      return res.status(500).json(transcript);
    }

    return res.json(transcript);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const uploadUrl = await client.files.upload(req.file.path);
    await fs.rm(req.file.path); // Remove file from temp storage.
    res.json(uploadUrl);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.set("port", 8000);
const server = app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${server.address().port}`);
});
