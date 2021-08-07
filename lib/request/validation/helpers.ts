/**
 * Checking if the given value is filled
 * @param value value
 * @returns boolean
 */
export const isFilled = (value: any) => {
  if (value !== null && value !== undefined) {
    if (typeof value === "string") {
      return `${value}`.length !== 0;
    } else if (Array.isArray(value)) {
      return value.length !== 0;
    } else {
      return true;
    }
  } else {
    return false;
  }
};
