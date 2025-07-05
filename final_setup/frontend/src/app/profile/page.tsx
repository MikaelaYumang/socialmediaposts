"use client";
import React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

export default function Profile() {
  interface Profile {
    bio: string;
    location: string;
    user: {
      username: string;
      email: string;
    };
  }
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const getProfile = async () => {
    try {
      const response = await fetch(`${BASE_URL}/profile`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data);
      } else {
        console.error(data);
      }
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getProfile();
  }, [BASE_URL]);

  const editProfileClick = async () => {
    setLoading(true);
    const response = await fetch(`${BASE_URL}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        bio: bio || profile?.bio,
        location: location || profile?.location,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      getProfile();
      setOpen(false);
      setLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="w-full min-h-[35vh] grid justify-center items-center">
          <Card className="bg-secondary min-h-[30vh] lg:min-w-[195vh] p-5 gap-1 sm:min-w-[95vh]">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col gap-1">
                <CardTitle>{profile?.user.username}</CardTitle>
                <CardDescription>{profile?.user.email}</CardDescription>
              </div>
              <Button onClick={() => router.back()}>Back</Button>
            </div>

            <div className="flex flex-row">
              <Label className="mr-1">Bio: </Label>
              <span> {profile?.bio}</span>
            </div>

            <div className="flex flex-row">
              <Label className="mr-1">Location: </Label>
              <span> {profile?.location}</span>
            </div>

            <div className="flex flex-row">
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger>
                  <Card className="px-10 py-3 text-primary-foreground bg-primary hover:bg-primary/90 cursor-pointer">
                    <CardTitle>Edit Profile</CardTitle>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile?</DialogTitle>
                    <Label className="my-2">Enter bio</Label>
                    <Input
                      type="text"
                      placeholder={profile?.bio}
                      onChange={(e) => setBio(e.target.value)}
                    />
                    <Label className="my-2">Enter Location</Label>

                    <Input
                      type="text"
                      placeholder={profile?.location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                    <div className="flex flex-row justify-end">
                      <Button
                        className="mt-3"
                        onClick={editProfileClick}
                        disabled={loading}
                      >
                        {loading ? "Loading" : "Save Changes"}
                      </Button>
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
        <Card className="w-full min-h-[65vh] grid justify-center items-center">
          <Card className="bg-secondary min-h-[60vh] lg:min-w-[195vh] sm:min-w-[95vh] p-5">
            <CardTitle>My Posts</CardTitle>
          </Card>
        </Card>
      </div>
    </>
  );
}
