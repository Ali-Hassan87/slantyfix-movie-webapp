"use client";
import { useRouter } from "next/navigation";
import ErrorState from "@/components/ErrorState";

export default function Error({ error, reset }) {
  const router = useRouter();
  return (
    <ErrorState
      message={error.message || "An unexpected error occurred."}
      buttonLabel="Go Home"
      onAction={() => router.push("/")}
    />
  );
}