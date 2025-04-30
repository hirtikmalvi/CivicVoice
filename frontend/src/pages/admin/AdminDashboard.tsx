import React, { useState, useEffect } from "react";
import AdminProfile from './AdminProfile'; 
import {
  Container,
  Button,
  Navbar,
  Nav,
  Table,
  Badge,
  Spinner,
  Form,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../hooks/useAuth";
import axios from "../../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

interface Complaint {
  complaint_id: number;
  title: string;
  status: string;
  upvotes: number;
  citizen_name: string;
  citizen_email: string;
  created_at: string;
  citizen_id: number;
}

interface User {
  user_id: number;
  fullname: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Citizen {
  citizen_id: number;
  user_id: number;
  adhar_number: string;
  phone_number: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
  updated_at: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  fullname?: string;
  email: string;
}

interface Authority {
  authority_id: number;
  user_id: number;
  zone: string;
  department: string;
  created_at: string;
  updated_at: string;
  fullname?: string;
  email: string;
  user_created_at: string;
  user_updated_at: string;
}

const statusMapping = {
  Pending: "Pending",
  "In Progress": "In_Progress",
  Resolved: "Resolved",
  Rejected: "Rejected",
  Escalated: "Escalated",
  Closed: "Closed",
};

const displayMapping = {
  Pending: "Pending",
  In_Progress: "In Progress",
  Resolved: "Resolved",
  Rejected: "Rejected",
  Escalated: "Escalated",
  Closed: "Closed",
};

const AdminDashboard: React.FC = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"complaints" | "users" | "citizens" | "authorities" | "profile">(
    "complaints"
  );
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [citizens, setCitizens] = useState<Citizen[]>([]);
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(false);
  const [editedStatus, setEditedStatus] = useState<{ [id: number]: string }>(
    {}
  );
  const [statusUpdating, setStatusUpdating] = useState<{
    [id: number]: boolean;
  }>({});

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/complaints");
      const complaintData = Array.isArray(response.data) ? response.data : [];

      const complaintsWithData = await Promise.all(
        complaintData.map(async (complaint: any) => {
          const upvotesResponse = await axios.get(
            `/api/complaints/${complaint.complaint_id}/upvotes/count`
          );
          const citizenResponse = await axios.get(
            `/api/citizen/${complaint.citizen_id}`
          );

          return {
            ...complaint,
            status:
              displayMapping[complaint.status as keyof typeof displayMapping] ||
              complaint.status,
            upvotes: upvotesResponse.data.count,
            citizen_name: citizenResponse.data.citizen?.fullname || "N/A",
            citizen_email: citizenResponse.data.citizen?.email || "N/A",
          };
        })
      );

      setComplaints(complaintsWithData);
    } catch (error) {
      toast.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/all/users");
      console.log(response.data.users);
      setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      console.log(Array.isArray(response.data.users));
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchCitizens = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/all/citizens");
      console.log(response.data.citizens);
      setCitizens(response.data.citizens);
    } catch (error) {
      toast.error("Failed to load citizens");
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthorities = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/admin/all/authorities");
      console.log(response.data.authorities);
      setAuthorities(response.data.authorities);
    } catch (error) {
      toast.error("Failed to load authorities");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComplaint = async (complaintId: number | string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this complaint?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/complaints/${complaintId}`);
      setComplaints((prev) =>
        prev.filter((c) => c.complaint_id !== complaintId)
      );
      toast.success("Complaint deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete complaint.");
    }
  };

  //delete citizen
  const handleDeleteCitizen = async (citizenId: number | string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this citizen?"
    );
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/api/admin/by-citizen-id/${citizenId}`);
      setCitizens((prev) =>
        prev.filter((citizen) => citizen.citizen_id !== citizenId)
      );
      toast.success("Citizen deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete citizen.");
    }
  };

  // Delete authority
  const handleDeleteAuthority = async (authorityId: number | string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this authority?"
    );
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/api/admin/by-authority-id/${authorityId}`);
      setAuthorities((prev) =>
        prev.filter((authority) => authority.authority_id !== authorityId)
      );
      toast.success("Authority deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete authority.");
    }
  };

  //Delete whole user with role (user_type)
  const handleDeleteUser = async (userId: number | string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this citizen?"
    );
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/api/admin/user/${userId}`);
      setUsers((prev) => {
        const updated = prev.filter((user) => user.user_id !== userId);
        return updated;
      }
      );

      toast.success("User deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete User.");
    }
  };
  

  useEffect(() => {
    if (tab === "complaints") fetchComplaints();
    else if (tab === "users") fetchUsers();
    else if (tab === "citizens") fetchCitizens();
    else fetchAuthorities();
  }, [tab]);

  const handleStatusChange = (id: number, newStatus: string) => {
    setEditedStatus((prev) => ({ ...prev, [id]: newStatus }));
  };

  const updateStatus = async (id: number) => {
    const displayStatus = editedStatus[id];
    const backendStatus =
      statusMapping[displayStatus as keyof typeof statusMapping] ||
      displayStatus;

    setStatusUpdating((prev) => ({ ...prev, [id]: true }));

    try {
      await axios.patch(`/api/complaints/${id}/status`, {
        status: backendStatus,
      });

      setComplaints((prev) =>
        prev.map((c) =>
          c.complaint_id === id ? { ...c, status: displayStatus } : c
        )
      );

      setEditedStatus((prev) => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });

      toast.success(`Complaint #${id} status updated.`);
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setStatusUpdating((prev) => ({ ...prev, [id]: false }));
    }
  };

  const formatDate = (date: string) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  const maskAadhar = (aadhar: string) =>
    aadhar ? `XXXX-XXXX-${aadhar.slice(-4)}` : "N/A";

  const maskPhone = (phone: string) =>
    phone ? `XXXXX-${phone.slice(-5)}` : "N/A";

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <ToastContainer />
      <Navbar expand="lg" className="px-4 bg-light shadow-sm">
        <Navbar.Brand>CivicVoice Admin</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link
              onClick={() => setTab("complaints")}
              active={tab === "complaints"}
            >
              All Complaints
            </Nav.Link>
            <Nav.Link onClick={() => setTab("users")} active={tab === "users"}>
              All Users
            </Nav.Link>
            <Nav.Link
              onClick={() => setTab("citizens")}
              active={tab === "citizens"}
            >
              All Citizens
            </Nav.Link>
            <Nav.Link
              onClick={() => setTab("authorities")}
              active={tab === "authorities"}
            >
              All Authorities
            </Nav.Link>
            <Nav.Link
              onClick={() => setTab("profile")}
              active={tab === "profile"}
            >
              Profile
            </Nav.Link>
          </Nav>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container className="py-4">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : tab === "complaints" ? (
          <>
            <h4>All Complaints</h4>
            <Table striped bordered hover responsive className="text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Change</th>
                  <th>Upvotes</th>
                  <th>Citizen</th>
                  <th>Email</th>
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.complaint_id}>
                    <td>{c.complaint_id}</td>
                    <td>{c.title}</td>
                    <td>
                      <Badge
                        bg={
                          c.status === "Resolved"
                            ? "success"
                            : c.status === "In Progress"
                            ? "info"
                            : c.status === "Rejected"
                            ? "danger"
                            : "warning"
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>
                    <td>
                      <Form.Select
                        size="sm"
                        value={editedStatus[c.complaint_id] || c.status}
                        onChange={(e) =>
                          handleStatusChange(c.complaint_id, e.target.value)
                        }
                      >
                        {Object.values(displayMapping).map((label) => (
                          <option key={label}>{label}</option>
                        ))}
                      </Form.Select>
                    </td>
                    <td>{c.upvotes}</td>
                    <td>{c.citizen_name}</td>
                    <td>{c.citizen_email}</td>
                    <td>{formatDate(c.created_at)}</td>
                    <td>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(c.complaint_id)}
                        disabled={
                          !editedStatus[c.complaint_id] ||
                          statusUpdating[c.complaint_id]
                        }
                      >
                        {statusUpdating[c.complaint_id]
                          ? "Updating..."
                          : "Update"}
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteComplaint(c.complaint_id)}
                        className="mt-1"
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : tab === "users" ? (
          <>
            <h4>All Users</h4>
            <Table striped bordered hover responsive className="text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered</th>
                  <th>Updated</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id}>
                    <td>{u.user_id}</td>
                    <td>{u.fullname}</td>
                    <td>{u.email}</td>
                    <td>
                      <Badge bg="secondary">{u.role}</Badge>
                    </td>
                    <td>{formatDate(u.created_at)}</td>
                    <td>{formatDate(u.updated_at)}</td>
                    <td>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() =>
                            handleDeleteUser(u.user_id)
                          }
                        >
                          Delete
                        </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : tab === "citizens" ? (
          <>
            <h4>All Citizens</h4>
            <Table striped bordered hover responsive className="text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Aadhar</th>
                  <th>City/State</th>
                  <th>Registered</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {citizens.map((c) => (
                  <tr key={c.citizen_id}>
                    <td>{c.citizen_id}</td>
                    <td>{c.fullname}</td>
                    <td>{c.email}</td>
                    <td>{maskPhone(c.phone_number)}</td>
                    <td>{maskAadhar(c.adhar_number)}</td>
                    <td>
                      {c.city}, {c.state}
                    </td>
                    <td>{formatDate(c.created_at)}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDeleteCitizen(c.citizen_id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : tab === "authorities" ? (
          <>
          <h4>All Authorities</h4>
          <Table striped bordered hover responsive className="text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Zone</th>
                <th>Created At</th>
                <th>Updated At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {authorities.map((a) => (
                <tr key={a.authority_id}>
                  <td>{a.authority_id}</td>
                  <td>{a.fullname}</td>
                  <td>{a.email}</td>
                  <td>{a.department}</td>
                  <td>{a.zone}</td>
                  <td>{formatDate(a.created_at)}</td>
                  <td>{formatDate(a.updated_at)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDeleteAuthority(a.authority_id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
        ) : (
          <AdminProfile />
        )
        }
      </Container>
    </>
  );
};

export default AdminDashboard;
