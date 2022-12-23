import { ArrowRight, EyeOff, Plus, X } from "lucide-react";
import Drawer from "./base/Drawer";
import UserSelect from "./UserSelect";
import { AppointmentUserId, User } from "../utils/types";
import { useState } from "react";
import dayjs from "dayjs";
import { toast } from "react-hot-toast";
import supabase from "../utils/client";

export default function NewAppointment({ students }: { students: User[] }) {
  const [newAppointment, setNewAppointment] = useState<AppointmentUserId>({
    topic: "",
    user: "",
    date: "",
    start_time: "",
    end_time: "",
    status: "scheduled",
    description: "",
    instructor: "",
  });

  const save = async (closeDrawer: () => void) => {
    if (
      !dayjs(newAppointment.start_time, "HH:mm").isBefore(
        dayjs(newAppointment.end_time, "HH:mm"),
        "minutes"
      )
    ) {
      toast.error("Start time must be before end time");
      return;
    }
    const { data, error } = await supabase.from("appointments").insert({
      ...newAppointment,
      start_time: newAppointment.start_time + ":00",
      end_time: newAppointment.end_time + ":00",
    });
    if (error) {
      console.error(error);
      toast.error("Error saving appointment");
      return;
    }
    toast.success("Appointment saved");
    setNewAppointment({
      topic: "",
      user: "",
      date: "",
      start_time: "",
      end_time: "",
      status: "scheduled",
      description: "",
      instructor: "",
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
                  end_time: "",
                  status: "scheduled",
                  description: "",
                  instructor: "",
                });
              }}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                save(closeDrawer);
              }}
              disabled={
                !(
                  newAppointment.topic &&
                  newAppointment.user &&
                  newAppointment.end_time &&
                  newAppointment.start_time &&
                  newAppointment.date
                )
              }
              className="px-6 py-2 bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md disabled:hover:bg-red-800 hover:bg-red-800/80 transition-all"
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
              students={students}
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
              <ArrowRight className="w-5 h-5 text-text-100" strokeWidth={3} />
              <input
                type="time"
                value={newAppointment.end_time}
                onChange={(e) => {
                  setNewAppointment((prev) => {
                    return {
                      ...prev,
                      end_time: e.target.value,
                    };
                  });
                }}
                className="py-1 px-3 rounded-sm bg-zinc-200/50 w-36 outline-none border-2 focus:border-zinc-400"
              />
            </div>
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
