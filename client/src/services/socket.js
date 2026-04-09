import { io } from "socket.io-client";

const socket = io(
  import.meta.env.VITE_SOCKET_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000",
  {
    autoConnect: false,
    withCredentials: true,
    auth: {
      token: localStorage.getItem("token"),
    },
  },
);

export default socket;
