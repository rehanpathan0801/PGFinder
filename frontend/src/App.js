import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PGList from './pages/PGList';
import PGDetails from './pages/PGDetails';
import AddPG from './pages/AddPG';
import EditPG from './pages/EditPG';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Cookies from './pages/Cookies';
import NotFound from './pages/NotFound';
import AdminDashboard from './components/Admin/Dashboard';
import UsersManagement from './components/Admin/UsersManagement';
import PGManagement from './components/Admin/PGManagement';
import MessagesManagement from './components/Admin/MessagesManagement';


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="pt-16 flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/admin/dashboard" element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              } />
              <Route path="/admin/users" element={<PrivateRoute allowedRoles={['super-admin']}><UsersManagement /></PrivateRoute>} />
              <Route path="/admin/pgs" element={<PrivateRoute allowedRoles={['super-admin']}><PGManagement /></PrivateRoute>} />
              <Route path="/admin/messages" element={<PrivateRoute allowedRoles={['super-admin']}><MessagesManagement /></PrivateRoute>} />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pgs" element={<PGList />} />
              <Route path="/pg/:id" element={<PGDetails />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              } />
              <Route path="/add-pg" element={
                <PrivateRoute allowedRoles={['owner']}>
                  <AddPG />
                </PrivateRoute>
              } />
              <Route path="/edit-pg/:id" element={
                <PrivateRoute allowedRoles={['owner']}>
                  <EditPG />
                </PrivateRoute>
              } />
              <Route path="/favorites" element={
                <PrivateRoute>
                  <Favorites />
                </PrivateRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App; 