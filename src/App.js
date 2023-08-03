import "./App.css";
import axios from "axios";
import Logo from "./assembly_logo.png";
import React from "react";
import { LoadingButton } from "@mui/lab";
import { CircularProgress, Input, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

async function transcript(audio_url) {
  let error_thrown = false;
  const headers = {
    authorization: "YOUR_API_KEY_HERE",
  };
  const response = await axios
    .post(
      "https://api.assemblyai.com/v2/transcript",
      { audio_url: audio_url },
      { headers: headers },
    )
    .catch((error) => {
      alert(error.response.data.error);
      error_thrown = true;
    });
  if (error_thrown) {
    return null;
  }
  const transcriptID = response.data.id;
  const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${transcriptID}`;
  while (true) {
    const pollingResponse = await axios.get(pollingEndpoint, { headers });
    const transcriptionResult = pollingResponse.data;
    if (transcriptionResult.status === "completed") {
      return transcriptionResult;
    } else if (transcriptionResult.status === "error") {
      alert(transcriptionResult.error);
      return null;
    } else {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

async function upload(file) {
  let error_thrown = false;
  const headers = {
    authorization: "YOUR_API_KEY_HERE",
  };
  const uploadResponse = await axios
    .post("https://api.assemblyai.com/v2/upload", file, { headers: headers })
    .catch((error) => {
      alert(error.response.data.error);
      error_thrown = true;
    });
  if (error_thrown) {
    return null;
  }
  const upload_url = uploadResponse.data.upload_url;
  return transcript(upload_url);
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#ffffff",
    },
  },
});

export default function App() {
  const [audioUrl, setAudioUrl] = React.useState("");
  const [isUploadError, setIsUploadError] = React.useState(false);
  const [isUploadLoading, setIsUploadLoading] = React.useState(false);
  const [isUrlError, setIsUrlError] = React.useState(false);
  const [isUrlLoading, setIsUrlLoading] = React.useState(false);
  const [uploadTranscriptText, setUploadTranscriptText] = React.useState("");
  const [uploadedFile, setUploadedFile] = React.useState("");
  const [urlTranscriptText, setUrlTranscriptText] = React.useState("");

  const onClickSubmit = (type) => () => {
    if (type === "audio_url" && audioUrl === "") {
      setIsUrlError(true);
    } else if (type === "audio_url" && audioUrl !== "") {
      setIsUrlError(false);
      setIsUrlLoading(true);
      transcript(audioUrl).then((result) => {
        setIsUrlLoading(false);
        if (result !== null) {
          setUrlTranscriptText(result.text);
        }
      });
    } else if (type === "uploaded_file" && uploadedFile === "") {
      setIsUploadError(true);
    } else if (type === "uploaded_file" && uploadedFile !== "") {
      setIsUploadError(false);
      setIsUploadLoading(true);
      upload(uploadedFile).then((result) => {
        setIsUploadLoading(false);
        if (result !== null) {
          setUploadTranscriptText(result.text);
        }
      });
    }
  };

  const onChangeUrl = (event) => {
    setAudioUrl(event.target.value);
  };

  const readFile = (event) => {
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedFile(reader.result);
    };
    try {
      reader.readAsArrayBuffer(event.target.files[0]);
    } catch {
      console.error("FileReader attempted to read an invalid file.");
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
                <LoadingButton
                  loading={isUrlLoading}
                  loadingIndicator={<CircularProgress color={"primary"} />}
                  onClick={onClickSubmit("audio_url")}
                  variant={"outlined"}
                >
                  Submit
                </LoadingButton>
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
                defaultValue={uploadedFile}
                error={isUploadError}
                onChange={readFile}
                sx={{ input: { color: "#ffffff" }, width: "50%" }}
                type={"file"}
              />
              <div className={"button-holder"}>
                <LoadingButton
                  loading={isUploadLoading}
                  loadingIndicator={<CircularProgress color={"primary"} />}
                  onClick={onClickSubmit("uploaded_file")}
                  variant={"outlined"}
                >
                  Submit
                </LoadingButton>
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
