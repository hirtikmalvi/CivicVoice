import axios from "axios";
import FormData from "form-data";

export const transcribeAudio = async (fileBuffer: Buffer): Promise<string> => {
  const formData = new FormData();
  formData.append("file", new Blob([fileBuffer]), "audio.mp3");
  formData.append("model", "whisper-1");

  const response = await axios.post(
    "https://api.openai.com/v1/audio/transcriptions",
    formData,
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );

  return response.data.text;
};
