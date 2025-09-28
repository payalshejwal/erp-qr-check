import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Save, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ManualAttendanceProps {
  session: {
    id: number;
    subject: string;
    class: string;
    time: string;
    day: string;
  };
  onBack: () => void;
}

const ManualAttendance = ({ session, onBack }: ManualAttendanceProps) => {
  const { toast } = useToast();
  
  // Mock student data
  const [students] = useState([
    { id: 1, name: "Alice Johnson", rollNo: "CS001", present: false },
    { id: 2, name: "Bob Smith", rollNo: "CS002", present: true },
    { id: 3, name: "Charlie Brown", rollNo: "CS003", present: false },
    { id: 4, name: "Diana Prince", rollNo: "CS004", present: true },
    { id: 5, name: "Eve Wilson", rollNo: "CS005", present: false },
    { id: 6, name: "Frank Miller", rollNo: "CS006", present: true },
    { id: 7, name: "Grace Lee", rollNo: "CS007", present: false },
    { id: 8, name: "Henry Davis", rollNo: "CS008", present: true },
    { id: 9, name: "Ivy Chen", rollNo: "CS009", present: false },
    { id: 10, name: "Jack Thompson", rollNo: "CS010", present: true },
  ]);

  const [attendance, setAttendance] = useState<Record<number, boolean>>(
    students.reduce((acc, student) => {
      acc[student.id] = student.present;
      return acc;
    }, {} as Record<number, boolean>)
  );

  const handleAttendanceChange = (studentId: number, checked: boolean) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: checked
    }));
  };

  const handleSaveAttendance = () => {
    const presentCount = Object.values(attendance).filter(Boolean).length;
    const totalStudents = students.length;
    
    toast({
      title: "Attendance Saved",
      description: `${presentCount}/${totalStudents} students marked present`,
    });
  };

  const handleMarkAll = (present: boolean) => {
    const newAttendance = students.reduce((acc, student) => {
      acc[student.id] = present;
      return acc;
    }, {} as Record<number, boolean>);
    setAttendance(newAttendance);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const attendancePercentage = Math.round((presentCount / students.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-teacher-soft">
      <div className="container mx-auto p-6">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-teacher flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Manual Attendance
              </CardTitle>
              <CardDescription>
                Mark attendance manually for {session.subject} - {session.class}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Session Info */}
              <div className="bg-teacher-soft p-4 rounded-lg">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div><strong>Subject:</strong> {session.subject}</div>
                  <div><strong>Class:</strong> {session.class}</div>
                  <div><strong>Time:</strong> {session.time}</div>
                  <div><strong>Day:</strong> {session.day}</div>
                </div>
              </div>

              {/* Attendance Summary */}
              <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                <div>
                  <h3 className="font-semibold">Attendance Summary</h3>
                  <p className="text-sm text-muted-foreground">
                    {presentCount} of {students.length} students present ({attendancePercentage}%)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll(true)}>
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleMarkAll(false)}>
                    Mark All Absent
                  </Button>
                </div>
              </div>

              {/* Student List */}
              <div className="space-y-2">
                <h3 className="font-semibold mb-4">Student List</h3>
                <div className="grid gap-2">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center space-x-3 p-3 bg-card border rounded-lg hover:shadow-sm transition-shadow"
                    >
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={attendance[student.id] || false}
                        onCheckedChange={(checked) => 
                          handleAttendanceChange(student.id, checked as boolean)
                        }
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              attendance[student.id] 
                                ? 'bg-success text-success-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {attendance[student.id] ? 'Present' : 'Absent'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t">
                <Button variant="teacher" onClick={handleSaveAttendance}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManualAttendance;