import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const initializeSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
  if (!socket) {
    socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
      // withCredentials: true,
    });
  }
  return socket;
};

const getSocket = (): Socket<DefaultEventsMap, DefaultEventsMap> => {
  if (!socket) {
    throw new Error(
      "Socket not initialized. Please call initializeSocket first."
    );
  }
  return socket;
};

export { initializeSocket, getSocket };

//==========================================
// import { io, Socket } from "socket.io-client";
// let socket: Socket | null = null;
// let saveSocket = {
//   body: {},
// };
// const setSocketData = () => {
//   socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
//     // Opsi tambahan jika diperlukan
//     // withCredentials: true,
//   });
//   saveSocket.body = socket;

//   sessionStorage.setItem("socketData", saveSocket.body);

//   return socket;
// };

// const getSocketData = () => {
//   socket = JSON.parse(sessionStorage.getItem("socketData"));
//   console.log("pmwrpow", socket);
//   if (!socket) {
//     throw new Error("Socket not initialized. Please call setSocketData first.");
//   }
//   return socket;
// };

// export { setSocketData, getSocketData };

//====================================

// import { io, Socket } from "socket.io-client";

// let socket: Socket | null = null;

// const setSocketData = (): Socket => {
//   if (!socket) {
//     socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
//       // Opsi tambahan jika diperlukan
//       // withCredentials: true,
//     });
//     console.log("opmopve", socket);
//   }
//   return socket;
// };

// const getSocketData = (): Socket => {
//   console.log("pmwrpow", socket);
//   if (!socket) {
//     throw new Error("Socket not initialized. Please call setSocketData first.");
//   }
//   return socket;
// };

// export { setSocketData, getSocketData };

//==============================================

// import { io } from "socket.io-client";

// let socket;

// const setSocketData = () => {
//   socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
//     // withCredentials: true,
//   });
//   // console.log(socket);
//   return socket;
// };

// const getSocketData = () => {
//   return socket;
// };

// module.exports = { setSocketData, getSocketData };
//==============================================
// Assuming your component file is named Socket.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// export default function Socket(page: any) {
//   const [message, setMessage] = useState(""); // Initialize message to empty string

//   useEffect(() => {
//     const socket = io("http://localhost:1500"); // Replace with your backend URL
//     setMessage("Connecting to socket...");
//     console.log("awdasdawbrw:");

//     socket.on("message", (data) => {
//       console.log("data:", data.message);
//       setMessage("message: " + data.message);
//     });
//     socket.on("welcome", (data) => {
//       console.log("data:", data.message);
//       setMessage("message: " + data.message);
//     });

//     // Clean up on component unmount
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   return <div>{message && <p>{message}</p>}</div>;
// }

// export default Socket;

//=========================================================

// // Assuming your component file is named Socket.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// // const Socket: React.FC = () => {
// export default function Socket() {
//   const [message, setMessage] = useState(""); // Initialize message to empty string

//   useEffect(() => {
//     const socket = io("http://localhost:1500"); // Replace with your backend URL
//     setMessage("Connecting to socket...");

//     socket.on("welcome", (data) => {
//       console.log("data:", data.message);
//       setMessage("message: " + data.message);
//     });

//     // Clean up on component unmount
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   return <div>{message && <p>{message}</p>}</div>;
// }

// // export default Socket;

//=========================================================

// // Assuming your component file is named Socket.tsx
// "use client";
// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// // const Socket: React.FC = () => {
// export default function Socket() {
//   const [message, setMessage] = useState(""); // Initialize message to empty string

//   useEffect(() => {
//     const socketIo = io("http://localhost:1500"); // Replace with your backend URL
//     setMessage("Connecting to socket...");
//     socketIo.on("connection", (socket) => {
//       socket.on("message", (data) => {
//         console.log("data:", data);
//         setMessage("message: " + data);
//       });
//     });

//     // Clean up on component unmount
//     return () => {
//       if (socket) {
//         socket.disconnect();
//       }
//     };
//   }, []);

//   return <div>{message && <p>{message}</p>}</div>;
// }

// // export default Socket;

//======================================================
