import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [chef, setChef] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedChef = localStorage.getItem('chef');
    if (storedChef) {
      setChef(JSON.parse(storedChef));
    }
    setLoading(false);
  }, []);

  const login = (chefData) => {
    localStorage.setItem('token', chefData.token);
    localStorage.setItem('chef', JSON.stringify(chefData));
    setChef(chefData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('chef');
    setChef(null);
  };

  // ✅ NEW — updates chef info in both state AND localStorage
  const updateChef = (updatedData) => {
    const updatedChef = { ...chef, ...updatedData };
    localStorage.setItem('chef', JSON.stringify(updatedChef));
    setChef(updatedChef);
  };

  return (
    <AuthContext.Provider value={{ chef, login, logout, loading, updateChef }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);