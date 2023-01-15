import {
  DollarSign,
  EyeOff,
  GraduationCap,
  Mail,
  Phone,
  Plus,
  Search,
  X,
} from "lucide-react";
import Drawer from "./base/Drawer";
import { useState } from "react";
import { User } from "../utils/types";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import supabase from "../utils/client";

export default function NewStudent() {
  const [newStudent, setNewStudent] = useState<User>({
    student_first: "",
    student_last: "",
    classOf: dayjs().year(),
    school: "",
    parent_first: "",
    parent_last: "",
    parent_email: "",
    phone_number: "",
    notes: "",
    billing_rate: 345,
    num_appointments: 0,
  });

  const save = async (closeDrawer: () => void) => {
    const { data, error } = await supabase.from("users").insert({
      ...newStudent,
    });
    if (error) {
      console.error(error);
      toast.error("Error saving student");
      return;
    }
    toast.success("Student saved");
    setNewStudent({
      student_first: "",
      student_last: "",
      classOf: dayjs().year(),
      school: "",
      parent_first: "",
      parent_last: "",
      parent_email: "",
      phone_number: "",
      notes: "",
      billing_rate: 345,
      num_appointments: 0,
    });
    closeDrawer();
  };

  return (
    <Drawer
      header={(closeDrawer: () => void) => (
        <div className="flex flex-row justify-between items-center w-full">
          <h1 className="text-2xl text-text-500 font-display font-bold">
            New Student
          </h1>
          <button
            onClick={closeDrawer}
            className="p-1 rounded-md hover:bg-zinc-300/50 transition-all"
          >
            <X />
          </button>
        </div>
      )}
      footer={(closeDrawer: () => void) => (
        <div className="flex flex-row justify-between items-center w-full">
          <button
            className="px-3 py-2 bg-zinc-300/60 rounded-md hover:bg-zinc-300 transition-all"
            onClick={() => {
              closeDrawer();
              setNewStudent({
                student_first: "",
                student_last: "",
                classOf: dayjs().year(),
                school: "",
                parent_first: "",
                parent_last: "",
                parent_email: "",
                phone_number: "",
                notes: "",
                billing_rate: 345,
                num_appointments: 0,
              });
            }}
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              save(closeDrawer);
            }}
            disabled={
              !(
                newStudent.student_first &&
                newStudent.student_last &&
                newStudent.classOf &&
                newStudent.school &&
                newStudent.parent_first &&
                newStudent.parent_last &&
                newStudent.parent_email &&
                newStudent.phone_number
              )
            }
            className="px-6 py-2 bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md disabled:hover:bg-red-800 hover:bg-emerald-700 transition-all"
          >
            Save
          </button>
        </div>
      )}
      target={(openDrawer: () => void) => (
        <button
          onClick={openDrawer}
          className="flex flex-row gap-2 text-white font-display rounded-sm items-center hover:bg-white/10 p-2 transition-all duration-150"
        >
          <Plus className="w-5 h-5" />
          <span>Student</span>
        </button>
      )}
    >
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-display text-text-300">Student</h3>
        <div className="flex flex-row gap-2 items-center">
          <input
            placeholder="First"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400"
            value={newStudent.student_first}
            onChange={(e) =>
              setNewStudent({ ...newStudent, student_first: e.target.value })
            }
          />
          <input
            placeholder="Last"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400"
            value={newStudent.student_last}
            onChange={(e) =>
              setNewStudent({ ...newStudent, student_last: e.target.value })
            }
          />
        </div>
        <div className="flex flex-row gap-2 items-center">
          <span>Class of</span>
          <input
            type="number"
            placeholder={dayjs().year().toString()}
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-24 outline-none border-2 focus:border-zinc-400"
            value={newStudent.classOf}
            onChange={(e) =>
              setNewStudent({
                ...newStudent,
                classOf: parseInt(e.target.value),
              })
            }
          />
        </div>
        <div className="relative w-full">
          <GraduationCap className="absolute left-1 h-full py-2" />
          <input
            placeholder="School"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400 pl-9"
            value={newStudent.school}
            onChange={(e) =>
              setNewStudent({ ...newStudent, school: e.target.value })
            }
          />
        </div>
        <hr className="border-zinc-300" />
        <h3 className="text-xl font-display text-text-300">Parent</h3>
        <div className="flex flex-row gap-2 items-center">
          <input
            placeholder="First"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400"
            value={newStudent.parent_first}
            onChange={(e) =>
              setNewStudent({ ...newStudent, parent_first: e.target.value })
            }
          />
          <input
            placeholder="Last"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400"
            value={newStudent.parent_last}
            onChange={(e) =>
              setNewStudent({ ...newStudent, parent_last: e.target.value })
            }
          />
        </div>
        <div className="relative w-full">
          <Mail className="absolute left-1 h-full py-2" />
          <input
            placeholder="Email"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400 pl-9"
            value={newStudent.parent_email}
            onChange={(e) =>
              setNewStudent({ ...newStudent, parent_email: e.target.value })
            }
          />
        </div>
        <div className="relative w-full">
          <Phone className="absolute left-1 h-full py-2" />
          <input
            placeholder="Phone Number"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400 pl-9"
            value={newStudent.phone_number}
            onChange={(e) =>
              setNewStudent({ ...newStudent, phone_number: e.target.value })
            }
          />
        </div>
        <hr className="border-zinc-300" />
        <h3 className="text-xl font-display text-text-300">Other Details</h3>
        <div className="flex flex-row gap-1 items-center w-full">
          <div className="relative w-1/3">
            <DollarSign className="absolute left-1 h-full py-2" />
            <input
              placeholder="Hourly Billing Rate"
              className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full outline-none border-2 focus:border-zinc-400 pl-9"
              value={newStudent.billing_rate}
              type="number"
              onChange={(e) =>
                setNewStudent({
                  ...newStudent,
                  billing_rate: parseInt(e.target.value),
                })
              }
            />
          </div>
          <span className="text-lg">/hr</span>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <textarea
            placeholder="Notes"
            className="py-1 px-3 rounded-sm bg-zinc-200/50 w-full h-32 resize-none outline-none border-2 focus:border-zinc-400"
            value={newStudent.notes}
            onChange={(e) =>
              setNewStudent({ ...newStudent, notes: e.target.value })
            }
          />
          <span className="flex flex-row gap-1 items-center">
            <EyeOff className="w-5 h-5 text-text-100" />
            <span className="text-text-100 text-sm ml-1">
              This will not be visible to the student
            </span>
          </span>
        </div>
      </div>
    </Drawer>
  );
}
