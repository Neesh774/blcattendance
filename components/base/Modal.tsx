import { HelpCircle, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

export default function Modal({
  target,
  children,
  header,
  footer,
  className,
}: {
  target: (openModal: any) => ReactNode;
  children: (closeModal: any) => ReactNode;
  header?: ReactNode;
  footer?: (closeModal: any) => ReactNode;
  className?: string;
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
        className={`fixed inset-0 overflow-hidden justify-center flex items-center pointer-events-none z-10 transition-all ${
          isOpen ? "bg-black/40 pointer-events-auto" : ""
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`xl:w-1/2 lg:w-4/5 w-full h-full lg:h-fit rounded-lg bg-zinc-100 z-50 flex flex-col pt-2 transition-all duration-150 ease-out ${
            !isOpen
              ? "opacity-50 lg:opacity-0 pointer-events-none translate-y-24 lg:translate-y-12"
              : "opacity-100 translate-y-0 h-fit"
          } ${!bgDelay && "delay-100"} ${className}`}
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
          {footer && (
            <div className="flex p-4 bg-zinc-200 border-t-2 border-zinc-500 rounded-b-lg">
              {footer(() => setIsOpen(false))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
