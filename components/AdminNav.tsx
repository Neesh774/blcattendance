import Image from "next/image";
import NewAppointment from "./NewAppointment";
import NewStudent from "./NewStudent";
import NewEvent from "./NewEvent";

export default function AdminNav() {
  return (
    <nav className="flex flex-row justify-between items-center px-4 py-1 bg-red-900 border-b-2 border-zinc-300">
      <div className="flex flex-row items-center">
        <Image alt="Logo" width={40} height={40} src="/favicon.png" />
        <h1 className="text-2xl font-medium font-serif text-white ml-2">
          BLC Attendance
        </h1>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <NewEvent />
        <NewAppointment />
        <NewStudent />
        <span className="font-display text-lg ml-4 font-medium text-amber-400">
          ADMIN
        </span>
      </div>
    </nav>
  );
}
