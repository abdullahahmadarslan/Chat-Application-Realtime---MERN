import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";
import io from "socket.io-client";

// creating context
const SocketContext = createContext();

// provider
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { userAuth } = useAuth();
  const userAuthLocal = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (userAuth) {
      // connecting to the server
      const socket = io("http://localhost:5000/", {
        query: { userId: userAuthLocal._id },
        reconnection: true,
      });

      setSocket(socket);

      // listening for online users event from the backend socket server to update the online status of the users in sidebar for each client
      socket.on("updateOnlineUsers", (users) => {
        console.log("Received online users:", users);
        setOnlineUsers(users);
      });

      // cleanup function when the component unmounts or the dependency changes
      return () => socket.close();
    } else {
      // if in case the authenticated user is not there but the connection is present, then we end the connection
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
    // eslint-disable-next-line
  }, [userAuth]);

  return (
    <SocketContext.Provider
      value={{ socket, onlineUsers, setSocket, setOnlineUsers }}
    >
      {children}
    </SocketContext.Provider>
  );
};

// custom hook
export const useSocketContext = () => {
  return useContext(SocketContext);
};
