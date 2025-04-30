// pages/authority/AuthorityProfile.tsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { getUserFromToken } from "../../hooks/useAuth";

// Types
interface Authority {
  authority_id: number;
  user_id: number;
  department: string;
  zone: string;
  fullname: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

// Fetch authority helper function
const fetchAuthorityByUserId = async (
  userId: string | number
): Promise<Authority | null> => {
  try {
    const response = await axios.get(`/api/authority/user/${userId}`);
    return response.data?.authority || null;
  } catch (error) {
    console.error("Failed to fetch authority", error);
    toast.error("Failed to fetch authority information.");
    return null;
  }
};

const AuthorityProfile: React.FC = () => {
  const user = getUserFromToken();
  const [authority, setAuthority] = useState<Authority | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorityProfile = async () => {
      const authorityData = await fetchAuthorityByUserId(user?.user_id!); 
      setAuthority(authorityData);
      setLoading(false);
    };

    fetchAuthorityProfile();
  }, []);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!authority) return <div className="container mt-5 text-danger">Authority profile not found.</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Authority Profile</h2>
        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <strong>Full Name:</strong> {authority.fullname}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Email:</strong> {authority.email}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Role:</strong> {authority.role}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Zone:</strong> {authority.zone}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Department:</strong> {authority.department.replace(/_/g, ' ')}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Authority ID:</strong> {authority.authority_id}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Created At:</strong> {new Date(authority.created_at).toUTCString()}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Updated At:</strong> {new Date(authority.updated_at).toUTCString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityProfile;
