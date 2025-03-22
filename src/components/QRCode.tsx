
import { QRCodeSVG } from 'qrcode.react';
import { saveAs } from 'file-saver';
import { Download, RefreshCw, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QRCodeProps {
  ticketId: string;
  eventTitle: string;
  userName: string;
  className?: string;
}

const TicketQRCode = ({ ticketId, eventTitle, userName, className }: QRCodeProps) => {
  // Format ticket data for the QR code
  const qrCodeData = JSON.stringify({
    ticket: ticketId,
    name: userName,
    event: eventTitle,
    timestamp: new Date().toISOString(),
  });

  const saveQRCode = () => {
    // Create a canvas element to convert SVG to canvas
    const canvas = document.createElement('canvas');
    const qrCodeElement = document.getElementById('ticket-qr-code');
    
    if (qrCodeElement) {
      const svgData = new XMLSerializer().serializeToString(qrCodeElement);
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width * 4; // Higher resolution
        canvas.height = img.height * 4;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              saveAs(blob, `Ticket-${ticketId}.png`);
            }
          });
        }
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const shareTicket = async () => {
    // Check if Web Share API is supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket for ${eventTitle}`,
          text: `My ticket for ${eventTitle}. ID: ${ticketId}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="bg-white p-4 sm:p-6 rounded-xl border border-border shadow-sm">
        <div 
          className="qr-container flex flex-col items-center"
          id="qr-container"
        >
          <QRCodeSVG
            id="ticket-qr-code"
            value={qrCodeData}
            size={200}
            level="H" // High error correction
            includeMargin={true}
            className="mb-4"
          />
          <div className="text-center space-y-1">
            <div className="text-sm text-gray-500">Ticket ID</div>
            <div className="font-mono font-medium text-sm">{ticketId}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button 
          onClick={saveQRCode}
          className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <Download size={16} />
          <span>Save</span>
        </button>
        
        <button 
          onClick={shareTicket}
          className="flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default TicketQRCode;
