import { useEffect, useState } from "react";
import { Appointment, User } from "./types";
import supabase from "./client";

export default function useStudents() {
  const [students, setStudents] = useState<User[] | undefined>(undefined);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.error(error);
      } else {
        setStudents(data);
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
            table: "users",
          },
          async (payload) => {
            console.log(payload);
            const student = payload.new as User;
            if (payload.eventType == "UPDATE") {
              setStudents((students) => {
                const newStudents =
                  students?.map((s) => {
                    if (s.id == student.id) {
                      return student;
                    }
                    return s;
                  }) || [];

                if (!newStudents.some((s) => s.id == student.id)) {
                  // if new student isn't in array
                  newStudents.push(student);
                }
                return newStudents;
              });
            } else if (payload.eventType == "INSERT") {
              setStudents((students) => {
                return [...(students ?? []), student];
              });
            } else if (payload.eventType == "DELETE") {
              setStudents((students) => {
                return students?.filter((s) => s.id != student.id) ?? [];
              });
            }
          }
        )
        .subscribe((status, err) => {
          console.log(status);
        });
    };
    const studentsChannel = createChannel();

    return () => {
      studentsChannel.unsubscribe();
    };
  }, []);

  return students;
}
