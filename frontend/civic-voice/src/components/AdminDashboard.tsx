import React, { useState } from "react";
import { Table, Button, Form, Container } from "react-bootstrap";
import ProfileCard from "./ProfileCard";

interface Complaint {
  id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  citizen_name: string;
  citizen_email: string;
  media_urls?: string[];
}

const sampleComplaints: Complaint[] = [
  {
    id: 1,
    title: "Broken Streetlight",
    description: "The streetlight near block A is not working.",
    status: "Pending",
    created_at: "2025-04-01T10:30:00Z",
    citizen_name: "Parth Chavda",
    citizen_email: "parth@example.com",
    media_urls: ["https://example.com/photo1.jpg"]
  },
  {
    id: 2,
    title: "Overflowing Garbage",
    description: "Garbage not collected from last 3 days in sector 7.",
    status: "In Progress",
    created_at: "2025-04-02T09:00:00Z",
    citizen_name: "Dhairya Modi",
    citizen_email: "dhairya@example.com",
    media_urls: []
  },
  {
    id: 3,
    title: "Water Leakage",
    description: "Leakage near main road causing traffic.",
    status: "Resolved",
    created_at: "2025-04-03T12:15:00Z",
    citizen_name: "Aarav Patel",
    citizen_email: "aarav@example.com",
    media_urls: ["https://example.com/photo2.jpg", "https://example.com/photo3.jpg"]
  },
  // Add more rows up to 10 as needed...
];

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(sampleComplaints);
  const [editedStatus, setEditedStatus] = useState<{ [id: number]: string }>({});

  const handleStatusChange = (id: number, newStatus: string) => {
    setEditedStatus((prev) => ({ ...prev, [id]: newStatus }));
  };

  const updateStatus = (id: number) => {
    const newStatus = editedStatus[id];
    if (!newStatus) return;

    const updated = complaints.map((comp) =>
      comp.id === id ? { ...comp, status: newStatus } : comp
    );
    setComplaints(updated);
    alert(`Status for complaint #${id} updated to "${newStatus}"`);
  };

  return (
    <Container className="mt-4">
      <Container className="mt-4">
        <ProfileCard />
      </Container>
      <h2 className="mb-4">Admin Dashboard – All Complaints</h2>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Submitted By</th>
            <th>Submitted At</th>
            <th>Media</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>{c.status}</td>
              <td>
                <Form.Select
                  value={editedStatus[c.id] || c.status}
                  onChange={(e) => handleStatusChange(c.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Rejected">Rejected</option>
                </Form.Select>
              </td>
              <td>
                {c.citizen_name} <br /> <small>({c.citizen_email})</small>
              </td>
              <td>{new Date(c.created_at).toLocaleString()}</td>
              <td>
                {c.media_urls?.length ? (
                  c.media_urls.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="d-block"
                    >
                      Media {index + 1}
                    </a>
                  ))
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => updateStatus(c.id)}
                >
                  Update
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
