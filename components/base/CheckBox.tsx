import { Check } from "lucide-react";

export default function CheckBox({
  checked,
  onChange,
  className,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <div
      onClick={() => onChange(!checked)}
      className="w-10 h-5 relative border rounded-lg flex items-center"
    >
      <div
        className={`${
          !checked ? "left-0 bg-gray-300" : "left-5 bg-emerald-600"
        } absolute transition-all rounded-lg w-5 h-5`}
      />
    </div>
  );
}
