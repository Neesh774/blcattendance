import { GetServerSideProps } from "next";
import supabase from "../../utils/client";
import {
  Appointment,
  Event as EventType,
  NewEventStudent,
  Status,
  User as UserType,
} from "../../utils/types";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Delete,
  DollarSign,
  Edit,
  Loader2,
  Plus,
  Trash,
  User,
  X,
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

export default function Event({
  initEvent,
}: {
  initEvent: EventType & { id: string };
}) {
  const [event, setEvent] = useState(initEvent);
  const [original, setOriginal] = useState(initEvent);
  const blacklistedStudents = useMemo(() => {
    return event.event_student
      .map((s) => s.student.toString())
      .filter((id) => !!id);
  }, [event.event_student]);
  const router = useRouter();

  const save = async () => {
    const { event_student, ...ev } = event;
    const { data, error } = await supabase
      .from("events")
      .update({
        ...ev,
        time: dayjs(event.time, "HH:mm").format("HH:mm:ss"),
      })
      .eq("id", event.id)
      .select(`*, event_student(*, users(*))`)
      .single();
    if (error) {
      console.error(error);
      toast.error("Error saving event");
      return;
    }

    console.log(event.event_student, original.event_student);
    if (
      !deepEquals(
        event.event_student.map((s) => ({
          student: s.student,
          status: s.status,
        })),
        original.event_student.map((s) => ({
          student: s.student,
          status: s.status,
        }))
      )
    ) {
      const removed: string[] = [];
      const added: NewEventStudent[] = [];

      original.event_student.forEach((s) => {
        const found = event.event_student.find((e) => e.student === s.student);
        if (!found) {
          removed.push(s.student);
        } else if (found && found.status !== s.status) {
          removed.push(s.student);
          added.push({
            student: s.student,
            status: found.status,
            event: event.id,
          });
        }
      });

      event.event_student.forEach((s) => {
        const found = original.event_student.find(
          (e) => e.student === s.student
        );
        if (!found) {
          added.push({
            student: s.student,
            status: s.status,
            event: event.id,
          });
        }
      });

      const { data, error } = await supabase
        .from("event_student")
        .delete()
        .in("student", removed)
        .eq("event", event.id);
      if (error) {
        console.error(error);
        toast.error("Error saving event");
        return;
      }

      const { data: data2, error: error2 } = await supabase
        .from("event_student")
        .insert(added);
      if (error2) {
        console.error(error2);
        toast.error("Error saving event");
        return;
      }
    }

    toast.success("Event saved");
    setEvent({ ...data, event_student: [...event_student] });
    setOriginal({ ...data, event_student: [...event_student] });
  };

  useEffect(() => {
    if (window) {
      const showAlert = (e: any) => {
        if (!deepEquals(event, original)) {
          e.preventDefault();
          e.returnValue = "";
        }
      };

      window.addEventListener("beforeunload", showAlert);

      return () => {
        window.removeEventListener("beforeunload", showAlert);
      };
    }
  }, [event, original]);

  const deleteEvent = async () => {
    const { data, error } = await supabase
      .from("events")
      .delete({})
      .eq("id", event.id);
    if (error) {
      console.error(error);
      toast.error("Error deleting event");
      return;
    }
    toast.success("Event deleted");
    router.push("/admin?s=events");
  };

  return (
    <>
      <div className="h-full min-h-screen bg-zinc-100 flex flex-col">
        <AdminNav />
        <div className="flex flex-row flex-grow w-full">
          <Sidebar section={undefined} />
          <div className="w-full">
            <div className="px-4 mx-auto flex flex-col gap-2 mt-12 w-full lg:px-0 lg:w-3/5 2xl:w-2/5">
              {event ? (
                <>
                  <div className="flex flex-row justify-between">
                    <input
                      value={event.topic}
                      onChange={(e) =>
                        setEvent({
                          ...event,
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
                          Delete Event
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
                              deleteEvent().then(() => closeModal());
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
                            Are you sure you want to delete this event? It will
                            NOT be recoverable.
                          </p>
                        </div>
                      )}
                    </Modal>
                  </div>
                  <table className="w-full">
                    <tbody>
                      <tr className="items-center gap-8">
                        <td className="py-3 text-lg font-medium font-display text-text-500">
                          Students
                        </td>
                        <td className="flex flex-col gap-4 gap-y-2 w-full items-center">
                          {event.event_student?.map(
                            (
                              { users: student, status, student: sId, ...rest },
                              i
                            ) => (
                              <div
                                key={i}
                                className="flex flex-row w-full justify-between"
                              >
                                <UserSelect
                                  fullObj
                                  selected={sId.toString() || ""}
                                  blacklisted={blacklistedStudents}
                                  initial={student}
                                  setSelected={(newStudent: UserType) => {
                                    setEvent((prev) => {
                                      const newEvents = {
                                        ...prev,
                                        event_student: prev.event_student.map(
                                          (s, ind) => {
                                            if (ind === i) {
                                              return {
                                                ...rest,
                                                users: newStudent,
                                                status,
                                                student:
                                                  newStudent.id.toString(),
                                              };
                                            }
                                            return s;
                                          }
                                        ),
                                      };
                                      console.log(newEvents);
                                      return newEvents;
                                    });
                                  }}
                                />
                                <div className="flex flex-row items-center gap-2">
                                  <select
                                    value={status}
                                    onChange={(e) => {
                                      setEvent((prev) => {
                                        return {
                                          ...prev,
                                          event_student: prev.event_student.map(
                                            (s) => {
                                              if (sId === s.student) {
                                                return {
                                                  ...s,
                                                  status: e.target
                                                    .value as Status,
                                                };
                                              }
                                              return s;
                                            }
                                          ),
                                        };
                                      });
                                    }}
                                    className="py-1 px-3 rounded-sm bg-zinc-200/50 w-40 outline-none border-2 focus:border-zinc-400"
                                  >
                                    <option value="scheduled">Scheduled</option>
                                    <option value="attended">Attended</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  <button
                                    onClick={() => {
                                      setEvent((prev) => {
                                        return {
                                          ...prev,
                                          event_student:
                                            prev.event_student.filter(
                                              (s) => sId !== s.student
                                            ),
                                        };
                                      });
                                    }}
                                    className="p-0.5 bg-zinc-200/50 rounded-r-sm hover:bg-zinc-300/50 transition-all"
                                  >
                                    <X className="stroke-text-500" />
                                  </button>
                                </div>
                              </div>
                            )
                          )}
                          <UserSelect
                            fullObj
                            setSelected={(s: UserType) => {
                              setEvent((prev) => {
                                return {
                                  ...prev,
                                  event_student: [
                                    ...prev.event_student,
                                    {
                                      users: s,
                                      status: "scheduled",
                                      student: s.id.toString(),
                                      event: event,
                                    },
                                  ],
                                };
                              });
                            }}
                            selected=""
                            className="opacity-50 hover:opacity-100"
                            blacklisted={blacklistedStudents}
                            target={
                              <>
                                <Plus className="w-5 h-5" />
                                <span>Add Student</span>
                              </>
                            }
                          />
                        </td>
                      </tr>
                      {event.instructor && (
                        <tr className="items-center gap-8">
                          <td className="py-3 text-lg font-medium font-display text-text-500">
                            Instructor
                          </td>
                          <td>
                            <input
                              value={event.instructor}
                              onChange={(e) =>
                                setEvent({
                                  ...event,
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
                          Time
                        </td>
                        <td>
                          <div className="flex flex-row w-full gap-2 items-center">
                            <input
                              type="time"
                              value={dayjs(event.time, "HH:mm").format("HH:mm")}
                              onChange={(e) => {
                                setEvent((prev) => {
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
                            value={event.date}
                            onChange={(e) => {
                              setEvent((prev) => {
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
                        setEvent({
                          ...event,
                          description: e.target.value,
                        })
                      }
                      className="text-text-300 rounded-md bg-zinc-200/50 hover:bg-zinc-200 transition-all duration-300 p-4 resize-none outline-none border-2 border-text-200"
                      value={event.description}
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
                deepEquals(event, original) ? "-bottom-20" : "bottom-10"
              }`}
            >
              <div className="w-4/5 mx-auto rounded-sm bg-zinc-800 px-4 py-2 flex flex-row justify-between items-center">
                <span className="text-text-200 font-medium">
                  You&apos;ve made changes to this appointment.
                </span>
                <div className="flex flex-row gap-4 items-center">
                  <button
                    onClick={() => {
                      setEvent(original);
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
    .from("events")
    .select(
      `
      *,
      event_student (
        users (
          *
        ),
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
      initEvent: data,
    },
  };
};
