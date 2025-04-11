import React, { useState, useEffect } from "react";
import axios from "axios";

interface CreateComplaintProps {
  onClose: () => void;
  onComplaintCreated: () => void;
}

interface Department {
  id: number;
  name: string;
}

const CreateComplaint: React.FC<CreateComplaintProps> = ({ onClose, onComplaintCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [zone, setZone] = useState("");
  const [department, setDepartment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [category, setCategory] = useState("");


  useEffect(() => {
    // Get user location (lat/lng)
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    // Fetch departments from backend
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/departments");
        setDepartments(res.data);
      } catch (error) {
        console.error("Failed to fetch departments", error);
      }
    };

    fetchDepartments();
  }, []);

  const handleAudioGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await axios.post("http://localhost:3000/api/generate-description", { audio: "sampleAudio.wav" });
      setDescription(res.data.description); // Assuming backend returns { description: "..." }
    } catch (error) {
      console.error("Error generating description from audio", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("zone", zone);
      formData.append("department", department);
      if (latitude) formData.append("latitude", latitude.toString());
      if (longitude) formData.append("longitude", longitude.toString());
      if (image) formData.append("image", image);

      await axios.post("http://localhost:3000/api/complaints", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      onComplaintCreated();
      onClose();
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3">
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <button type="button" className="btn btn-sm btn-outline-secondary mt-2" onClick={handleAudioGenerate} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate from Audio"}
        </button>
      </div>

      <div className="mb-3">
        <label className="form-label">Location</label>
        <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Complaint Zone</label>
        <input className="form-control" value={zone} onChange={(e) => setZone(e.target.value)} required />
      </div>

      <div className="mb-3">
  <label className="form-label">Category</label>
  <select
    className="form-select"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
  >
    <option value="">Select Category</option>
    <option value="Garbage_Collection">Garbage Collection</option>
    <option value="Drainage_Issue">Drainage Issue</option>
    <option value="Water_Supply_Disruption">Water Supply Disruption</option>
    <option value="Water_Leakage">Water Leakage</option>
    <option value="Electricity_Outage">Electricity Outage</option>
    <option value="Street_Light_Issue">Street Light Issue</option>
    <option value="Potholes___Road_Damage">Potholes & Road Damage</option>
    <option value="Broken_Footpath">Broken Footpath</option>
    <option value="Unauthorized_Construction">Unauthorized Construction</option>
    <option value="Public_Health_Hazard">Public Health Hazard</option>
    <option value="Incorrect_Property_Tax_Bill">Incorrect Property Tax Bill</option>
    <option value="Fire_Safety_Violation">Fire Safety Violation</option>
    <option value="Pollution_Complaint">Pollution Complaint</option>
    <option value="Deforestation_Issue">Deforestation Issue</option>
    <option value="Traffic_Signal_Issue">Traffic Signal Issue</option>
    <option value="Parking_Violation">Parking Violation</option>
    <option value="Damaged_Public_Facilities">Damaged Public Facilities</option>
    <option value="Illegal_Trade_Activity">Illegal Trade Activity</option>
  </select>
</div>


      <div className="mb-3">
        <label className="form-label">Attach Image (optional)</label>
        <input type="file" accept="image/*" className="form-control" onChange={handleImageChange} />
      </div>

      {latitude && longitude && (
        <div className="mb-3 text-muted">
          <small>Detected Location: Lat {latitude.toFixed(4)}, Lng {longitude.toFixed(4)}</small>
        </div>
      )}

      <button type="submit" className="btn btn-primary">
        Submit Complaint
      </button>
    </form>
  );
};

export default CreateComplaint;
