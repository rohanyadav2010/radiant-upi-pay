
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, ScanLine, QrCode } from 'lucide-react';
import jsQR from 'jsqr';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  scanType: 'qr' | 'mobile';
  onScanSuccess?: (result: string) => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ 
  isOpen, 
  onClose, 
  scanType,
  onScanSuccess 
}) => {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      const constraints = { 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };
      
      console.log("Requesting user media with constraints:", constraints);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log("Camera stream obtained:", stream.active, stream.id);
      setHasCameraPermission(true);
      setIsCameraActive(true);
      setError(null);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded");
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log("Video playing successfully");
                // Start scanning after camera is initialized and playing
                setScanning(true);
                startScanning();
              })
              .catch(err => {
                console.error("Error playing video:", err);
                setError("Failed to start video: " + err.message);
              });
          }
        };
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err);
      setError(`Could not access camera: ${err.message || 'Please check permissions.'}`);
      setHasCameraPermission(false);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => {
        console.log("Stopping track:", track.kind, track.id);
        track.stop();
      });
      videoRef.current.srcObject = null;
    }
    
    if (scanIntervalRef.current) {
      console.log("Clearing scan interval");
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setIsCameraActive(false);
    setScanning(false);
  };

  const startScanning = () => {
    if (!canvasRef.current || !videoRef.current) {
      console.log("Canvas or video ref not available for scanning");
      return;
    }
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx) {
      console.log("Could not get 2D context");
      return;
    }
    
    console.log("Starting QR code scanning...");
    scanIntervalRef.current = window.setInterval(() => {
      if (video.readyState === video.HAVE_ENOUGH_DATA && scanning) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for QR code scanning
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Try to find QR code in the image
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });
        
        if (code) {
          console.log("QR Code detected:", code.data);
          
          // For mobile number scanning, we should verify if it's a number
          if (scanType === 'mobile') {
            // Simple validation for mobile numbers (adjust as needed)
            const mobileRegex = /^[0-9]{10,12}$/;
            if (mobileRegex.test(code.data)) {
              if (onScanSuccess) {
                setScanning(false);
                onScanSuccess(code.data);
                stopCamera();
                onClose();
              }
            }
          } else {
            // For QR codes, accept any data
            if (onScanSuccess) {
              setScanning(false);
              onScanSuccess(code.data);
              stopCamera();
              onClose();
            }
          }
        }
      }
    }, 200); // Scan every 200ms for better performance
  };

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

  const scanLineAnimation = {
    initial: { y: 0 },
    animate: { 
      y: [0, 250, 0],
      transition: { 
        repeat: Infinity, 
        duration: 3, 
        ease: "easeInOut" 
      }
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
        className="bg-white dark:bg-gray-800 rounded-2xl p-5 m-4 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold dark:text-white">
            {scanType === 'qr' ? 'Scan QR Code' : 'Scan Mobile Number'}
          </h3>
          <button onClick={onClose} className="dark:text-gray-300">
            <X size={20} />
          </button>
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-900 rounded-xl aspect-square flex items-center justify-center mb-4 relative overflow-hidden">
          {error ? (
            <div className="text-center text-gray-500 dark:text-gray-400 p-4">
              <Camera className="mx-auto mb-2 text-gray-400" size={48} />
              <p>{error}</p>
              <button 
                onClick={startCamera} 
                className="mt-3 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                Try Again
              </button>
            </div>
          ) : !hasCameraPermission ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <Camera className="mx-auto mb-2 text-gray-400" size={48} />
              <p>Camera access needed</p>
              <button 
                onClick={startCamera} 
                className="mt-3 bg-blue-500 text-white px-3 py-1 rounded-lg text-sm"
              >
                Enable Camera
              </button>
            </div>
          ) : (
            <>
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Scanning animation overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Corner markers */}
                <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-blue-500"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-blue-500"></div>
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-blue-500"></div>
                <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-blue-500"></div>
                
                {/* Scan line */}
                <motion.div 
                  className="absolute left-0 right-0 h-0.5 bg-blue-500"
                  variants={scanLineAnimation}
                  initial="initial"
                  animate="animate"
                >
                  <ScanLine className="text-blue-500 absolute -top-2 left-1/2 transform -translate-x-1/2" size={20} />
                </motion.div>
              </div>
              
              {/* Hidden canvas for image processing */}
              <canvas ref={canvasRef} className="hidden absolute" />
            </>
          )}
        </div>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
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
