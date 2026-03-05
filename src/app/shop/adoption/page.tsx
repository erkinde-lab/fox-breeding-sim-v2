"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdoptionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to NPC Kennel where foundation foxes are now located
    router.replace("/npc-kennel");
  }, [router]);

  return (
    <div className="space-y-8">
      <div>
        <h1
          className="text-4xl font-folksy text-foreground tracking-tight"
          style={{ fontWeight: 400 }}
        >
          Foundation Fox Adoption
        </h1>
        <p className="text-muted-foreground mt-2">
          Redirecting to NPC Kennel...
        </p>
      </div>
    </div>
  );
}
