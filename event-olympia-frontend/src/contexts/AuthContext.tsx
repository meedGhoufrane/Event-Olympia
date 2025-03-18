import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  _id: string;
  email: string;
  name?: string;
  role?: string;
  [key: string]: any; 
}

type AuthContextType = {
  isAuthenticated: boolean;
  userRole: string | null;
  user: User | null;
  setIsAuthenticated: (value: boolean) => void;
  setUserRole: (role: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  user: null,
  setIsAuthenticated: () => {},
  setUserRole: () => {},
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('userRole');
    const userData = localStorage.getItem('user');
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
      
      if (userData && userData !== "undefined") {
        try {
          const parsedUser = JSON.parse(userData);
          if (parsedUser && typeof parsedUser === 'object') {
            setUser(parsedUser);
          } else {
            console.error('User data is not a valid object');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
        }
      } else {
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        user,
        setIsAuthenticated,
        setUserRole,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);