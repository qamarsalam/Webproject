import { createContext, useState } from "react";

export const AuthContext = createContext({
  user: { role: "external" },
  setUser: () => { },
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("kuEventsUser");
    return savedUser ? JSON.parse(savedUser) : { role: "external" };
  });

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
