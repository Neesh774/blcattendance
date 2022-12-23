import { GetServerSideProps } from "next";
import supabase from "../../utils/client";
import { Appointment } from "../../utils/types";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { useState } from "react";
import { ChevronDown, ChevronRight, User } from "lucide-react";
import Table from "../../components/base/Table";
import UserAppointments from "../../components/UserAppointments";
import Link from "next/link";
import getTagColor from "../../utils/getTagColor";

export default function Student({ appointment }: { appointment: Appointment }) {
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
        <Sidebar section={undefined} />
        <div className="w-full">
          <div className="px-4 mx-auto flex flex-col gap-2 mt-12 w-full lg:px-0 lg:w-3/5 2xl:w-2/5">
            <h1 className="text-4xl font-bold font-display text-text-500 mb-4">
              {appointment.topic}
            </h1>
            <table className="w-full">
              <tr className="items-center gap-8">
                <td className="py-1 text-lg font-medium font-display text-text-500">
                  Student
                </td>
                <td>
                  <Link
                    href={`/students/${appointment.user.id}`}
                    className="flex flex-row w-fit items-center gap-2 px-2 py-1 hover:bg-zinc-200/70 rounded-md"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-lg font-medium font-display text-text-500">
                      {appointment.user.student_first}{" "}
                      {appointment.user.student_last}
                    </span>
                  </Link>
                </td>
              </tr>
              {appointment.instructor && (
                <tr className="items-center gap-8">
                  <td className="py-1 text-lg font-medium font-display text-text-500">
                    Instructor
                  </td>
                  <td>{appointment.instructor}</td>
                </tr>
              )}
              <tr className="items-center gap-8">
                <td className="py-1 text-lg font-medium font-display text-text-500">
                  Status
                </td>
                <td>
                  <span
                    className={`font-medium px-2 py-1 rounded-md capitalize font-display text-text-500 ${getTagColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status}
                  </span>
                </td>
              </tr>
            </table>
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold font-display text-text-500 mb-4">
                Notes
              </h1>
              <p className="text-text-300 rounded-md bg-zinc-200/50 p-4">
                {appointment.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Params = {
  id: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
  const { data, error } = await supabase
    .from("appointments")
    .select(
      `
      *,
      user (
        *
      )`
    )
    .eq("id", id)
    .single();
  if (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      appointment: data,
    },
  };
};
