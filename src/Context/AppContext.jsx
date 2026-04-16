/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState, useCallback, useRef } from "react";

export const AppContext = createContext();

export default function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const isFetchingUser = useRef(false);

  const getUser = useCallback(async () => {
    // cegah race condition
    if (isFetchingUser.current) return;
    isFetchingUser.current = true;

    try {
      const res = await fetch("/api/user", {
        headers: { 
          Accept: "application/json",
          Authorization: `Bearer ${token}` 
        },
      });
      
      if (res.ok) { 
        const data = await res.json();
        setUser(data); 
      } else { 
        // sinkronkan token jika unauthorized
        setToken(null); 
        localStorage.removeItem("token"); 
        setUser(null); 
      }
    } catch (error) { 
      console.error("Auth Error:", error); 
    } finally {
      isFetchingUser.current = false;
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      // optimasi render frame dan cegah loop
      requestAnimationFrame(() => {
        queueMicrotask(() => getUser());
      });
    } else {
      setUser(null);
    }
  }, [token, getUser]);

  return (
    <AppContext.Provider value={{ token, setToken, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
}
