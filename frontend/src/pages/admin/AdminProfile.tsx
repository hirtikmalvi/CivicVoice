import React from "react";

// Note: Bootstrap would need to be installed in your project

// import "bootstrap/dist/css/bootstrap.min.css";

// Define interfaces for our data types

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Admin {
  admin_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  users: User;
}

// Admin Profile Component
export const AdminProfile: React.FC = () => {
  // Hardcoded admin data
  const admin: Admin = {
    admin_id: 42,
    user_id: 789,
    created_at: "2023-08-15T09:30:00.000Z",
    updated_at: "2025-03-20T14:15:00.000Z",
    users: {
      user_id: 789,
      username: "admin_sarah",
      email: "sarah.admin@citycouncil.gov",
      first_name: "Sarah",
      last_name: "Johnson",
    },
  };

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Calculate account age
  const calculateAccountAge = (dateString: string): string => {
    const createDate = new Date(dateString);
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - createDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;

    if (years > 0) {
      return `${years} year${years !== 1 ? "s" : ""}, ${months} month${
        months !== 1 ? "s" : ""
      }`;
    } else if (months > 0) {
      return `${months} month${months !== 1 ? "s" : ""}, ${days} day${
        days !== 1 ? "s" : ""
      }`;
    } else {
      return `${days} day${days !== 1 ? "s" : ""}`;
    }
  };

  const accountAge = calculateAccountAge(admin.created_at);

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Administrator Profile</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-3 text-center mb-3 mb-md-0">
              {/* <div
                className="rounded-circle overflow-hidden mx-auto"
                style={{ width: "150px", height: "150px" }}
              >
                <img
                  src={
                    admin.users.profile_picture ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Admin Profile"
                  className="img-fluid"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div> */}
            </div>
            <div className="col-md-9">
              <h5 className="mb-3">
                {admin.users.first_name} {admin.users.last_name}
              </h5>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="mb-1">
                    <strong>Email:</strong> {admin.users.email}
                  </p>
                  <p className="mb-1">
                    <strong>Admin ID:</strong> {admin.admin_id}
                  </p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="mb-1">
                    <strong>User ID:</strong> {admin.user_id}
                  </p>
                  <p className="mb-1">
                    <strong>Account Age:</strong> {accountAge}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong>{" "}
                    <span className="text-success">Active</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 mb-4">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Account Information</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <tbody>
                        <tr>
                          <th style={{ width: "180px" }}>Account Created</th>
                          <td>{formatDate(admin.created_at)}</td>
                        </tr>
                        <tr>
                          <th>Last Updated</th>
                          <td>{formatDate(admin.updated_at)}</td>
                        </tr>
                        <tr>
                          <th>Account Type</th>
                          <td>Administrator</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
