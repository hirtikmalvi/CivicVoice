import { useState, useEffect } from 'react';
import axios from 'axios';

// Types
interface Complaint {
  complaint_id: number;
  title: string;
  description: string;
  status: string;
  created_at: string;
  latitude: number;
  longitude: number;
  upvotes: number;
  distance: number;
  trendingScore: number;
}

interface TrendingResponse {
  trending: Complaint[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TrendingComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [radius, setRadius] = useState(10); // Default 10km radius

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => {
          setError("Unable to access your location. Please enable location services.");
          // Use default location or prompt user
          setUserLocation({ lat: 0, lng: 0 });
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setUserLocation({ lat: 0, lng: 0 });
    }
  }, []);

  // Fetch trending complaints when location is available or page/radius changes
  useEffect(() => {
    if (!userLocation) return;
    
    const fetchTrending = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TrendingResponse>('/api/complaints/trending', {
          params: {
            latitude: userLocation.lat,
            longitude: userLocation.lng,
            radiusKm: radius,
            limit: 10,
            page
          }
        });
        
        setComplaints(response.data.trending);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch trending complaints");
        setLoading(false);
      }
    };

    fetchTrending();
  }, [userLocation, page, radius]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Handle radius change
  const handleRadiusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRadius(parseInt(event.target.value));
    setPage(1); // Reset to first page when changing radius
  };

  if (loading && !complaints.length) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error && !complaints.length) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      Error: {error}
    </div>;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Trending Complaints</h2>
        <p className="text-sm text-gray-600">
          Showing complaints from the last 3 days within {radius}km of your location
        </p>
        
        {/* Radius filter */}
        <div className="mt-3 flex items-center">
          <label className="mr-2 text-sm">Distance:</label>
          <select 
            value={radius} 
            onChange={handleRadiusChange}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value={5}>5km</option>
            <option value={10}>10km</option>
            <option value={20}>20km</option>
            <option value={50}>50km</option>
          </select>
        </div>
      </div>

      {/* Complaints list */}
      <div className="divide-y divide-gray-200">
        {complaints.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No trending complaints found in your area
          </div>
        ) : (
          complaints.map(complaint => (
            <div key={complaint.complaint_id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between">
                <h3 className="font-medium">{complaint.title}</h3>
                <div className="flex items-center space-x-1 text-amber-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                  <span>{complaint.upvotes}</span>
                </div>
              </div>
              
              <p className="mt-1 text-sm text-gray-600 line-clamp-2">{complaint.description}</p>
              
              <div className="mt-2 flex items-center text-xs text-gray-500 space-x-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {new Date(complaint.created_at).toLocaleDateString()}
                </div>
                
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {complaint.distance.toFixed(1)} km away
                </div>
                
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    complaint.status === 'OPEN' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-700">
              Showing page <span className="font-medium">{page}</span> of{" "}
              <span className="font-medium">{totalPages}</span>
            </p>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                page === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className={`ml-3 relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                page === totalPages
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}