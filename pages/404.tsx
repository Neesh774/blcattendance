import Image from "next/image";
import Link from "next/link";
import AdminNav from "../components/AdminNav";

export default function NotFound() {
  return (
    <div className="h-screen bg-zinc-100 flex flex-col">
      <AdminNav />
      <div className="flex flex-col gap-4 flex-grow justify-center items-center">
        <h1 className="text-5xl font-bold font-display text-red-900">
          404 - Page Not Found
        </h1>
        <p className="text-lg font-medium">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/admin"
          className="underline underline-offset-2 text-red-800"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
