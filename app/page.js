import { Button } from "@/components/ui/button";
import { UserButton } from "@stackframe/stack";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center mt-10">
        Welcome to AI Counsellor
      </h1>
      <Button variant="destructive">Subscribe</Button>
      <UserButton/>
    </div>
    
  );
}
