import React, { createContext, useState, useEffect, ReactNode } from "react";
import * as SecureStorage from "expo-secure-store";

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