/**
 * Executes the render function received from the API to determine
 * which fields should be displayed and which should be hidden
 * based on field dependencies and current values.
 * 
 * @param renderFunction The render function string received from the API
 * @param fieldValuePairs Array of [fieldId, selectedValue] pairs
 * @returns [displayed, hidden] - two arrays containing field IDs
 */
export function executeRenderFunction(
  renderFunction: string,
  fieldValuePairs: [string | number, any][]
): [string[] | number[], string[] | number[]] {
  // Create a safe execution environment for the render function
  const fn = new Function('fieldValuePairs', `${renderFunction}; return render(fieldValuePairs);`);
  return fn(fieldValuePairs);
}

/**
 * A more robust version that handles errors and provides validation
 */
export function executeRenderFunctionSafely(
  renderFunction: string,
  fieldValuePairs: [string | number, any][]
): [string[] | number[], string[] | number[]] {
  try {
    // Validate inputs
    if (!renderFunction || typeof renderFunction !== 'string') {
      console.warn('Invalid render function provided');
      return [[], []]; // Return empty arrays if no valid render function
    }

    if (!Array.isArray(fieldValuePairs)) {
      console.warn('Invalid fieldValuePairs provided');
      return [[], []];
    }

    // Execute the render function in a safe way
    const fn = new Function('fieldValuePairs', `${renderFunction}; return render(fieldValuePairs);`);
    const result = fn(fieldValuePairs);

    if (!Array.isArray(result) || result.length !== 2) {
      console.warn('Render function did not return expected [displayed, hidden] arrays');
      return [[], []];
    }

    const [displayed, hidden] = result;
    
    if (!Array.isArray(displayed) || !Array.isArray(hidden)) {
      console.warn('Render function did not return arrays for [displayed, hidden]');
      return [[], []];
    }

    return [displayed, hidden];
  } catch (error) {
    console.error('Error executing render function:', error);
    // Return empty arrays if there's an error, so the app doesn't break
    return [[], []];
  }
}

/**
 * Creates a field visibility state and handles field value changes
 */
export interface FieldVisibility {
  displayed: Set<string | number>;
  hidden: Set<string | number>;
}

/**
 * Process form fields with render function to determine visibility
 * 
 * @param renderFunction The render function string from API
 * @param fields All available fields in the form
 * @param currentFieldValues Current field values in the form
 * @returns FieldVisibility object with displayed and hidden fields
 */
export function processFieldVisibility(
  renderFunction: string | undefined,
  fields: Array<{ id: string | number }>,
  currentFieldValues: Record<string | number, any>
): FieldVisibility {
  // If no render function is provided, show all fields
  if (!renderFunction) {
    return {
      displayed: new Set(fields.map(field => field.id)),
      hidden: new Set()
    };
  }

  // Build field value pairs from current form state
  const fieldValuePairs: [string | number, any][] = [];
  Object.entries(currentFieldValues).forEach(([fieldId, value]) => {
    // Only include values that are not null/undefined
    if (value !== null && value !== undefined) {
      fieldValuePairs.push([fieldId, value]);
    }
  });

  // Execute the render function to get visibility lists
  const [displayedFieldIds, hiddenFieldIds] = executeRenderFunctionSafely(renderFunction, fieldValuePairs);

  // Convert to Sets for efficient lookups
  const displayedSet = new Set<string | number>(displayedFieldIds);
  const hiddenSet = new Set<string | number>(hiddenFieldIds);

  // Only include fields that exist in the form (from the API response)
  fields.forEach(field => {
    // If field is not in either set, default to showing it
    if (!displayedSet.has(field.id) && !hiddenSet.has(field.id)) {
      displayedSet.add(field.id);
    }
  });

  return {
    displayed: displayedSet,
    hidden: hiddenSet
  };
}