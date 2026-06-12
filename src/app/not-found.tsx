import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-normal">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page may have moved or the item is no longer available.</p>
      <Button asChild className="mt-6"><Link href="/">Go home</Link></Button>
    </main>
  );
}
