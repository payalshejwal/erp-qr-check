import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { GraduationCap, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const StudentLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (username === "student" && password === "student123") {
        toast({
          title: "Login Successful",
          description: "Welcome to the Student Portal!",
        });
        navigate("/student/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Try student/student123",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-student-soft/10 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-sm text-muted-foreground hover:text-student mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </button>

        {/* Login Card */}
        <Card className="border-2 shadow-2xl shadow-student/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-student/5 to-transparent pointer-events-none" />
          <div className="relative p-8">
            {/* Header */}
            <div className="flex items-center justify-center mb-8">
              <div className="w-20 h-20 bg-student/10 rounded-full flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-student" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Student Portal</h1>
              <p className="text-sm text-muted-foreground">Sign in to track your attendance</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                  required
                />
                <button type="button" className="text-xs text-muted-foreground hover:text-student transition-colors">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                variant="student"
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StudentLogin;