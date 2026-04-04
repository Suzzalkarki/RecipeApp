import { createContext, useState, useContext, useEffect } from 'react';

// 1. Create the context object
const AuthContext = createContext();

// 2. Create the Provider — wraps the whole app and shares data
export const AuthProvider = ({ children }) => {
  const [chef, setChef] = useState(null);        // logged-in chef info
  const [loading, setLoading] = useState(true);  // checking auth status

  // On app load — check if chef was previously logged in
  useEffect(() => {
    const storedChef = localStorage.getItem('chef');
    if (storedChef) {
      setChef(JSON.parse(storedChef));  // restore chef from localStorage
    }
    setLoading(false);
  }, []);

  // Called after successful login or register
  const login = (chefData) => {
    localStorage.setItem('token', chefData.token);
    localStorage.setItem('chef', JSON.stringify(chefData));
    setChef(chefData);
  };

  // Called when chef clicks logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('chef');
    setChef(null);
  };

  return (
    <AuthContext.Provider value={{ chef, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook — makes using context easier in any component
export const useAuth = () => useContext(AuthContext);