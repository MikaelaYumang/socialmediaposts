"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import PostManager from "@/components/snippets/postManager";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;
  const router = useRouter();

  useEffect(() => {
    async function fetchUsername() {
      try {
        const response = await fetch(`${BASE_URL}/home`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUsername(data.username);
        } else {
          setUsername("");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUsername("");
      }
    }
    fetchUsername();
  }, [BASE_URL]);

  const handleLogout = async () => {
    const response = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      setOpen(false); // close dialog if you have a state `open`
      router.push("/auth/login");
    } else {
      console.error("Logout failed");
    }
  };

  return (
    <>
      <div className="mb-24">
        <Card className="top-0 w-full flex flex-row justify-between p-3 fixed">
          <div>
            <Label>Welcome, {username}</Label>
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Settings</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/change-password">Change Password</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setOpen(true)}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Logout?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently log you out.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <PostManager />
      </div>
    </>
  );
}
