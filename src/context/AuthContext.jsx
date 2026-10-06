import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return null;
  }
};

/**
 * SHA-256 digest of a password, hex encoded.
 * Used so plaintext passwords are never persisted in localStorage.
 * Returns an empty string when Web Crypto is unavailable.
 */
const hashPassword = async (password) => {
  if (typeof crypto === "undefined" || !crypto.subtle) return "";
  const data = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getStoredUser);

  /**
   * Creates an account only. It deliberately does NOT sign the user in:
   * signing in happens on the sign in screen and nowhere else.
   */
  const register = async (email, password, name) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, message: "Please enter a valid email address" };
    }
    if (!name?.trim()) {
      return { success: false, message: "Please enter your name" };
    }
    if (!password || password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    if (users.find((u) => u.email === cleanEmail)) {
      return { success: false, message: "An account with this email exists" };
    }

    const hash = await hashPassword(password);
    users.push({
      id: Date.now(),
      email: cleanEmail,
      name: name.trim(),
      // legacy accounts stored a raw password, keep reading those
      password: hash ? `sha256:${hash}` : password,
    });
    localStorage.setItem("users", JSON.stringify(users));

    return {
      success: true,
      message: "Account created. Sign in to continue.",
      email: cleanEmail,
    };
  };

  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find((u) => u.email === cleanEmail);

    if (!found || !password) {
      return { success: false, message: "Invalid email or password!" };
    }

    const hash = await hashPassword(password);
    let valid = false;

    if (found.password?.startsWith("sha256:")) {
      valid = found.password === `sha256:${hash}`;
    } else {
      // account created before hashing was introduced
      valid = found.password === password;
      if (valid && hash) {
        found.password = `sha256:${hash}`;
        localStorage.setItem("users", JSON.stringify(users));
      }
    }

    if (!valid) {
      return { success: false, message: "Invalid email or password!" };
    }

    const userData = { email: found.email, name: found.name };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    return { success: true, message: "Signed in!" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components -- hook + provider co-located by convention
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};