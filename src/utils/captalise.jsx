
export default function captalize(string) {
    // Check if the input is a non-empty string to avoid errors
    if (typeof string !== "string" || string.length === 0) {
      return string;
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
  
}
