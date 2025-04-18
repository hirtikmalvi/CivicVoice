// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// interface CreateComplaintProps {
//   onClose: () => void;
//   onComplaintCreated: () => void;
// }

// const CreateComplaint: React.FC<CreateComplaintProps> = ({
//   onClose,
//   onComplaintCreated,
// }) => {
//   const [title, setTitle] = useState("");
//   const [keywords, setKeywords] = useState("");
//   const [category, setCategory] = useState("");
//   const [files, setFiles] = useState<FileList | null>(null);
//   const [latitude, setLatitude] = useState<number>();
//   const [longitude, setLongitude] = useState<number>();
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setLatitude(pos.coords.latitude);
//         setLongitude(pos.coords.longitude);
//       },
//       () => toast.error("Could not get location")
//     );
//   }, []);

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       if (e.target.files.length > 5) {
//         toast.error("You can upload a maximum of 5 files.");
//       } else {
//         setFiles(e.target.files);
//       }
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const audioPresent =
//       files && [...files].some((f) => f.type.startsWith("audio"));

//     if (!keywords && !audioPresent) {
//       return toast.error("Either description or audio is required.");
//     }

//     if (!category) return toast.error("Category is required.");

//     const formData = new FormData();
//     formData.append("citizen_id", "1"); // Placeholder
//     if (title) formData.append("title", title);
//     formData.append("keywords", keywords);
//     formData.append("category", category);
//     if (latitude) formData.append("latitude", latitude.toString());
//     if (longitude) formData.append("longitude", longitude.toString());

//     if (files) {
//       Array.from(files).forEach((file) => {
//         formData.append("file", file);
//       });
//     }

//     try {
//       setIsLoading(true);
//       await axios.post("http://localhost:5000/api/complaints", formData, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });
//       toast.success("Complaint created successfully!");
//       onComplaintCreated();
//       onClose();
//     } catch (error) {
//       toast.error("Error submitting complaint.");
//       console.error(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="p-3">
//       <div className="mb-3">
//         <label className="form-label">Title (Optional)</label>
//         <input
//           className="form-control"
//           value={title}
//           onChange={(e) => setTitle(e.target.value)}
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Description</label>
//         <textarea
//           className="form-control"
//           value={keywords}
//           onChange={(e) => setKeywords(e.target.value)}
//           placeholder="Write complaint keywords or context"
//         />
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Attach Media (Image/Video/Audio)</label>
//         <input
//           type="file"
//           className="form-control"
//           accept="image/*,video/*,audio/*"
//           multiple
//           onChange={handleFileChange}
//         />
//         <div className="form-text">Maximum 5 files allowed.</div>
//       </div>

//       <div className="mb-3">
//         <label className="form-label">Complaint Category</label>
//         <select
//           className="form-select"
//           value={category}
//           onChange={(e) => setCategory(e.target.value)}
//           required
//         >
//           <option value="">Select Category</option>
//           <option value="Garbage_Collection">Garbage Collection</option>
//           <option value="Drainage_Issue">Drainage Issue</option>
//           <option value="Water_Supply_Disruption">
//             Water Supply Disruption
//           </option>
//           <option value="Water_Leakage">Water Leakage</option>
//           <option value="Electricity_Outage">Electricity Outage</option>
//           <option value="Street_Light_Issue">Street Light Issue</option>
//           <option value="Potholes___Road_Damage">Potholes & Road Damage</option>
//           <option value="Broken_Footpath">Broken Footpath</option>
//           <option value="Unauthorized_Construction">
//             Unauthorized Construction
//           </option>
//           <option value="Public_Health_Hazard">Public Health Hazard</option>
//           <option value="Incorrect_Property_Tax_Bill">
//             Incorrect Property Tax Bill
//           </option>
//           <option value="Fire_Safety_Violation">Fire Safety Violation</option>
//           <option value="Pollution_Complaint">Pollution Complaint</option>
//           <option value="Deforestation_Issue">Deforestation Issue</option>
//           <option value="Traffic_Signal_Issue">Traffic Signal Issue</option>
//           <option value="Parking_Violation">Parking Violation</option>
//           <option value="Damaged_Public_Facilities">
//             Damaged Public Facilities
//           </option>
//           <option value="Illegal_Trade_Activity">Illegal Trade Activity</option>
//         </select>
//       </div>

//       {latitude && longitude && (
//         <div className="mb-3 text-muted">
//           <small>
//             Location: {latitude.toFixed(4)}, {longitude.toFixed(4)}
//           </small>
//         </div>
//       )}

//       <button
//         type="submit"
//         className="btn btn-primary w-100"
//         disabled={isLoading}
//       >
//         {isLoading ? "Submitting..." : "Submit Complaint"}
//       </button>
//     </form>
//   );
// };

// export default CreateComplaint;
import React from "react";

const CreateComplaint = () => {
  return <div></div>;
};

export default CreateComplaint;
