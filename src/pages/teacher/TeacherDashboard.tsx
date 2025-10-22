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
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showManualAttendance, setShowManualAttendance] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLecture, setNewLecture] = useState({
    subject: "",
    class: "",
    startTime: "",
    endTime: "",
    day: format(new Date(), 'EEEE')
  });
  const [timetable, setTimetable] = useState<Array<{
    id: string;
    subject: string;
    class_name: string;
    start_time: string;
    end_time: string;
    day_of_week: string;
    status?: string;
  }>>([]);

  // Load lectures from database
  useEffect(() => {
    const loadLectures = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = format(new Date(), 'EEEE');
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('teacher_id', user.id)
        .eq('day_of_week', today)
        .order('start_time');

      if (error) {
        console.error('Error loading lectures:', error);
        return;
      }

      if (data) {
        setTimetable(data.map(lecture => ({
          ...lecture,
          status: getSessionStatus(lecture.start_time, lecture.end_time)
        })));
      }
    };

    loadLectures();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('lectures-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lectures'
        },
        () => {
          loadLectures();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Function to check if current time is past the session start time
  const getSessionStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const sessionStart = startHour * 60 + startMin;
    
    // Session is active from start time till end of day
    if (currentTime >= sessionStart) {
      return "active";
    }
    return "upcoming";
  };

  // Update session statuses every minute
  useEffect(() => {
    const updateStatuses = () => {
      setTimetable(prev => prev.map(session => ({
        ...session,
        status: getSessionStatus(session.start_time, session.end_time)
      })));
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [timetable.length]);

  const handleAddLecture = async () => {
    if (!newLecture.subject || !newLecture.class || !newLecture.startTime || !newLecture.endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to add lectures",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('lectures')
      .insert({
        teacher_id: user.id,
        subject: newLecture.subject,
        class_name: newLecture.class,
        start_time: newLecture.startTime,
        end_time: newLecture.endTime,
        day_of_week: newLecture.day
      });

    if (error) {
      console.error('Error adding lecture:', error);
      toast({
        title: "Error",
        description: "Failed to add lecture",
        variant: "destructive"
      });
      return;
    }

    setNewLecture({ subject: "", class: "", startTime: "", endTime: "", day: format(new Date(), 'EEEE') });
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
    <div className="min-h-screen bg-gradient-to-br from-background via-teacher-soft/20 to-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teacher to-teacher-accent bg-clip-text text-transparent">Teacher Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your classes and track attendance</p>
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
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={newLecture.startTime}
                      onChange={(e) => setNewLecture({ ...newLecture, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={newLecture.endTime}
                      onChange={(e) => setNewLecture({ ...newLecture, endTime: e.target.value })}
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
          <Card className="border-l-4 border-l-teacher hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Classes</CardTitle>
              <div className="p-2 bg-teacher/10 rounded-lg">
                <Clock className="h-5 w-5 text-teacher" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{timetable.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {timetable.filter(s => s.status === 'active').length} active, {timetable.filter(s => s.status === 'upcoming').length} upcoming
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-success hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <div className="p-2 bg-success/10 rounded-lg">
                <Users className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">156</div>
              <p className="text-xs text-muted-foreground mt-1">Across all classes</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">87%</div>
              <p className="text-xs text-muted-foreground mt-1">This semester</p>
            </CardContent>
          </Card>
        </div>

        {/* Timetable */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Today's Schedule</CardTitle>
            <CardDescription>Manage attendance for your classes</CardDescription>
          </CardHeader>
          <CardContent>
            {timetable.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No lectures scheduled for today</p>
                <p className="text-sm mt-2">Click "Add Lecture" to create a new lecture</p>
              </div>
            ) : (
              <div className="space-y-3">
              {timetable.map((session) => (
                <div
                  key={session.id}
                  className="group flex items-center justify-between p-5 border-2 rounded-xl hover:border-teacher/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{session.subject}</h3>
                      <Badge 
                        variant={session.status === 'active' ? 'default' : 'secondary'}
                        className={session.status === 'active' ? 'bg-success text-white px-3 py-1' : 'px-3 py-1'}
                      >
                        {session.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <span className="font-medium">Class: {session.class_name}</span>
                      <span>•</span>
                      <span>{session.start_time} - {session.end_time}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleManualAttendance(session)}
                      className="group-hover:border-teacher group-hover:text-teacher"
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;