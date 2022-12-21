import { Calendar, Users } from "lucide-react";

export default function Sidebar({
  section,
  setSection,
}: {
  section: "schedule" | "users";
  setSection: (section: "schedule" | "users") => void;
}) {
  return (
    <div className="flex flex-col w-fit bg-zinc-200/50 pl-2 py-2 gap-2">
      <button
        onClick={() => setSection("schedule")}
        className={`flex flex-row gap-2 items-center px-2 py-2 transition-all duration-200 rounded-md rounded-r-none ${
          section === "schedule" ? "bg-cyan-400/40" : "hover:bg-cyan-400/30"
        }`}
      >
        <Calendar className="text-cyan-600" />
      </button>
      <button
        onClick={() => setSection("users")}
        className={`flex flex-row gap-2 items-center px-2 py-2 transition-all duration-200 rounded-md rounded-r-none ${
          section === "users" ? "bg-emerald-400/40" : "hover:bg-emerald-400/20"
        }`}
      >
        <Users className="text-emerald-600" />
      </button>
    </div>
  );
}
