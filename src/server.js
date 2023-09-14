const axios = require("axios");
const cors = require("cors");
const express = require("express");
const fs = require("fs");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// Set file upload destination for temp storage.
// Must use dest, otherwise files will be stored in memory.
const upload = multer({ dest: "." });

const headers = { authorization: "YOUR_API_KEY_HERE" };

// Class to standardize error handling between AAI errors and Axios errors.
class AssemblyAIError {
  constructor(status, error) {
    this.response = { status, data: { error: error } };
  }
}

app.post("/transcript", async (req, res) => {
  try {
    const postResponse = await axios.post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: req.body.audio_url },
      { headers: headers },
    );
    while (true) {
      const getResponse = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${postResponse.data.id}`,
        { headers },
      );
      if (getResponse.data.status === "completed") {
        return res.json(getResponse.data);
      } else if (getResponse.data.status === "error") {
        throw new AssemblyAIError(400, getResponse.data.error); // Throw error from AAI server.
      } else {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // Poll every 3 seconds.
      }
    }
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const data = fs.readFileSync(req.file.path); // Read file from temp storage.
    const response = await axios.post(
      "https://api.assemblyai.com/v2/upload",
      data,
      { headers: headers },
    );
    fs.rmSync(req.file.path); // Remove file from temp storage.
    res.json(response.data.upload_url);
  } catch (error) {
    res.status(error.response.status).json(error.response.data);
  }
});

app.set("port", 8000);
const server = app.listen(app.get("port"), () => {
  console.log(`Server is running on port ${server.address().port}`);
});
