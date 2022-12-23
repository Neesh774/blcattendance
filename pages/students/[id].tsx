import { GetServerSideProps } from "next";
import supabase from "../../utils/client";
import { Appointment, User } from "../../utils/types";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import Table from "../../components/base/Table";
import UserAppointments from "../../components/UserAppointments";
import dayjs from "dayjs";

export default function Student({
  user,
  appointments,
}: {
  user: User;
  appointments: Appointment[];
}) {
  const [studentDetailsHidden, setStudentDetailsHidden] = useState(false);
  const [parentDetailsHidden, setParentDetailsHidden] = useState(true);

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
          <div className="px-4 mx-auto flex flex-col gap-4 mt-12 w-full lg:px-0 lg:w-4/5 xl:w-3/5 2xl:w-2/5">
            <h1 className="text-4xl font-bold font-display text-text-500">
              {user.student_first} {user.student_last}
            </h1>
            <div className="flex flex-col gap-6">
              <div
                className="w-full flex flex-row px-2 items-center justify-between border-b-2 border-b-zinc-300 cursor-pointer rounded-t-md py-3 hover:bg-zinc-200/50 transition-all duration-150"
                onClick={() => setStudentDetailsHidden(!studentDetailsHidden)}
              >
                <h3 className="text-2xl font-display font-medium text-text-300 select-none">
                  Student Details
                </h3>
                <ChevronRight
                  className={`${
                    !studentDetailsHidden && "rotate-90"
                  } transition-all duration-300`}
                />
              </div>
              <div
                className={`flex flex-col gap-6 ${
                  studentDetailsHidden ? "hidden" : ""
                }`}
              >
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col gap-3">
                    <span className="text-xl font-display font-bold text-text-300">
                      First Name
                    </span>
                    <span className="text-xl font-display font-bold text-text-300">
                      Last Name
                    </span>
                    <span className="text-xl font-display font-bold text-text-300">
                      Grade
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-lg text-text-300">
                      {user.student_first}
                    </span>
                    <span className="text-lg text-text-300">
                      {user.student_last}
                    </span>
                    <span className="text-lg text-text-300">
                      {13 - (user.classOf - dayjs().year())}
                      <span className="text-text-200">
                        {" "}
                        &#40;Class of {user.classOf}&#41;
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xl font-display font-bold text-text-300">
                    Notes
                  </span>
                  <span className="text-text-300 rounded-md bg-zinc-200/50 p-4">
                    {user.notes}
                  </span>
                </div>
              </div>
              <div
                className="w-full flex flex-row px-2 items-center justify-between border-b-2 border-b-zinc-300 py-3 rounded-t-md hover:bg-zinc-200/50 transition-all duration-150 cursor-pointer"
                onClick={() => setParentDetailsHidden(!parentDetailsHidden)}
              >
                <h3 className="text-2xl font-display font-medium text-text-300 select-none">
                  Parent Details
                </h3>
                <ChevronRight
                  className={`${
                    !parentDetailsHidden && "rotate-90"
                  } transition-all duration-300`}
                />
              </div>
              <div
                className={`flex flex-col gap-6 ${
                  parentDetailsHidden ? "hidden" : ""
                }`}
              >
                <div className="flex flex-row gap-4">
                  <div className="flex flex-col gap-3">
                    <span className="text-xl font-display font-bold text-text-300">
                      First Name
                    </span>
                    <span className="text-xl font-display font-bold text-text-300">
                      Last Name
                    </span>
                    <span className="text-xl font-display font-bold text-text-300">
                      Email
                    </span>
                    <span className="text-xl font-display font-bold text-text-300">
                      Phone
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    <span className="text-lg text-text-300">
                      {user.parent_first}
                    </span>
                    <span className="text-lg text-text-300">
                      {user.parent_last}
                    </span>
                    <a
                      href={`mailto:${user.parent_email}`}
                      className="text-lg text-text-300 underline"
                    >
                      {user.parent_email}
                    </a>
                    <span className="text-lg text-text-300">
                      {user.phone_number}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-display font-medium text-text-400 select-none">
                  Appointments
                </h2>
                <UserAppointments appointments={appointments} />
              </div>
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
  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();
  if (userError) {
    console.error(userError);
    return {
      notFound: true,
    };
  }
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
        *
    `
    )
    .eq("user", id)
    .order("date", { ascending: false });
  if (appointmentsError) {
    console.error(appointmentsError);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      user,
      appointments,
    },
  };
};
