import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

interface Complaint {
  id: number;
  title: string;
  status: string;
  upvotes: number;
  created_at: string;
  citizen_name: string;
  citizen_email: string;
}

interface User {
  user_id: number;
  fullname: string;
  password?: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const adminProfile = {
  name: "Admin User",
  email: "admin@example.com",
};

const sampleComplaints: Complaint[] = [
  {
    id: 350,
    title: "Potholes on Main Road",
    status: "Resolved",
    upvotes: 5,
    created_at: "2025-04-14T12:00:00Z",
    citizen_name: "Dhairya Modi",
    citizen_email: "dhairya@example.com",
  },
  {
    id: 351,
    title: "Overflowing Garbage Bin",
    status: "Pending",
    upvotes: 3,
    created_at: "2025-04-13T09:20:00Z",
    citizen_name: "Sneha R. Sharma",
    citizen_email: "sneha.r.sharma@gmail.com",
  },
  {
    id: 352,
    title: "Broken Street Light",
    status: "In Progress",
    upvotes: 4,
    created_at: "2025-04-12T18:10:00Z",
    citizen_name: "Raj Mehta",
    citizen_email: "raj.mehta@example.com",
  },
  {
    id: 353,
    title: "Illegal Parking Near School",
    status: "Resolved",
    upvotes: 2,
    created_at: "2025-04-11T10:15:00Z",
    citizen_name: "Hirtik Malvi",
    citizen_email: "hirtik1@gmail.com",
  },
  {
    id: 354,
    title: "Noise Complaint from Factory",
    status: "Pending",
    upvotes: 1,
    created_at: "2025-04-10T16:30:00Z",
    citizen_name: "Sneha Desai",
    citizen_email: "sneha.desai90@gmail.com",
  },
  {
    id: 355,
    title: "Water Leakage at Junction",
    status: "In Progress",
    upvotes: 6,
    created_at: "2025-04-09T11:45:00Z",
    citizen_name: "Alice J.",
    citizen_email: "alice.j@example.com",
  },
  {
    id: 356,
    title: "Uncovered Drainage Hole",
    status: "Resolved",
    upvotes: 8,
    created_at: "2025-04-08T07:55:00Z",
    citizen_name: "John Anger",
    citizen_email: "john.anger123@example.com",
  },
  {
    id: 357,
    title: "Foul Smell from Sewer",
    status: "Pending",
    upvotes: 3,
    created_at: "2025-04-07T14:05:00Z",
    citizen_name: "Charlie Brown",
    citizen_email: "charlie.b@example.com",
  },
  {
    id: 358,
    title: "Traffic Light Not Working",
    status: "In Progress",
    upvotes: 5,
    created_at: "2025-04-06T20:20:00Z",
    citizen_name: "Parth Chavda",
    citizen_email: "parthChavda@123568.com",
  },
  {
    id: 359,
    title: "Garbage Dump at Empty Plot",
    status: "Resolved",
    upvotes: 7,
    created_at: "2025-04-05T13:00:00Z",
    citizen_name: "James Bond",
    citizen_email: "james.bond@example.com",
  },
];

const sampleUsers: User[] = [
  {
    user_id: 1,
    fullname: "Alice Johnson",
    password: "securepassword",
    email: "alice.j@example.com",
    role: "Citizen",
    created_at: "2025-03-09 22:43:30",
    updated_at: "2025-03-09 22:44:06",
  },
  {
    user_id: 2,
    fullname: "Bob Smith",
    password: "securepassword",
    email: "bob.smith@example.com",
    role: "Admin",
    created_at: "2025-03-09 22:43:30",
    updated_at: "2025-03-09 22:44:07",
  },
  {
    user_id: 3,
    fullname: "Charlie Brown",
    password: "securepassword",
    email: "charlie.b@example.com",
    role: "Authority",
    created_at: "2025-03-09 22:43:30",
    updated_at: "2025-03-09 22:44:07",
  },
  {
    user_id: 4,
    fullname: "Sneha Desai",
    password: "securepassword",
    email: "sneha.desai90@gmail.com",
    role: "Citizen",
    created_at: "2025-04-04 18:57:45",
    updated_at: "2025-04-04 18:57:45",
  },
  {
    user_id: 5,
    fullname: "Raj Mehta",
    password: "securepassword",
    email: "raj.mehta@example.com",
    role: "Citizen",
    created_at: "2025-04-08 18:45:08",
    updated_at: "2025-04-08 18:45:08",
  },
  {
    user_id: 6,
    fullname: "John Anger",
    password: "securepassword",
    email: "john.anger123@example.com",
    role: "Citizen",
    created_at: "2025-04-01 21:12:17",
    updated_at: "2025-04-01 21:12:17",
  },
  {
    user_id: 7,
    fullname: "Sneha R. Sharma",
    password: "securepassword",
    email: "sneha.r.sharma@gmail.com",
    role: "Citizen",
    created_at: "2025-04-13 09:36:16",
    updated_at: "2025-04-13 15:21:44",
  },
  {
    user_id: 8,
    fullname: "Parth Chavda",
    password: "securepassword",
    email: "parthChavda@123568.com",
    role: "Citizen",
    created_at: "2025-04-10 19:55:17",
    updated_at: "2025-04-10 19:55:17",
  },
  {
    user_id: 9,
    fullname: "Hirtik Malvi",
    password: "securepassword",
    email: "hirtik1@gmail.com",
    role: "Citizen",
    created_at: "2025-04-13 18:52:22",
    updated_at: "2025-04-13 18:52:22",
  },
  {
    user_id: 10,
    fullname: "James Bond",
    password: "securepassword",
    email: "james.bond@example.com",
    role: "Citizen",
    created_at: "2025-04-02 10:10:10",
    updated_at: "2025-04-02 11:11:11",
  },
];

const AdminDashboard: React.FC = () => {
  const [tab, setTab] = useState<"complaints" | "users">("complaints");
  const [complaints, setComplaints] = useState<Complaint[]>(sampleComplaints);
  const [editedStatus, setEditedStatus] = useState<{ [id: number]: string }>(
    {}
  );

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ background: "#f8f9fa", minHeight: "100vh" }}>
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container-fluid px-4">
          <span className="navbar-brand">CivicVoice</span>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#adminNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="adminNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    tab === "complaints" ? "active" : ""
                  }`}
                  onClick={() => setTab("complaints")}
                >
                  All Complaints
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn btn-link ${
                    tab === "users" ? "active fw-bold" : ""
                  }`}
                  onClick={() => setTab("users")}
                >
                  All Users
                </button>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link"
                  id="adminMenu"
                  data-bs-toggle="dropdown"
                >
                  {adminProfile.name}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="adminMenu"
                >
                  <li>
                    <span className="dropdown-item-text fw-bold">
                      {adminProfile.name}
                    </span>
                  </li>
                  <li>
                    <span className="dropdown-item-text text-muted">
                      {adminProfile.email}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {tab === "complaints" ? (
          <>
            <h3 className="mb-3">All Complaints</h3>
            <div className="table-responsive text-center">
              <table className="table table-bordered table-striped align-middle">
                <thead className="">
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Change Status</th>
                    <th>Upvotes</th>
                    <th>Citizen</th>
                    <th>Email</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((comp) => (
                    <tr key={comp.id}>
                      <td>{comp.id}</td>
                      <td>{comp.title}</td>
                      <td>
                        <span
                          className={`badge ${
                            comp.status === "Resolved"
                              ? "bg-success"
                              : comp.status === "In Progress"
                              ? "bg-info text-dark"
                              : comp.status === "Rejected"
                              ? "bg-danger"
                              : "bg-warning text-dark"
                          }`}
                        >
                          {comp.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={editedStatus[comp.id] || comp.status}
                          onChange={(e) =>
                            handleStatusChange(comp.id, e.target.value)
                          }
                        >
                          <option value="Pending">Pending</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                      <td>{comp.upvotes}</td>
                      <td>{comp.citizen_name}</td>
                      <td>{comp.citizen_email}</td>
                      <td>
                        {new Date(comp.created_at).toISOString().split("T")[0]}
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => updateStatus(comp.id)}
                        >
                          Update
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <>
            <h3 className="mb-3">All Users</h3>
            <div className="table-responsive text-center">
              <table className="table table-bordered table-striped align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleUsers.map((u) => (
                    <tr key={u.user_id}>
                      <td>{u.user_id}</td>
                      <td>{u.fullname}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className="badge bg-secondary">{u.role}</span>
                      </td>
                      <td>
                        {new Date(u.created_at).toISOString().split("T")[0]}
                      </td>
                      <td>
                        {new Date(u.updated_at).toISOString().split("T")[0]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
