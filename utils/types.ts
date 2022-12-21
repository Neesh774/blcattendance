export type User = {
    id: number;
    created_at: string;
    student_first: string;
    student_last: string;
    parent_first: string;
    parent_last: string;
    parent_email: string;
    phone_number: string;
}

export type Appointment = {
    id: string;
    last_modified: string;
    status: string;
    topic: string;
    description: string;
    instructor: string;
    start_time: string;
    end_time: string;
    date: string;
    user: User;
}