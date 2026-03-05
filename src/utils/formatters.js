// File: src/utils/formatters.js
export const formatDuration = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "N/A";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
};
export const formatDate = (dateInput) => {
    if (!dateInput) return "N/A";
    try {
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch (error) {
        console.error("Error formatting date:", error); // Keep console.error for actual errors
        return "Invalid Date";
    }
};
