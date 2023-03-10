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
import AdminNav from "../components/AdminNav";
import Events from "../components/Events";
import useEvents from "../utils/useEvents";

export default function Dashboard({
  section,
}: {
  section: "schedule" | "users" | undefined;
}) {
  const users = useStudents();
  const appointments = useAppointments();
  const events = useEvents();

  return (
    <div className="bg-zinc-100 flex flex-col h-screen">
      <AdminNav />
      <div className="flex flex-row flex-grow w-full h-[calc(100vh-3.5rem)]">
        <Sidebar section={section} />
        <div className="flex flex-col w-full overflow-y-auto overflow-x-hidden">
          {section === "schedule" ? (
            <Schedule appointments={appointments} />
          ) : section === "users" ? (
            <Students students={users} />
          ) : (
            <Events events={events} />
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
