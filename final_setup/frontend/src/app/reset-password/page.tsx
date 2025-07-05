"use client"

import { Card, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
    const [ newPasswordState, setNewPasswordState ] = useState("");
    const [ newRePasswordState, setNewRePasswordState ] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;
    const router = useRouter();

    const resetPass = async (e: any) => {
        e.preventDefault();

        if (newPasswordState !== newRePasswordState) {
            setMessage("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                credentials: "include",
                body: JSON.stringify({
                    password: newPasswordState
                })
            })

            const data = await response.json();

            if (response.ok) {
                setMessage("Password Reset Successfully!")
                setNewPasswordState("");
setNewRePasswordState("");

                setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
            }
        } catch (error) {
            setMessage("Error changing password")
        } finally {
    setLoading(false);
  }
    }
  return (
    <>
      <div className="min-h-screen grid justify-center items-center">
        <form onSubmit={resetPass}>
          <Card className="py-5 px-10">
            <CardTitle>Reset Password</CardTitle>
            <Label>New Password</Label>
            <Input type="password" placeholder="Enter new password" value={newPasswordState} onChange={(e) => setNewPasswordState(e.target.value)}/>

            <Label>Re-Enter New Password</Label>
            <Input type="password" placeholder="Re-Enter new password" value={newRePasswordState} onChange={(e) => setNewRePasswordState(e.target.value)}/>

            {message && <p className={`${
                  message === "Password Reset Successfully!"
                    ? "text-green-600"
                    : "text-red-600"
            }`}>{message}</p>}

            <Button type="submit" disabled={loading}> {loading ? "Sending..." : "Save Changes"}</Button>
          </Card>
        </form>
      </div>
    </>
  );
}
