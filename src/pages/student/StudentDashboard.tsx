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
    <div className="min-h-screen bg-gradient-to-br from-background to-student-soft">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-student">Student Dashboard</h1>
            <p className="text-muted-foreground">Track your attendance and scan QR codes</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-student">{attendancePercentage}%</div>
              <p className="text-xs text-muted-foreground">{presentClasses} of {totalClasses} classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classes This Week</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">10 attended</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Class</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">CS 101</div>
              <p className="text-xs text-muted-foreground">Tomorrow 9:00 AM</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-student">Quick Actions</CardTitle>
            <CardDescription>Mark your attendance for today's classes</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="student" 
              size="lg" 
              className="w-full md:w-auto"
              onClick={() => setShowScanner(true)}
            >
              <QrCode className="h-5 w-5 mr-2" />
              Scan QR Code for Attendance
            </Button>
          </CardContent>
        </Card>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-student">Recent Attendance</CardTitle>
            <CardDescription>Your attendance history for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendanceRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{record.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      {record.date} • {record.time}
                    </p>
                  </div>
                  <Badge 
                    variant={record.status === 'present' ? 'default' : 'secondary'}
                    className={record.status === 'present' ? 'bg-success' : 'bg-error'}
                  >
                    {record.status === 'present' ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
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