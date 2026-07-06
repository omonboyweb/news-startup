import type { Metadata } from "next";

import { loginAction } from "@/lib/admin/actions";

export const metadata: Metadata = {
  title: "Kirish · Admin",
  robots: { index: false, follow: false },
};

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <h1 className="text-2xl font-bold tracking-tight">Muharrir paneli</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Davom etish uchun admin parolini kiriting.
      </p>

      <form action={loginAction} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium">
            Parol
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:border-foreground/40"
          />
        </div>

        {error ? (
          <p className="text-sm text-red-600">Parol noto&apos;g&apos;ri.</p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Kirish
        </button>
      </form>
    </div>
  );
}
