import { useEffect, useState } from "react";
import { Appointment } from "./types";
import supabase from "./client";

export default function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[] | undefined>(
    undefined
  );

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
        .not("user", "is", null);
      if (error) {
        console.error(error);
      } else {
        setAppointments(data);
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
            const appointment = payload.new as Appointment;
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
                  } as Appointment);
                }
                return newAppointments;
              });
            } else if (payload.eventType == "INSERT") {
              setAppointments((appointments) => {
                return [
                  ...(appointments ?? []),
                  { ...appointment, user: user.data },
                ];
              });
            } else if (payload.eventType == "DELETE") {
              setAppointments((appointments) => {
                return (
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

  return appointments;
}
