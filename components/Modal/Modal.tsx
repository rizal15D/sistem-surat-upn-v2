"use client";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function Modal({
  children,
  setModalOpen,
  className,
}: {
  children: React.ReactNode;
  setModalOpen: (value: boolean) => void;
  className?: string;
}) {
  return (
    <div
      className={`bg-black/50 fixed top-0 left-0 w-screen h-screen z-9999 flex justify-center items-center`}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        setModalOpen(false);
      }}
    >
      <div
        className={`${className} bg-white shadow-default dark:bg-boxdark relative lg:w-[50%] lg:max-h-[85%] sm:w-[100%] sm:max-h-[100%] overflow-y-auto rounded-lg`}
      >
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
