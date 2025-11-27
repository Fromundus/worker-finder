import { CheckCircle, Info, XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "@/api/axios";
import InputWithLabel from "@/components/custom/InputWithLabel";
import { Label } from "@/components/ui/label";
import ButtonWithLoading from "@/components/custom/ButtonWithLoading";

export default function EmailVerification() {
  const [qs] = useSearchParams();
  const navigate = useNavigate();

  const status = qs.get("status");
  const emailFromQuery = qs.get("email") || "";

  const [email, setEmail] = useState(emailFromQuery);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const resendVerification = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/email/resend", { email });
      console.log(res);
      setMessage(res.data.message);
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className="mx-auto h-12 w-12 text-green-500" />,
          title: "Email Verified",
          description: "Your email has been successfully verified. You can now log in to your account.",
          action: (
            <Button className="w-fit" onClick={() => navigate("/login")}>
              Login
            </Button>
          ),
        };
      case "already_verified":
        return {
          icon: <Info className="mx-auto h-12 w-12 text-blue-500" />,
          title: "Already Verified",
          description: "This email address has already been verified. Please log in to continue.",
          action: (
            <Button className="w-fit" onClick={() => navigate("/login")}>
              Login
            </Button>
          ),
        };
      case "invalid":
      default:
        return {
          icon: <XCircle className="mx-auto h-12 w-12 text-red-500" />,
          title: "Invalid or Expired Link",
          description: "Your verification link is invalid or has expired. Enter your email below to receive a new verification link.",
          action: (
            <div className="space-y-4">
              <div className="flex flex-col gap-3 items-start">
                <Label htmlFor="email">
                  Email
                </Label>
                <Input
                  id="email"
                  className="text-foreground"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <ButtonWithLoading
                loading={loading}
                onClick={resendVerification}
                disabled={loading || !email}
                className="w-full"
              >
                Resend Verification Link
              </ButtonWithLoading>
              {message &&
                <>
                  <p className="text-sm text-muted-foreground">{message}</p>
                  <Button className="w-fit" onClick={() => navigate("/login")}>
                    Login
                  </Button>
                </>
              }
            </div>
          ),
        };
    }
  };

  const { icon, title, description, action } = renderContent();

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="card-electric max-w-lg mx-auto w-full text-sm">
        <CardHeader className="text-center">
          {icon}
          <CardTitle className="mt-4 text-2xl font-bold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center text-muted-foreground">
          <p>{description}</p>
          {action}
        </CardContent>
      </Card>
    </div>
  );
}
