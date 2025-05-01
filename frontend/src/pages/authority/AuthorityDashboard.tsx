// pages/authority/AuthorityDashboard.tsx
import React, { useEffect, useState } from "react";
import ComplaintList from "./complaintList";
import { getUserFromToken } from "../../hooks/useAuth";
import axios from "../../api/axiosInstance";
import { toast } from "react-toastify";

// Define the type for a complaint
interface Complaint {
  id: number;
  title: string;
  status: string;
  upvotes: number;
  createdBy: string;
  // Add other fields as needed
}

interface Authority {
  id: number;
  department: string;
  // Add other fields if needed
}

interface ComplaintResponse {
  data: Complaint[];
}

const AuthorityDashboard: React.FC = () => {
  const user = getUserFromToken(); // { user_id, role }

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [department, setDepartment] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

  const fetchComplaintsByDepartment = async (
    department: string
  ): Promise<Complaint[]> => {
    try {
      const response = await axios.get<ComplaintResponse>(
        `api/complaints/department/${department}`
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to fetch complaints by department", error);
      toast.error("Failed to fetch complaints for this department.");
      return [];
    }
  };

  const loadAuthorityComplaints = async () => {
    if (user?.user_id && user?.role === "Authority") {
      setLoading(true);
      try {
        const authority = await fetchAuthorityByUserId(user.user_id);
        if (authority?.department) {
          const dept = authority.department;
          setDepartment(dept);

          const complaintsData = await fetchComplaintsByDepartment(dept);
          setComplaints(complaintsData || []);
        }
      } catch (err) {
        console.error("Error loading authority complaints:", err);
        toast.error("Something went wrong while loading complaints.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    loadAuthorityComplaints();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mt-4">
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          Complaints for {department ? department.replace(/_/g, " ") : "..."}
        </h2>
        <p className="text-muted">Click on a complaint to view and update details</p>
      </div>

      {loading ? (
        <p className="text-center">Loading complaints...</p>
      ) : complaints.length === 0 ? (
        <p className="text-center text-muted">No complaints found for this department.</p>
      ) : (
        <ComplaintList complaints={complaints} />
      )}
    </div>
  );
};

export default AuthorityDashboard;
