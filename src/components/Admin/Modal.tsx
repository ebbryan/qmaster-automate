type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
};

const Modal = ({ onClose, children }: ModalProps) => {
  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all max-w-lg mx-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          {children}
          <button
            className="absolute top-0 right-0 mt-4 mr-4"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6 text-gray-700"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="sr-only">Close</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
