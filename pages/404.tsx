import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen bg-zinc-100 flex flex-col">
      <nav className="flex flex-row justify-between items-center px-4 py-1 bg-red-900 border-b-2 border-zinc-300">
        <div className="flex flex-row items-center">
          <Image alt="Logo" width={40} height={40} src="/favicon.png" />
          <h1 className="text-2xl font-medium font-serif text-white ml-2">
            BLC Attendance
          </h1>
        </div>
        <span className="font-display text-lg ml-4 font-medium text-amber-400">
          ADMIN
        </span>
      </nav>
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
