"use client"
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [ loading, setLoading ] = useState(false);
  const router = useRouter();

  const loadingClick = () => {
    setLoading(true);
    router.push("/auth/login");
  }
  return (
    <><div className="min-h-screen grid justify-center items-center">
      <Button className="my-2" disabled={loading} onClick={loadingClick}>{loading ? "Loading..." : "Login"}</Button>
    </div>
      
    </>
  );
}
