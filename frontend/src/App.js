import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChefProfile from './pages/ChefProfile';
import RecipeDetail from './pages/RecipeDetail';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navbar />
          <div style={{ flex: 1 }}>
            <Routes>
              {/* Public — anyone can see */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Auth required — any logged in user */}
              <Route
                path="/chefs/:id"
                element={
                  <ProtectedRoute type="auth">
                    <ChefProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipes/:id"
                element={
                  <ProtectedRoute type="auth">
                    <RecipeDetail />
                  </ProtectedRoute>
                }
              />

              {/* Chef only — must be logged in AND be a chef */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute type="chef">
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;