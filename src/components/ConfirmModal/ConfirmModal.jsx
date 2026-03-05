// src/components/ConfirmModal.jsx

import React from "react";
import Modal from "react-modal";
import { X, AlertTriangle, HelpCircle, CheckCircle2 } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "danger", // Defaulting to 'danger' as it's a common use-case
}) => {
  // A richer configuration for a more professional look
  const variantConfig = {
    primary: {
      IconComponent: HelpCircle,
      headerBg: "bg-blue-500",
      buttonClasses:
        "bg-blue-600 hover:bg-blue-700 focus-visible:ring-blue-500",
    },
    danger: {
      IconComponent: AlertTriangle,
      headerBg: "bg-red-800",
      buttonClasses: "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500",
    },
    success: {
      IconComponent: CheckCircle2,
      headerBg: "bg-green-500",
      buttonClasses:
        "bg-green-600 hover:bg-green-700 focus-visible:ring-green-500",
    },
  };

  const selectedVariant = variantConfig[variant] || variantConfig.primary;
  const { IconComponent, headerBg, buttonClasses } = selectedVariant;

  const modalAnimation = `
        @keyframes fadeInScaleUp {
            from { opacity: 0; transform: translateY(-20px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
    `;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => !isLoading && onRequestClose()}
      contentLabel={title}
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[9999] transition-opacity duration-300"
      ariaHideApp={false}
    >
      <style>{modalAnimation}</style>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col"
        style={{
          animation:
            "fadeInScaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
        role="alertdialog"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Close Button */}
        <button
          onClick={onRequestClose}
          disabled={isLoading}
          className="absolute top-3 right-3 p-1.5 rounded-full text-gray-200 hover:text-white hover:bg-white/20 transition-colors z-10"
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        {/* Header with Icon */}
        <div
          className={`relative h-20 flex items-center justify-center ${headerBg}`}
        >
          <IconComponent className="text-white" size={48} aria-hidden="true" />
        </div>

        {/* Body Content */}
        <div className="p-6 text-center">
          <h3 className="text-2xl font-bold text-gray-800" id="modal-title">
            {title}
          </h3>
          {children && (
            <div className="mt-2">
              <p className="text-base text-gray-600" id="modal-description">
                {children}
              </p>
            </div>
          )}
        </div>

        {/* Footer with Action Buttons */}
        <div className="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onRequestClose}
            disabled={isLoading}
            className="inline-flex w-full justify-center rounded-lg cursor-pointer bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-100 disabled:opacity-50 sm:w-auto"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex w-full justify-center cursor-pointer  items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed sm:w-auto ${buttonClasses}`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
