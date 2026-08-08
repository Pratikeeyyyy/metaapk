import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

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
    const userData = { email, name };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true, message: 'Registration successful!' };
  };

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password!' };
    }

    const userData = { email: user.email, name: user.name };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    
    return { success: true, message: 'Login successful!' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider co-located by convention
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};