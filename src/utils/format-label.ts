/**
 * Formats a field key into a user-friendly label
 * e.g., "first_name" becomes "First Name", "contactId" becomes "Contact Id"
 */
export function formatFieldLabel(key: string): string {
  // First, handle camelCase by inserting spaces before capital letters
  let formatted = key.replace(/([a-z])([A-Z])/g, '$1 $2');
  // Then, handle snake_case by replacing underscores with spaces
  formatted = formatted.replace(/_/g, ' ');
  // Finally, capitalize the first letter of each word
  return formatted
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}