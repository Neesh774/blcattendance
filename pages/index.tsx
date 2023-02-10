import { Appointment as AppointmentType, Event } from "../utils/types";
import dayjs from "dayjs";
import Appointment from "../components/Appointment";
import { Apple, Loader2 } from "lucide-react";
import Image from "next/image";
import useAppointments from "../utils/useAppointments";
import { useEffect, useState } from "react";
import useEvents from "../utils/useEvents";
import EventAppointment from "../components/EventAppointment";

export default function SignIn() {
  const allAppointments = useAppointments();
  const allEvents = useEvents();

  const filterAppointments = (appointments: AppointmentType[]) => {
    return appointments.filter((a) => {
      const startTime = dayjs(a.start_time, "HH:mm:SS");
      const date = dayjs(a.date, "YYYY-MM-DD");
      return (
        startTime.isAfter(dayjs().set("hour", 10).set("minute", 0), "hour") &&
        startTime.isBefore(dayjs().set("hour", 20), "hour") &&
        date.isSame(dayjs(), "date") &&
        a.status == "scheduled"
      );
    });
  };

  const filterEvents = (events: Event[]) => {
    console.log(events);
    const filtered = events.map((e) => {
      return {
        ...e,
        event_student: e.event_student.filter((es) => {
          return es.status == "scheduled";
        }),
      };
    });
    return filtered.filter((e) => {
      const date = dayjs(e.date, "YYYY-MM-DD");
      return date.isSame(dayjs(), "date");
    });
  };

  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (allAppointments) {
      setAppointments(filterAppointments(allAppointments));
    }
    if (allEvents) {
      setEvents(filterEvents(allEvents));
    }
  }, [allAppointments, allEvents]);

  return (
    <div className="h-screen bg-zinc-100 flex flex-col">
      <nav className="flex flex-row justify-between items-center px-4 py-3 bg-red-900 border-b-2 border-zinc-300">
        <div className="flex flex-row items-center">
          <Image alt="Logo" width={40} height={40} src="/favicon.png" />
          <h1 className="text-2xl font-medium font-serif text-white ml-2">
            Brookfield Learning Center Attendance
          </h1>
        </div>
      </nav>
      <div className="flex flex-col w-full flex-grow py-4 gap-8">
        <div className="mx-auto text-center flex flex-col gap-2 px-6">
          <h1 className="text-3xl text-text-500 font-display font-bold">
            Welcome to the Brookfield Learning Center!
          </h1>
          <h3 className="text-xl text-text-400 font-display font-semibold">
            Please select your name below if you&apos;ve scheduled an
            appointment.
          </h3>
        </div>
        {events
          .filter((e) => e.event_student.length > 0)
          .map((e, i) => (
            <div
              key={i}
              className="bg-zinc-200/50 flex flex-col gap-4 border-y-[1px] border-zinc-300 p-4"
            >
              <div className="flex flex-row items-baseline gap-2">
                <h1 className="text-3xl font-semibold">{e.topic}</h1>
                <span className="text-lg font-semibold text-text-200">
                  {dayjs(e.time, "HH:mm:ss").format("h:mm A")}
                </span>
              </div>
              <div className="flex flex-row flex-wrap gap-4">
                {e.event_student?.map((student, i) => (
                  <EventAppointment student={student} key={i} />
                ))}
              </div>
            </div>
          ))}
        <div className="flex flex-row flex-wrap gap-4 bg-zinc-200/50 border-y-[1px] border-zinc-300 p-4">
          {appointments ? (
            <>
              {appointments.length > 0 ? (
                appointments?.map((appt, i) => (
                  <Appointment key={i} appointment={appt} />
                ))
              ) : (
                <div className="flex flex-col w-full justify-center items-center">
                  <div className="flex justify-center items-center p-4 rounded-full bg-red-300 text-red-800">
                    <Apple strokeWidth={2} width={40} height={40} />
                  </div>
                  <h1 className="text-xl text-text-500 font-display font-bold">
                    No appointments coming up
                  </h1>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col w-full justify-center items-center">
              <Loader2
                width={40}
                height={40}
                className="animate-spin text-text-300"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
