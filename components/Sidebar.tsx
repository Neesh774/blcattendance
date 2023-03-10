import { Calendar, CalendarRange, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar({
  section,
}: {
  section: "schedule" | "users" | "events" | undefined;
}) {
  return (
    <div className="flex flex-col w-fit bg-zinc-200/50 pl-2 py-2 gap-2">
      <Link
        href="/admin?s=schedule"
        className={`flex flex-row gap-2 items-center px-2 py-2 transition-all duration-200 rounded-md rounded-r-none ${
          section === "schedule" ? "bg-cyan-400/40" : "hover:bg-cyan-400/30"
        }`}
      >
        <Calendar className="text-cyan-600" />
      </Link>
      <Link
        href="/admin?s=users"
        className={`flex flex-row gap-2 items-center px-2 py-2 transition-all duration-200 rounded-md rounded-r-none ${
          section === "users" ? "bg-emerald-400/40" : "hover:bg-emerald-400/20"
        }`}
      >
        <Users className="text-emerald-600" />
      </Link>
      <Link
        href="/admin?s=events"
        className={`flex flex-row gap-2 items-center px-2 py-2 transition-all duration-200 rounded-md rounded-r-none ${
          section === "events" ? "bg-violet-400/40" : "hover:bg-violet-400/20"
        }`}
      >
        <CalendarRange className="text-violet-700" />
      </Link>
    </div>
  );
}
