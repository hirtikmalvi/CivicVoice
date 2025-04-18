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
  profile_picture: string | null;
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
  users: User;
}

// Citizen Profile Component
export const CitizenProfile: React.FC = () => {
  // Hardcoded citizen data
  const citizen: Citizen = {
    citizen_id: 123,
    user_id: 456,
    adhar_number: "123456789012",
    phone_number: "9876543210",
    city: "Ahmedabad",
    state: "Gujarat",
    pincode: "380015",
    created_at: "2024-04-10T14:30:00.000Z",
    updated_at: "2025-04-16T10:45:00.000Z",
    address: "123, Clear Street, Satellite Area",
    latitude: 23.0225,
    longitude: 72.5714,
    users: {
      user_id: 456,
      username: "citizen_john",
      email: "john.doe@example.com",
      first_name: "John",
      last_name: "Doe",
      profile_picture:
        "https://res.cloudinary.com/demo/image/facebook/s--ZuJGmG2B--/65646572251",
    },
  };

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Open map in new tab with the location
  const viewOnMap = (): void => {
    if (citizen.latitude && citizen.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${citizen.latitude},${citizen.longitude}`;
      window.open(mapUrl, "_blank");
    }
  };

  // Mask the Aadhar number for privacy
  const maskAadhar = (aadhar: string): string => {
    return "XXXX-XXXX-" + aadhar.slice(-4);
  };

  // Mask the phone number for privacy
  const maskPhone = (phone: string): string => {
    return "XXXXX-" + phone.slice(-5);
  };

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light">
          <h4 className="mb-0">Citizen Profile</h4>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-3 text-center mb-3 mb-md-0">
              <div
                className="rounded-circle overflow-hidden mx-auto"
                style={{ width: "150px", height: "150px" }}
              >
                <img
                  src={
                    citizen.users.profile_picture ||
                    "https://via.placeholder.com/150"
                  }
                  alt="Profile"
                  className="img-fluid"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-md-9">
              <h5 className="mb-3">
                {citizen.users.first_name} {citizen.users.last_name}
              </h5>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="mb-1">
                    <strong>Username:</strong> {citizen.users.username}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {citizen.users.email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {maskPhone(citizen.phone_number)}
                  </p>
                </div>
                <div className="col-md-6 mb-2">
                  <p className="mb-1">
                    <strong>Citizen ID:</strong> {citizen.citizen_id}
                  </p>
                  <p className="mb-1">
                    <strong>Aadhar:</strong> {maskAadhar(citizen.adhar_number)}
                  </p>
                  <p className="mb-1">
                    <strong>Member Since:</strong>{" "}
                    {formatDate(citizen.created_at).split(",")[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className="card">
                <div className="card-header bg-light">
                  <h5 className="mb-0">Location Information</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <h6>Address</h6>
                      <p>{citizen.address}</p>
                      <p className="mb-1">
                        {citizen.city}, {citizen.state} - {citizen.pincode}
                      </p>
                    </div>
                    <div className="col-md-6 mb-3">
                      <h6>Coordinates</h6>
                      {citizen.latitude && citizen.longitude ? (
                        <div>
                          <p className="mb-2">
                            Lat: {citizen.latitude}, Long: {citizen.longitude}
                          </p>
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={viewOnMap}
                          >
                            View on Map
                          </button>
                        </div>
                      ) : (
                        <p className="text-muted">
                          Location data not available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
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
                          <td>{formatDate(citizen.created_at)}</td>
                        </tr>
                        <tr>
                          <th>Last Updated</th>
                          <td>{formatDate(citizen.updated_at)}</td>
                        </tr>
                        <tr>
                          <th>User ID</th>
                          <td>{citizen.user_id}</td>
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
