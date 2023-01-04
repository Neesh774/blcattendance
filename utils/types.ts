export type User = {
    id?: number;
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
}

export type RecurringAppointment = {
    num_appointments: number;
    user: User;
    start_date: string;
    frequency: "weekly" | "biweekly";
    days: string[];
}

export type NewRecurringAppointmentObj = Omit<RecurringAppointment, "user"> & {
    user: string;
}

export type Appointment = {
    id?: string;
    status: string;
    topic: string;
    description: string;
    instructor: string;
    start_time: string;
    date: string;
    user: User;
    recurring: RecurringAppointment;
}

export type NewRecurringAppointment = Omit<Appointment, "recurring" | "user"> & {
    recurring: true;
    num_appointments: number;
    frequency: "weekly" | "biweekly";
    days: string[];
    user: string;
}

export type NewSingleAppointment = Omit<Appointment, "recurring" | "user"> & {
    recurring: false;
    user: string;
}

export type NewAppointment = NewRecurringAppointment | NewSingleAppointment;

export type TableOptions = {
    hideFilters: boolean;
    selection?: false
} | {
    hideFilters: boolean;
    selection: true
    setSelection: (selection: any) => void;
}