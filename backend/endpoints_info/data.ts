export const apiRoutes: { name: string; purpose: string; url: string }[] = [
  // Complaint Routes
  {
    name: "getComplaints",
    purpose: "Fetch all complaints",
    url: "/api/complaints",
  },
  {
    name: "getComplaintById",
    purpose: "Fetch complaint by ID",
    url: "/api/complaints/:complaintId",
  },
  {
    name: "getComplaintsByCitizen",
    purpose: "Fetch complaints for a citizen",
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
    purpose: "Fetch media linked to a complaint",
    url: "/api/complaints/:complaintId/media",
  },
  {
    name: "getComplaintsByAuthority",
    purpose: "Fetch complaints assigned to authority",
    url: "/api/complaints/authority/:authorityId",
  },
  {
    name: "getAllComplaintsUpvotedByCitizen",
    purpose: "Complaints a citizen has upvoted",
    url: "/api/complaints/upvoted/citizen/:citizenId",
  },
  {
    name: "getUpvoteCountOfComplaint",
    purpose: "Fetch number of upvotes for a complaint",
    url: "/api/complaints/:complaintId/upvotes/count",
  },
  {
    name: "createComplaint",
    purpose: "Create a new complaint with media/audio",
    url: "/api/complaints",
  },
  {
    name: "upvoteComplaint",
    purpose: "Upvote a complaint",
    url: "/api/complaints/:complaintId/upvote",
  },
  {
    name: "updateComplaint",
    purpose: "Update all details of a complaint",
    url: "/api/complaints/:complaintId",
  },
  {
    name: "updateComplaintStatus",
    purpose: "Update status of a complaint",
    url: "/api/complaints/:complaintId/status",
  },
  {
    name: "updateComplaintCategory",
    purpose: "Update category of a complaint",
    url: "/api/complaints/:complaintId/category",
  },
  {
    name: "updateComplaintAuthority",
    purpose: "Assign or update authority for a complaint",
    url: "/api/complaints/:complaintId/authority",
  },
  {
    name: "deleteComplaint",
    purpose: "Delete a complaint with its media/upvotes",
    url: "/api/complaints/:complaintId",
  },
  {
    name: "deleteMediaFromComplaint",
    purpose: "Delete specific media from complaint",
    url: "/api/complaints/:complaintId/media/:mediaId",
  },
  {
    name: "removeUpvoteFromComplaint",
    purpose: "Remove an upvote by citizen",
    url: "/api/complaints/:complaintId/upvote/:citizenId",
  },

  // Media Routes
  {
    name: "getMediaById",
    purpose: "Get media by ID",
    url: "/api/media/:mediaId",
  },
  {
    name: "getMediaByType",
    purpose: "Fetch media by type (image/video)",
    url: "/api/media/type/:mediaType",
  },
  {
    name: "updateMedia",
    purpose: "Update media details",
    url: "/api/media/:mediaId",
  },
  {
    name: "updateMediaType",
    purpose: "Update only media type",
    url: "/api/media/:mediaId/type",
  },
  {
    name: "deleteMedia",
    purpose: "Delete media by ID",
    url: "/api/media/:mediaId",
  },

  // Upvote Routes
  {
    name: "getUpvotesByComplaint",
    purpose: "Get all upvotes on a complaint",
    url: "/api/upvotes/complaint/:complaintId",
  },
  {
    name: "getUpvotesByCitizen",
    purpose: "Get all upvotes done by a citizen",
    url: "/api/upvotes/citizen/:citizenId",
  },
];
