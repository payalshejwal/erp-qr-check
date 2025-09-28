import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, ArrowLeft } from "lucide-react";
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
      if (username === "student" && password === "password") {
        toast({
          title: "Login Successful",
          description: "Welcome to the Student Portal!",
        });
        navigate("/student/dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Try student/password",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-student-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="w-full border-student/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-student-soft rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-student" />
            </div>
            <CardTitle className="text-2xl text-student">Student Login</CardTitle>
            <CardDescription>
              Access the student portal to mark attendance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Student ID</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your student ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                  required
                />
              </div>
              <Button
                type="submit"
                variant="student"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-4 p-3 bg-muted rounded-md text-sm text-muted-foreground">
              <strong>Demo Credentials:</strong><br />
              Student ID: student<br />
              Password: password
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentLogin;