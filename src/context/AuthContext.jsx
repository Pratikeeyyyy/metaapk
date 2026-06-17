import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = (email, password, name) => {
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userExists = users.find(u => u.email === email);
    if (userExists) {
      return { success: false, message: 'User already exists!' };
    }

    // Create new user
    const newUser = { id: Date.now(), email, password, name };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Auto login after registration
    setUser({ email, name });
    localStorage.setItem('user', JSON.stringify({ email, name }));
    
    return { success: true, message: 'Registration successful!' };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password!' };
    }

    setUser({ email: user.email, name: user.name });
    localStorage.setItem('user', JSON.stringify({ email: user.email, name: user.name }));
    
    return { success: true, message: 'Login successful!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};