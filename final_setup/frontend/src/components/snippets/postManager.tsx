"use client";

import { useEffect, useState } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const PostManager = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [postToDelete, setPostToDelete] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [ openEdit, setOpenEdit] = useState(false);
  const [ postToEdit, setPostToEdit] = useState<any>(null);
  const [ editedTitle, setEditedTitle] = useState("");
  const [ editedDescription, setEditedDescription] = useState("");



  const fetchPosts = async () => {
    const response = await fetch(`${BASE_URL}/post`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    if (response.ok) {
      setPosts(data.posts);
      setUserId(data.userId);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPostForm = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, description }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage("Post created successfully");
        setDialogOpen(false);
        setTitle("");
        setDescription("");
        fetchPosts();
        setTimeout(() => {
          setMessage("");
        }, 2000);
      }
    } catch (error: any) {
      console.log("Error creating post", error.message);
    }
  };

  const deletePost = async (post: any) => {
    try {
      const response = await fetch(`${BASE_URL}/post/${post.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Successfully deleted post!");
        setOpenDelete(false);
        fetchPosts();
      }
    } catch (error) {
      setMessage("Error deleting post");
    }
  };

  const editPost = async () => {
  if (!postToEdit) return;

  const response = await fetch(`${BASE_URL}/post/${postToEdit.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      title: editedTitle,
      description: editedDescription,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    setMessage("Successfully edited post");
    setOpenEdit(false);
    fetchPosts();
  }
};


  return (
    <>
      <div className="!fixed bottom-0 left-0 w-full flex justify-center items-center py-4 z-50">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger>
            <Card className="gap-2 py-2.5 px-20 text-primary-foreground bg-primary hover:bg-primary/90 cursor-pointer">
              <CardTitle>CREATE POST</CardTitle>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create post</DialogTitle>
              <DialogDescription>Title</DialogDescription>
              <Input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <DialogDescription>Description</DialogDescription>
              <Input
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </DialogHeader>
            <Button type="submit" onClick={createPostForm}>
              Create Post
            </Button>
            <p
              className={`text-center mb-2 ${
                message === "Post created successfully"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          </DialogContent>
        </Dialog>
      </div>

      <div className="min-h-4 top-15 w-full grid justify-center items-center fixed">
        <Card className="px-40 py-2 m-2">
          <CardTitle>POSTS</CardTitle>
        </Card>
      </div>

      <div className="min-h-auto grid justify-center items-center mt-25">
  {posts.map((post: any, index) => (
    <Card className="px-5 py-3 m-2 gap-2" key={index}>
      <div className="flex flex-row justify-between gap-20">
        <CardDescription className="p-0">
          {post.user.username} ({post.user.email})
        </CardDescription>

        {userId === post.user.id && (
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
      </div>

      <CardTitle>{post.title}</CardTitle>
      <Label>{post.description}</Label>
      <CardDescription><Link href={`/posts/${post.id}`} className="underline">View Details</Link></CardDescription>
    </Card>
  ))}
</div>


      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              post.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
          if (postToDelete) deletePost(postToDelete);
        }}
      >Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

       <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Post?</AlertDialogTitle>
          <AlertDialogDescription>
            Title
          </AlertDialogDescription>
          <Input
  type="text"
  value={editedTitle}
  onChange={(e) => setEditedTitle(e.target.value)}
/>
          <AlertDialogDescription>
            Description
          </AlertDialogDescription>
         <Input
  type="text"
  value={editedDescription}
  onChange={(e) => setEditedDescription(e.target.value)}
/>

        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
<AlertDialogAction onClick={editPost} disabled={!editedTitle || !editedDescription}>
  Continue
</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};

export default PostManager;
