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

  // contacts array which are friends of current logged in user
  const [contactsArray, setContactsArray] = useState([]);

  // get all users from the database except the logged in user
  const [allUsers, setAllUsers] = useState([]);

  // messages array for selected group or contact
  const [messages, setMessages] = useState([]);

  // groups
  const [selectedGroup, setSelectedGroup] = useState(null);

  // groups array for sidebar
  const [groupsArray, setGroupsArray] = useState([]);

  //toSentRequestIds
  const [toSentRequestIds, setToSentRequestIds] = useState([]);

  // pending friend requests of the logged in user
  const [pendingRequests, setPendingRequests] = useState([]);

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
        groupsArray,
        setGroupsArray,
        selectedGroup,
        setSelectedGroup,
        toSentRequestIds,
        setToSentRequestIds,
        allUsers,
        setAllUsers,
        pendingRequests,
        setPendingRequests,
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
