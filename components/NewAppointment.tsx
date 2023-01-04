import { ArrowRight, EyeOff, Plus, X } from "lucide-react";
import Drawer from "./base/Drawer";
import UserSelect from "./UserSelect";
import {
  NewAppointment as NewAppointmentType,
  NewRecurringAppointment,
  NewRecurringAppointmentObj,
  RecurringAppointment,
  User,
} from "../utils/types";
import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import supabase from "../utils/client";
import CheckBox from "./base/CheckBox";
import { generateAppointments } from "../utils/generateAppointments";

export default function NewAppointment() {
  const [newAppointment, setNewAppointment] = useState<NewAppointmentType>({
    topic: "",
    user: "",
    date: "",
    start_time: "",
    status: "scheduled",
    description: "",
    instructor: "",
    recurring: false,
  });

  const save = async (closeDrawer: () => void) => {
    if (!newAppointment.recurring) {
      const { data, error } = await supabase.from("appointments").insert({
        ...newAppointment,
        start_time: newAppointment.start_time + ":00",
      });
      if (error) {
        console.error(error);
        toast.error("Error saving appointment");
        return;
      }
    } else {
      const recurringAppointment: NewRecurringAppointmentObj = {
        start_date: newAppointment.date,
        frequency: newAppointment.frequency,
        num_appointments: newAppointment.num_appointments,
        user: newAppointment.user,
        days: newAppointment.days,
      };
      const { data: recData, error: recError } = await supabase
        .from("recurring_appointments")
        .insert(recurringAppointment)
        .select()
        .single();
      if (recError) {
        console.error(recError);
        toast.error("Error saving appointment");
        return;
      }
      const recurringAppointments = generateAppointments(newAppointment);
      const { data, error } = await supabase.from("appointments").insert([
        ...recurringAppointments.map((appointment) => {
          return {
            ...appointment,
            recurring: recData.id,
          };
        }),
      ]);
      if (error) {
        console.error(error);
        toast.error("Error saving appointment");
        return;
      }
    }
    toast.success("Appointment saved");
    setNewAppointment({
      topic: "",
      user: "",
      date: "",
      start_time: "",
      status: "scheduled",
      description: "",
      instructor: "",
      recurring: false,
    });
    closeDrawer();
  };

  return (
    <>
      <Drawer
        header={(closeDrawer: () => void) => (
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="text-2xl text-text-500 font-display font-bold">
              New Appointment
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
                setNewAppointment({
                  topic: "",
                  user: "",
                  date: "",
                  start_time: "",
                  status: "scheduled",
                  description: "",
                  instructor: "",
                  recurring: false,
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
            <span>Appointment</span>
          </button>
        )}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Topic"
              value={newAppointment.topic}
              onChange={(e) => {
                setNewAppointment((prev) => {
                  return {
                    ...prev,
                    topic: e.target.value,
                  };
                });
              }}
              className="py-1 px-3 rounded-sm bg-zinc-200/50 w-60 outline-none border-2 focus:border-zinc-400"
            />
            <UserSelect
              selected={newAppointment.user}
              setSelected={(id: string) => {
                setNewAppointment((prev) => {
                  return {
                    ...prev,
                    user: id,
                  };
                });
              }}
            />
            <div className="flex flex-row gap-4 w-84 items-center">
              <input
                type="text"
                placeholder="Instructor"
                value={newAppointment.instructor}
                onChange={(e) => {
                  setNewAppointment((prev) => {
                    return {
                      ...prev,
                      instructor: e.target.value,
                    };
                  });
                }}
                className="py-1 px-3 rounded-sm bg-zinc-200/50 w-40 outline-none border-2 focus:border-zinc-400"
              />
              <select
                value={newAppointment.status}
                onChange={(e) => {
                  setNewAppointment((prev) => {
                    return {
                      ...prev,
                      status: e.target.value,
                    };
                  });
                }}
                className="py-1 px-3 rounded-sm bg-zinc-200/50 w-40 outline-none border-2 focus:border-zinc-400"
              >
                <option value="scheduled">Scheduled</option>
                <option value="attended">Attended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <hr className="border-zinc-300" />
            <div className="flex flex-row justify-between w-full items-center">
              <label className="text-text-500 font-display text-lg font-bold">
                Recurring
              </label>
              <CheckBox
                checked={newAppointment.recurring}
                onChange={(e) => {
                  setNewAppointment((prev) => {
                    return {
                      ...prev,
                      recurring: e,
                      num_appointments: 1,
                      start_date: prev.date || "",
                      frequency: "weekly",
                      days: [],
                    };
                  });
                }}
              />
            </div>
            {newAppointment.recurring ? (
              <div className="flex flex-col w-full gap-2">
                <div className="flex flex-row w-full gap-2 items-center justify-between">
                  <label className="text-text-400 font-display font-bold">
                    # Appointments
                  </label>
                  <input
                    type="number"
                    value={newAppointment.num_appointments}
                    onChange={(e) => {
                      setNewAppointment((prev) => {
                        return {
                          ...prev,
                          num_appointments: parseInt(e.target.value),
                        };
                      });
                    }}
                    min={1}
                    className="py-1 px-3 rounded-sm bg-zinc-200/50 w-16 outline-none border-2 focus:border-zinc-400"
                  />
                </div>
                <div className="flex flex-row w-full gap-2 items-center justify-between">
                  <label className="text-text-400 font-display font-bold">
                    Frequency
                  </label>
                  <select
                    value={newAppointment.frequency}
                    onChange={(e) => {
                      setNewAppointment((prev) => {
                        return {
                          ...prev,
                          frequency: e.target.value as "weekly" | "biweekly",
                        };
                      });
                    }}
                    className="py-1 px-1 rounded-sm bg-zinc-200/50 w-36 outline-none border-2 focus:border-zinc-400"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                  </select>
                </div>
                <div className="flex flex-row w-full gap-2 items-center justify-between">
                  <label className="text-text-400 font-display font-bold">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => {
                      setNewAppointment((prev) => {
                        return {
                          ...prev,
                          date: e.target.value,
                        };
                      });
                    }}
                    className="py-1 px-3 rounded-sm bg-zinc-200/50 w-fit outline-none border-2 focus:border-zinc-400"
                  />
                </div>
                <div className="flex flex-row w-full gap-2 items-center justify-between">
                  <label className="text-text-400 font-display font-bold">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newAppointment.start_time}
                    onChange={(e) => {
                      setNewAppointment((prev) => {
                        return {
                          ...prev,
                          start_time: e.target.value,
                        };
                      });
                    }}
                    className="py-1 px-3 rounded-sm bg-zinc-200/50 w-36 outline-none border-2 focus:border-zinc-400"
                  />
                </div>
                <div className="flex flex-row w-full gap-2 items-center justify-between">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className={`flex flex-col items-center justify-center ${
                          newAppointment.days.includes(day)
                            ? "bg-emerald-600 text-white"
                            : "bg-zinc-200/50 text-text-400"
                        } rounded-full w-10 h-10 cursor-pointer`}
                        onClick={() => {
                          setNewAppointment((prev) => {
                            const reccuringDays = (
                              prev as NewRecurringAppointment
                            ).days;
                            return {
                              ...prev,
                              days: reccuringDays.includes(day)
                                ? reccuringDays.filter((d) => d !== day)
                                : [...reccuringDays, day],
                            };
                          });
                        }}
                      >
                        <span className="font-display font-semibold text-sm">
                          {day}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-row w-full gap-2 items-center">
                <input
                  type="time"
                  value={newAppointment.start_time}
                  onChange={(e) => {
                    setNewAppointment((prev) => {
                      return {
                        ...prev,
                        start_time: e.target.value,
                      };
                    });
                  }}
                  className="py-1 px-3 rounded-sm bg-zinc-200/50 w-36 outline-none border-2 focus:border-zinc-400"
                />
                <input
                  type="date"
                  value={newAppointment.date}
                  onChange={(e) => {
                    setNewAppointment((prev) => {
                      return {
                        ...prev,
                        date: e.target.value,
                      };
                    });
                  }}
                  className="py-1 px-3 rounded-sm bg-zinc-200/50 w-fit outline-none border-2 focus:border-zinc-400"
                />
              </div>
            )}
            <hr className="border-zinc-300" />
            <div className="flex flex-col w-full gap-2">
              <textarea
                placeholder="Description"
                value={newAppointment.description}
                onChange={(e) => {
                  setNewAppointment((prev) => {
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
