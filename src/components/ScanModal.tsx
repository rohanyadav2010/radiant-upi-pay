
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanType: 'qr' | 'mobile';
}

const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, scanType }) => {
  if (!isOpen) return null;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.div
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white rounded-2xl p-5 m-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold">
            {scanType === 'qr' ? 'Scan QR Code' : 'Scan Mobile Number'}
          </h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="bg-gray-100 rounded-xl aspect-square flex items-center justify-center mb-4">
          <div className="text-center text-gray-500">
            <p>Camera placeholder</p>
            <p className="text-xs mt-2">
              {scanType === 'qr' 
                ? 'Point your camera at a QR code' 
                : 'Scan a phone number barcode'
              }
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          {scanType === 'qr' 
            ? 'Position the QR code within the frame to scan'
            : 'Position the barcode within the frame to scan'
          }
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ScanModal;
