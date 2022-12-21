export default function getTagColor(tag: string) {
    switch (tag) {
        case "scheduled":
            return "bg-blue-400/20";
        case "cancelled":
            return "bg-red-600/40";
        case "attended":
            return "bg-green-600/40";
        default:
            return "bg-gray-600/40";
    }
}