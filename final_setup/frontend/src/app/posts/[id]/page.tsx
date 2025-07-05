"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import dayjs from "dayjs"

export default function PostDetailedPage() {
  const params = useParams();
  const id = params.id as string;
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent ] = useState("");
  const [ open, setOpen ] = useState(false);

  const fetchDetailedPost = async () => {
    const response = await fetch(`${BASE_URL}/post/${params.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (response.ok) {
      setTitle(data.title);
      setDescription(data.description);
      setUsername(data.user.username);
      setEmail(data.user.email);
    }
  };

  const fetchComments = async () => {
    const response = await fetch(`${BASE_URL}/comment/${params.id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();

    if (response.ok) {
      setComments(data.comments);
    }
  };

  const postComment = async () => {
    const response = await fetch(`${BASE_URL}/comment/${params.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        content: content
      })
  })
    const data = await response.json();
    if (response.ok) {
      fetchComments();
      setOpen(false);
    }
  }

  useEffect(() => {
    fetchDetailedPost();
    fetchComments();
  }, [BASE_URL]);
  return (
    <>
      <div className="min-h-auto grid justify-center mt-7">
        <Card className="px-35 py-7 m-2 gap-2">
          <div className="flex flex-row justify-between gap-20">
            <CardDescription className="p-0">
              {username} ({email})
            </CardDescription>

            {/* {userId === post.user.id && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Edit</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-24 !overflow-y-visible"
              align="start"
            >
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => {
  setPostToEdit(post);
  setEditedTitle(post.title);
  setEditedDescription(post.description);
  setOpenEdit(true);
}}
>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setOpenDelete(true);
                    setPostToDelete(post);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div> */}
          </div>
          <CardTitle>{title ?? "Loading..."}</CardTitle>
          <Label>{description ?? "Loading"}</Label>
          <div className="flex justify-between">
            <Button className="w-[7rem] bg-secondary text-primary hover:text-white">
              Like
            </Button>
            

            <Dialog open={open} onOpenChange={() => setOpen(true)}>
              <DialogTrigger className="w-[7rem] bg-secondary text-primary hover:text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive shadow-xs hover:bg-primary/90 h-9 px-4 py-2 has-[>svg]:px-3"> 
              Comment
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="gap-3">
              <DialogTitle>Post a comment?</DialogTitle>
                  <Label>Content</Label>
                  <Input type="text" placeholder="Enter comment here" onChange={(e) => setContent(e.target.value)}/>
                  <Button onClick={postComment}>Post comment</Button>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </Card>
        {comments.length > 0 ? (
          <Card className="px-10 py-7 m-1 gap-3">
            <CardTitle className="text-center">Comments</CardTitle>
            {comments.map((comment: any, index: number) => (
              <Card className="gap-0 px-20 mt-0" key={index}>
                <CardDescription>
                  {comment.user.username} ({comment.user.email})
                </CardDescription>
                <CardDescription className="mb-2">{dayjs(comment.createdAt).format("MMMM D, YYYY h:mm A")}</CardDescription>

                <CardTitle className=" font-medium">
                  {comment.content ?? "Loading.."}
                </CardTitle>
              </Card>
            ))}
          </Card>
        ) : (
          <Card>
            <CardTitle className="text-center">No comments posted</CardTitle>
          </Card>
        )}
      </div>
    </>
  );
}
