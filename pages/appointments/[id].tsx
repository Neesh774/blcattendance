import { GetServerSideProps } from "next";
import supabase from "../../utils/client";
import { Appointment, Status, User as UserType } from "../../utils/types";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Delete,
  DollarSign,
  Edit,
  Loader2,
  Trash,
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
import { formatDays } from "../../utils/formatDays";
import NewAppointment from "../../components/NewAppointment";
import NewStudent from "../../components/NewStudent";
import Modal from "../../components/base/Modal";
import AdminNav from "../../components/AdminNav";

export default function Student({
  initAppointment,
}: {
  initAppointment: Appointment;
}) {
  const [appointment, setAppointment] = useState(initAppointment);
  const [original, setOriginal] = useState(initAppointment);
  const router = useRouter();

  const save = async () => {
    const updated: any = {
      ...filterOutProp(appointment, "fts"),
      start_time: dayjs(appointment.start_time, "HH:mm").format("HH:mm:ss"),
      user: appointment.user.id,
    };
    if (appointment.recurring) {
      updated.recurring = appointment.recurring.id;
    }
    const { data, error } = await supabase
      .from("appointments")
      .update(updated)
      .eq("id", appointment.id)
      .select()
      .single();
    if (error) {
      console.error(error);
      toast.error("Error saving appointment");
      return;
    }
    toast.success("Appointment saved");
    if (appointment.recurring) {
      setAppointment({
        ...data,
        user: appointment.user,
        recurring: appointment.recurring,
      });
      setOriginal({
        ...data,
        user: appointment.user,
        recurring: appointment.recurring,
      });
    } else {
      setAppointment({ ...data, user: appointment.user });
      setOriginal({ ...data, user: appointment.user });
    }
  };

  const saveAllFuture = async () => {
    const { id, ...appt } = appointment;

    const { data, error } = await supabase
      .from("appointments")
      .update({
        ...appt,
        user: appointment.user.id,
        recurring: appointment.recurring.id,
      })
      .gte("date", appointment.date)
      .eq("recurring", appointment.recurring.id)
      .select(`*, recurring(*), user(*)`);
    if (error) {
      console.error(error);
      toast.error("Error saving appointment");
      return;
    }
    toast.success("Appointment saved");

    if (appointment.status === "cancelled" && original.status !== "cancelled") {
      const { data, error } = await supabase
        .from("users")
        .update({ num_appointments: initAppointment.user.num_appointments - 1 })
        .eq("id", appointment.user.id)
        .select();
      if (error) {
        console.error(error);
        toast.error("Error updating user");
        return;
      }
    } else if (
      appointment.status !== "cancelled" &&
      original.status === "cancelled"
    ) {
      const { data, error } = await supabase
        .from("users")
        .update({ num_appointments: initAppointment.user.num_appointments + 1 })
        .eq("id", appointment.user.id)
        .select();
      if (error) {
        console.error(error);
        toast.error("Error updating user");
        return;
      }
    }

    data[0].recurring.days = JSON.parse(data[0].recurring.days);
    setAppointment({ ...data[0], user: appointment.user });
    setOriginal({ ...data[0], user: appointment.user });
  };

  useEffect(() => {
    if (window) {
      const showAlert = (e: any) => {
        if (!deepEquals(appointment, original)) {
          e.preventDefault();
          e.returnValue = "";
        }
      };

      window.addEventListener("beforeunload", showAlert);

      return () => {
        window.removeEventListener("beforeunload", showAlert);
      };
    }
  }, [appointment, original]);

  const deleteAppointment = async () => {
    const { data, error } = await supabase
      .from("appointments")
      .delete()
      .eq("id", appointment.id);
    if (error) {
      console.error(error);
      toast.error("Error deleting appointment");
      return;
    }
    toast.success("Appointment deleted");
    router.push("/admin?s=schedule");
  };

  return (
    <>
      <div className="h-full min-h-screen bg-zinc-100 flex flex-col">
        <AdminNav />
        <div className="flex flex-row flex-grow w-full">
          <Sidebar section={undefined} />
          <div className="w-full">
            <div className="px-4 mx-auto flex flex-col gap-2 mt-12 w-full lg:px-0 lg:w-3/5 2xl:w-2/5">
              {appointment ? (
                <>
                  <div className="flex flex-row justify-between">
                    <input
                      value={appointment.topic}
                      onChange={(e) =>
                        setAppointment({
                          ...appointment,
                          topic: e.target.value,
                        })
                      }
                      className="text-4xl font-bold font-display text-text-500 mb-4 p-2 rounded-sm w-fit bg-transparent border-2 border-text-200"
                    />
                    <Modal
                      target={(openModal) => (
                        <button
                          onClick={openModal}
                          className="w-10 h-10 border-2 border-zinc-400 hover:border-red-500 transition-all text-zinc-400 hover:text-red-500 rounded-sm hover:bg-red-500/20 flex justify-center items-center"
                        >
                          <Trash />
                        </button>
                      )}
                      header={
                        <h1 className="text-2xl text-text-500 font-display font-bold">
                          Delete Appointment
                        </h1>
                      }
                      className="xl:!w-1/3 lg:!w-3/5"
                      footer={(closeModal) => (
                        <div className="flex flex-row gap-4 w-full justify-end">
                          <button
                            className="px-6 py-2 rounded-md hover:bg-zinc-300 transition-all"
                            onClick={closeModal}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              deleteAppointment().then(() => closeModal());
                            }}
                            className="bg-red-900 hover:bg-red-800 transition-all text-white px-6 py-2 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    >
                      {() => (
                        <div className="flex flex-col h-32 justify-between">
                          <p>
                            Are you sure you want to delete this appointment? It
                            will NOT be recoverable. &#40;There&apos;s also a
                            &quot;Cancelled&quot; status if you just want to
                            hide it from the calendar.&#41;
                          </p>
                        </div>
                      )}
                    </Modal>
                  </div>
                  {appointment.recurring && (
                    <div className="w-full bg-zinc-200 border-2 border-l-4 border-zinc-400 p-4">
                      <h2 className="font-bold">
                        This appointment is part of a recurring event.
                      </h2>
                      <p>
                        It starts on{" "}
                        {dayjs(
                          appointment.recurring.start_date,
                          "YYYY-MM-DD"
                        ).format("MMMM D, YYYY")}
                        , on{" "}
                        <span className="italic">
                          {formatDays(
                            appointment.recurring.days.map((day) => {
                              return dayjs()
                                .day(
                                  [
                                    "Sun",
                                    "Mon",
                                    "Tue",
                                    "Wed",
                                    "Thu",
                                    "Fri",
                                    "Sat",
                                  ].indexOf(day)
                                )
                                .format("dddd");
                            })
                          )}
                        </span>
                        {appointment.recurring.frequency === "weekly"
                          ? " every week "
                          : " every other week "}
                        at{" "}
                        {dayjs(appointment.start_time, "HH:mm:ss").format(
                          "h:mm A"
                        )}
                        .
                      </p>
                    </div>
                  )}
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
                              setAppointment({
                                ...appointment,
                                user: student,
                                cost_per_hour: student.billing_rate,
                              })
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
                                  status: e.target.value as Status,
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
                          Cost
                        </td>
                        <td>
                          <div className="flex flex-row gap-1 items-center">
                            <DollarSign />
                            <input
                              type="number"
                              value={appointment.cost_per_hour}
                              onChange={(e) =>
                                setAppointment({
                                  ...appointment,
                                  cost_per_hour: parseInt(e.target.value),
                                })
                              }
                              className="px-2 py-1 rounded-sm w-20 bg-transparent border-2 border-text-200"
                            />
                            <span className="text-xl">/hr</span>
                          </div>
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
                  {appointment.recurring != null && (
                    <button
                      onClick={saveAllFuture}
                      className="rounded-sm hover:bg-white/10 text-text-100 px-2 py-1 transition-all"
                    >
                      Save for all future appointments
                    </button>
                  )}
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
      ),
      recurring (
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
  if (data.recurring) {
    data.recurring.days = JSON.parse(data.recurring.days);
  }

  return {
    props: {
      initAppointment: data,
    },
  };
};

function filterOutProp<T>(obj: T, prop: keyof T) {
  const { [prop]: _, ...rest } = obj;
  return rest;
}
