import React from "react";
import Modal from "react-modal";
import { X, Info, Cross } from "lucide-react"; // Using Info as a default icon
import { motion } from "framer-motion"; // Keeping framer-motion for the content if desired
import { CancelOutlined } from "@mui/icons-material";

const ModalWrapper = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title, // Added a title prop for consistency
  header = false, // Kept for backwards compatibility
  children,
  className = "",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isConfirmLoading = false,
  contentLabel,
  // New props for consistency with ConfirmModal
  confirmButtonVariant = "primary", // 'primary', 'danger', 'success'
  hideFooter = true,
}) => {
  // Variant configuration for button colors
  const variantConfig = {
    primary: "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
    danger: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
  };

  const buttonClasses = variantConfig[confirmButtonVariant] || variantConfig.primary;

  const modalAnimation = `
    @keyframes fadeInScaleUp {
      from { opacity: 0; transform: translateY(-20px) scale(0.98); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => !isConfirmLoading && onRequestClose()}
      contentLabel={contentLabel || title}
      className=" flex items-center justify-center  m-auto  "
      overlayClassName="fixed flex items-center justify-center inset-0 bg-gray-900/60 backdrop-blur-sm z-[997] transition-opacity duration-300"
      ariaHideApp={false}
      closeTimeoutMS={300}
    >
      <style>{modalAnimation}</style>
      <div
        className={`bg-white   rounded-md shadow-2xl w-full min-w-lg overflow-hidden flex justify-center item-center flex-col ${className}`}
        style={{ animation: "fadeInScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
        role="dialog"
        aria-labelledby="modal-title"
      >
        {/* --- Header Section --- */}

        {/* --- Body Content --- */}
        {/* The children are now rendered inside a padded content area */}
        <div className=" overflow-y-auto h-full  relative max-h-[95vh]">
          <div className="px-3 py-1 bg-white sticky top-0 z-10 flex items-center justify-between border-b border-gray-200">
            <CancelOutlined className="sticky top-2 right-2 w-fit shadow-2xl text-red-600 cursor-pointer" onClick={onRequestClose} />

          </div>
          <div className="p-3">
            {children}

          </div>
        </div>

        {/* --- Footer with Action Buttons --- */}
        {/* The footer is now optional via the `hideFooter` prop */}
        {!hideFooter && (
          <footer className="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-200">
            {onRequestClose && (
              <button
                type="button"
                onClick={onRequestClose}
                disabled={isConfirmLoading}
                className="inline-flex w-full justify-center rounded-lg cursor-pointer bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-50 sm:w-auto"
              >
                {cancelText}
              </button>
            )}
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={isConfirmLoading}
                className={`inline-flex w-full justify-center cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 focus-visible:outline-none disabled:bg-gray-400 sm:w-auto ${buttonClasses}`}
              >
                {isConfirmLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : (
                  confirmText
                )}
              </button>
            )}
          </footer>
        )}
      </div>
    </Modal>
  );
};

export default ModalWrapper;