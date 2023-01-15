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
    billing_rate: number;
    num_appointments: number;
}

export type RecurringAppointmentParent = {
    num_appointments: number;
    user: User;
    start_date: string;
    frequency: "weekly" | "biweekly";
    days: string[];
    id?: string;
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
    recurring: RecurringAppointmentParent;
    cost_per_hour: number;
}

export type NewRecurringAppointment = Omit<Appointment, "recurring" | "user"> & {
    recurring: true;
    num_appointments: number;
    frequency: "weekly" | "biweekly";
    days: string[];
    user: User | undefined;
}

export type NewSingleAppointment = Omit<Appointment, "recurring" | "user"> & {
    recurring: false;
    user: User | undefined;
}

export type NewAppointment = NewRecurringAppointment | NewSingleAppointment

export type TableOptions = {
    hideFilters: boolean;
    selection?: false
} | {
    hideFilters: boolean;
    selection: true
    setSelection: (selection: any) => void;
}