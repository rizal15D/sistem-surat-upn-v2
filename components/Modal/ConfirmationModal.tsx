import { Button } from "../ui/button";
import Modal from "./Modal";

export default function ConfirmationModal({
  setModalOpen,
  onClick,
  title,
  message,
}: {
  setModalOpen: (value: boolean) => void;
  onClick: () => void;
  title: string;
  message: string;
}) {
  return (
    <Modal setModalOpen={setModalOpen}>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">{title}</h3>
        </div>
        <div className="p-6.5">
          <p className="text-black dark:text-white">{message}</p>
          <div className="flex justify-end space-x-2 mt-6 text-white">
            <Button
              variant="destructive"
              className="bg-danger hover:bg-opacity-90"
              onClick={onClick}
            >
              Ya
            </Button>
            <Button
              variant="default"
              className="bg-primary hover:bg-opacity-90"
              onClick={() => setModalOpen(false)}
            >
              Tidak
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
