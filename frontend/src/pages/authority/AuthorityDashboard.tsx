import React, { useState } from "react";
import {
  Container,
  Button,
  Table,
  Badge,
  Navbar,
  Nav,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../hooks/useAuth";
import ProfileCard from "../../components/ProfileCard";

interface Complaint {
  id: number;
  title: string;
  status: string;
  upvotes: number;
  createdBy: string;
}

const AuthorityDashboard: React.FC = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const [allComplaints, setAllComplaints] = useState<Complaint[]>([
    {
      id: 1,
      title: "Broken pipe",
      status: "Pending",
      upvotes: 5,
      createdBy: "user1",
    },
    {
      id: 2,
      title: "No streetlights",
      status: "In Progress",
      upvotes: 7,
      createdBy: "user2",
    },
    {
      id: 3,
      title: "Garbage overflow",
      status: "Resolved",
      upvotes: 4,
      createdBy: "user3",
    },
  ]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleStatusChange = (id: number, newStatus: string) => {
    setAllComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
    );
  };

  const filteredComplaints = allComplaints.filter((c) =>
    c.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      {/* <Navbar bg="light" className="px-4 d-flex justify-content-between">
        <h4>Authority Dashboard</h4>
        <div className="d-flex gap-3 align-items-center">
          <ProfileCard />
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Navbar>

      <Container className="mt-4">
        <Form.Control
          type="text"
          placeholder="Search complaints..."
          className="mb-3"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Status</th>
              <th>Upvotes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>
                  <Badge
                    bg={
                      c.status === "Resolved"
                        ? "success"
                        : c.status === "In Progress"
                        ? "info"
                        : "warning"
                    }
                  >
                    {c.status}
                  </Badge>
                </td>
                <td>{c.upvotes}</td>
                <td>
                  <Form.Select
                    size="sm"
                    value={c.status}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container> */}
    </>
  );
};

export default AuthorityDashboard;
