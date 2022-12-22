import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { Appointment } from "../utils/types";
import Schedule from "../components/Schedule";

export default function Dashboard() {
  const [section, setSection] = useState<"schedule" | "users">("schedule");
  const [appointments, setAppointments] = useState<Appointment[] | undefined>(
    undefined
  );
  const [users, setUsers] = useState<Appointment[] | undefined>(undefined);

  return (
    <div className="h-full min-h-screen bg-zinc-100 flex flex-col">
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
      <div className="flex flex-row flex-grow w-full">
        <Sidebar section={section} setSection={setSection} />
        <div className="flex flex-col w-full overflow-x-hidden">
          {section === "schedule" ? (
            <Schedule
              appointments={appointments}
              setAppointments={setAppointments}
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
