import { useEffect, useState } from "react";
import { Event, EventStudent, EventStudentUpdate } from "./types";
import supabase from "./client";

export default function useEvents() {
  const [events, setEvents] = useState<Event[] | undefined>(
    undefined
  );

  useEffect(() => {
    const fetchevents = async () => {
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
          )
        `
        )
        .order("time", { ascending: true })
      if (error) {
        console.error(error);
      } else {
        setEvents(data);
      }
    };
    fetchevents();
    const createChannel = () => {
      return supabase
        .channel("blc")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "events",
          },
          async (payload) => {
            const event = payload.new as Event;
            if (payload.eventType == "UPDATE") {
              setEvents((events) => {
                const newEvents =
                  events?.map((a) => {
                    if (a.id == event.id) {
                      return event;
                    }
                    return a;
                  }) || [];
                if (!newEvents.some((a) => a.id == event.id)) {
                  newEvents.push(event as Event);
                }
                return newEvents;
              });
            } else if (payload.eventType == "INSERT") {
              setEvents((events) => {
                return [
                  ...(events ?? []),
                  event,
                ];
              });
            } else if (payload.eventType == "DELETE") {
              setEvents((events) => {
                return (
                  events?.filter((a) => a.id != event.id) ?? []
                );
              });
            }
          }
        )
        .subscribe((status, err) => {
          console.log(status);
        });
    };
    const eventsChannel = createChannel();

    const createEventStudentChannel = () => {
      return supabase
        .channel("blc")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "event_student",
          },
          async (payload) => {
            const eventStudent = payload.new as EventStudentUpdate;
            const { data: event } = await supabase
              .from("events")
              .select(
                `
                *,
                event_student (
                  users (
                    *
                  ),
                  *
                )
              `
              )
              .eq("id", eventStudent.event)
              .single() as { data: Event & { id: string } };
            if (payload.eventType == "UPDATE") {
              setEvents((events) => {
                const newEvents =
                  events?.map((a) => {
                    if (a.id == event.id) {
                      return event;
                    }
                    return a;
                  }) || [];
                if (!newEvents.some((a) => a.id == event.id)) {
                  newEvents.push(event as Event);
                }
                return newEvents;
              });
            }
          }
        )
        .subscribe((status, err) => {
          console.log(status);
        });
    }
    const eventStudentChannel = createEventStudentChannel();

    return () => {
      eventsChannel.unsubscribe();
      eventStudentChannel.unsubscribe();
    };
  }, []);

  return events;
}
