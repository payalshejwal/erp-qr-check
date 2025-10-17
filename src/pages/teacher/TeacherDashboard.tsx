import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, LogOut, Clock, Users, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import ManualAttendance from "@/components/ManualAttendance";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showManualAttendance, setShowManualAttendance] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLecture, setNewLecture] = useState({
    subject: "",
    class: "",
    time: "",
    day: "Monday"
  });

  // Mock timetable data
  const [timetable, setTimetable] = useState<Array<{
    id: number;
    subject: string;
    class: string;
    time: string;
    day: string;
    status?: string;
  }>>([
    {
      id: 1,
      subject: "Computer Science 101",
      class: "CS-A",
      time: "09:00 - 10:30",
      day: "Monday",
    },
    {
      id: 2,
      subject: "Data Structures",
      class: "CS-B", 
      time: "11:00 - 12:30",
      day: "Monday",
    },
    {
      id: 3,
      subject: "Algorithms",
      class: "CS-A",
      time: "14:00 - 15:30", 
      day: "Monday",
    },
    {
      id: 4,
      subject: "Database Systems",
      class: "CS-C",
      time: "16:00 - 17:30",
      day: "Monday",
    }
  ]);

  // Function to check if current time is within session time
  const getSessionStatus = (timeSlot: string) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startTime, endTime] = timeSlot.split(' - ');
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const sessionStart = startHour * 60 + startMin;
    const sessionEnd = endHour * 60 + endMin;
    
    if (currentTime >= sessionStart && currentTime <= sessionEnd) {
      return "active";
    }
    return "upcoming";
  };

  // Update session statuses every minute
  useEffect(() => {
    const updateStatuses = () => {
      setTimetable(prev => prev.map(session => ({
        ...session,
        status: getSessionStatus(session.time)
      })));
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleAddLecture = () => {
    if (!newLecture.subject || !newLecture.class || !newLecture.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const newSession = {
      id: timetable.length + 1,
      subject: newLecture.subject,
      class: newLecture.class,
      time: newLecture.time,
      day: newLecture.day,
      status: getSessionStatus(newLecture.time)
    };

    setTimetable([...timetable, newSession]);
    setNewLecture({ subject: "", class: "", time: "", day: "Monday" });
    setIsDialogOpen(false);
    
    toast({
      title: "Lecture Added",
      description: `${newLecture.subject} has been added to your schedule`,
    });
  };

  const handleGenerateQR = (session: any) => {
    setSelectedSession(session);
    setShowManualAttendance(false);
  };

  const handleManualAttendance = (session: any) => {
    setSelectedSession(session);
    setShowManualAttendance(true);
  };

  const handleLogout = () => {
    navigate("/");
  };

  if (selectedSession && !showManualAttendance) {
    return <QRCodeGenerator session={selectedSession} onBack={() => setSelectedSession(null)} />;
  }

  if (selectedSession && showManualAttendance) {
    return <ManualAttendance session={selectedSession} onBack={() => setSelectedSession(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-teacher-soft">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-teacher">Teacher Dashboard</h1>
            <p className="text-muted-foreground">Manage your classes and attendance</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="teacher">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lecture
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Lecture</DialogTitle>
                  <DialogDescription>
                    Enter the details for the new lecture
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject Name</Label>
                    <Input
                      id="subject"
                      placeholder="e.g., Computer Science 101"
                      value={newLecture.subject}
                      onChange={(e) => setNewLecture({ ...newLecture, subject: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class">Class Name</Label>
                    <Input
                      id="class"
                      placeholder="e.g., CS-A"
                      value={newLecture.class}
                      onChange={(e) => setNewLecture({ ...newLecture, class: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      placeholder="e.g., 09:00 - 10:30"
                      value={newLecture.time}
                      onChange={(e) => setNewLecture({ ...newLecture, time: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={handleAddLecture} className="w-full">
                  Add Lecture
                </Button>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">1 active, 3 upcoming</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">This semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Timetable */}
        <Card>
          <CardHeader>
            <CardTitle className="text-teacher">Today's Schedule</CardTitle>
            <CardDescription>Manage attendance for your classes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {timetable.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{session.subject}</h3>
                      <Badge 
                        variant={session.status === 'active' ? 'default' : 'secondary'}
                        className={session.status === 'active' ? 'bg-success' : ''}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Class: {session.class} • {session.time}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="teacher-outline"
                      size="sm"
                      onClick={() => handleManualAttendance(session)}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Manual
                    </Button>
                    <Button
                      variant="teacher"
                      size="sm"
                      onClick={() => handleGenerateQR(session)}
                    >
                      <QrCode className="h-4 w-4 mr-1" />
                      Generate QR
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;