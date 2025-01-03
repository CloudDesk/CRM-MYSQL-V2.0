/**
 * Formats a date into a standardized string format
 * @param {Date|null} [date] - Optional date object. If null/undefined, uses current date
 * @param {string} [format='iso'] - Format type ('iso' or 'readable')
 * @returns {string} Formatted date string
 */
export const formatDate = (date = null, format = "iso") => {
  try {
    // If date is null/undefined, use current date
    const dateObj = date ? new Date(date) : new Date();

    // Validate date
    if (isNaN(dateObj.getTime())) {
      throw new Error("Invalid date");
    }

    switch (format) {
      case "iso":
        // Format: YYYY-MM-DD-HH-mm-ss
        return dateObj
          .toISOString()
          .slice(0, 19)
          .replace("T", "-")
          .replace(/:/g, "-");

      case "readable":
        // Format: DD-MM-YYYY_HH-mm-ss
        return dateObj
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false, // Use 24-hour format
          })
          .replace(/[/:]/g, "-")
          .replace(",", ""); // Remove comma between date and time

      default:
        return dateObj
          .toISOString()
          .slice(0, 19)
          .replace("T", "-")
          .replace(/:/g, "-");
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    // Return current date if there's an error
    return formatDate(new Date());
  }
};
