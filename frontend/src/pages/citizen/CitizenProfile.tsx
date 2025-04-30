import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import { Spinner } from "react-bootstrap";

// Define interfaces for our data types
interface User {
  user_id: string;
  email: string;
  fullname: string;
  role: string;
  user_created_at: string;
  user_updated_at: string;
}

interface Citizen {
  citizen_id: string;
  user_id: string;
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
  fullname: string;
  email: string;
  role: string;
  user_created_at: string;
  user_updated_at: string;
}

// CitizenProfile Component
export const CitizenProfile: React.FC = () => {
  const { citizenId } = useParams<{ citizenId: string }>();
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/citizen/${citizenId}`);
        setCitizen(response.data.citizen);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching citizen data:", err);
        setError("Failed to load citizen profile. Please try again later.");
        setLoading(false);
      }
    };

    if (citizenId) {
      fetchCitizenData();
    }
  }, [citizenId]);

  // Format date to a more readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Open map in new tab with the location
  const viewOnMap = (): void => {
    if (citizen?.latitude && citizen?.longitude) {
      const mapUrl = `https://www.google.com/maps?q=${citizen.latitude},${citizen.longitude}`;
      window.open(mapUrl, "_blank");
    }
  };

  // Mask the Aadhar number for privacy
  const maskAadhar = (aadhar: string): string => {
    if (!aadhar) return "N/A";
    return "XXXX-XXXX-" + aadhar.slice(-4);
  };

  // Mask the phone number for privacy
  const maskPhone = (phone: string): string => {
    if (!phone) return "N/A";
    return "XXXXX-" + phone.slice(-5);
  };

  // Go back to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error || !citizen) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Citizen profile not found"}
        </div>
        <button className="btn btn-primary" onClick={handleGoBack}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Citizen Profile</h4>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleGoBack}
          >
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="row mb-4">
            <div className="col-md-3 text-center mb-3 mb-md-0">
              <div
                className="rounded-circle overflow-hidden mx-auto"
                style={{ width: "150px", height: "150px" }}
              >
                <img
                  src="https://via.placeholder.com/150"
                  alt="Profile"
                  className="img-fluid"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </div>
            <div className="col-md-9">
              <h5 className="mb-3">{citizen.fullname}</h5>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <p className="mb-1">
                    <strong>Name:</strong> {citizen.fullname}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {citizen.email}
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
                    {formatDate(citizen.user_created_at).split(",")[0]}
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
                          <td>{formatDate(citizen.user_created_at)}</td>
                        </tr>
                        <tr>
                          <th>Last Updated</th>
                          <td>{formatDate(citizen.user_updated_at)}</td>
                        </tr>
                        <tr>
                          <th>User ID</th>
                          <td>{citizen.user_id}</td>
                        </tr>
                        <tr>
                          <th>Role</th>
                          <td>{citizen.role}</td>
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

export default CitizenProfile;