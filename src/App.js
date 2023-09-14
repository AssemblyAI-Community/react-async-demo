import "./App.css";
import axios from "axios";
import Logo from "./assembly_logo.png";
import React from "react";
import { Button, CircularProgress, Input, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
  },
});

async function transcribe(audio_url) {
  const response = await axios
    .post("http://localhost:8000/transcript", {
      audio_url: audio_url,
    })
    .catch((error) => {
      alert(error.response.data.error);
      return null;
    });

  return response?.data;
}

async function upload(file) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios
    .post("http://localhost:8000/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .catch((error) => {
      alert(error.response.data.error);
      return null;
    });

  return transcribe(response?.data);
}

export default function App() {
  const [audioUrl, setAudioUrl] = React.useState("");
  const [isUploadError, setIsUploadError] = React.useState(false);
  const [isUploadLoading, setIsUploadLoading] = React.useState(false);
  const [isUrlError, setIsUrlError] = React.useState(false);
  const [isUrlLoading, setIsUrlLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState("");
  const [uploadTranscriptText, setUploadTranscriptText] = React.useState("");
  const [urlTranscriptText, setUrlTranscriptText] = React.useState("");

  const onChangeFile = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onChangeUrl = (event) => {
    setAudioUrl(event.target.value);
  };

  const onClickSubmit = (type) => () => {
    if (type === "audio_url" && audioUrl === "") {
      setIsUrlError(true);
    } else if (type === "audio_url" && audioUrl !== "") {
      setIsUrlError(false);
      setIsUrlLoading(true);
      transcribe(audioUrl).then((result) => {
        setIsUrlLoading(false);
        if (result) {
          setUrlTranscriptText(result.text);
        }
      });
    } else if (type === "uploaded_file" && selectedFile === "") {
      setIsUploadError(true);
    } else if (type === "uploaded_file" && selectedFile !== "") {
      setIsUploadError(false);
      setIsUploadLoading(true);
      upload(selectedFile).then((result) => {
        setIsUploadLoading(false);
        if (result) {
          setUploadTranscriptText(result.text);
        }
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={"app"}>
        <div className={"content"}>
          <img alt={"AssemblyAI Logo"} className={"logo"} src={Logo} />
          <p>Welcome to AssemblyAI's React demo!</p>
          <p>
            This will show you how to use our async API within a React
            project...
          </p>
          <div className={"split"}>
            <div className={"pane"}>
              <p>
                ...via our{" "}
                <a
                  className={"link"}
                  href={
                    "https://www.assemblyai.com/docs/Models/speech_recognition#quickstart"
                  }
                >
                  audio_url parameter
                </a>
                ...
              </p>
              <TextField
                error={isUrlError}
                focused={true}
                label={"URL"}
                onChange={onChangeUrl}
                sx={{ input: { color: "#ffffff" }, width: "50%" }}
                value={audioUrl}
              />
              <div className={"button-holder"}>
                {isUrlLoading ? (
                  <CircularProgress color={"primary"} />
                ) : (
                  <Button
                    onClick={onClickSubmit("audio_url")}
                    variant={"outlined"}
                  >
                    Submit
                  </Button>
                )}
              </div>
              {urlTranscriptText !== "" ? (
                <div className={"transcript-holder"}>
                  <p className={"transcript"}>{urlTranscriptText}</p>
                </div>
              ) : null}
            </div>
            <div className={"pane"}>
              <p>
                ...or by{" "}
                <a
                  className={"link"}
                  href={
                    "https://www.assemblyai.com/docs/Guides/transcribing_an_audio_file"
                  }
                >
                  uploading a file!
                </a>
              </p>
              <Input
                defaultValue={selectedFile}
                error={isUploadError}
                onChange={onChangeFile}
                sx={{ input: { color: "#ffffff" }, width: "50%" }}
                type={"file"}
              />
              <div className={"button-holder"}>
                {isUploadLoading ? (
                  <CircularProgress color={"primary"} />
                ) : (
                  <Button
                    onClick={onClickSubmit("uploaded_file")}
                    variant={"outlined"}
                  >
                    Submit
                  </Button>
                )}
              </div>
              {uploadTranscriptText !== "" ? (
                <div className={"transcript-holder"}>
                  <p className={"transcript"}>{uploadTranscriptText}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
