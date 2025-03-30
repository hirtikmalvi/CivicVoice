export const apiRoutes: { name: string; purpose: string; url: string }[] = [
  {
    name: "getComplaints",
    purpose: "Fetch all complaints",
    url: "/api/complaints",
  },
  {
    name: "getComplaintById",
    purpose: "Fetch a complaint by its ID",
    url: "/api/complaints/:complaintId",
  },
  {
    name: "getComplaintsByCitizen",
    purpose: "Fetch complaints by a specific citizen",
    url: "/api/complaints/citizen/:citizenId",
  },
  {
    name: "getComplaintsByCategory",
    purpose: "Fetch complaints by category",
    url: "/api/complaints/category/:categoryName",
  },
  {
    name: "getComplaintsByStatus",
    purpose: "Fetch complaints by status",
    url: "/api/complaints/status/:statusName",
  },
  {
    name: "getComplaintMedia",
    purpose: "Fetch media files related to a complaint",
    url: "/api/complaints/:complaintId/media",
  },
  {
    name: "getComplaintsByAuthority",
    purpose: "Fetch complaints assigned to a specific authority",
    url: "/api/complaints/authority/:authorityId",
  },
];
