import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axiosInstance"; // adjust if your path is different

interface Media {
  media_id: string;
  complaint_id: string;
  media_url: string;
  media_type: string;
  created_at: string;
}

interface ComplaintData {
  complaint_id: string;
  citizen_id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  media_url: string | null;
  latitude: number;
  longitude: number;
  authority_id: string | null;
  created_at: string;
  updated_at: string;
}

const Complaint: React.FC = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [complaint, setComplaint] = useState<ComplaintData | null>(null);
  const [media, setMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const response = await axios.get(`/api/complaints/${complaintId}`);
        const complaintMediaResponse = await axios.get(
          `/api/complaints/${complaintId}/media`
        );
        setComplaint(response.data);
        setMedia(complaintMediaResponse.data);
      } catch (error) {
        console.error("Failed to fetch complaint details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [complaintId]);

  const formatCategory = (category: string): string =>
    category.replace(/_/g, " ");

  const formatDate = (dateString: string): string =>
    new Date(dateString).toLocaleString();

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "Resolved":
        return "bg-success";
      case "In Progress":
        return "bg-info text-dark";
      case "Rejected":
        return "bg-danger";
      case "Escalated":
        return "bg-primary";
      default:
        return "bg-warning text-dark";
    }
  };

  const viewOnMap = () => {
    if (complaint)
      window.open(
        `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`,
        "_blank"
      );
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <h5>Loading complaint details...</h5>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="container py-5 text-center text-danger">
        <h5>Complaint not found.</h5>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Complaint #{complaint.complaint_id}</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-8">
              <h5 className="card-title">{complaint.title}</h5>
              <p className="card-text">{complaint.description}</p>
            </div>
            <div className="col-md-4 text-md-end">
              <span
                className={`badge ${getStatusBadgeClass(
                  complaint.status
                )} mb-2`}
              >
                {complaint.status}
              </span>
              <p className="small text-muted mb-1">
                Category: {formatCategory(complaint.category)}
              </p>
              <p className="small text-muted mb-1">
                Citizen ID: {complaint.citizen_id}
              </p>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <h6>Location</h6>
              <div className="d-flex align-items-center">
                <p className="mb-0">
                  Coordinates: {complaint.latitude}, {complaint.longitude}
                </p>
                <button
                  className="btn btn-sm btn-outline-primary ms-3"
                  onClick={viewOnMap}
                >
                  View on Map
                </button>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <h6>Media</h6>
              {media.length > 0 ? (
                <div className="row g-3">
                  {media.map((item) => (
                    <div className="col-md-4 col-sm-6" key={item.media_id}>
                      {item.media_type === "image" ? (
                        <div className="card h-100">
                          <img
                            src={item.media_url}
                            alt="Complaint media"
                            className="card-img-top"
                            style={{ height: "200px", objectFit: "cover" }}
                          />
                          <div className="card-footer p-2 text-center">
                            <a
                              href={item.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              View Full Size
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="card h-100">
                          <div className="card-body text-center">
                            <p>Media #{item.media_id}</p>
                            <a
                              href={item.media_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-secondary"
                            >
                              View Media
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No media available</p>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <h6>Timeline</h6>
              <div className="table-responsive">
                <table className="table table-sm table-bordered">
                  <tbody>
                    <tr>
                      <th style={{ width: "140px" }}>Created</th>
                      <td>{formatDate(complaint.created_at)}</td>
                    </tr>
                    <tr>
                      <th>Last Updated</th>
                      <td>{formatDate(complaint.updated_at)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-md-6">
              <h6>Authority Information</h6>
              {complaint.authority_id ? (
                <p>Authority ID: {complaint.authority_id}</p>
              ) : (
                <p className="text-muted">No authority assigned yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaint;
