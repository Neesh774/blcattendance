import {
  ArrowRight,
  CalendarDays,
  DollarSign,
  EyeOff,
  Plus,
  X,
} from "lucide-react";
import Drawer from "./base/Drawer";
import UserSelect from "./UserSelect";
import {
  NewEvent as NewEventType,
  NewEventStudent,
  NewRecurringAppointment,
  RecurringAppointmentParent,
  Status,
  User,
} from "../utils/types";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import supabase from "../utils/client";
import CheckBox from "./base/CheckBox";
import { generateAppointments } from "../utils/generateAppointments";

export default function NewEvent() {
  const [newEvent, setNewEvent] = useState<NewEventType>({
    topic: "",
    date: "",
    time: "",
    description: "",
    instructor: "",
    students: [],
  });
  const blacklistedStudents = useMemo(() => {
    return newEvent.students.map((s) => s.id?.toString()).filter((id) => !!id);
  }, [newEvent.students]);

  const save = async (closeDrawer: () => void) => {
    if (newEvent.students.length === 0) {
      toast.error("Please select at least 1 student!");
      return;
    }
    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          topic: newEvent.topic,
          date: newEvent.date,
          time: newEvent.time,
          description: newEvent.description,
          instructor: newEvent.instructor,
        },
      ])
      .select("id")
      .single();
    if (error || !data) {
      toast.error("Error creating event!");
      console.error(error);
      return;
    }

    const eventStudents = newEvent.students.map((student) => {
      return {
        event: data.id,
        student: student.id,
      };
    });

    const { data: eventStudentsData, error: eventStudentsError } =
      await supabase.from("event_student").insert(eventStudents);
    if (eventStudentsError) {
      toast.error("Error creating event!");
      console.error(eventStudentsError);
      return;
    }

    toast.success("Event created!");
    setNewEvent({
      topic: "",
      date: "",
      time: "",
      description: "",
      instructor: "",
      students: [],
    });

    closeDrawer();
  };

  return (
    <>
      <Drawer
        header={(closeDrawer: () => void) => (
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-2xl text-text-500 font-display font-bold">
              New Event
            </h1>
            <button
              onClick={closeDrawer}
              className="p-1 rounded-md hover:bg-zinc-300/50 transition-all"
            >
              <X />
            </button>
          </div>
        )}
        footer={(closeDrawer: () => void) => (
          <div className="flex flex-row justify-between items-center w-full">
            <button
              className="px-3 py-2 bg-zinc-300/60 rounded-md hover:bg-zinc-300 transition-all"
              onClick={() => {
                closeDrawer();
                setNewEvent({
                  topic: "",
                  date: "",
                  time: "",
                  description: "",
                  instructor: "",
                  students: [],
                });
              }}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                save(closeDrawer);
              }}
              className="px-6 py-2 bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md disabled:hover:bg-emerald-500 hover:bg-emerald-700 transition-all"
            >
              Save
            </button>
          </div>
        )}
        target={(openDrawer: () => void) => (
          <button
            onClick={openDrawer}
            className="flex flex-row gap-2 text-white font-display rounded-sm items-center hover:bg-white/10 p-2 transition-all duration-150"
          >
            <Plus className="w-5 h-5" />
            <span>Event</span>
          </button>
        )}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-xl font-display text-text-300">Event</h3>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Topic"
              value={newEvent.topic}
              onChange={(e) => {
                setNewEvent((prev) => {
                  return {
                    ...prev,
                    topic: e.target.value,
                  };
                });
              }}
              className="py-1 px-3 rounded-sm bg-zinc-200/50 w-60 outline-none border-2 focus:border-zinc-400"
            />
            <div className="flex flex-row gap-4 w-84 items-center">
              <input
                type="text"
                placeholder="Instructor"
                value={newEvent.instructor}
                onChange={(e) => {
                  setNewEvent((prev) => {
                    return {
                      ...prev,
                      instructor: e.target.value,
                    };
                  });
                }}
                className="py-1 px-3 rounded-sm bg-zinc-200/50 w-40 outline-none border-2 focus:border-zinc-400"
              />
            </div>
            <div className="flex flex-row gap-4 gap-y-2 w-full flex-wrap items-center">
              {newEvent.students.map((student, i) => (
                <div key={i} className="flex flex-row">
                  <UserSelect
                    fullObj
                    selected={student.id?.toString() || ""}
                    blacklisted={blacklistedStudents}
                    initial={student}
                    setSelected={(s: User) => {
                      setNewEvent((prev) => {
                        return {
                          ...prev,
                          students: prev.students.map((student, j) => {
                            if (i === j) {
                              return s;
                            }
                            return student;
                          }),
                        };
                      });
                    }}
                  />
                  <button
                    onClick={() => {
                      setNewEvent((prev) => {
                        return {
                          ...prev,
                          students: prev.students.filter(
                            (s) => student.id !== s.id
                          ),
                        };
                      });
                    }}
                    className="p-0.5 hover:bg-zinc-300/50 transition-all"
                  >
                    <X className="stroke-text-500" />
                  </button>
                </div>
              ))}
              <UserSelect
                fullObj
                setSelected={(s: User) => {
                  setNewEvent((prev) => {
                    return {
                      ...prev,
                      students: [...prev.students, s],
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
            </div>
            <hr className="border-zinc-300" />
            <h3 className="text-xl font-display text-text-300">
              Time and Date
            </h3>
            <div className="flex flex-row w-full gap-2 items-center">
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) => {
                  setNewEvent((prev) => {
                    return {
                      ...prev,
                      time: e.target.value,
                    };
                  });
                }}
                className="py-1 px-3 rounded-sm bg-zinc-200/50 w-36 outline-none border-2 focus:border-zinc-400"
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => {
                  setNewEvent((prev) => {
                    return {
                      ...prev,
                      date: e.target.value,
                    };
                  });
                }}
                className="py-1 px-3 rounded-sm bg-zinc-200/50 w-fit outline-none border-2 focus:border-zinc-400"
              />
            </div>
            <hr className="border-zinc-300" />
            <h3 className="text-xl font-display text-text-300">
              Other Details
            </h3>
            <div className="flex flex-col w-full gap-2">
              <textarea
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) => {
                  setNewEvent((prev) => {
                    return {
                      ...prev,
                      description: e.target.value,
                    };
                  });
                }}
                className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full h-40 resize-none outline-none border-2 focus:border-zinc-400"
              />
              <span className="flex flex-row gap-1 items-center">
                <EyeOff className="w-5 h-5 text-text-100" />
                <span className="text-text-100 text-sm ml-1">
                  This will not be visible to the student
                </span>
              </span>
            </div>
            <hr className="border-zinc-300" />
          </div>
        </div>
      </Drawer>
    </>
  );
}
