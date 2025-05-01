import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import { getUserFromToken } from '../../hooks/useAuth';

// Types
interface Admin {
  admin_id: number;
  user_id: number;
  fullname: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
  user_created_at: string;
  user_updated_at: string;
}

// Fetch admin helper function
const fetchAdminByUserId = async (
  userId: string | number
): Promise<Admin | null> => {
  try {
    const response = await axios.get(`/api/admin/user/${userId}`);
    return response.data?.admin || null;
  } catch (error) {
    console.error("Failed to fetch admin", error);
    toast.error("Failed to fetch admin information.");
    return null;
  }
};

const AdminProfile: React.FC = () => {
  const user = getUserFromToken();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const adminData = await fetchAdminByUserId(user?.user_id!);
      setAdmin(adminData);
      setLoading(false);
    };

    fetchAdminProfile();
  }, []);

  if (loading) return <div className="container mt-5">Loading...</div>;
  if (!admin) return <div className="container mt-5 text-danger">Admin profile not found.</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="mb-4">Admin Profile</h2>
        <div className="row mb-3">
          <div className="col-md-6 mb-2">
            <strong>Full Name:</strong> {admin.fullname}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Email:</strong> {admin.email}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Role:</strong> {admin.role}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Admin ID:</strong> {admin.admin_id}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Created At (Admin):</strong> {new Date(admin.created_at).toUTCString()}
          </div>
          <div className="col-md-6 mb-2">
            <strong>Updated At (Admin):</strong> {new Date(admin.updated_at).toUTCString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
