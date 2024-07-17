// import { useAuth } from "../context/AuthContext";

export const ChatMessage = ({ messagee }) => {
  // const { userAuth } = useAuth();
  const user = JSON.parse(localStorage.getItem("user"));
  let fromMe = user && user._id === messagee.sender;
  let messageClass = fromMe ? "sent" : "received";
  console.log(user);
  return (
    <>
      {/* sent and received classes */}
      <div className={`message ${messageClass}`}>
        <div className="text">
          {messagee.message}
          <span className="timestamp">{extractTime(messagee.createdAt)}</span>
        </div>
      </div>
    </>
  );
};

const extractTime = (createdAt) => {
  const date = new Date(createdAt);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
