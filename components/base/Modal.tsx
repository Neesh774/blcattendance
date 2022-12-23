import { HelpCircle, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export default function Modal({
  target,
  children,
  header,
}: {
  target: (openModal: any) => ReactNode;
  children: (closeModal: any) => ReactNode;
  header?: ReactNode;
}) {
  const [bgDelay, setBgDelay] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setBgDelay(true), 100);
      addEventListener("keydown", (e) => {
        if (e.key == "Escape") {
          setIsOpen(false);
        }
      });
    } else {
      setTimeout(() => setBgDelay(false), 100);
      removeEventListener("keydown", (e) => {
        if (e.key == "Escape") {
          setIsOpen(false);
        }
      });
    }
  }, [isOpen, setIsOpen]);

  return (
    <>
      {target(() => setIsOpen(!isOpen))}
      <div
        className={`fixed inset-0 overflow-hidden justify-center flex items-center pointer-events-none z-10 py-96 transition-all ${
          isOpen ? "bg-black/40 pointer-events-auto" : ""
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`lg:w-1/2 w-full h-full lg:h-fit rounded-lg bg-zinc-100 z-50 flex flex-col px-2 pb-8 pt-2 transition-all duration-150 ease-out ${
            !isOpen
              ? "opacity-50 lg:opacity-0 pointer-events-none translate-y-24 lg:translate-y-12"
              : "opacity-100 translate-y-0 h-fit"
          } ${!bgDelay && "delay-100"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4">
            {header}
            <button
              className="w-8 h-8 flex justify-center items-center rounded-md hover:bg-zinc-300/10 transition-all duration-100"
              onClick={() => setIsOpen(false)}
            >
              <X />
            </button>
          </div>
          <div className="p-8 flex flex-col gap-4">
            {children(() => setIsOpen(false))}
          </div>
        </div>
      </div>
    </>
  );
}
