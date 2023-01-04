import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Image from "next/image";
import { Appointment, User } from "../utils/types";
import Schedule from "../components/Schedule";
import { GetServerSideProps } from "next";
import Students from "../components/Students";
import { Plus } from "lucide-react";
import NewAppointment from "../components/NewAppointment";
import toast from "react-hot-toast";
import supabase from "../utils/client";
import NewStudent from "../components/NewStudent";
import useStudents from "../utils/useStudents";
import useAppointments from "../utils/useAppointments";

export default function Dashboard({
  section,
}: {
  section: "schedule" | "users" | undefined;
}) {
  const users = useStudents();
  const appointments = useAppointments();

  return (
    <div className="bg-zinc-100 flex flex-col h-screen">
      <nav className="flex flex-row justify-between items-center px-4 py-1 h-14 bg-red-900 border-b-2 border-zinc-300">
        <div className="flex flex-row items-center">
          <Image alt="Logo" width={40} height={40} src="/favicon.png" />
          <h1 className="text-2xl font-medium font-serif text-white ml-2">
            BLC Attendance
          </h1>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <NewAppointment />
          <NewStudent />
          <span className="font-display text-lg ml-4 font-medium text-amber-400">
            ADMIN
          </span>
        </div>
      </nav>
      <div className="flex flex-row flex-grow w-full h-[calc(100vh-3.5rem)]">
        <Sidebar section={section} />
        <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden">
          {section === "schedule" ? (
            <Schedule appointments={appointments} />
          ) : (
            <Students students={users} />
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      section: context.query.s
        ? (context.query.s as "schedule" | "users")
        : "schedule",
    },
  };
};
