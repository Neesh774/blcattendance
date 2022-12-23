import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Drawer({
  header,
  footer,
  children,
  target,
}: {
  header: (closeDrawer: () => void) => JSX.Element;
  footer: (closeDrawer: () => void) => JSX.Element;
  children: JSX.Element;
  target: (openDrawer: () => void) => JSX.Element;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const closeDrawer = () => setIsOpen(false);
  const openDrawer = () => setIsOpen(true);

  return (
    <>
      <div
        className={`fixed inset-0 overflow-hidden pointer-events-none z-10 transition-all ${
          isOpen ? "bg-black/40 pointer-events-auto" : ""
        }`}
        onClick={() => closeDrawer()}
      >
        <div
          className={`absolute right-0 top-0 bottom-0 flex flex-col z-20 overflow-hidden w-96 bg-zinc-50 transition-all duration-150 ${
            isOpen ? "pointer-events-auto shadow-lg" : "translate-x-96"
          }`}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div className="flex flex-grow flex-col gap-2 pt-8 px-4">
            {header(closeDrawer)}
            {children}
          </div>
          <div className="bg-zinc-200/50 border-t border-zinc-300 px-4 py-6">
            {footer(closeDrawer)}
          </div>
        </div>
      </div>
      {target(openDrawer)}
    </>
  );
}
