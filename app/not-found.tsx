import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-balance sm:text-3xl">
        Sahifa topilmadi
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Siz qidirayotgan maqola yoki sahifa mavjud emas yoki ko&apos;chirilgan
        bo&apos;lishi mumkin.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
      >
        <ArrowLeft className="size-3.5" aria-hidden="true" />
        Bosh sahifaga qaytish
      </Link>
    </div>
  );
}
