import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

export default function Chat() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const initializeChat = async () => {
    try {
      // Get or create chat room for the group
      const roomRes = await api.post("/chat/rooms", { groupId: id });
      setRoom(roomRes.data);

      // Fetch existing messages
      const messagesRes = await api.get(`/chat/rooms/${roomRes.data._id}/messages`);
      setMessages(messagesRes.data);

      // Initialize Socket.IO
      const token = localStorage.getItem("token");
      socketRef.current = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        auth: { token }
      });

      socketRef.current.on("connect", () => {
        console.log("Connected to chat server");
        socketRef.current.emit("join-room", roomRes.data._id);
      });

      socketRef.current.on("new-message", (data) => {
        setMessages((prev) => [...prev, data]);
      });

      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from chat server");
      });
    } catch (error) {
      console.error("Failed to initialize chat:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !room) return;

    try {
      const messageData = {
        content: newMessage.trim(),
        roomId: room._id,
        sender: user
      };

      // Send via Socket.IO
      socketRef.current.emit("send-message", messageData);

      // Also save to database
      await api.post(`/chat/rooms/${room._id}/messages`, {
        content: newMessage.trim()
      });

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col">
        <div className="bg-white rounded-2xl card-shadow border border-pink-100 flex flex-col flex-1 min-h-0">
          {/* Chat Header */}
          <div className="p-3 sm:p-4 border-b border-pink-100">
            <h2 className="text-lg sm:text-xl font-bold text-purple-700">
              {room?.name || "Chat Room"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {room?.members?.length || 0} members
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.sender?._id === user?._id ||
                             message.sender?._id?.toString() === user?._id?.toString();
                
                return (
                  <div
                    key={message._id || Math.random()}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs font-semibold mb-1">
                          {message.sender?.name || "Unknown"}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isOwn ? "text-pink-100" : "text-gray-500"
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 sm:p-4 border-t border-pink-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-purple-700 transform transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

