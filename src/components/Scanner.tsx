
import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Check, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ScannerProps {
  onSuccess: (decodedText: string, decodedResult: any) => void;
  className?: string;
}

const Scanner = ({ onSuccess, className }: ScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [scannerMessage, setScannerMessage] = useState('Preparing camera...');
  const [showAnimation, setShowAnimation] = useState(false);
  
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  
  useEffect(() => {
    // Clean up scanner on unmount
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    };
  }, []);
  
  const startScanner = async () => {
    setScanResult(null);
    setIsScanning(true);
    setShowAnimation(true);
    setScannerMessage('Accessing camera...');
    
    if (!scannerRef.current) return;
    
    try {
      html5QrCodeRef.current = new Html5Qrcode("scanner");
      
      const config = { fps: 10, qrbox: { width: 250, height: 250 } };
      
      // Request permission first
      await navigator.mediaDevices.getUserMedia({ video: true });
      
      await html5QrCodeRef.current.start(
        { facingMode: "environment" }, 
        config,
        handleScanSuccess,
        handleScanFailure
      );
      
      setScannerMessage('Scan a QR code');
    } catch (error) {
      console.error("Error starting scanner:", error);
      setScannerMessage('Camera access denied or not available');
      setIsScanning(false);
    }
  };
  
  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        setIsScanning(false);
        setScannerMessage('Scanning stopped');
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };
  
  const handleScanSuccess = (decodedText: string, decodedResult: any) => {
    setShowAnimation(false);
    setScanResult(decodedText);
    stopScanner();
    
    try {
      // Validate that it's a JSON object
      const ticketData = JSON.parse(decodedText);
      
      if (ticketData && ticketData.ticket) {
        // Call the parent's success handler
        onSuccess(decodedText, decodedResult);
      } else {
        toast.error("Invalid QR Code", {
          description: "This doesn't appear to be a valid ticket.",
        });
      }
    } catch (error) {
      toast.error("Invalid QR Code Format", {
        description: "Could not read the QR code data.",
      });
    }
  };
  
  const handleScanFailure = (error: any) => {
    // We don't need to handle every failure, as most are just frames without QR codes
    // Only log critical errors
    if (error && error.name !== "NotFoundException") {
      console.error("Error scanning:", error);
    }
  };
  
  const resetScanner = () => {
    setScanResult(null);
    startScanner();
  };

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      <div 
        className={cn(
          "relative w-full max-w-md aspect-square rounded-xl overflow-hidden border border-border mb-4",
          isScanning ? "bg-black" : "bg-gray-100"
        )}
      >
        <div 
          id="scanner" 
          ref={scannerRef}
          className="w-full h-full"
        />
        
        {/* Scanning animation overlay */}
        {showAnimation && isScanning && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="w-full h-full relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 border-2 border-primary rounded-lg">
                  {/* Scanning line animation */}
                  <div className="h-0.5 w-full bg-primary animate-[ping_1.5s_ease-in-out_infinite] opacity-70"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Status message */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <div className={cn(
            "py-2 px-4 rounded-full inline-block text-sm",
            isScanning ? "bg-black/70 text-white" : "bg-white text-gray-800"
          )}>
            {scannerMessage}
          </div>
        </div>
      </div>
      
      {/* Scanner controls */}
      <div className="flex gap-4 mt-2">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg",
              "bg-primary text-white",
              "hover:bg-primary/90 transition-colors"
            )}
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-lg",
              "bg-gray-200 text-gray-800",
              "hover:bg-gray-300 transition-colors"
            )}
          >
            Stop Scanning
          </button>
        )}
        
        {scanResult && (
          <button
            onClick={resetScanner}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
          >
            <RefreshCw size={18} />
            Scan Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Scanner;
