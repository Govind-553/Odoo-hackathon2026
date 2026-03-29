import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = 'max-w-lg' }) => {
  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-secondary/40 backdrop-blur-sm transition-all"
        />

        {/* Modal content */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative bg-white w-full ${maxWidth} rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
            <h2 className="text-xl font-bold text-secondary tracking-tight">
              {title}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-50 transition-colors text-muted hover:text-secondary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-slate-50/50">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
