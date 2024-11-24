import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStorage from "expo-secure-store";
import { AUTH_SERVER_URL } from "../types";
import { useLogout } from "../hooks/useLogout";

interface AuthContextType {
  token: string | null,
  setToken: (token: string | null) => void;
  role: string | null,
  setRole: (role: string | null) => void;
  userId: string | null,
  setUserId: (userId: string | null) => void;
  email: string | null,
  setEmail: (userId: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {},
  role: null,
  setRole: () => {},
  userId: null,
  setUserId: () => {},
  email: null,
  setEmail: () => {},
});

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await SecureStorage.getItemAsync("access-token");
      if (token) {
        console.log(token);
        setToken(token);
        // fetch to validate token or we logout to attain new token
        const res = await fetch(`${AUTH_SERVER_URL}/get_user_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: token
          }),
        });
        const data = await res.json();
        if (data.code !== "1000") {
          setToken(null);
        }

        console.log(data.data);

        setRole(data.data.role);
        setUserId(data.data.id);
        setEmail(data.data.email);
      }
    }

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId, token, setToken, role, setRole, email, setEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };