import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance";

const ComplaintDetails = () => {
  const { id } = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [citizenName, setCitizenName] = useState<string>("");

  const fetchCitizenById = async (citizenId: string) => {
    const res = await axios.get(`api/citizen/${citizenId}`);
    console.log(res.data);
    return res.data;
  };

  const fetchComplaintById = async (id: string) => {
    const response = await axios.get(`api/complaints/${id}`);
    console.log("Response data Before update", response.data);
    return response.data;
  };

  const updateComplaintStatus = async (id: string, status: string) => {
    const response = await axios.patch(`api/complaints/${id}/status`, {
      status,
    });
    console.log("Response data after update", response.data.complaint);
    return response.data.complaint;
  };

  const viewOnMap = () => {
    if (complaint)
      window.open(
        `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`,
        "_blank"
      );
  };

  useEffect(() => {
    if (!id) return;

    const loadComplaintDetails = async () => {
      try {
        const data = await fetchComplaintById(id);
        setComplaint(data);
        setStatus(data.status);
        console.log("Hello 1");
        // Fetch citizen name
        const citizen = await fetchCitizenById(data.citizen_id);
        setCitizenName(citizen.citizen.fullname);
        console.log("Hello 2");
      } catch {
        setError("Failed to fetch complaint or citizen details");
      } finally {
        setLoading(false);
      }
    };

    loadComplaintDetails();
  }, [id]);

  const handleUpdate = async () => {
    try {
      setUpdating(true);
      const updated = await updateComplaintStatus(id!, status);
      setComplaint(updated);
    } catch {
      setError("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (error) return <div className="container mt-5 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-3">{complaint.title}</h2>
        <p className="text-muted mb-4">{complaint.description}</p>

        <div className="row mb-4">
          <div className="col-md-6 mb-2">
            <strong>Complaint ID:</strong> {complaint.complaint_id}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Citizen:</strong> {citizenName} (ID: {complaint.citizen_id})
          </div>
          <div className="col-md-6 mb-2">
            <strong>Category:</strong> {complaint.category.replace(/_/g, " ")}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Status:</strong>{" "}
            <span className={`badge ${getStatusBadge(complaint.status)}`}>
              {formatStatus(complaint.status)}
            </span>
          </div>
          <div className="col-md-6 mb-2">
            <strong>Latitude:</strong> {complaint.latitude}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Longitude:</strong> {complaint.longitude}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Created At:</strong>{" "}
            {new Date(complaint.created_at).toUTCString()}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Updated At:</strong>{" "}
            {new Date(complaint.updated_at).toUTCString()}
          </div>
        </div>
          <button
            className="btn btn-sm btn-outline-primary mb-3"
            onClick={viewOnMap}
          >
            View on Map
          </button>

        {complaint.complaint_media?.length > 0 && (
          <div className="mb-4">
            <strong>Attached Media:</strong>
            <div className="mt-2 d-flex flex-wrap gap-3">
              {complaint.complaint_media.map((media: any) => (
                <div key={media.media_id}>
                  <a
                    href={media.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {/* <img
                                            src={media.media_url}
                                            alt="Complaint Media"
                                            style={{ width: '150px', height: 'auto', borderRadius: '8px' }}
                                        /> */}
                    Media
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-bold">Update Complaint Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="form-select"
          >
            <option value="Pending">Pending</option>
            <option value="In_Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
            <option value="Escalated">Escalated</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <button
          onClick={handleUpdate}
          disabled={updating}
          className="btn btn-primary"
        >
          {updating ? "Updating..." : "Update Status"}
        </button>
      </div>
    </div>
  );
};

const formatStatus = (status: string) =>
  status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-warning text-dark";
    case "in_progress":
      return "bg-primary";
    case "resolved":
      return "bg-success";
    case "rejected":
      return "bg-danger";
    case "escalated":
      return "bg-dark";
    case "closed":
      return "bg-secondary";
    default:
      return "bg-light text-dark";
  }
};

export default ComplaintDetails;
