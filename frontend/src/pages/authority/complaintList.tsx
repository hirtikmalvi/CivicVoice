// pages/authority/ComplaintList.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ComplaintList = ({ complaints }: { complaints: any[] }) => {
  const navigate = useNavigate();

  if (complaints.length === 0) {
    return <p className="text-center text-muted">No complaints found.</p>;
  }

  return (
    <div className="row">
      {complaints.map((complaint) => (
        <div
          key={complaint.complaint_id}
          className="col-md-6 col-lg-4 mb-4"
        >
          <div
            className="card h-100 shadow-sm"
            onClick={() => navigate(`/authority/complaint/${complaint.complaint_id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="card-body">
              <h5 className="card-title">{complaint.title}</h5>
              <p className="card-text text-truncate">
                {complaint.description}
              </p>
              <span className={`badge ${getStatusBadge(complaint.status)}`}>
                {formatStatus(complaint.status)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const formatStatus = (status: string) => {
  // Capitalize with spaces (e.g., "In_Progress" -> "In Progress")
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
};

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-warning text-dark';
    case 'in_progress':
      return 'bg-primary';
    case 'resolved':
      return 'bg-success';
    case 'rejected':
      return 'bg-danger';
    case 'escalated':
      return 'bg-dark';
    case 'closed':
      return 'bg-secondary';
    default:
      return 'bg-light text-dark';
  }
};

export default ComplaintList;
