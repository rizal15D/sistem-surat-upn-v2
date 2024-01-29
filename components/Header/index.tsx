import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import DropdownUser from "./DropdownUser";
import Modal from "../Modal/Modal";
import { useToast } from "../ui/use-toast";
import ConfirmationModal from "../Modal/ConfirmationModal";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    if (
      e.currentTarget.password.value !==
      e.currentTarget.password_confirmation.value
    ) {
      toast({
        title: "Gagal mengubah password",
        description: "Password baru dan konfirmasi password baru tidak sama",
        className: "bg-danger text-white",
      });
      return;
    }

    if (e.currentTarget.password.value.length < 8) {
      toast({
        title: "Gagal mengubah password",
        description: "Password baru minimal 8 karakter",
        className: "bg-danger text-white",
      });
      return;
    }

    const input = {
      oldPassword: e.currentTarget.old_password.value,
      newPassword: e.currentTarget.password.value,
    };

    mutate(input);
  };

  const { mutate } = useMutation({
    mutationKey: ["changePassword"],
    mutationFn: async (input: any) => {
      const response = await axios.put(`/api/users`, { input });
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Berhasil mengubah password",
        description: "Password berhasil diubah",
        className: "bg-success text-white",
      });
      setChangePasswordModalOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Gagal mengubah password",
        description: "Password lama salah",
        className: "bg-danger text-white",
      });
    },
  });

  return (
    <>
      <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <div className="flex flex-grow items-center justify-between px-4 py-2 shadow-2 md:px-6 2xl:px-11">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <!-- Hamburger Toggle BTN --> */}
            <button
              aria-controls="sidebar"
              onClick={(e) => {
                e.stopPropagation();
                props.setSidebarOpen(!props.sidebarOpen);
              }}
              className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark"
            >
              <span className="relative block h-5.5 w-5.5 cursor-pointer">
                <span className="du-block absolute right-0 h-full w-full">
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!w-full delay-300"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "delay-400 !w-full"
                    }`}
                  ></span>
                  <span
                    className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!w-full delay-500"
                    }`}
                  ></span>
                </span>
                <span className="absolute right-0 h-full w-full rotate-45">
                  <span
                    className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!h-0 !delay-[0]"
                    }`}
                  ></span>
                  <span
                    className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                      !props.sidebarOpen && "!h-0 !delay-200"
                    }`}
                  ></span>
                </span>
              </span>
            </button>
            {/* <!-- Hamburger Toggle BTN --> */}

            {/* <Link className="block flex-shrink-0 lg:hidden" href="/">
            <Image
              width={32}
              height={32}
              src={"/images/logo/logo-icon.svg"}
              alt="Logo"
            />

          </Link> */}
            <span
              className="ml-2 text-xl font-bold text-black dark:text-white cursor-pointer"
              onClick={() => {
                router.push("/surat");
              }}
            >
              UPN
            </span>
          </div>

          {/* <div className="hidden sm:block">
          <form action="https://formbold.com/s/unique_form_id" method="POST">
            <div className="relative">
              <button className="absolute left-0 top-1/2 -translate-y-1/2">
                <svg
                  className="fill-body hover:fill-primary dark:fill-bodydark dark:hover:fill-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9.16666 3.33332C5.945 3.33332 3.33332 5.945 3.33332 9.16666C3.33332 12.3883 5.945 15 9.16666 15C12.3883 15 15 12.3883 15 9.16666C15 5.945 12.3883 3.33332 9.16666 3.33332ZM1.66666 9.16666C1.66666 5.02452 5.02452 1.66666 9.16666 1.66666C13.3088 1.66666 16.6667 5.02452 16.6667 9.16666C16.6667 13.3088 13.3088 16.6667 9.16666 16.6667C5.02452 16.6667 1.66666 13.3088 1.66666 9.16666Z"
                    fill=""
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.2857 13.2857C13.6112 12.9603 14.1388 12.9603 14.4642 13.2857L18.0892 16.9107C18.4147 17.2362 18.4147 17.7638 18.0892 18.0892C17.7638 18.4147 17.2362 18.4147 16.9107 18.0892L13.2857 14.4642C12.9603 14.1388 12.9603 13.6112 13.2857 13.2857Z"
                    fill=""
                  />
                </svg>
              </button>

              <input
                type="text"
                placeholder="Type to search..."
                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
              />
            </div>
          </form>
        </div> */}

          <div className="flex items-center gap-3 2xsm:gap-7">
            <ul className="flex items-center gap-2 2xsm:gap-4">
              {/* <!-- Dark Mode Toggler --> */}
              {/* <DarkModeSwitcher /> */}
              {/* <!-- Dark Mode Toggler --> */}

              {/* <!-- Notification Menu Area --> */}
              {/* <DropdownNotification /> */}
              {/* <!-- Notification Menu Area --> */}

              {/* <!-- Chat Notification Area --> */}
              {/* <DropdownMessage /> */}
              {/* <!-- Chat Notification Area --> */}
            </ul>

            {/* <!-- User Area --> */}
            <DropdownUser
              setChangePasswordModalOpen={setChangePasswordModalOpen}
              setLogoutModalOpen={setLogoutModalOpen}
            />
            {/* <!-- User Area --> */}
          </div>
        </div>
      </header>

      {changePasswordModalOpen && (
        <Modal setModalOpen={setChangePasswordModalOpen}>
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Ubah Password
              </h3>
            </div>
            <form onSubmit={handleChangePassword}>
              <div className="p-6.5">
                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Password Lama <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="old_password"
                    type="password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Password Baru <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="password"
                    type="password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <div className="mb-4.5">
                  <label className="mb-2.5 block text-black dark:text-white">
                    Konfirmasi Password Baru{" "}
                    <span className="text-meta-1">*</span>
                  </label>
                  <input
                    name="password_confirmation"
                    type="password"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                  />
                </div>

                <button className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray">
                  Ubah
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
      {logoutModalOpen && (
        <ConfirmationModal
          setModalOpen={setLogoutModalOpen}
          onClick={() => {
            signOut();
          }}
          title="Logout"
          message="Apakah anda yakin ingin logout?"
        />
      )}
    </>
  );
};

export default Header;
