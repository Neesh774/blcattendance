import { GetServerSideProps } from "next";
import supabase from "../../utils/client";
import { Appointment, User } from "../../utils/types";
import Image from "next/image";
import Sidebar from "../../components/Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Loader2,
  Pencil,
  X,
} from "lucide-react";
import Table from "../../components/base/Table";
import UserAppointments from "../../components/UserAppointments";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import { deepEquals } from "../../utils/deepEquals";
import NewAppointment from "../../components/NewAppointment";
import NewStudent from "../../components/NewStudent";

export default function Student({
  initialUser,
  appointments,
}: {
  initialUser: User;
  appointments: Appointment[];
}) {
  const [studentDetailsHidden, setStudentDetailsHidden] = useState(false);
  const [parentDetailsHidden, setParentDetailsHidden] = useState(true);
  const [user, setUser] = useState(initialUser);
  const [original, setOriginal] = useState(initialUser);
  const [editEmail, setEditEmail] = useState(false);

  const save = async () => {
    const { data, error } = await supabase
      .from("users")
      .update(user)
      .eq("id", user.id)
      .select()
      .single();
    if (error) {
      console.error(error);
      toast.error("Error saving student details");
      return;
    }
    toast.success("Student details saved");
    setUser(data);
    setOriginal(data);
  };

  useEffect(() => {
    if (window) {
      const showAlert = (e: any) => {
        if (!deepEquals(user, original)) {
          e.preventDefault();
          e.returnValue = "";
        }
      };

      window.addEventListener("beforeunload", showAlert);

      return () => {
        window.removeEventListener("beforeunload", showAlert);
      };
    }
  }, [user, original]);

  return (
    <div className="h-full min-h-screen bg-zinc-100 flex flex-col">
      <nav className="flex flex-row justify-between items-center px-4 py-1 bg-red-900 border-b-2 border-zinc-300">
        <div className="flex flex-row items-center">
          <Image alt="Logo" width={40} height={40} src="/favicon.png" />
          <h1 className="text-2xl font-medium font-serif text-white ml-2">
            BLC Attendance
          </h1>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <NewAppointment />
          <NewStudent />
          <span className="font-display text-lg ml-4 font-medium text-amber-400">
            ADMIN
          </span>
        </div>
      </nav>
      <div className="flex flex-row flex-grow w-full">
        <Sidebar section={undefined} />
        <div className="w-full">
          <div className="px-4 mx-auto flex flex-col gap-4 mt-12 w-full lg:px-0 lg:w-[50rem]">
            {user && appointments ? (
              <>
                <div className="flex flex-row gap-2 w-fit items-center">
                  <span className="text-4xl font-bold font-display text-text-500 rounded-sm bg-transparent h-fit">
                    <div
                      contentEditable
                      spellCheck="false"
                      onBlur={(e) => {
                        setUser({
                          ...user,
                          student_first: e.target.textContent ?? "",
                        });
                      }}
                      className="p-2 outline-none border-2 border-text-200/20 transition-all hover:border-text-200/50 focus:border-blue-500"
                      dangerouslySetInnerHTML={{
                        __html: user.student_first,
                      }}
                    />
                  </span>
                  <span className="text-4xl font-bold font-display text-text-500 rounded-sm w-fit bg-transparent h-fit">
                    <div
                      contentEditable
                      spellCheck="false"
                      onBlur={(e) =>
                        setUser({
                          ...user,
                          student_last: e.target.textContent ?? "",
                        })
                      }
                      className="p-2 outline-none border-2 border-text-200/20 transition-all hover:border-text-200/50 focus:border-blue-500"
                      dangerouslySetInnerHTML={{
                        __html: user.student_last,
                      }}
                    />
                  </span>
                </div>
                <div className="flex flex-col gap-6">
                  <div
                    className="w-full flex flex-row px-2 items-center justify-between border-b-2 border-b-zinc-300 cursor-pointer rounded-t-md py-3 hover:bg-zinc-200/50 transition-all duration-150"
                    onClick={() =>
                      setStudentDetailsHidden(!studentDetailsHidden)
                    }
                  >
                    <h3 className="text-2xl font-display font-medium text-text-300 select-none">
                      Student Details
                    </h3>
                    <ChevronRight
                      className={`${
                        !studentDetailsHidden && "rotate-90"
                      } transition-all duration-300`}
                    />
                  </div>
                  <div
                    className={`flex flex-col gap-6 ${
                      studentDetailsHidden ? "hidden" : ""
                    }`}
                  >
                    <table>
                      <tbody>
                        <tr>
                          <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                            First Name
                          </td>
                          <td className="py-3 text-lg w-5/6 text-text-300">
                            {user.student_first ?? ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                            Last Name
                          </td>
                          <td className="py-3 text-lg w-5/6 text-text-300">
                            {user.student_last ?? ""}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                            Grade
                          </td>
                          <td className="py-3 text-lg w-5/6 text-text-300">
                            {user.classOf && dayjs().year() >= user.classOf
                              ? "Graduated"
                              : 13 - (user.classOf - dayjs().year())}
                            <span className="text-text-200">
                              {" "}
                              &#40;Class of
                              <input
                                type="number"
                                className="w-20 text-lg text-text-300 bg-transparent border-2 border-text-200/20 transition-all hover:border-text-200/50 focus:border-blue-500 rounded-sm px-1 ml-1"
                                value={user.classOf ?? dayjs().year()}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    classOf: parseInt(e.target.value),
                                  })
                                }
                              />
                              &#41;
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                            School
                          </td>
                          <td className="py-3 text-lg w-5/6 text-text-300">
                            <input
                              type="text"
                              className="text-lg text-text-300 bg-transparent border-2 border-text-200/20 transition-all hover:border-text-200/50 focus:border-blue-500 rounded-sm px-1"
                              value={user.school ?? ""}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  school: e.target.value,
                                })
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                            Billing Rate
                          </td>
                          <td className="py-3 flex flex-row items-center text-lg w-5/6 text-text-300">
                            <DollarSign />
                            <input
                              type="number"
                              className="text-lg w-20 text-text-300 bg-transparent border-2 border-text-200/20 transition-all hover:border-text-200/50 focus:border-blue-500 rounded-sm px-1"
                              value={user.billing_rate ?? ""}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  billing_rate: parseInt(e.target.value),
                                })
                              }
                            />
                            <span className="text-xl">/hr</span>
                            <span className="text-text-200 ml-1">
                              &#40;{user.student_first} has had{" "}
                              {appointments.length} appointments&#41;
                            </span>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="flex flex-col gap-2">
                      <span className="text-xl font-display font-bold text-text-300">
                        Notes
                      </span>
                      <textarea
                        className="text-text-300 rounded-md bg-zinc-200/50 hover:bg-zinc-200 transition-all duration-300 p-4 resize-none outline-none border-2 border-text-200"
                        value={user.notes}
                        onChange={(e) =>
                          setUser({
                            ...user,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div
                    className="w-full flex flex-row px-2 items-center justify-between border-b-2 border-b-zinc-300 py-3 rounded-t-md hover:bg-zinc-200/50 transition-all duration-150 cursor-pointer"
                    onClick={() => setParentDetailsHidden(!parentDetailsHidden)}
                  >
                    <h3 className="text-2xl font-display font-medium text-text-300 select-none">
                      Parent Details
                    </h3>
                    <ChevronRight
                      className={`${
                        !parentDetailsHidden && "rotate-90"
                      } transition-all duration-300`}
                    />
                  </div>
                  <div
                    className={`flex flex-col gap-6 ${
                      parentDetailsHidden ? "hidden" : ""
                    }`}
                  >
                    <table className="w-full">
                      <tbody>
                        {original.parent_first && (
                          <tr>
                            <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                              First Name
                            </td>
                            <td className="py-3 text-lg w-5/6 text-text-300">
                              <input
                                type="text"
                                className="text-lg text-text-300 bg-transparent border-2 border-text-200/20 transition-all focus:border-blue-500 outline-none rounded-sm px-1"
                                value={user.parent_first}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    parent_first: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </tr>
                        )}
                        {original.parent_last && (
                          <tr>
                            <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                              Last Name
                            </td>
                            <td className="py-3 text-lg w-5/6 text-text-300">
                              <input
                                type="text"
                                className="text-lg text-text-300 bg-transparent border-2 border-text-200/20 transition-all focus:border-blue-500 outline-none rounded-sm px-1"
                                value={user.parent_last}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    parent_last: e.target.value,
                                  })
                                }
                              />
                            </td>
                          </tr>
                        )}
                        <tr>
                          <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                            Email
                          </td>
                          <td
                            className={`py-3 flex flex-row gap-2 items-center align-middle ${
                              editEmail && "w-full"
                            }`}
                          >
                            <a
                              href={
                                editEmail ? "" : `mailto:${user.parent_email}`
                              }
                              contentEditable={editEmail}
                              className={`text-lg whitespace-nowrap px-1 border-2 outline-none  ${
                                editEmail
                                  ? "text-text-300 bg-transparent border-text-200/20 transition-all focus:border-blue-500 rounded-sm max-w-full min-w-[5rem]"
                                  : "underline border-transparent"
                              }`}
                              onBlur={(e) => {
                                if (e.target.innerText != "") {
                                  setUser({
                                    ...user,
                                    parent_email: e.target.innerText,
                                  });
                                  setEditEmail(false);
                                }
                              }}
                              onBeforeInput={(e: any) => {
                                if (e.data == "\n") {
                                  e.preventDefault();
                                }
                              }}
                              onPaste={(e: any) => {
                                console.log(e);
                              }}
                              dangerouslySetInnerHTML={{
                                __html: user.parent_email,
                              }}
                            />
                            <button
                              className="flex flex-row w-fit gap-2 text-text-300 border-2 border-zinc-300 font-display rounded-sm items-center hover:bg-zinc-200/30 p-1 transition-all duration-150"
                              onClick={() => setEditEmail(!editEmail)}
                            >
                              {editEmail ? (
                                <X className="w-5 h-5 text-red-700" />
                              ) : (
                                <Pencil className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td className="py-3 text-xl w-1/6 font-display font-bold text-text-300">
                            Phone
                          </td>
                          <td className="py-3 text-lg w-5/6 text-text-300">
                            <input
                              type="tel"
                              className="text-lg text-text-300 bg-transparent border-2 border-text-200/20 transition-all focus:border-blue-500 outline-none rounded-sm px-1"
                              value={user.phone_number}
                              pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                              required
                              onChange={(e) => {
                                setUser({
                                  ...user,
                                  phone_number: e.target.value,
                                });
                              }}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-display font-medium text-text-400 select-none">
                      Appointments
                    </h2>
                    <UserAppointments appointments={appointments} />
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <Loader2 className="animate-spin w-10 h-10 text-red-800" />
              </div>
            )}
          </div>
          <div
            className={`fixed w-full transition-all duration-300 ${
              deepEquals(user, original) ? "-bottom-20" : "bottom-10"
            }`}
          >
            <div className="w-4/5 mx-auto rounded-sm bg-zinc-800 px-4 py-2 flex flex-row justify-between items-center">
              <span className="text-text-200 font-medium">
                You&apos;ve made changes to this user.
              </span>
              <div className="flex flex-row gap-4 items-center">
                <button
                  onClick={() => {
                    setUser(original);
                  }}
                  className="rounded-sm hover:bg-white/10 text-text-100 px-2 py-1 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="rounded-sm bg-emerald-600 hover:bg-emerald-700 transition-all text-white px-2 py-1"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type Params = {
  id: string;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as Params;
  const { data: user, error: userError } = await supabase
    .from("users")
    .select()
    .eq("id", id)
    .single();
  if (userError) {
    console.error(userError);
    return {
      notFound: true,
    };
  }
  const { data: appointments, error: appointmentsError } = await supabase
    .from("appointments")
    .select(
      `
        *
    `
    )
    .eq("user", id)
    .order("date", { ascending: false });
  if (appointmentsError) {
    console.error(appointmentsError);
    return {
      notFound: true,
    };
  }
  return {
    props: {
      initialUser: user,
      appointments,
    },
  };
};
