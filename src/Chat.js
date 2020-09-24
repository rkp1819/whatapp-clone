import React from "react";
import "./Chat.css";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/MicNoneOutlined";
import SendIcon from "@material-ui/icons/Send";
import AttachmentIcon from "@material-ui/icons/Attachment";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useParams } from "react-router-dom";
import { db } from "./firebase";
import firebase from "firebase";

import { useStateValue } from "./StateProvider";
import Sidebar from "./Sidebar";

function Chat(props) {
  const [isTextMessage, setIsTextMessage] = React.useState(false);
  const [input, setInput] = React.useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = React.useState("Chat Room");
  const [seed, setSeed] = React.useState("");

  const [{ user }, dispatch] = useStateValue();
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    if (roomId) {
      setSeed(Math.floor(Math.random() * 50000));
      db.collection("chat-rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      db.collection("chat-rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }

    return () => {
      // cleanup;
    };
  }, [roomId]);

  function handleTextMessageChange(e) {
    let val = e.target.value;
    setInput(val);
  }

  function sendTextMessage(e) {
    console.log(input);

    db.collection("chat-rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setInput("");
    setIsTextMessage(false);
    e.preventDefault();
  }

  return (
    <div className="chat chat_hidden">
      <div className="chat_header">
        <IconButton>
          <ArrowBackIcon
            onClick={() => {
              // change css=> show Sidebar, hide chat
              document
                .getElementsByClassName("chat")[0]
                .classList.remove("chat_visible");
              document
                .getElementsByClassName("sidebar")[0]
                .classList.remove("sidebar_hidden");
              console.log("Room ID: " + props.id);
              document
                .getElementsByClassName("chat")[0]
                .classList.add("chat_hidden");
              document
                .getElementsByClassName("sidebar")[0]
                .classList.add("sidebar_visible");
            }}
            className="chat_header_back"
            ame="chat_header_back"
          />
        </IconButton>
        <Avatar
          src={`https://avatars.dicebear.com/api/human/${seed}.svg`}
          className="chat_header_avatar"
        />
        <div className="chat_header_text">
          <h3>{roomName}</h3>
          <p>
            last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
          {/* <p>
            Brijkishore, harita sister, Home, Jawin, Pinku bro, Pinky Jio, Rupa
            Khudi, Santosh, Shiva bro, +91 7738423567 +91 8374433484 +91
            4895309539, Brijkishore, harita sister, Home, Jawin, Pinku bro,
            Pinky Jio, Rupa Khudi, Santosh, Shiva bro, +91 7738423567 +91
            8374433484 +91 4895309539
          </p> */}
        </div>
        <div className="chat_header_right">
          <IconButton>
            <SearchOutlined className="mui-icon" />
          </IconButton>
          <IconButton>
            <MoreVertIcon className="mui-icon" />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name == user.displayName && "chat_reciver"
            }`}
          >
            <span className="chat_name">{message.name}</span>
            <div className="chat_message_body">
              <p>
                {message.message}
                <span className="chat_timestamp">
                  {new Date(message.timestamp?.toDate()).toUTCString()}
                </span>
              </p>
            </div>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <form onSubmit={sendTextMessage} className="chat_footer_form">
          <IconButton>
            <InsertEmoticonIcon className="mui-icon" />
          </IconButton>
          <IconButton>
            <AttachmentIcon className="mui-icon" />
          </IconButton>
          <input
            type="text"
            placeholder="Type a message"
            onChange={(e) => {
              handleTextMessageChange(e);
              if (e.target.value == "") {
                setIsTextMessage(false);
              } else {
                setIsTextMessage(true);
              }
            }}
            onKeyUpCapture={(e) => {
              if (e.target.value == "13") {
                console.log(input);

                db.collection("chat-rooms")
                  .doc(roomId)
                  .collection("messages")
                  .add({
                    message: input,
                    name: user.displayName,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                  });
                setInput("");
                setIsTextMessage(false);
              }
            }}
            value={input}
          />
          {isTextMessage ? (
            <IconButton onClick={sendTextMessage}>
              <SendIcon className="mui-icon" />
            </IconButton>
          ) : (
            <IconButton>
              <MicIcon className="mui-icon" />
            </IconButton>
          )}
        </form>
      </div>
    </div>
  );
}

export default Chat;
