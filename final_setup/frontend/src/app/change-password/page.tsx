"use client";

// import { useAuth } from "@/app/(hooks)/AuthContext"; // adjust path

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function ChangePassword() {
  // const { user } = useAuth();

  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reEnteredNewPassword, setReEnteredNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;

  const backClick = () => {
    router.back();
  };

  const submitChangePass = async (e: any) => {
    e.preventDefault();

    // if (!user) return;

    // const userId = user.id;

    if (newPassword !== reEnteredNewPassword) {
      setMessage("New Entered Passwords don't match!");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/change-password/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },

        credentials: "include",
        body: JSON.stringify({
          password: newPassword,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage("Password changed successfully!");
      } else {
        setMessage("Failed to change password");
      }
    } catch (error) {
      setMessage("Error changing password");
    }
  };
  return (
    <>
      <Button className="absolute  ml-2 top-4" onClick={backClick}>
        Back
      </Button>

      <div className="min-h-screen grid justify-center items-center">
        <form onSubmit={submitChangePass}>
          <Card className="p-3">
            <CardTitle>Change Password</CardTitle>
            <Input
              type="password"
              placeholder="Enter Old Password"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Enter New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Re-Enter New Password"
              onChange={(e) => setReEnteredNewPassword(e.target.value)}
            />
            <Button type="submit">Change Password</Button>
            {message ? (
              <p
                className={`${
                  message === "Password changed successfully!"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            ) : null}
          </Card>
        </form>
      </div>
    </>
  );
}
