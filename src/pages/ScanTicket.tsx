
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Scanner from '@/components/Scanner';
import { validateTicket, checkInTicket } from '@/utils/ticketUtils';
import { ScanLine, Check, X, UserCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ScanResultData {
  valid: boolean;
  message: string;
  ticket: any;
  scannedData: string;
}

const ScanTicket = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scanResult, setScanResult] = useState<ScanResultData | null>(null);

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem('isAuthenticated');
    
    // Simulate loading
    setTimeout(() => {
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      } else {
        navigate('/admin');
      }
      setIsLoading(false);
    }, 1000);
  }, [navigate]);

  const handleScanSuccess = (decodedText: string, decodedResult: any) => {
    try {
      // Parse the QR code data
      const ticketData = JSON.parse(decodedText);
      
      if (ticketData && ticketData.ticket) {
        // Validate the ticket in our system
        const validationResult = validateTicket(ticketData.ticket);
        
        setScanResult({
          ...validationResult,
          scannedData: decodedText
        });
        
        // Show appropriate toast based on validation result
        if (validationResult.valid) {
          toast.success("Valid Ticket", {
            description: "This ticket is valid and ready for check-in.",
          });
        } else {
          if (validationResult.ticket && validationResult.ticket.checkedIn) {
            toast.error("Already Used", {
              description: "This ticket has already been checked in.",
            });
          } else {
            toast.error("Invalid Ticket", {
              description: validationResult.message,
            });
          }
        }
      } else {
        setScanResult({
          valid: false,
          message: "Invalid QR code format",
          ticket: null,
          scannedData: decodedText
        });
        
        toast.error("Invalid QR Code", {
          description: "This QR code does not contain valid ticket data.",
        });
      }
    } catch (error) {
      setScanResult({
        valid: false,
        message: "Error processing QR code",
        ticket: null,
        scannedData: decodedText
      });
      
      toast.error("Processing Error", {
        description: "Could not process the scanned QR code.",
      });
    }
  };

  const handleCheckIn = () => {
    if (scanResult && scanResult.valid && scanResult.ticket) {
      const success = checkInTicket(scanResult.ticket.id);
      
      if (success) {
        // Update the scan result
        setScanResult({
          ...scanResult,
          valid: false, // Mark as invalid to prevent multiple check-ins
          message: "Ticket has been checked in",
          ticket: {
            ...scanResult.ticket,
            checkedIn: true,
            checkInTime: new Date().toISOString()
          }
        });
        
        toast.success("Check-in Successful", {
          description: `${scanResult.ticket.fullName} has been checked in.`,
        });
      } else {
        toast.error("Check-in Failed", {
          description: "There was an error checking in this ticket.",
        });
      }
    }
  };

  const resetScan = () => {
    setScanResult(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-10 h-10 border-t-2 border-b-2 border-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading scanner...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-display font-medium mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">
              You need to be logged in to access the ticket scanner.
            </p>
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-4 animate-fade-in">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-full mb-4">
              <ScanLine className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-display font-medium mb-2">Ticket Scanner</h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Scan attendee QR codes to verify tickets and check guests into the event
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Scanner */}
            <div className="flex flex-col items-center">
              <Scanner onSuccess={handleScanSuccess} />
            </div>
            
            {/* Scan Result */}
            <div className="flex flex-col justify-center">
              {scanResult ? (
                <div className={cn(
                  "bg-white rounded-xl border shadow-sm overflow-hidden animate-scale-in",
                  scanResult.valid ? "border-green-200" : (
                    scanResult.ticket && scanResult.ticket.checkedIn 
                      ? "border-blue-200" 
                      : "border-red-200"
                  )
                )}>
                  <div className={cn(
                    "p-4 flex items-center",
                    scanResult.valid 
                      ? "bg-green-50 text-green-800" 
                      : (scanResult.ticket && scanResult.ticket.checkedIn 
                        ? "bg-blue-50 text-blue-800" 
                        : "bg-red-50 text-red-800")
                  )}>
                    {scanResult.valid ? (
                      <Check className="h-5 w-5 mr-2" />
                    ) : (
                      scanResult.ticket && scanResult.ticket.checkedIn ? (
                        <UserCheck className="h-5 w-5 mr-2" />
                      ) : (
                        <X className="h-5 w-5 mr-2" />
                      )
                    )}
                    <span className="font-medium">
                      {scanResult.valid 
                        ? "Valid Ticket" 
                        : (scanResult.ticket && scanResult.ticket.checkedIn 
                          ? "Already Checked In" 
                          : "Invalid Ticket")}
                    </span>
                  </div>
                  
                  {scanResult.ticket ? (
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Ticket ID</p>
                          <p className="font-mono font-medium">{scanResult.ticket.id}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Event</p>
                          <p className="font-medium">{scanResult.ticket.eventTitle}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Attendee</p>
                          <p className="font-medium">{scanResult.ticket.fullName}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Quantity</p>
                          <p className="font-medium">{scanResult.ticket.quantity} {scanResult.ticket.quantity > 1 ? 'tickets' : 'ticket'}</p>
                        </div>
                        
                        {scanResult.ticket.checkedIn && (
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Check-in Time</p>
                            <p className="font-medium">
                              {scanResult.ticket.checkInTime 
                                ? new Date(scanResult.ticket.checkInTime).toLocaleString() 
                                : 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-6 flex gap-4">
                        {scanResult.valid ? (
                          <button
                            onClick={handleCheckIn}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check size={18} />
                            Check In
                          </button>
                        ) : (
                          <button
                            onClick={resetScan}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Scan Another
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
                      <p className="text-gray-800 font-medium mb-2">QR Code Not Recognized</p>
                      <p className="text-gray-600 text-sm mb-6">This QR code doesn't contain valid ticket data.</p>
                      
                      <button
                        onClick={resetScan}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Scan Again
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 text-center">
                  <div className="flex flex-col items-center justify-center h-64">
                    <ScanLine className="h-16 w-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-medium text-gray-800 mb-2">Ready to Scan</h3>
                    <p className="text-gray-600">
                      Point the camera at a ticket QR code to scan and verify the attendee.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScanTicket;
