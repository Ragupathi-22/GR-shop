"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { useGlobalLoading } from "./GlobalLoadingContext";

// User type
type User = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  name: string;
  email: string;
  address?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string;
  } | null;
  token: string;
};


type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
  ) => Promise<void>;

  logout: () => Promise<void>;
  loading: boolean;
  updateUserProfile: (profile: { first_name: string; last_name: string; email: string }) => void;
  updateUserAddress: (address: any) => void;

};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setGlobalLoading: setGlobalLoading } = useGlobalLoading();

  useEffect(() => {
    // On mount, check if the server set a cookie for auth
    // Fetch user info if logged in
    const fetchUser = async () => {
      try {
        setGlobalLoading(true);
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
        setGlobalLoading(false);
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

  const register = async (
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ first_name, last_name, username, email, password }),
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

  const updateUserProfile = async (profile: { first_name: string; last_name: string; email: string }) => {
    // Optimistically update local user state for immediate UI feedback
    setUser((prev) =>
      prev ? {
        ...prev,
        first_name: profile.first_name,
        last_name: profile.last_name,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
      } : prev,
    );

    if (!user) return;

    try {
      const res = await fetch('/api/users/update-profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          first_name: profile.first_name,
          last_name: profile.last_name,
          email: profile.email,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update profile');
      }

      const data = await res.json();
      setUser((prev) =>
        prev ? {
          ...prev,
          first_name: data.first_name,
          last_name: data.last_name,
          name: `${data.first_name} ${data.last_name}`,
          email: data.email,
        } : prev,
      );
      // toast.success('Profile updated');
    } catch (error) {
      toast.error(
        'Failed to update profile: ' +
        (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  };


  const updateUserAddress = async (address: any) => {
    setUser((prev) => (prev ? { ...prev, address } : prev));

    if (!user) return;

    try {
      const res = await fetch('/api/users/update-address', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, address, email: user.email }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update address');
      }
      // toast.success('Address updated');
    } catch (error) {
      toast.error(
        'Failed to update address: ' +
        (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  };



  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
        updateUserProfile,
        updateUserAddress,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
