import dayjs from "dayjs";
import { EventStudent } from "../utils/types";
import supabase from "../utils/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

export default function EventAppointment({
  student,
}: {
  student: EventStudent;
}) {
  const router = useRouter();
  const signIn = async () => {
    console.log(student.id, student.event);
    const { error } = await supabase
      .from("event_student")
      .update({ status: "attended" })
      .eq("student", student.student)
      .eq("event", student.event);
    if (error) {
      toast.error("There was an error signing you in. Please try again", {});
    } else {
      toast(`Hi ${student.users.student_first}!`, {
        icon: "👋",
        id: student.id,
        style: {
          fontSize: "1.2rem",
        },
      });
      setTimeout(() => {
        router.reload();
      }, 3000);
    }
  };
  return (
    <div className="flex flex-col w-72 rounded-lg bg-zinc-50 p-3 shadow-lg">
      <h1 className="text-text-400 text-xl">
        {(student.users?.student_first ?? "John") +
          " " +
          (student.users?.student_last ?? "Smith")}
      </h1>
      <button
        onClick={signIn}
        className="bg-red-700 rounded-md text-white font-semibold text-center py-2 mt-4"
      >
        I&apos;m here!
      </button>
    </div>
  );
}
