import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-stone-900/60 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal dialog */}
        <div
          className={`w-full ${maxWidthStyles[maxWidth]} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-elevated transition-all z-10 border border-stone-200`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            {title && <h3 className="text-lg font-serif font-bold text-brand-maroon">{title}</h3>}
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-stone-700 transition-colors p-1 rounded-full hover:bg-stone-100"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
