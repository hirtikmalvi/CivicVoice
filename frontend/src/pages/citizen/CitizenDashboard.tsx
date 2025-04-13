import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Navbar,
  Nav,
  Table,
  Badge,
  Modal,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../hooks/useAuth";
import axios from "../../api/axiosInstance"; // Import the axiosInstance

interface Complaint {
  complaint_id: number;
  title: string;
  status: string;
  upvotes: number;
  citizen_id: string;
  created_at: string;
}

const CitizenDashboard: React.FC = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [view, setView] = useState<"my" | "all" | "trending">("my");
  const [showProfile, setShowProfile] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    status: "Pending",
  });
  const [allComplaints, setAllComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/complaints/");
      setAllComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching complaints:", err);
      setAllComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  // const getCitizenById = async (citizen_id: string): Promise<any> => {
  //   try {
  //     const response = await axios.get(`/api/citizen/${citizen_id}`); // Use relative path
  //     return response.data.citizen.fullname as string;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const fetchUserComplaints = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/complaints/citizen/${user.id}` // Use relative path
      );
      setAllComplaints(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching user complaints:", err);
      setAllComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === "my") {
      fetchUserComplaints();
    } else if (view === "all") {
      fetchComplaints();
    }
  }, [view]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleUpvote = (id: number) => {
    setAllComplaints((prev) =>
      prev.map((c) =>
        c.complaint_id === id ? { ...c, upvotes: c.upvotes + 1 } : c
      )
    );
  };

  const handleComplaintSubmit = () => {
    const newId = allComplaints.length + 1;
    const newEntry: Complaint = {
      complaint_id: newId,
      title: newComplaint.title,
      status: newComplaint.status,
      upvotes: 0,
      citizen_id: user?.name || "anonymous",
      created_at: new Date().toISOString(),
    };

    setAllComplaints([...allComplaints, newEntry]);
    setNewComplaint({ title: "", status: "Pending" });
    setShowComplaintModal(false);
  };

  const trendingComplaints = [...allComplaints]
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 3);

  const renderComplaints = (complaints: Complaint[]) => (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Status</th>
          <th>Upvotes</th>
          <th>Created By</th>
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
              {/* <td>{getCitizenById(c.citizen_id)}</td> */}
              <td>{new Date(c.created_at).toISOString().split("T")[0]}</td>
              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleUpvote(c.complaint_id)}
                >
                  Upvote
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
      <Navbar
        bg="light"
        expand="lg"
        className="px-4 d-flex justify-content-between"
      >
        <div className="d-flex align-items-center gap-3">
          <Nav>
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
        </div>
        <div className="d-flex gap-3 align-items-center">
          <Button variant="primary" onClick={() => setShowComplaintModal(true)}>
            + Create Complaint
          </Button>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <>
                {view === "my" && (
                  <>
                    <h3>My Complaints</h3>
                    {renderComplaints(allComplaints)}
                  </>
                )}
                {view === "all" && (
                  <>
                    <h3>All Complaints</h3>
                    {renderComplaints(allComplaints)}
                  </>
                )}
                {view === "trending" && (
                  <>
                    <h3>🔥 Trending Complaints</h3>
                    {renderComplaints(trendingComplaints)}
                  </>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>

      {/* Profile Modal */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>👤 Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Create Complaint Modal */}
      <Modal
        show={showComplaintModal}
        onHide={() => setShowComplaintModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <CreateComplaint
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
          onComplaintCreated={function (): void {
            throw new Error("Function not implemented.");
          }}
        ></CreateComplaint> */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowComplaintModal(false)}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={handleComplaintSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CitizenDashboard;
