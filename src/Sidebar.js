import React from "react";
import "./Sidebar.css";
import { db } from "./firebase";

import { Avatar } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import IconButton from "@material-ui/core/IconButton";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat";
import { useStateValue } from "./StateProvider";

function Sidebar() {
  const [rooms, setRooms] = React.useState([]);
  const [seed, setSeed] = React.useState("");

  const [{ user }, dispatch] = useStateValue();

  React.useEffect(() => {
    setSeed(Math.floor(Math.random() * 50000));
    const unsubscribe = db
      .collection("chat-rooms")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setRooms(
          snapshot.docs.map((doc) => {
            return {
              id: doc.id,
              data: doc.data(),
            };
          })
        );
      });

    return () => {
      //cleanup - detach the RealTimeEventLister for this useEffect.
      unsubscribe();
    };
  }, []);

  return (
    <div className="sidebar sidebar_visible">
      <div className="sidebar_header">
        <div className="sidebar_header_left">
          <Avatar src={user?.photoURL} />
        </div>
        <div className="sidebar_header_right">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className="sidebar_search">
        <div className="sidebar_search_container">
          <SearchOutlined />
          <input type="text" placeholder="Search or start a new chat" />
        </div>
      </div>
      <div className="sidebar_chats">
        <SidebarChat addNewChat />
        {rooms.map((room) => {
          return (
            <SidebarChat
              key={room.id}
              id={room.id}
              name={room.data.name}
              timestamp={room.data.timestamp}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
