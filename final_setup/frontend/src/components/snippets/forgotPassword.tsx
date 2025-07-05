"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const ForgotPassword = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;
  const [emailState, setEmailState] = useState("");
  const [message, setMessage] = useState("");
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isOTPDialogOpen, setIsOTPDialogOpen] = useState(false);
  const [OTPState, setOTPState] = useState("");
  const router = useRouter();
  const [ loading, setLoading] = useState(false);

  useEffect(() => {
  if (isOTPDialogOpen) {
    setMessage("");
    setLoading(false);
    setOTPState(""); // Clear OTP input on open
  }
  if (isEmailDialogOpen) {
    setMessage("");
    setLoading(false);
  }
}, [isOTPDialogOpen, isEmailDialogOpen]);


  const submitClickOTP = async (e: any) => {
    e.preventDefault();
    if (!emailState) {
      setMessage("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailState,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("OTP sent to your email!");
        setIsEmailDialogOpen(false);
        setIsOTPDialogOpen(true);
      } else {
        setMessage("Failed to send OTP");
      }
    } catch (error) {
      setMessage("An error occurred sending OTP");
    }
  };

  const verifyOTP = async (e: any) => {
    e.preventDefault();

    if (OTPState.length !== 6) {
      setMessage("Please enter a 6-digit OTP");
      return;
    }

    setLoading(true)

    try {
      const response = await fetch(`${BASE_URL}/verify-otp`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: emailState,
    otp: OTPState,
  }),
  credentials: "include",  // **Important! Add this!**
});

      const data = await response.json();

      if (response.ok) {
        setMessage("OTP verified successfully!");
        setIsOTPDialogOpen(false);
        router.push("/reset-password");
      } else {
        setMessage("OTP verification failed");
      }
    } catch (error) {
      setMessage("An error occurred during OTP verification");
    }
  };

  return (
    <>
      {/* OTP */}
      <CardDescription className="mt-1">
        <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
          <DialogTrigger asChild>
            <CardDescription className="underline">
              Forgot Password?
            </CardDescription>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Forgot Password?</DialogTitle>
              <DialogDescription>Send email for verification</DialogDescription>
            </DialogHeader>
            <div className="grid py-2">
              <Input
                className="w-full"
                placeholder="Send email"
                onChange={(e) => setEmailState(e.target.value)}
              />
            </div>

<p
  className={`text-center mb-2 ${
    message === "OTP verified successfully!" ||
    message === "OTP sent to your email!"
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {message}
</p>
            <DialogFooter>
              <Button type="submit" onClick={submitClickOTP} disabled={loading}>
                

                  {loading ? "Sending..." : "Submit"}

              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardDescription>

      <CardDescription className="mt-1">
        <Dialog open={isOTPDialogOpen} onOpenChange={setIsOTPDialogOpen}>
          
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Forgot Password?</DialogTitle>
              <DialogDescription>
                Type the 6-digit OTP sent to your email
              </DialogDescription>
            </DialogHeader>
            <div className="grid justify-center py-4">
              <InputOTP maxLength={6} onChange={(value) => setOTPState(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
<p
  className={`text-center mb-2 ${
    message === "OTP verified successfully!" ||
    message === "OTP sent to your email!"
      ? "text-green-600"
      : "text-red-600"
  }`}
>
  {message}
</p>
            <DialogFooter>
              <Button type="submit" onClick={verifyOTP} disabled={loading}>
                {loading ? "Sending..." : "Submit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardDescription>
    </>
  );
};

export default ForgotPassword;
