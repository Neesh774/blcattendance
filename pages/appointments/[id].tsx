import { GetServerSideProps } from "next";
import supabase from "../../utils/client";
import { Appointment, User as UserType } from "../../utils/types";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Edit,
  Loader2,
  User,
} from "lucide-react";
import Table from "../../components/base/Table";
import UserAppointments from "../../components/UserAppointments";
import Link from "next/link";
import getTagColor from "../../utils/getTagColor";
import UserSelect from "../../components/UserSelect";
import { deepEquals } from "../../utils/deepEquals";
import dayjs from "dayjs";
import toast from "react-hot-toast";

export default function Student({
  initAppointment,
}: {
  initAppointment: Appointment;
}) {
  const [appointment, setAppointment] = useState(initAppointment);
  const [original, setOriginal] = useState(initAppointment);
  const save = async () => {
    if (
      !dayjs(appointment.start_time, "HH:mm:ss").isBefore(
        dayjs(appointment.end_time, "HH:mm:ss"),
        "minutes"
      )
    ) {
      toast.error("Start time must be before end time");
      return;
    }
    const { data, error } = await supabase
      .from("appointments")
      .update({
        ...appointment,
        start_time: dayjs(appointment.start_time, "HH:mm:ss").format(
          "HH:mm:ss"
        ),
        end_time: dayjs(appointment.end_time, "HH:mm:ss").format("HH:mm:ss"),
        user: appointment.user.id,
      })
      .eq("id", appointment.id)
      .select()
      .single();
    if (error) {
      console.error(error);
      toast.error("Error saving appointment");
      return;
    }
    toast.success("Appointment saved");
    setAppointment({ ...data, user: appointment.user });
    setOriginal({ ...data, user: appointment.user });
  };

  return (
    <>
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
              {appointment ? (
                <>
                  <input
                    value={appointment.topic}
                    onChange={(e) =>
                      setAppointment({ ...appointment, topic: e.target.value })
                    }
                    className="text-4xl font-bold font-display text-text-500 mb-4 p-2 rounded-sm w-fit bg-transparent border-2 border-text-200"
                  />
                  <table className="w-full">
                    <tbody>
                      <tr className="items-center gap-8">
                        <td className="py-3 text-lg font-medium font-display text-text-500">
                          Student
                        </td>
                        <td className="flex flex-row gap-2">
                          <Link
                            href={`/students/${appointment.user.id}`}
                            className="flex flex-row w-fit items-center gap-2 px-2 py-1 hover:bg-zinc-200/70 rounded-sm"
                          >
                            <User className="w-5 h-5" />
                            <span className="text-lg font-medium font-display text-text-500 whitespace-nowrap">
                              {appointment.user.student_first}{" "}
                              {appointment.user.student_last}
                            </span>
                          </Link>
                          <UserSelect
                            selected={(
                              appointment.user.id as number
                            ).toString()}
                            setSelected={(student: UserType) =>
                              setAppointment({ ...appointment, user: student })
                            }
                            fullObj
                            target={<Edit className="w-5 h-5" />}
                          />
                        </td>
                      </tr>
                      {appointment.instructor && (
                        <tr className="items-center gap-8">
                          <td className="py-3 text-lg font-medium font-display text-text-500">
                            Instructor
                          </td>
                          <td>
                            <input
                              value={appointment.instructor}
                              onChange={(e) =>
                                setAppointment({
                                  ...appointment,
                                  instructor: e.target.value,
                                })
                              }
                              className="px-2 py-1 rounded-sm bg-transparent border-2 border-text-200"
                            />
                          </td>
                        </tr>
                      )}
                      <tr className="items-center gap-8">
                        <td className="py-3 text-lg font-medium font-display text-text-500">
                          Status
                        </td>
                        <td>
                          <span
                            className={`font-medium px-2 py-1 rounded-md capitalize font-display text-text-500 ${getTagColor(
                              appointment.status
                            )}`}
                          >
                            <select
                              value={appointment.status}
                              onChange={(e) =>
                                setAppointment({
                                  ...appointment,
                                  status: e.target.value,
                                })
                              }
                              className="bg-transparent outline-none"
                            >
                              <option value="scheduled">Scheduled</option>
                              <option value="attended">Attended</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </span>
                        </td>
                      </tr>
                      <tr className="items-center gap-8">
                        <td className="py-3 text-lg font-medium font-display text-text-500">
                          Times
                        </td>
                        <td>
                          <div className="flex flex-row w-full gap-2 items-center">
                            <input
                              type="time"
                              value={dayjs(
                                appointment.start_time,
                                "HH:mm"
                              ).format("HH:mm")}
                              onChange={(e) => {
                                setAppointment((prev) => {
                                  return {
                                    ...prev,
                                    start_time: e.target.value,
                                  };
                                });
                              }}
                              className="py-1 px-3 rounded-sm w-fit bg-zinc-200/50 outline-none border-2 focus:border-zinc-400"
                            />
                            <ArrowRight
                              className="w-5 h-5 text-text-100"
                              strokeWidth={3}
                            />
                            <input
                              type="time"
                              value={dayjs(
                                appointment.end_time,
                                "HH:mm"
                              ).format("HH:mm")}
                              onChange={(e) => {
                                setAppointment((prev) => {
                                  return {
                                    ...prev,
                                    end_time: e.target.value,
                                  };
                                });
                              }}
                              className="py-1 px-3 rounded-sm w-fit bg-zinc-200/50 outline-none border-2 focus:border-zinc-400"
                            />
                          </div>
                        </td>
                      </tr>
                      <tr className="items-center gap-8">
                        <td className="py-3 text-lg font-medium font-display text-text-500">
                          Date
                        </td>
                        <td>
                          <input
                            type="date"
                            value={appointment.date}
                            onChange={(e) => {
                              setAppointment((prev) => {
                                return {
                                  ...prev,
                                  date: e.target.value,
                                };
                              });
                            }}
                            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-fit outline-none border-2 focus:border-zinc-400"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold font-display text-text-500 mb-4">
                      Notes
                    </h1>
                    <textarea
                      onChange={(e) =>
                        setAppointment({
                          ...appointment,
                          description: e.target.value,
                        })
                      }
                      className="text-text-300 rounded-md bg-zinc-200/50 hover:bg-zinc-200 transition-all duration-300 p-4 resize-none outline-none border-2 border-text-200"
                      value={appointment.description}
                    />
                  </div>
                </>
              ) : (
                <div className="w-full flex justify-center">
                  <Loader2 className="animate-spin w-10 h-10 text-red-800" />
                </div>
              )}
            </div>
            <div
              className={`fixed w-full transition-all duration-300 ${
                deepEquals(appointment, original) ? "-bottom-20" : "bottom-10"
              }`}
            >
              <div className="w-4/5 mx-auto rounded-sm bg-zinc-800 px-4 py-2 flex flex-row justify-between items-center">
                <span className="text-text-200 font-medium">
                  You&apos;ve made changes to this appointment.
                </span>
                <div className="flex flex-row gap-4 items-center">
                  <button
                    onClick={() => {
                      setAppointment(original);
                    }}
                    className="rounded-sm hover:bg-white/10 text-text-100 px-2 py-1 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={save}
                    className="rounded-sm bg-emerald-600 hover:bg-emerald-700 transition-all text-white px-2 py-1"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
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
      initAppointment: data,
    },
  };
};
