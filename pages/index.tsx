import { useEffect, useState } from "react";
import { Appointment as AppointmentType } from "../utils/types";
import supabase from "../utils/client";
import dayjs from "dayjs";
import Appointment from "../components/Appointment";
import { Apple, Loader2 } from "lucide-react";
import Image from "next/image";

export default function SignIn() {
  const [appointments, setAppointments] = useState<
    AppointmentType[] | undefined
  >(undefined);

  const filterAppointments = (appointments: AppointmentType[]) => {
    return appointments.filter(
      (a) =>
        dayjs(a.start_time).isAfter(dayjs().subtract(30, "minutes")) &&
        dayjs(a.start_time).isBefore(dayjs().add(30, "minutes")) &&
        a.status == "scheduled"
    );
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          *,
          user (
            *
          )
        `
        )
        .order("start_time", { ascending: true })
        .filter("status", "eq", "scheduled");
      if (error) {
        console.error(error);
      } else {
        setAppointments(filterAppointments(data ?? []));
      }
    };
    fetchAppointments();
    const createChannel = () => {
      return supabase
        .channel("blc")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "appointments",
          },
          async (payload) => {
            console.log(payload);
            const appointment = payload.new as AppointmentType;
            const user = await supabase
              .from("users")
              .select()
              .eq("id", appointment.user)
              .single();
            if (payload.eventType == "UPDATE") {
              setAppointments((appointments) => {
                const newAppointments =
                  appointments?.map((a) => {
                    if (a.id == appointment.id) {
                      return { ...appointment, user: user.data };
                    }
                    return a;
                  }) || [];
                if (!newAppointments.some((a) => a.id == appointment.id)) {
                  newAppointments.push({
                    ...appointment,
                    user: user.data,
                  } as AppointmentType);
                }
                return filterAppointments(newAppointments ?? []);
              });
            } else if (payload.eventType == "INSERT") {
              setAppointments((appointments) => {
                return filterAppointments([
                  ...(appointments ?? []),
                  { ...appointment, user: user.data },
                ]);
              });
            } else if (payload.eventType == "DELETE") {
              setAppointments((appointments) => {
                return filterAppointments(
                  appointments?.filter((a) => a.id != appointment.id) ?? []
                );
              });
            }
          }
        )
        .subscribe((status, err) => {
          console.log(status);
        });
    };
    const appointmentsChannel = createChannel();

    return () => {
      appointmentsChannel.unsubscribe();
    };
  }, []);

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
