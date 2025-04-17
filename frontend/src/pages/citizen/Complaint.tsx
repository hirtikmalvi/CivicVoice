import React from "react";
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

const ComplaintDetailExample: React.FC = () => {
  const complaint: ComplaintData = {
    complaint_id: "349",
    citizen_id: "17",
    title: "Potholes on Road",
    description: "There is a huge pothole on Nikol-Naroda Road, Ahmedabad.",
    status: "Pending",
    category: "Potholes___Road_Damage",
    media_url: null,
    latitude: 23.0326272,
    longitude: 72.630272,
    authority_id: null,
    created_at: "2025-04-16T20:00:53.239Z",
    updated_at: "2025-04-16T20:00:53.239Z",
  };

  // Hardcoded media data
  const media: Media[] = [
    {
      media_id: "52",
      complaint_id: "349",
      media_url:
        "https://res.cloudinary.com/disxth1ow/image/upload/v1744833654/complaints/uofresfiylinfqnocxnk.jpg",
      media_type: "image",
      created_at: "2025-04-16T20:00:54.691Z",
    },
    {
      media_id: "53",
      complaint_id: "349",
      media_url:
        "https://res.cloudinary.com/disxth1ow/image/upload/v1744833655/complaints/vyksy5ji3xp8r15yibux.jpg",
      media_type: "image",
      created_at: "2025-04-16T20:00:55.569Z",
    },
  ];

  // Format the category by replacing underscores with spaces
  const formatCategory = (category: string): string => {
    return category.replace(/_/g, " ");
  };

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get the badge color based on status
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case "Resolved":
        return "bg-success";
      case "In Progress":
        return "bg-info text-dark";
      case "Rejected":
        return "bg-danger";
      default:
        return "bg-warning text-dark";
    }
  };

  // Open map in new tab with the location
  const viewOnMap = (): void => {
    const mapUrl = `https://www.google.com/maps?q=${complaint.latitude},${complaint.longitude}`;
    window.open(mapUrl, "_blank");
  };

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

export default ComplaintDetailExample;
