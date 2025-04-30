import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./components/login";
import Register from "./components/Register";
import UserDashboard from "./pages/citizen/CitizenDashboard";
import ProtectedRoute from "./components/protectedRoutes";
import NotFound from "./pages/NotFound";
import CitizenLogin from "./pages/citizen/CitizenLogin";
import CitizenRegister from "./pages/citizen/CitizenRegister";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AuthorityLogin from "./pages/authority/AuthorityLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Complaint from "./pages/citizen/Complaint";
import AdminProfile from "./pages/admin/AdminProfile";
import { CitizenProfile } from "./pages/citizen/CitizenProfile";
import AuthorityDashboard from "./pages/authority/AuthorityDashboard";
import ComplaintDetails from "./pages/authority/ComplaintDetails";
import AuthorityNavbar from "./pages/authority/AuthorityNavbar";
import AuthorityProfile from "./pages/authority/AuthorityProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<CitizenLogin />} />
        <Route path="/register" element={<CitizenRegister />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/authority/login" element={<AuthorityLogin />} />

        {/* Protected Routes */}
        <Route
          path="/citizen/dashboard"
          element={
            <ProtectedRoute>
              <CitizenDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/complaint/:complaintId"
          element={
            <ProtectedRoute>
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/citizen/profile/:citizenId"
          element={
            <ProtectedRoute>
              <CitizenProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaint"
          element={
            <ProtectedRoute>
              <Complaint />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/authority/dashboard"
          element={
            <ProtectedRoute>
              <AuthorityDashboard />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/authority/*" element={
            <ProtectedRoute>
              <AuthorityNavbar />
            </ProtectedRoute>
          }
        >
            <Route
                path="dashboard"
                element={
                <ProtectedRoute>
                    <AuthorityDashboard />
                </ProtectedRoute>
                }
            />
            <Route
                path="complaint/:id"
                element={
                <ProtectedRoute>
                    <ComplaintDetails />
                </ProtectedRoute>
                }
            />
            <Route
                path="profile"
                element={
                <ProtectedRoute>
                    <AuthorityProfile />
                </ProtectedRoute>
                }
            />

        </Route>

        {/* <Route path="/authority/*" element={<AuthorityNavbar />}>
          <Route path="dashboard" element={<AuthorityDashboard />} />
          <Route path="complaint/:id" element={<ComplaintDetails />} />
          <Route path="profile" element={<AuthorityProfile />} />
        </Route> */}

        {/* Catch-All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

{
  /* Protected Citizen Routes */
}











// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Login from "./components/login";
// import Register from "./components/Register";
// import UserDashboard from "./pages/citizen/CitizenDashboard";
// import ProtectedRoute from "./components/protectedRoutes";
// import NotFound from "./pages/NotFound";
// import CitizenLogin from "./pages/citizen/CitizenLogin";
// import CitizenRegister from "./pages/citizen/CitizenRegister";
// import CitizenDashboard from "./pages/citizen/CitizenDashboard";
// import AdminLogin from "./pages/admin/AdminLogin";
// import AuthorityLogin from "./pages/authority/AuthorityLogin";
// import AdminDashboard from "./pages/admin/AdminDashboard";
// import Complaint from "./pages/citizen/Complaint";
// import AdminProfile from "./pages/admin/AdminProfile";
// import { CitizenProfile } from "./pages/citizen/CitizenProfile";
// import AuthorityDashboard from "./pages/authority/AuthorityDashboard";
// import ComplaintDetails from "./pages/authority/ComplaintDetails";
// import AuthorityNavbar from "./pages/authority/AuthorityNavbar";
// import AuthorityProfile from "./pages/authority/AuthorityProfile";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         {/* Public */}
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<CitizenLogin />} />
//         <Route path="/register" element={<CitizenRegister />} />
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/authority/login" element={<AuthorityLogin />} />

//         {/* Protected Routes */}
//         <Route
//           path="/citizen/dashboard"
//           element={
//             <ProtectedRoute role="citizen">
//               <CitizenDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/citizen/complaint/:complaintId"
//           element={
//             <ProtectedRoute role="citizen" >
//               <Complaint />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/citizen/profile"
//           element={
//             <ProtectedRoute role="citizen">
//               <CitizenProfile />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/complaint"
//           element={
//             <ProtectedRoute role="citizen">
//               <Complaint />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//         <Route
//           path="/admin/profile"
//           element={
//             <ProtectedRoute role="admin">
//               <AdminProfile />
//             </ProtectedRoute>
//           }
//         />
//         {/* <Route
//           path="/authority/dashboard"
//           element={
//             <ProtectedRoute>
//               <AuthorityDashboard />
//             </ProtectedRoute>
//           }
//         /> */}

//         <Route
//           path="/authority/*" element={
//             <ProtectedRoute role="authority">
//               <AuthorityNavbar />
//             </ProtectedRoute>
//           }
//         >
//             <Route
//                 path="dashboard"
//                 element={
//                 <ProtectedRoute role="authority">
//                     <AuthorityDashboard />
//                 </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="complaint/:id"
//                 element={
//                 <ProtectedRoute role="authority">
//                     <ComplaintDetails />
//                 </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="profile"
//                 element={
//                 <ProtectedRoute role="authority">
//                     <AuthorityProfile />
//                 </ProtectedRoute>
//                 }
//             />

//         </Route>

//         {/* <Route path="/authority/*" element={<AuthorityNavbar />}>
//           <Route path="dashboard" element={<AuthorityDashboard />} />
//           <Route path="complaint/:id" element={<ComplaintDetails />} />
//           <Route path="profile" element={<AuthorityProfile />} />
//         </Route> */}

//         {/* Catch-All */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;

// {
//   /* Protected Citizen Routes */
// }
