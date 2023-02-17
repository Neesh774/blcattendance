import dayjs from "dayjs";
import { Appointment as AppointmentType } from "../utils/types";
import supabase from "../utils/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

export default function Appointment({
  appointment,
}: {
  appointment: AppointmentType;
}) {
  const router = useRouter();

  const signIn = async () => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "attended" })
      .eq("id", appointment.id);
    if (error) {
      toast.error("There was an error signing you in. Please try again", {});
    } else {
      toast(
        `Hi ${appointment.user.student_first}! ${
          appointment.instructor &&
          `You'll be working on ${appointment.topic} with ${appointment.instructor} today.`
        }`,
        {
          icon: "👋",
          id: appointment.id,
          style: {
            fontSize: "1.2rem",
          },
        }
      );
      setTimeout(() => {
        router.reload();
      }, 3000);
    }
  };
  return (
    <div className="flex flex-col w-72 rounded-lg bg-zinc-50 p-3 shadow-lg">
      <p className="text-text-300 capitalize mb-1">
        <span>
          {dayjs(appointment.start_time, "HH:mm:SS")
            .set("date", dayjs().get("date"))
            .format("h:mm A ")}
        </span>
      </p>
      <h1 className="text-text-400 text-xl">
        {(appointment.user?.student_first ?? "John") +
          " " +
          (appointment.user?.student_last ?? "Smith")}
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
