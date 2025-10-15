import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GraduationCap, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <GraduationCap className="h-10 w-10 text-primary mr-3" />
            <h1 className="text-4xl font-bold text-foreground">Smart Attendance System</h1>
          </div>
        </div>

        {/* Portal Selection */}
        <div className="grid gap-8">
          {/* Teacher Portal Card */}
          <Card className="bg-card/50 backdrop-blur border-border/50 p-8 hover:bg-card/70 transition-all duration-300">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center border border-border/50">
                <User className="h-10 w-10 text-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Teacher Portal</h2>
              <Button 
                onClick={() => navigate('/teacher/login')}
                className="w-40 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Login
              </Button>
              <button className="text-sm text-primary hover:underline">
                Create an account
              </button>
            </div>
          </Card>

          {/* Student Portal Card */}
          <Card className="bg-card/50 backdrop-blur border-border/50 p-8 hover:bg-card/70 transition-all duration-300">
            <div className="flex flex-col items-center space-y-6">
              <div className="w-20 h-20 bg-card rounded-2xl flex items-center justify-center border border-border/50">
                <GraduationCap className="h-10 w-10 text-foreground" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground">Student Portal</h2>
              <Button 
                onClick={() => navigate('/student/login')}
                className="w-40 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Login
              </Button>
              <button className="text-sm text-primary hover:underline">
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