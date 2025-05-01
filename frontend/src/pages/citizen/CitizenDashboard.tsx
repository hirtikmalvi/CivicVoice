import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Button,
  Navbar,
  Nav,
  Table,
  Badge,
  Modal,
  Spinner,
  Dropdown,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserFromToken } from "../../hooks/useAuth";
import axios from "../../api/axiosInstance";
import CreateComplaint from "../citizen/CreateComplaint";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Complaint {
  complaint_id: number;
  title: string;
  status: string;
  upvotes: number;
  citizen_name: string;
  created_at: string;
  citizen_id: number;
  isUpvoted?: boolean;
}

interface CitizenInfo {
  citizen_id: string;
  user_id: string;
  fullName: string;
}

interface ComplaintsState {
  my: Complaint[];
  all: Complaint[];
  trending: Complaint[];
  lastFetched: {
    my: number | null;
    all: number | null;
    trending: number | null;
  };
}

const CitizenDashboard: React.FC = () => {
  const user = getUserFromToken();
  const navigate = useNavigate();
  const [view, setView] = useState<"my" | "all" | "trending">("my");
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [citizenInfo, setCitizenInfo] = useState<CitizenInfo | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [complaintToDelete, setComplaintToDelete] = useState<number | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  // Store complaints for each view type separately
  const [complaintsState, setComplaintsState] = useState<ComplaintsState>({
    my: [],
    all: [],
    trending: [],
    lastFetched: {
      my: null,
      all: null,
      trending: null,
    },
  });

  // Cache timeout in milliseconds (e.g., 5 minutes)
  const CACHE_TIMEOUT = 5 * 60 * 1000;

  const isCacheValid = (viewType: "my" | "all" | "trending") => {
    const lastFetched = complaintsState.lastFetched[viewType];
    if (!lastFetched) return false;

    const now = Date.now();
    return now - lastFetched < CACHE_TIMEOUT;
  };

  const fetchCitizenInfo = useCallback(
    async (userId: string | number | undefined) => {
      if (!userId) return;

      try {
        const response = await axios.get(`/api/citizen/user/${userId}`);
        const citizenData = {
          citizen_id: response.data.citizen.citizen_id,
          user_id: response.data.citizen.user_id,
          fullName: response.data.citizen.fullname,
        };
        setCitizenInfo(citizenData);
        return citizenData.citizen_id;
      } catch (error) {
        console.error("Failed to fetch citizen ID", error);
        return null;
      }
    },
    []
  );

  const enhanceComplaintWithDetails = useCallback(
    async (complaint: Complaint, currentCitizenId?: string) => {
      try {
        const [upvotesResponse, citizenResponse] = await Promise.all([
          axios.get(`/api/complaints/${complaint.complaint_id}/upvotes/count`),
          axios.get(`/api/citizen/${complaint.citizen_id}`),
        ]);

        // Check if the current user has upvoted this complaint
        let isUpvoted = false;
        if (currentCitizenId) {
          try {
            const upvoteStatusResponse = await axios.get(
              `/api/complaints/${complaint.complaint_id}/upvote/${currentCitizenId}`
            );
            isUpvoted = upvoteStatusResponse.data.upvoted || false;
          } catch (error) {
            console.error("Failed to check upvote status", error);
          }
        }

        const citizenName = citizenResponse.data.citizen
          ? citizenResponse.data.citizen.fullname
          : "N/A";

        return {
          ...complaint,
          upvotes: upvotesResponse.data.count,
          citizen_name: citizenName,
          isUpvoted: isUpvoted,
        };
      } catch (error) {
        console.error(
          `Failed to enhance complaint ${complaint.complaint_id}`,
          error
        );
        return complaint;
      }
    },
    []
  );

  const fetchMyComplaints = useCallback(async () => {
    if (!citizenInfo?.citizen_id) return [];

    try {
      const response = await axios.get(
        `/api/complaints/citizen/${citizenInfo.citizen_id}`
      );
      const complaintData = Array.isArray(response.data) ? response.data : [];

      const enhancedComplaints = await Promise.all(
        complaintData.map((complaint) =>
          enhanceComplaintWithDetails(complaint, citizenInfo.citizen_id)
        )
      );

      return enhancedComplaints;
    } catch (error) {
      console.error("Failed to load my complaints", error);
      return [];
    }
  }, [citizenInfo, enhanceComplaintWithDetails]);

  const fetchAllComplaints = useCallback(async () => {
    try {
      const response = await axios.get("/api/complaints");
      const complaintData = Array.isArray(response.data) ? response.data : [];

      const enhancedComplaints = await Promise.all(
        complaintData.map((complaint) =>
          enhanceComplaintWithDetails(complaint, citizenInfo?.citizen_id)
        )
      );

      return enhancedComplaints;
    } catch (error) {
      console.error("Failed to load all complaints", error);
      return [];
    }
  }, [citizenInfo, enhanceComplaintWithDetails]);

  const fetchTrendingComplaints = useCallback(async () => {
    try {
      const response = await axios.get("/api/complaints/trending");
      const complaintData = Array.isArray(response.data) ? response.data : [];

      const enhancedComplaints = await Promise.all(
        complaintData.map((complaint) =>
          enhanceComplaintWithDetails(complaint, citizenInfo?.citizen_id)
        )
      );

      return enhancedComplaints;
    } catch (error) {
      console.error("Failed to load trending complaints", error);
      return [];
    }
  }, [citizenInfo, enhanceComplaintWithDetails]);

  // Fetch data based on the current view if needed
  const fetchDataIfNeeded = useCallback(async () => {
    if (loading) return;

    // Skip if cache is still valid
    if (isCacheValid(view)) {
      if (!initialDataLoaded) {
        setInitialDataLoaded(true);
      }
      return;
    }

    setLoading(true);

    try {
      let complaints: Complaint[] = [];

      switch (view) {
        case "my":
          complaints = await fetchMyComplaints();
          break;
        case "all":
          complaints = await fetchAllComplaints();
          break;
        case "trending":
          complaints = await fetchTrendingComplaints();
          break;
      }

      setComplaintsState((prevState) => ({
        ...prevState,
        [view]: complaints,
        lastFetched: {
          ...prevState.lastFetched,
          [view]: Date.now(),
        },
      }));

      if (!initialDataLoaded) {
        setInitialDataLoaded(true);
      }
    } finally {
      setLoading(false);
    }
  }, [
    view,
    loading,
    initialDataLoaded,
    fetchMyComplaints,
    fetchAllComplaints,
    fetchTrendingComplaints,
  ]);

  // Fetch citizen info only once when component mounts
  useEffect(() => {
    if (user?.user_id && !citizenInfo) {
      fetchCitizenInfo(user.user_id);
    }
  }, [user, fetchCitizenInfo, citizenInfo]);

  // Fetch data when citizen info is available or view changes
  useEffect(() => {
    if (citizenInfo) {
      fetchDataIfNeeded();
    }
  }, [view, citizenInfo, fetchDataIfNeeded]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const viewProfile = () => {
    if (citizenInfo?.citizen_id) {
      navigate(`/citizen/profile/${citizenInfo.citizen_id}`);
    }
  };

  const handleComplaintCreated = () => {
    setShowComplaintModal(false);

    // Invalidate the cache for "my" and "all" views
    setComplaintsState((prevState) => ({
      ...prevState,
      lastFetched: {
        ...prevState.lastFetched,
        my: null,
        all: null,
      },
    }));

    // Refetch data for the current view
    fetchDataIfNeeded();
  };

  const handleVote = async (
    complaintId: number,
    citizenId: number,
    isCurrentlyUpvoted: boolean
  ) => {
    try {
      if (isCurrentlyUpvoted) {
        // If already upvoted, perform downvote
        await axios.delete(
          `/api/complaints/${complaintId}/upvote/${citizenId}`
        );

        // Update all lists that might contain this complaint
        setComplaintsState((prevState) => ({
          ...prevState,
          my: updateComplaintInList(prevState.my, complaintId, false),
          all: updateComplaintInList(prevState.all, complaintId, false),
          trending: updateComplaintInList(
            prevState.trending,
            complaintId,
            false
          ),
        }));

        toast.success("Vote removed successfully!");
      } else {
        // If not upvoted, perform upvote
        await axios.post(`/api/complaints/${complaintId}/upvote`, {
          citizen_id: citizenId,
        });

        // Update all lists that might contain this complaint
        setComplaintsState((prevState) => ({
          ...prevState,
          my: updateComplaintInList(prevState.my, complaintId, true),
          all: updateComplaintInList(prevState.all, complaintId, true),
          trending: updateComplaintInList(
            prevState.trending,
            complaintId,
            true
          ),
        }));

        toast.success("Upvoted successfully!");
      }
    } catch (err) {
      console.error("Failed to handle vote", err);
      toast.error("Failed to process your vote. Please try again.");
    }
  };

  // Function to handle the delete complaint confirmation
  const confirmDeleteComplaint = (complaintId: number) => {
    setComplaintToDelete(complaintId);
    setShowDeleteModal(true);
  };

  // Function to execute the delete complaint
  const handleDeleteComplaint = async () => {
    if (!complaintToDelete) return;

    setDeleteLoading(true);
    try {
      await axios.delete(`/api/complaints/${complaintToDelete}`);

      // Remove the deleted complaint from all lists
      setComplaintsState((prevState) => ({
        ...prevState,
        my: prevState.my.filter((c) => c.complaint_id !== complaintToDelete),
        all: prevState.all.filter((c) => c.complaint_id !== complaintToDelete),
        trending: prevState.trending.filter(
          (c) => c.complaint_id !== complaintToDelete
        ),
      }));

      toast.success("Complaint deleted successfully!");
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete complaint", err);
      toast.error("Failed to delete the complaint. Please try again.");
    } finally {
      setDeleteLoading(false);
      setComplaintToDelete(null);
    }
  };

  // Helper function to update a complaint in a list
  const updateComplaintInList = (
    list: Complaint[],
    complaintId: number,
    isUpvoted: boolean
  ): Complaint[] => {
    return list.map((c) =>
      c.complaint_id === complaintId
        ? {
            ...c,
            upvotes: isUpvoted ? c.upvotes + 1 : Math.max(0, c.upvotes - 1),
            isUpvoted: isUpvoted,
          }
        : c
    );
  };

  const renderComplaints = (complaints: Complaint[]) => (
    <Table striped bordered hover responsive className="mt-3">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Status</th>
          <th>Upvotes</th>
          <th>Citizen</th>
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
              <td>
                <Link
                  to={`/citizen/complaint/${c.complaint_id}`}
                  className="text-decoration-none"
                >
                  {c.title}
                </Link>
              </td>
              <td>
                <Badge
                  bg={
                    c.status === "Resolved"
                      ? "success"
                      : c.status === "In Progress" || c.status === "In_Progress"
                      ? "info"
                      : c.status === "Rejected"
                      ? "danger"
                      : c.status === "Escalated"
                      ? "primary"
                      : c.status === "Closed"
                      ? "secondary"
                      : "warning"
                  }
                >
                  {c.status === "In_Progress" ? "In Progress" : c.status}
                </Badge>
              </td>
              <td>{c.upvotes}</td>
              <td>
                <Link
                  to={`/citizen/profile/${c.citizen_id}`}
                  className="text-decoration-none"
                >
                  {c.citizen_name || "N/A"}
                </Link>
              </td>
              <td>{new Date(c.created_at).toISOString().split("T")[0]}</td>
              <td>
                <div className="d-flex gap-2">
                  {citizenInfo?.citizen_id && (
                    <Button
                      size="sm"
                      variant={c.isUpvoted ? "primary" : "outline-primary"}
                      onClick={() =>
                        handleVote(
                          c.complaint_id,
                          Number(citizenInfo.citizen_id),
                          !!c.isUpvoted
                        )
                      }
                    >
                      {c.isUpvoted ? "👎 Remove Vote" : "👍 Upvote"}
                    </Button>
                  )}

                  {/* Delete button - always shown for user's own complaints */}
                  {String(c.citizen_id) === citizenInfo?.citizen_id && (
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => confirmDeleteComplaint(c.complaint_id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </Table>
  );

  // Force refresh button handler
  const handleRefresh = () => {
    // Invalidate the cache for the current view
    setComplaintsState((prevState) => ({
      ...prevState,
      lastFetched: {
        ...prevState.lastFetched,
        [view]: null,
      },
    }));

    // Fetch fresh data
    fetchDataIfNeeded();
  };

  // Show cached data immediately if available while loading fresh data in background
  const currentViewComplaints = complaintsState[view];
  const shouldShowSpinner =
    loading && currentViewComplaints.length === 0 && !initialDataLoaded;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Navbar expand="lg" className="px-4 bg-light shadow-sm">
        <Navbar.Brand>CivicVoice</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-between">
          <Nav className="me-auto">
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
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? <Spinner animation="border" size="sm" /> : "↻ Refresh"}
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => setShowComplaintModal(true)}
            >
              + Create
            </Button>
            <Dropdown>
              <Dropdown.Toggle
                variant="outline-secondary"
                id="profile-dropdown"
              >
                {citizenInfo?.fullName || "User"}
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item onClick={viewProfile}>My Profile</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Navbar>

      <Container className="mt-4">
        {shouldShowSpinner ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <h4 className="mb-3">
              {view === "my"
                ? "My Complaints"
                : view === "all"
                ? "All Complaints"
                : "🔥 Trending Complaints"}
              {loading && (
                <Spinner
                  animation="border"
                  size="sm"
                  className="ms-2"
                  style={{ width: "1rem", height: "1rem" }}
                />
              )}
            </h4>
            {renderComplaints(currentViewComplaints)}
          </>
        )}
      </Container>

      {/* Create Complaint Modal */}
      <Modal
        show={showComplaintModal}
        onHide={() => setShowComplaintModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateComplaint
            onClose={() => setShowComplaintModal(false)}
            onComplaintCreated={handleComplaintCreated}
          />
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this complaint? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteComplaint}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Deleting...
              </>
            ) : (
              "Delete Complaint"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CitizenDashboard;
