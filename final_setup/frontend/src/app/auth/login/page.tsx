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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
// import { useAuth } from "@/app/(hooks)/AuthContext";
import ForgotPassword from "@/components/snippets/forgotPassword";

export default function Login() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;
  // const { fetchUser } = useAuth();
  const router = useRouter();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");

  const handleSubmitLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setLoginMessage("Logged in successfully! Redirecting...");
        // await fetchUser();
        router.push("/home");
      } else {
        if (data.msg === "User email not found") {
          setLoginMessage("User email not found");
        } else if (data.msg === "Password not matched") {
          setLoginMessage("Password not matched");
        } else {
          setLoginMessage("Login failed");
        }
      }
    } catch (error) {
      setLoginMessage("Something went wrong. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <Card className="px-7 py-10">
          <form onSubmit={handleSubmitLogin}>
            <div>
              <CardTitle className="py-2">Login Page</CardTitle>
              <Label className="my-2">Email</Label>
              <Input
                placeholder="Enter your email"
                onChange={(e) => setLoginEmail(e.target.value)}
              />
              <Label className="my-2">Password</Label>
              <Input
                placeholder="Enter your password "
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <ForgotPassword />

              <Button type="submit" className="my-2">
                Login
              </Button>
              <CardDescription>
                No account yet?{" "}
                <Link className="underline" href="/auth/register">
                  Register here
                </Link>
              </CardDescription>
              {loginMessage && (
                <CardDescription
                  className={`mt-1 ${
                    loginMessage.includes("successfully")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {loginMessage}
                </CardDescription>
              )}
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
