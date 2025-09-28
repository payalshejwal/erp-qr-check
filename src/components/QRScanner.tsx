import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MapPin, CheckCircle, AlertCircle, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onBack: () => void;
}

const QRScanner = ({ onBack }: QRScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [location, setLocation] = useState<{lat: number; lon: number} | null>(null);
  const [locationError, setLocationError] = useState<string>("");
  const [scanResult, setScanResult] = useState<any>(null);
  const { toast } = useToast();

  // Campus coordinates (example - replace with actual coordinates)
  const CAMPUS_LAT = 40.7128;
  const CAMPUS_LON = -74.0060;
  const ALLOWED_RADIUS = 200; // meters

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          setLocationError("Location access denied. Please enable location services.");
          console.error("Location error:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const isWithinCampus = () => {
    if (!location) return false;
    const distance = calculateDistance(
      location.lat, 
      location.lon, 
      CAMPUS_LAT, 
      CAMPUS_LON
    );
    return distance <= ALLOWED_RADIUS;
  };

  const startScanning = () => {
    setIsScanning(true);
    
    const html5QrcodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      },
      false
    );

    html5QrcodeScanner.render(
      (decodedText) => {
        try {
          const qrData = JSON.parse(decodedText);
          setScanResult(qrData);
          html5QrcodeScanner.clear();
          setIsScanning(false);
          processAttendance(qrData);
        } catch (error) {
          toast({
            title: "Invalid QR Code",
            description: "This QR code is not valid for attendance.",
            variant: "destructive",
          });
        }
      },
      (error) => {
        console.warn("QR scan error:", error);
      }
    );
  };

  const processAttendance = (qrData: any) => {
    if (!location) {
      toast({
        title: "Location Required",
        description: "Unable to determine your location. Please enable GPS.",
        variant: "destructive",
      });
      return;
    }

    if (!isWithinCampus()) {
      toast({
        title: "Outside Campus",
        description: "You are outside premises. Attendance not allowed.",
        variant: "destructive",
      });
      return;
    }

    // Simulate attendance marking
    toast({
      title: "Attendance Marked Successfully",
      description: `Present for ${qrData.subject} - ${qrData.class}`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-student-soft">
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Location Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-student flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {locationError ? (
                <div className="flex items-center text-error">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  {locationError}
                </div>
              ) : location ? (
                <div className="space-y-2">
                  <div className="flex items-center text-success">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Location detected successfully
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Status: {isWithinCampus() ? 
                      <span className="text-success font-medium">Within campus radius</span> : 
                      <span className="text-error font-medium">Outside campus radius</span>
                    }
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Lat: {location.lat.toFixed(6)}, Lon: {location.lon.toFixed(6)}
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground">Detecting location...</div>
              )}
            </CardContent>
          </Card>

          {/* QR Scanner */}
          <Card>
            <CardHeader>
              <CardTitle className="text-student">QR Code Scanner</CardTitle>
              <CardDescription>
                Scan the QR code displayed by your teacher to mark attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <Button 
                  variant="student" 
                  size="lg" 
                  className="w-full"
                  onClick={startScanning}
                  disabled={!location || locationError !== ""}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start QR Scanner
                </Button>
              ) : (
                <div className="space-y-4">
                  <div id="qr-reader" className="w-full"></div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsScanning(false);
                      window.location.reload(); // Simple way to clear scanner
                    }}
                  >
                    Stop Scanning
                  </Button>
                </div>
              )}

              {scanResult && (
                <div className="bg-student-soft p-4 rounded-lg">
                  <h4 className="font-semibold text-student mb-2">Scanned Session:</h4>
                  <div className="text-sm space-y-1">
                    <div><strong>Subject:</strong> {scanResult.subject}</div>
                    <div><strong>Class:</strong> {scanResult.class}</div>
                    <div><strong>Time:</strong> {scanResult.time}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Scan</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="text-sm space-y-2 list-decimal list-inside text-muted-foreground">
                <li>Make sure you are on campus premises</li>
                <li>Allow camera access when prompted</li>
                <li>Point your camera at the QR code displayed by your teacher</li>
                <li>Keep the QR code within the scanning frame</li>
                <li>Wait for automatic detection and attendance confirmation</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;