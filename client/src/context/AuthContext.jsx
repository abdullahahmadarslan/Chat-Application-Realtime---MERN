import { createContext, useContext, useState, useEffect } from "react";

// initialize context
const AuthContext = createContext();

// provider
export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // console.log(parsedUser);
        setUserAuth(parsedUser);
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem("user"); // Remove invalid data
      }
    }
    setLoading(false);
  }, []);

  // contacts
  const [selectedContact, setSelectedContact] = useState(null);

  // contacts array for sidebar
  const [contactsArray, setContactsArray] = useState([]);

  // messages
  const [messages, setMessages] = useState([]);

  // provider
  return (
    <AuthContext.Provider
      value={{
        userAuth,
        setUserAuth,
        loading,
        selectedContact,
        setSelectedContact,
        messages,
        setMessages,
        contactsArray,
        setContactsArray,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to use context provided by provider
export const useAuth = () => {
  return useContext(AuthContext);
};
