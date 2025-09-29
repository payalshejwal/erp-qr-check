import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, QrCode, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">EduAttend</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automatic Attendance Monitoring with QR Codes and Geolocation
          </p>
        </div>


        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="hover:shadow-xl transition-all duration-300 border-teacher/20 hover:border-teacher">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-teacher-soft rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-teacher" />
              </div>
              <CardTitle className="text-2xl text-teacher">Teacher Portal</CardTitle>
              <CardDescription>
                Generate QR codes, manage attendance, and view class schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                variant="teacher" 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/teacher/login')}
              >
                Access Teacher Portal
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-student/20 hover:border-student">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-student-soft rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-student" />
              </div>
              <CardTitle className="text-2xl text-student">Student Portal</CardTitle>
              <CardDescription>
                Scan QR codes to mark attendance and view your records
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                variant="student" 
                size="lg" 
                className="w-full"
                onClick={() => navigate('/student/login')}
              >
                Access Student Portal
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-muted-foreground">
          <p>Prototype for Automatic Attendance Monitoring System</p>
        </div>
      </div>
    </div>
  );
};

export default Home;