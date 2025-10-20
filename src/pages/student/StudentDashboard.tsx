import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, LogOut, Camera, Calendar, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import QRScanner from "@/components/QRScanner";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

  // Mock attendance data
  const attendanceRecords = [
    {
      id: 1,
      subject: "Computer Science 101",
      date: "2024-01-15",
      time: "09:00 - 10:30",
      status: "present"
    },
    {
      id: 2,
      subject: "Data Structures",
      date: "2024-01-15",
      time: "11:00 - 12:30", 
      status: "present"
    },
    {
      id: 3,
      subject: "Algorithms",
      date: "2024-01-14",
      time: "14:00 - 15:30",
      status: "absent"
    },
    {
      id: 4,
      subject: "Database Systems",
      date: "2024-01-14",
      time: "16:00 - 17:30",
      status: "present"
    }
  ];

  const handleLogout = () => {
    navigate("/");
  };

  const totalClasses = attendanceRecords.length;
  const presentClasses = attendanceRecords.filter(record => record.status === "present").length;
  const attendancePercentage = Math.round((presentClasses / totalClasses) * 100);

  if (showScanner) {
    return <QRScanner onBack={() => setShowScanner(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-student-soft/20 to-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-student to-student-accent bg-clip-text text-transparent">Student Dashboard</h1>
            <p className="text-muted-foreground mt-1">Track your attendance and scan QR codes</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-student hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <div className="p-2 bg-student/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-student" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground mt-1">{presentClasses} of {totalClasses} classes</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes This Week</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">12</div>
              <p className="text-xs text-muted-foreground mt-1">10 attended</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <div className="p-2 bg-success/10 rounded-lg">
                <Calendar className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-foreground">CS 101</div>
              <p className="text-xs text-muted-foreground mt-1">Tomorrow 9:00 AM</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 shadow-xl border-2 border-student/20">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
            <CardDescription>Mark your attendance for today's classes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="student" 
              size="lg" 
              className="w-full text-base font-semibold h-14"
              onClick={() => setShowScanner(true)}
            >
              <QrCode className="h-6 w-6 mr-2" />
              Scan QR Code for Attendance
            </Button>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Recent Attendance</CardTitle>
            <CardDescription>Your attendance history for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {attendanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-5 border-2 rounded-xl hover:border-student/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{record.subject}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {record.date} • {record.time}
                    </p>
                  </div>
                  <Badge 
                    variant={record.status === 'present' ? 'default' : 'secondary'}
                    className={`${record.status === 'present' ? 'bg-success text-white' : 'bg-error text-white'} px-4 py-2 text-sm`}
                  >
                    {record.status === 'present' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Present
                      </>
                    ) : (
                      'Absent'
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;