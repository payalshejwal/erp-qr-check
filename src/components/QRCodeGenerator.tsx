import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Download, RefreshCw } from "lucide-react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  session: {
    id: number;
    subject: string;
    class: string;
    time: string;
    day: string;
  };
  onBack: () => void;
}

const QRCodeGenerator = ({ session, onBack }: QRCodeGeneratorProps) => {
  const [qrCode, setQrCode] = useState<string>("");
  const [sessionToken, setSessionToken] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async () => {
    setIsGenerating(true);
    
    // Generate a unique token for this session
    const token = `${session.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setSessionToken(token);

    // Create QR data
    const qrData = {
      sessionId: session.id,
      subject: session.subject,
      class: session.class,
      time: session.time,
      day: session.day,
      token: token,
      timestamp: new Date().toISOString(),
    };

    try {
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 300,
        margin: 2,
        color: {
          dark: '#1e40af', // teacher blue
          light: '#ffffff'
        }
      });
      setQrCode(qrCodeDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
    
    setIsGenerating(false);
  };

  const downloadQRCode = () => {
    if (qrCode) {
      const link = document.createElement('a');
      link.download = `attendance-${session.subject}-${session.class}.png`;
      link.href = qrCode;
      link.click();
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-teacher-soft">
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-teacher">QR Code Generated</CardTitle>
              <CardDescription>
                Students can scan this QR code to mark their attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Session Details */}
              <div className="bg-teacher-soft p-4 rounded-lg">
                <h3 className="font-semibold text-teacher mb-2">Session Details</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>Subject:</strong> {session.subject}</div>
                  <div><strong>Class:</strong> {session.class}</div>
                  <div><strong>Time:</strong> {session.time}</div>
                  <div><strong>Day:</strong> {session.day}</div>
                </div>
                {sessionToken && (
                  <div className="mt-2">
                    <strong>Token:</strong> <code className="text-xs bg-white px-2 py-1 rounded">{sessionToken}</code>
                  </div>
                )}
              </div>

              {/* QR Code Display */}
              <div className="text-center">
                {isGenerating ? (
                  <div className="flex flex-col items-center space-y-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-teacher" />
                    <p>Generating QR Code...</p>
                  </div>
                ) : qrCode ? (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-lg inline-block shadow-lg">
                      <img src={qrCode} alt="Attendance QR Code" className="mx-auto" />
                    </div>
                    <div className="flex gap-2 justify-center">
                      <Button variant="teacher-outline" onClick={generateQRCode}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button variant="teacher" onClick={downloadQRCode}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Failed to generate QR code</p>
                )}
              </div>

              {/* Instructions */}
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Instructions for Students:</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside text-muted-foreground">
                  <li>Open the Student Portal on your mobile device</li>
                  <li>Click "Scan QR Code" to open the camera scanner</li>
                  <li>Point your camera at this QR code</li>
                  <li>Ensure you are on campus premises for location verification</li>
                  <li>Your attendance will be marked automatically</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;