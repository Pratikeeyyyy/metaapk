import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Landing from "./pages/Landing";
import ExpenseApp from "./Expenseapp";
import PrivateRoute from "./guard/AuthGuard";

const AppContent = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();

  return (
    <div>
      {user && (
        <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
          <div>
            <span className="font-semibold">👋 Welcome, {user.name}!</span>
            <span className="ml-4 text-sm text-gray-400">({user.email})</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition text-sm"
            >
              <i
                className={`fas ${darkMode ? "fa-sun text-yellow-400" : "fa-moon text-indigo-300"}`}
              ></i>
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      <ExpenseApp />
    </div>
  );
};

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/app"
            element={
              <PrivateRoute>
                <AppContent darkMode={darkMode} setDarkMode={setDarkMode} />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
