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

export type Appointment = {
    id?: string;
    status: string;
    topic: string;
    description: string;
    instructor: string;
    start_time: string;
    end_time: string;
    date: string;
    user: User;
}

export type AppointmentUserId = Omit<Appointment, "user"> & { user: string };

export type TableOptions = {
    hideFilters: boolean;
    selection?: false
} | {
    hideFilters: boolean;
    selection: true
    setSelection: (selection: any) => void;
}