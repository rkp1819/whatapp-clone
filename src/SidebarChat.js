import React from "react";
import { useState, useEffect } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";
import firebase from "firebase";
import { db } from "./firebase";
import { Link } from "react-router-dom";

function SidebarChat(props) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (props.id) {
      db.collection("chat-rooms")
        .doc(props.id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [props.id]);

  useEffect(() => {
    console.log("SidebarChat useEffect effect");
    setSeed(Math.floor(Math.random() * 50000));
    return () => {
      console.log("SidebarChat useEffect cleanup");
    };
  }, []);

  function addChatRoom() {
    let name = prompt("Chat room Name");
    console.log(name);
    if (name) {
      db.collection("chat-rooms").add({
        // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        timestamp: new Date(
          firebase.firestore.Timestamp.now().seconds * 1000
        ).toLocaleString(),
        name: name,
      });
    }
  }

  function loadChatRoom() {
    document.getElementsByClassName("chat")[0].classList.remove("chat_hidden");
    document
      .getElementsByClassName("sidebar")[0]
      .classList.remove("sidebar_visible");
    console.log("Room ID: " + props.id);
    document.getElementsByClassName("chat")[0].classList.add("chat_visible");
    document
      .getElementsByClassName("sidebar")[0]
      .classList.add("sidebar_hidden");
  }

  return props.addNewChat ? (
    <div className="sidebar_chat" onClick={addChatRoom}>
      <p>Add New Chat</p>
    </div>
  ) : (
    <Link to={`/rooms/${props.id}`}>
      <div className="sidebar_chat" onClick={loadChatRoom}>
        <div className="sidebar_chat_avatar">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        </div>
        <div className="sidebar_chat_info">
          <h3>{props.name}</h3>
          <p>{messages[0]?.message}</p>
          <span className="sidebar_chat_info_timestamp">
            <p>{props.timestamp}</p>
          </span>
        </div>
      </div>
    </Link>
  );
}

export default SidebarChat;
