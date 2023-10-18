export type User = {
  id: number;
  created_at?: string;
  student_first: string;
  student_last: string;
  parent_first: string;
  parent_last: string;
  parent_email: string;
  phone_number: string;
  classOf: number;
  school: string;
  notes: string;
  billing_rate: number;
  num_appointments: number;
};

export type NewUser = Omit<User, "id" | "created_at" | "num_appointments">;

export type RecurringAppointmentParent = {
  num_appointments: number;
  user: User;
  start_date: string;
  frequency: "weekly" | "biweekly";
  days: string[];
  id?: string;
};

export type Status = "scheduled" | "cancelled" | "attended";

export type Appointment = {
  id?: string;
  status: Status;
  topic: string;
  description: string;
  instructor: string;
  start_time: string;
  date: string;
  user: User;
  recurring: RecurringAppointmentParent;
  cost_per_hour: number;
  fts: string;
};

export type NewRecurringAppointment = Omit<
  Appointment,
  "recurring" | "user" | "fts"
> & {
  recurring: true;
  num_appointments: number;
  frequency: "weekly" | "biweekly";
  days: string[];
  user: User | undefined;
};

export type NewSingleAppointment = Omit<
  Appointment,
  "recurring" | "user" | "fts"
> & {
  recurring: false;
  user: User | undefined;
};

export type NewAppointment = NewRecurringAppointment | NewSingleAppointment;

export type TableOptions =
  | {
      hideFilters?: boolean;
      selection?: false;
      link: (header: string, row: any) => string | null;
    }
  | {
      hideFilters: boolean;
      selection: true;
      setSelection: (selection: any) => void;
    };

export type Event = {
  id?: string;
  topic: string;
  description: string;
  instructor: string;
  date: string;
  time: string;
  users: User[];
  event_student: EventStudent[];
};

export type EventStudent = {
  id?: string;
  event: Event;
  student: string;
  users: User;
  status: Status;
};

export type EventStudentUpdate = {
  id: string;
  status: Status;
  event: string;
  student: string;
};

export type NewEvent = Omit<Event, "id" | "users" | "event_student"> & {
  students: User[];
};

export type NewEventStudent = Omit<EventStudent, "id" | "event" | "users"> & {
  event: string;
};
