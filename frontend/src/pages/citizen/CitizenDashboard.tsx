// CitizenDashboard.tsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Navbar,
  Nav,
  Table,
  Badge,
  Modal,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../hooks/useAuth";
import axios from "../../api/axiosInstance";
import CreateComplaint, {
  CreateComplaintProps,
} from "../citizen/CreateComplaint";

interface Complaint {
  complaint_id: number;
  title: string;
  status: string;
  upvotes: number;
  citizen_name: string;
  created_at: string;
  citizen_id: number;
}

const CitizenDashboard: React.FC = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [view, setView] = useState<"my" | "all" | "trending">("my");
  const [showProfile, setShowProfile] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async (citizenId: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/complaints/citizen/${citizenId}`);
      // Ensure the response data is an array
      const complaintData = Array.isArray(response.data) ? response.data : [];

      // Fetch additional data for each complaint
      const complaintsWithData = await Promise.all(
        complaintData.map(async (complaint: Complaint) => {
          const upvotesResponse = await axios.get(
            `/api/complaints/${complaint.complaint_id}/upvotes/count`
          );
          const citizenResponse = await axios.get(
            `/api/citizen/${complaint.citizen_id}`
          ); // Use citizen_id from complaint

          // Extract citizen name from the nested 'users' object
          const citizenName = citizenResponse.data.citizen
            ? citizenResponse.data.citizen.fullname
            : "N/A";

          return {
            ...complaint,
            upvotes: upvotesResponse.data.count,
            citizen_name: citizenName,
          };
        })
      );

      setComplaints(complaintsWithData);
    } catch (error: any) {
      console.error("Failed to load complaints", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCitizenId = async (userId: string | number | undefined) => {
    try {
      const response = await axios.get(`/api/citizen/user/${userId}`);
      return response.data.citizen_id;
    } catch (error) {
      console.error("Failed to fetch citizen ID", error);
      return null;
    }
  };

  const handleFetchMyComplaints = async () => {
    setLoading(true);
    try {
      const userId = user?.user_id;
      const citizenId = await fetchCitizenId(userId);

      if (citizenId) {
        await fetchComplaints(citizenId);
      } else {
        setComplaints([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchAllComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/complaints");
      const complaintData = Array.isArray(response.data) ? response.data : [];

      const complaintsWithData = await Promise.all(
        complaintData.map(async (complaint: Complaint) => {
          const upvotesResponse = await axios.get(
            `/api/complaints/${complaint.complaint_id}/upvotes/count`
          );
          const citizenResponse = await axios.get(
            `/api/citizen/${complaint.citizen_id}`
          );

          const citizenName = citizenResponse.data.citizen
            ? citizenResponse.data.citizen.fullname
            : "N/A";

          return {
            ...complaint,
            upvotes: upvotesResponse.data.count,
            citizen_name: citizenName,
          };
        })
      );

      setComplaints(complaintsWithData);
    } catch (error: any) {
      console.error("Failed to load all complaints", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchTrendingComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/statistics/complaints/trending");
      const complaintData = Array.isArray(response.data) ? response.data : [];

      const complaintsWithData = await Promise.all(
        complaintData.map(async (complaint: Complaint) => {
          const upvotesResponse = await axios.get(
            `/api/complaints/${complaint.complaint_id}/upvotes/count`
          );
          const citizenResponse = await axios.get(
            `/api/citizen/${complaint.citizen_id}`
          );

          const citizenName = citizenResponse.data.citizen
            ? citizenResponse.data.citizen.fullname
            : "N/A";

          return {
            ...complaint,
            upvotes: upvotesResponse.data.count,
            citizen_name: citizenName,
          };
        })
      );

      setComplaints(complaintsWithData);
    } catch (error: any) {
      console.error("Failed to load trending complaints", error);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFetch = () => {
    if (view === "my") {
      handleFetchMyComplaints();
    } else if (view === "all") {
      handleFetchAllComplaints();
    } else if (view === "trending") {
      handleFetchTrendingComplaints();
    }
  };

  useEffect(() => {
    handleFetch();
  }, [view]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleComplaintCreated = () => {
    setShowComplaintModal(false);
    handleFetch();
  };

  const handleUpvote = async (complaintId: number, citizenId: number) => {
    try {
      await axios.post(`/api/complaints/${complaintId}/upvote`, {
        citizen_id: citizenId,
      });
      // Optimistically update the upvotes count
      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === complaintId ? { ...c, upvotes: c.upvotes + 1 } : c
        )
      );
    } catch (err) {
      console.error("Failed to upvote", err);
    }
  };

  const renderComplaints = (complaints: Complaint[]) => (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Status</th>
          <th>Upvotes</th>
          <th>Citizen</th>
          <th>Created At</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {complaints.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center text-muted">
              No complaints found.
            </td>
          </tr>
        ) : (
          complaints.map((c) => (
            <tr key={c.complaint_id}>
              <td>{c.complaint_id}</td>
              <td>{c.title}</td>
              <td>
                <Badge bg={c.status === "Resolved" ? "success" : "warning"}>
                  {c.status}
                </Badge>
              </td>
              <td>{c.upvotes}</td>
              <td>{c.citizen_name || "N/A"}</td>
              <td>{new Date(c.created_at).toISOString().split("T")[0]}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleUpvote(c.complaint_id, c.citizen_id)}
                >
                  👍 Upvote
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  return (
    <>
      <Navbar expand="lg" className="px-4 bg-light shadow-sm">
        <Navbar.Brand>CivicVoice</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between">
          <Nav className="me-auto">
            <Nav.Link onClick={() => setView("my")} active={view === "my"}>
              My Complaints
            </Nav.Link>
            <Nav.Link onClick={() => setView("all")} active={view === "all"}>
              All Complaints
            </Nav.Link>
            <Nav.Link
              onClick={() => setView("trending")}
              active={view === "trending"}
            >
              Trending
            </Nav.Link>
          </Nav>
          <div className="d-flex gap-2">
            <Button
              variant="outline-primary"
              onClick={() => setShowComplaintModal(true)}
            >
              + Create
            </Button>
            <Button variant="outline-danger" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container className="mt-4">
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <h4 className="mb-3">
              {view === "my"
                ? "My Complaints"
                : view === "all"
                ? "All Complaints"
                : "🔥 Trending Complaints"}
            </h4>
            {renderComplaints(complaints)}
          </>
        )}
      </Container>

      {/* Create Complaint Modal */}
      <Modal
        show={showComplaintModal}
        onHide={() => setShowComplaintModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateComplaint
            onClose={() => setShowComplaintModal(false)}
            onComplaintCreated={handleComplaintCreated}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CitizenDashboard;
