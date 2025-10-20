import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary-soft/10 to-background flex items-center justify-center p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-2xl">
              <GraduationCap className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-student bg-clip-text text-transparent">
            Smart Attendance System
          </h1>
          <p className="text-lg text-muted-foreground">Choose your portal to get started</p>
        </div>

        {/* Portal Selection */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Teacher Portal Card */}
          <Card className="group relative overflow-hidden border-2 hover:border-teacher/50 transition-all duration-300 hover:shadow-2xl hover:shadow-teacher/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-teacher/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center space-y-6 p-8">
              <div className="w-20 h-20 bg-teacher/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <User className="h-10 w-10 text-teacher" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Teacher Portal</h2>
                <p className="text-sm text-muted-foreground">Manage classes and attendance</p>
              </div>
              <Button 
                onClick={() => navigate('/teacher/login')}
                variant="teacher"
                className="w-full"
              >
                Login
              </Button>
              <button 
                onClick={() => navigate('/teacher/signup')}
                className="text-sm text-teacher hover:underline transition-all"
              >
                Create an account
              </button>
            </div>
          </Card>

          {/* Student Portal Card */}
          <Card className="group relative overflow-hidden border-2 hover:border-student/50 transition-all duration-300 hover:shadow-2xl hover:shadow-student/20 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-student/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center space-y-6 p-8">
              <div className="w-20 h-20 bg-student/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <GraduationCap className="h-10 w-10 text-student" />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Student Portal</h2>
                <p className="text-sm text-muted-foreground">Track attendance and scan QR codes</p>
              </div>
              <Button 
                onClick={() => navigate('/student/login')}
                variant="student"
                className="w-full"
              >
                Login
              </Button>
              <button 
                onClick={() => navigate('/student/signup')}
                className="text-sm text-student hover:underline transition-all"
              >
                Create an account
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;