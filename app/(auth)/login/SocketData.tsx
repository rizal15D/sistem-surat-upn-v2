import { io } from "socket.io-client";

const SocketData = () => {
  let socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
    // Opsi tambahan jika diperlukan
    // withCredentials: true,
  });
  return socket;
};

export { SocketData };
