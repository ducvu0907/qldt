import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStorage from "expo-secure-store";
import { useGetUser } from "../hooks/useGetUser";
import { AUTH_SERVER_URL } from "../types";

interface AuthContextType {
  token: string | null,
  setToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: () => {}
});

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      const token = await SecureStorage.getItemAsync("access-token");
      if (token) {
        setToken(token);
        // fetch to validate token or we logout to attain new token
        const res = await fetch(`${AUTH_SERVER_URL}/get_user_info`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ "token": token }),
        });
        const data = await res.json();
        if (data.code !== 1000) {
          setToken(null);
        }
      }
    }

    fetchToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };