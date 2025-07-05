"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Register() {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [reEnteredPass, setReEnteredPass] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (password !== reEnteredPass) {
      setMessage("Password do not match");
      return;
    }

    fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: userName,
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data.msg?.toLowerCase().includes("email") &&
          data.msg.includes("taken")
        ) {
          setMessage("Email already taken.");
        } else if (
          data.msg?.toLowerCase().includes("username") &&
          data.msg.includes("taken")
        ) {
          setMessage("Username already taken.");
        } else if (data.msg?.toLowerCase().includes("created successfully")) {
          setMessage("Registered successfully!");
          setTimeout(() => {
            router.push("/auth/login");
          }, 1000);
        } else {
          setMessage(data.msg || "Registration failed.");
        }
      });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center">
        <Card className="px-8 py-8">
          <form onSubmit={handleSubmit}>
            <CardTitle className="py-3">Register Page</CardTitle>

            <Label className="my-2">Username</Label>
            <Input
              placeholder="Enter username "
              onChange={(e) => setUserName(e.target.value)}
            />
            <Label className="my-2">Email</Label>

            <Input
              placeholder="Enter email "
              onChange={(e) => setEmail(e.target.value)}
            />
            <Label className="my-2">Password</Label>

            <Input
              placeholder="Enter password "
              onChange={(e) => setPassword(e.target.value)}
            />
            <Label className="my-2">Re-Enter Password</Label>

            <Input
              placeholder="Re-enter password "
              onChange={(e) => setReEnteredPass(e.target.value)}
            />
            <Button className="my-2" type="submit">
              Submit
            </Button>
            <CardDescription>
              Already created an account? <Link className="underline" href="/auth/login">Login</Link>
            </CardDescription>
            {message ? (
              <p
                className={`mt-2 ${
                  message.includes("successfully")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>
        </Card>
      </div>
    </>
  );
}
