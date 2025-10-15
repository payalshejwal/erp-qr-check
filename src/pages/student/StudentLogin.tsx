import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </button>

        {/* Login Card */}
        <div className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center border border-border/50">
              <GraduationCap className="h-8 w-8 text-foreground" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-1">Student Portal</h1>
            <p className="text-sm text-muted-foreground">Smart Attendance Tracker</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                required
              />
              <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Forgot password
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium py-6 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;