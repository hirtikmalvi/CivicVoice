// import React, { useState, useEffect } from "react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "../../api/axiosInstance";
// import { getUserFromToken } from "../../hooks/useAuth";

// export interface CreateComplaintProps {
//   onClose: () => void;
//   onComplaintCreated: () => void;
// }

// interface Category {
//   value: string;
//   label: string;
// }

// const MAX_MEDIA_FILES = 4;
// const MAX_TOTAL_MEDIA = 5;
// const MAX_AUDIO_DURATION_MS = 30000;

// const CreateComplaint: React.FC<CreateComplaintProps> = ({
//   onClose,
//   onComplaintCreated,
// }) => {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [citizen_id, setCitizen_id] = useState("");
//   const [location, setLocation] = useState<{
//     latitude: number | null;
//     longitude: number | null;
//   }>({
//     latitude: null,
//     longitude: null,
//   });
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [mediaFiles, setMediaFiles] = useState<File[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [audioRecording, setAudioRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
//     null
//   );
//   const [stopTimer, setStopTimer] = useState<NodeJS.Timeout | null>(null);
//   const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const categories: Category[] = (await axios.get(`/api/category/all`))
//           .data;
//         setCategories(categories || []);
//       } catch (err) {
//         toast.error("Error fetching categories");
//       }
//     };

//     const fetchCitizenId = async () => {
//       try {
//         const user = getUserFromToken();
//         const userId = user?.user_id;

//         const response = await axios.get(`/api/citizen/user/${userId}`);
//         console.log("Response: ", response);
//         setCitizen_id(response.data.citizen.citizen_id);
//       } catch (error) {
//         console.error("Failed to fetch citizen ID", error);
//         return null;
//       }
//     };
//     fetchCitizenId()
//     fetchCategories();
//   }, []);

//   const handleLocationClick = () => {
//     if (!navigator.geolocation) {
//       toast.error("Geolocation is not supported by your browser.");
//       return;
//     }

//     navigator.geolocation.getCurrentPosition(
//       (position) => {
//         const { latitude, longitude } = position.coords;
//         setLatitude(latitude);
//         setLongitude(longitude);
//         setLocation({ latitude, longitude });
//         toast.success("Location fetched!");
//       },
//       () => toast.error("Failed to fetch location.")
//     );
//   };

//   const handleStartRecording = async () => {
//     if (mediaFiles.length + (audioBlob ? 1 : 0) >= MAX_TOTAL_MEDIA) {
//       toast.error("You can only upload up to 5 total media files.");
//       return;
//     }

//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       const recorder = new MediaRecorder(stream);
//       const chunks: Blob[] = [];

//       recorder.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           chunks.push(event.data);
//         }
//       };

//       recorder.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/wav" });
//         setAudioBlob(blob);
//         stream.getTracks().forEach((track) => track.stop());
//         toast.success("Audio recorded!");
//       };

//       recorder.start();
//       setMediaRecorder(recorder);
//       setAudioRecording(true);

//       const timeout = setTimeout(() => {
//         if (recorder.state === "recording") {
//           recorder.stop();
//           setAudioRecording(false);
//         }
//       }, MAX_AUDIO_DURATION_MS);

//       setStopTimer(timeout);
//     } catch (err) {
//       toast.error("Failed to access microphone.");
//       setAudioRecording(false);
//     }
//   };

//   const handleStopRecording = () => {
//     if (mediaRecorder?.state === "recording") {
//       mediaRecorder.stop();
//       setAudioRecording(false);
//       if (stopTimer) {
//         clearTimeout(stopTimer);
//         setStopTimer(null);
//       }
//     }
//   };

//   const handleRemoveRecording = () => {
//     setAudioBlob(null);
//     setAudioRecording(false);
//     toast.info("Audio recording removed.");
//   };

//   const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files ? Array.from(e.target.files) : [];
//     const total = mediaFiles.length + files.length;

//     if (total > MAX_MEDIA_FILES) {
//       setFormErrors((prev) => ({
//         ...prev,
//         mediaFiles: `You can upload max ${MAX_MEDIA_FILES} image/video files.`,
//       }));
//       toast.error(`Only ${MAX_MEDIA_FILES} image/video files allowed.`);
//       return;
//     }

//     setMediaFiles([...mediaFiles, ...files]);
//     setFormErrors((prev) => ({ ...prev, mediaFiles: "" }));
//   };

//   const handleRemoveMedia = (index: number) => {
//     const updated = [...mediaFiles];
//     updated.splice(index, 1);
//     setMediaFiles(updated);
//     toast.info("Media file removed.");
//   };

//   const validateForm = () => {
//     const errors: { [key: string]: string } = {};
//     if (!title.trim()) errors.title = "Title is required.";
//     else if (title.trim().length < 5)
//       errors.title = "Title must be at least 5 characters.";
//     if (!category) errors.category = "Please select a category.";

//     if (!description.trim() && !audioBlob) {
//       errors.description = "Provide text or audio description.";
//     }

//     if (mediaFiles.length > MAX_MEDIA_FILES)
//       errors.mediaFiles = `Max ${MAX_MEDIA_FILES} image/video files allowed.`;
//     if (mediaFiles.length + (audioBlob ? 1 : 0) > MAX_TOTAL_MEDIA)
//       errors.mediaFiles = `Total media (image/video/audio) must not exceed ${MAX_TOTAL_MEDIA}.`;
//     return errors;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const errors = validateForm();
//     setFormErrors(errors);

//     if (Object.keys(errors).length > 0) {
//       toast.error("Please fix form errors before submitting.");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("citizen_id", citizen_id);
//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("category", category);
//     formData.append("location", JSON.stringify(location));
//     if (latitude) formData.append("latitude", latitude.toString());
//     if (longitude) formData.append("longitude", longitude.toString());

//     // Append media files
//     mediaFiles.forEach((file) => {
//       formData.append("file", file);
//     });

//     // Append audio blob if it exists
//     if (audioBlob) {
//       try {
//         const audioFile = new File([audioBlob], "audio.wav", {
//           type: "audio/wav",
//         });
//         formData.append("file", audioFile);
//         console.log("Audio file appended to FormData:", audioFile); // Debugging line
//       } catch (audioError) {
//         console.error("Error creating audio file:", audioError);
//         toast.error("Failed to prepare audio file.");
//         return;
//       }
//     }

//     // Log FormData contents for debugging
//     for (const pair of formData.entries()) {
//       console.log(pair[0] + ", " + pair[1]);
//     }

//     try {
//       const response = await axios.post("/api/complaints", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("Complaint submitted successfully!");
//       onComplaintCreated();
//       onClose();
//       setTitle("");
//       setDescription("");
//       setCategory("");
//       setLocation({ latitude: null, longitude: null });
//       setLatitude(null);
//       setLongitude(null);
//       setMediaFiles([]);
//       setAudioBlob(null);
//       setFormErrors({});
//     } catch (error: any) {
//       console.error("API Error:", error);
//       if (error.response) {
//         console.error("Response Data:", error.response.data);
//         console.error("Response Status:", error.response.status);
//       }
//       toast.error("Something went wrong submitting complaint.");
//     }
//   };

//   return (
//     <div style={styles.container}>
//       <ToastContainer />
//       <div style={styles.card}>
//         <h2 style={styles.heading}>📣 File a New Complaint</h2>
//         <form onSubmit={handleSubmit} style={styles.form}>
//           <input
//             type="text"
//             placeholder="Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             style={styles.input}
//           />
//           {formErrors.title && (
//             <div style={styles.error}>{formErrors.title}</div>
//           )}
//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//             style={styles.input}
//           >
//             <option value="">Select Category</option>
//             {categories.map((cat, idx) => (
//               <option key={idx} value={cat.value}>
//                 {cat.label}
//               </option>
//             ))}
//           </select>
//           {formErrors.category && (
//             <div style={styles.error}>{formErrors.category}</div>
//           )}
//           <textarea
//             placeholder="Description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             style={styles.textarea}
//           />
//           {formErrors.description && (
//             <div style={styles.error}>{formErrors.description}</div>
//           )}
//           <div style={styles.audioSection}>
//             {audioBlob ? (
//               <>
//                 <audio controls src={URL.createObjectURL(audioBlob)} />
//                 <button
//                   type="button"
//                   onClick={handleRemoveRecording}
//                   style={styles.button}
//                 >
//                   Remove Audio
//                 </button>
//               </>
//             ) : audioRecording ? (
//               <button
//                 type="button"
//                 onClick={handleStopRecording}
//                 style={styles.button}
//               >
//                 Stop Recording
//               </button>
//             ) : (
//               <button
//                 type="button"
//                 onClick={handleStartRecording}
//                 style={styles.button}
//               >
//                 Record Audio
//               </button>
//             )}
//           </div>
//           <input
//             type="file"
//             accept="image/*,video/*"
//             multiple
//             onChange={handleMediaFileChange}
//             style={styles.input}
//           />
//           {formErrors.mediaFiles && (
//             <div style={styles.error}>{formErrors.mediaFiles}</div>
//           )}
//           {mediaFiles.map((file, index) => (
//             <div key={index} style={styles.mediaItem}>
//               <span>{file.name}</span>
//               <button
//                 type="button"
//                 onClick={() => handleRemoveMedia(index)}
//                 style={styles.button}
//               >
//                 Remove
//               </button>
//             </div>
//           ))}
//           <button
//             type="button"
//             onClick={handleLocationClick}
//             style={styles.button}
//           >
//             Get Current Location
//           </button>
//           {location.latitude && location.longitude && (
//             <div style={styles.locationDisplay}>
//               📍 Latitude: {location.latitude}, Longitude: {location.longitude}
//             </div>
//           )}
//           <button type="submit" style={styles.submitButton}>
//             Submit Complaint
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateComplaint;

// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     display: "flex",
//     justifyContent: "center",
//     padding: "30px",
//     backgroundColor: "#f0f2f5",
//   },
//   card: {
//     width: "100%",
//     maxWidth: "600px",
//     padding: "25px",
//     backgroundColor: "#ffffff",
//     borderRadius: "12px",
//     boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//   },
//   heading: {
//     marginBottom: "20px",
//     textAlign: "center",
//     color: "#333",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "15px",
//   },
//   input: {
//     padding: "12px",
//     fontSize: "16px",
//     border: "1px solid #ccc",
//     borderRadius: "6px",
//   },
//   textarea: {
//     padding: "12px",
//     fontSize: "16px",
//     minHeight: "100px",
//     border: "1px solid #ccc",
//     borderRadius: "6px",
//   },
//   button: {
//     padding: "10px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     width: "fit-content",
//   },
//   submitButton: {
//     padding: "12px",
//     backgroundColor: "#28a745",
//     color: "#fff",
//     border: "none",
//     borderRadius: "6px",
//     cursor: "pointer",
//     fontSize: "16px",
//   },
//   error: {
//     color: "red",
//     fontSize: "14px",
//   },
//   locationDisplay: {
//     fontSize: "14px",
//     color: "#555",
//     paddingLeft: "5px",
//   },
//   audioSection: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "8px",
//   },
//   mediaItem: {
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#f8f9fa",
//     padding: "8px",
//     borderRadius: "4px",
//   },
// };















import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../../api/axiosInstance";
import { getUserFromToken } from "../../hooks/useAuth";

export interface CreateComplaintProps {
  onClose: () => void;
  onComplaintCreated: () => void;
}

interface Category {
  value: string;
  label: string;
}

const MAX_MEDIA_FILES = 4;
const MAX_TOTAL_MEDIA = 5;
const MAX_AUDIO_DURATION_MS = 30000;

const CreateComplaint: React.FC<CreateComplaintProps> = ({
  onClose,
  onComplaintCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [citizen_id, setCitizen_id] = useState("");
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [audioRecording, setAudioRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const stopTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories: Category[] = (await axios.get(`/api/category/all`))
          .data;
        setCategories(categories || []);
      } catch (err) {
        toast.error("Error fetching categories");
      }
    };

    const fetchCitizenId = async () => {
      try {
        const user = getUserFromToken();
        const userId = user?.user_id;

        const response = await axios.get(`/api/citizen/user/${userId}`);
        setCitizen_id(response.data.citizen.citizen_id);
      } catch (error) {
        console.error("Failed to fetch citizen ID", error);
      }
    };

    fetchCitizenId();
    fetchCategories();

    // Cleanup function to handle component unmount
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Clean up audioUrl when audioBlob changes
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      return () => {
        if (url) URL.revokeObjectURL(url);
      };
    } else {
      setAudioUrl(null);
    }
  }, [audioBlob]);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setLocation({ latitude, longitude });
        toast.success("Location fetched!");
      },
      () => toast.error("Failed to fetch location.")
    );
  };

  const handleStartRecording = async () => {
    if (mediaFiles.length + (audioBlob ? 1 : 0) >= MAX_TOTAL_MEDIA) {
      toast.error("You can only upload up to 5 total media files.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
        toast.success("Audio recorded!");
        setAudioRecording(false);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setAudioRecording(true);

      const timeout = setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, MAX_AUDIO_DURATION_MS);

      stopTimerRef.current = timeout;
    } catch (err) {
      toast.error("Failed to access microphone.");
      setAudioRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current);
        stopTimerRef.current = null;
      }
    }
  };

  const handleRemoveRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    toast.info("Audio recording removed.");
  };

  const handleMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const total = mediaFiles.length + files.length;

    if (total > MAX_MEDIA_FILES) {
      setFormErrors((prev) => ({
        ...prev,
        mediaFiles: `You can upload max ${MAX_MEDIA_FILES} image/video files.`,
      }));
      toast.error(`Only ${MAX_MEDIA_FILES} image/video files allowed.`);
      return;
    }

    setMediaFiles([...mediaFiles, ...files]);
    setFormErrors((prev) => ({ ...prev, mediaFiles: "" }));
  };

  const handleRemoveMedia = (index: number) => {
    const updated = [...mediaFiles];
    updated.splice(index, 1);
    setMediaFiles(updated);
    toast.info("Media file removed.");
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!title.trim()) errors.title = "Title is required.";
    else if (title.trim().length < 5)
      errors.title = "Title must be at least 5 characters.";
    if (!category) errors.category = "Please select a category.";

    if (!description.trim() && !audioBlob) {
      errors.description = "Provide text or audio description.";
    }

    if (mediaFiles.length > MAX_MEDIA_FILES)
      errors.mediaFiles = `Max ${MAX_MEDIA_FILES} image/video files allowed.`;
    if (mediaFiles.length + (audioBlob ? 1 : 0) > MAX_TOTAL_MEDIA)
      errors.mediaFiles = `Total media (image/video/audio) must not exceed ${MAX_TOTAL_MEDIA}.`;
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix form errors before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("citizen_id", citizen_id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", JSON.stringify(location));
    if (latitude) formData.append("latitude", latitude.toString());
    if (longitude) formData.append("longitude", longitude.toString());

    // Append media files
    mediaFiles.forEach((file) => {
      formData.append("file", file);
    });

    // Append audio blob if it exists
    if (audioBlob) {
      try {
        const audioFile = new File([audioBlob], "audio.wav", {
          type: "audio/wav",
        });
        formData.append("file", audioFile);
      } catch (audioError) {
        console.error("Error creating audio file:", audioError);
        toast.error("Failed to prepare audio file.");
        return;
      }
    }

    try {
      await axios.post("/api/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Complaint submitted successfully!");
      onComplaintCreated();
      onClose();

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation({ latitude: null, longitude: null });
      setLatitude(null);
      setLongitude(null);
      setMediaFiles([]);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioBlob(null);
      setAudioUrl(null);
      setFormErrors({});
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error("Something went wrong submitting complaint.");
    }
  };

  return (
    <div style={styles.container}>
      <ToastContainer limit={3} />
      <div style={styles.card}>
        <h2 style={styles.heading}>📣 File a New Complaint</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          {formErrors.title && (
            <div style={styles.error}>{formErrors.title}</div>
          )}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.input}
          >
            <option value="">Select Category</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <div style={styles.error}>{formErrors.category}</div>
          )}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          {formErrors.description && (
            <div style={styles.error}>{formErrors.description}</div>
          )}
          <div style={styles.audioSection}>
            {audioBlob && audioUrl ? (
              <>
                <audio controls src={audioUrl} />
                <button
                  type="button"
                  onClick={handleRemoveRecording}
                  style={styles.button}
                >
                  Remove Audio
                </button>
              </>
            ) : audioRecording ? (
              <button
                type="button"
                onClick={handleStopRecording}
                style={{ ...styles.button, backgroundColor: "#dc3545" }}
              >
                Stop Recording
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStartRecording}
                style={styles.button}
              >
                Record Audio
              </button>
            )}
          </div>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaFileChange}
            style={styles.input}
          />
          {formErrors.mediaFiles && (
            <div style={styles.error}>{formErrors.mediaFiles}</div>
          )}
          {mediaFiles.map((file, index) => (
            <div key={index} style={styles.mediaItem}>
              <span>{file.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveMedia(index)}
                style={styles.button}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleLocationClick}
            style={styles.button}
          >
            Get Current Location
          </button>
          {location.latitude && location.longitude && (
            <div style={styles.locationDisplay}>
              📍 Latitude: {location.latitude}, Longitude: {location.longitude}
            </div>
          )}
          <button type="submit" style={styles.submitButton}>
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateComplaint;

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "30px",
    backgroundColor: "#f0f2f5",
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    padding: "25px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    marginBottom: "20px",
    textAlign: "center",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  textarea: {
    padding: "12px",
    fontSize: "16px",
    minHeight: "100px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "fit-content",
  },
  submitButton: {
    padding: "12px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "16px",
  },
  error: {
    color: "red",
    fontSize: "14px",
  },
  locationDisplay: {
    fontSize: "14px",
    color: "#555",
    paddingLeft: "5px",
  },
  audioSection: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  mediaItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: "8px",
    borderRadius: "4px",
  },
};