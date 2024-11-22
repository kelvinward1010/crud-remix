import React, { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    showModal: boolean;
    onClose: () => void;
    children: ReactNode;
    width?: string;
    height?: string;
}

const Modal: React.FC<ModalProps> = ({ showModal, onClose, children, width, height }) => {
    if (!showModal) return null;

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div
                className={`relative bg-white rounded-lg shadow-lg p-6 ${width || 'w-1/3'} ${height || 'h-auto'}`}
            >
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                    onClick={onClose}
                >
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
};

export default Modal;
