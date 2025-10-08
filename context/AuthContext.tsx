// "use client";

// import React, { createContext, useContext, useEffect, useState } from "react";
// import { toast } from "sonner";

// type User = {
//   id: number;
//   name: string;
//   email: string;
//   token: string;
// };

// type AuthContextType = {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (name: string, email: string, password: string) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
// };

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const WP_URL = process.env.NEXT_PUBLIC_WP_URL || "https://cwpteam.ntplstaging.com/Ragu/gr";

//   // Load user from localStorage on mount
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       try {
//         setUser(JSON.parse(savedUser));
//       } catch (err) {
//         console.error("Failed to parse user from localStorage", err);
//       }
//     }
//     setLoading(false);
//   }, []);

//   // Login using WordPress JWT
//   const login = async (email: string, password: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username: email, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Login failed");

//       const userData: User = {
//         id: data.user_id,
//         name: data.user_display_name,
//         email,
//         token: data.token, // JWT token
//       };

//       setUser(userData);
//       localStorage.setItem("user", JSON.stringify(userData));
//       toast.success("Login successful!");
//     } catch (error) {
//       toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Register using custom WordPress endpoint
//   const register = async (name: string, email: string, password: string) => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${WP_URL}/wp-json/custom/v1/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Registration failed");

//       // Auto login after registration
//       await login(email, password);
//       toast.success("Registration successful!");
//     } catch (error) {
//       toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//     toast.info("You have been logged out");
//   };

//   return (
//     <AuthContext.Provider
//       value={{ user, isAuthenticated: !!user, login, register, logout, loading }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within an AuthProvider");
//   return context;
// };

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

// User type
type User = {
  id: number;
  name: string;
  email: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if the server set a cookie for auth
    // Fetch user info if logged in
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include", // include cookies
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Login failed");
      }

      const data = await res.json();
      setUser(data.user);
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Registration failed");
      }

      const data = await res.json();
      setUser(data.user);
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("Registration failed: " + (error instanceof Error ? error.message : "Unknown error"));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      toast.info("Logged out successfully");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
