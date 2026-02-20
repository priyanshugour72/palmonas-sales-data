"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const message = searchParams.get("message");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 dark:bg-zinc-950">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <h1 className="text-center text-xl font-semibold text-slate-900 dark:text-white">
          Access denied
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {error === "DomainNotAllowed" && message
            ? decodeURIComponent(message)
            : "Only @palmonas.com email addresses are allowed to sign in."}
        </p>
        <Link
          href="/auth/signin"
          className="mt-6 block w-full rounded-lg bg-slate-900 py-3 text-center font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-100 dark:bg-zinc-950" />}>
      <ErrorContent />
    </Suspense>
  );
}
