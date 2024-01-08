"use client";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function Modal({
  children,
  setModalOpen,
}: {
  children: React.ReactNode;
  setModalOpen: (value: boolean) => void;
}) {
  return (
    <div className="bg-black/50 fixed top-0 left-0 w-screen h-screen z-9999 flex justify-center items-center">
      <div className="bg-white rounded-sm shadow-default dark:bg-boxdark relative">
        <div
          onClick={() => setModalOpen(false)}
          className="absolute top-0 right-0 m-4 cursor-pointer"
        >
          <Cross2Icon className="w-6 h-6" />
        </div>
        {children}
      </div>
    </div>
  );
}
