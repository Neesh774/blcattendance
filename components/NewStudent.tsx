import { Plus, X } from "lucide-react";
import Drawer from "./base/Drawer";

export default function NewStudent() {
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
      footer={() => <span>footer</span>}
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
      <span>something</span>
    </Drawer>
  );
}
