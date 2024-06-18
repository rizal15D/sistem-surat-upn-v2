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

// Assuming your component file is named Socket.tsx
"use client";
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

// const Socket: React.FC = () => {
export default function Socket() {
  const [message, setMessage] = useState(""); // Initialize message to empty string

  useEffect(() => {
    const socket = io("http://localhost:1500"); // Replace with your backend URL
    setMessage("Connecting to socket...");

    socket.on("message", (data) => {
      console.log("data:", data);
      setMessage("message: " + data);
    });

    // Clean up on component unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return <div>{message && <p>{message}</p>}</div>;
}

// export default Socket;
