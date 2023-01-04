import { NewAppointment, NewRecurringAppointment, NewRecurringAppointmentObj, NewSingleAppointment } from "./types";
import dayjs from "dayjs";

export function generateAppointments(recurring: NewRecurringAppointment) {
  const { frequency, date: start_date, days } = recurring;
  const appointments: NewSingleAppointment[] = [];
  let date = dayjs(start_date, "YYYY-MM-DD");
  let i = 0;
  // go through each week or every other week and add all of the days that are selected until we reach the number of appointments
  while (i < recurring.num_appointments) {
    // go through every day of the week
    for (let j = 0; j < 7; j++) {
      // if the day is selected, add an appointment
      if (days.includes(date.format("ddd"))) {
        appointments.push({
          recurring: false,
          date: date.format("YYYY-MM-DD"),
          start_time: recurring.start_time,
          topic: recurring.topic + ` (${i + 1}/${recurring.num_appointments})`,
          description: recurring.description,
          instructor: recurring.instructor,
          status: "scheduled",
          user: recurring.user,
        });
        i++;
      }
      // if we've reached the number of appointments, break out of the loop
      if (i >= recurring.num_appointments) {
        break;
      }
      // add a day to the date
      date = date.add(1, "day");
    }

    if (frequency === "biweekly") {
      date = date.add(2, "week");
    }
  }
  return appointments;
}