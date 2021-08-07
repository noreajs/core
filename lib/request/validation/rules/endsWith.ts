import { Validator } from "../validator";

/**
 * Check if the value or item's of value ends with the given pattern
 * @param pattern pattern
 * @param caseSensitive case sensitive
 * @returns Validator.RuleType
 */
const endWithRule = (
  pattern: string,
  caseSensitive: boolean = true
): Validator.RuleType => {
  return {
    message: (value, field) => {
      if (Array.isArray(value)) {
        return `Each item of \`${field}\` must end with \`${pattern}\``;
      } else {
        return `The field \`${field}\` value must end with \`${pattern}\``;
      }
    },
    validator: (value: string | string[], _field, _origin, def) => {
      try {
        if (Array.isArray(value)) {
          for (const item of value) {
            if (caseSensitive) {
              if (!item.endsWith(pattern)) {
                return false;
              }
            } else {
              if (!item.toLowerCase().endsWith(pattern.toLowerCase())) {
                return false;
              }
            }
          }
          return true;
        } else {
          if (caseSensitive) {
            return value.endsWith(pattern);
          } else {
            return value.toLowerCase().endsWith(pattern.toLowerCase());
          }
        }
      } catch (error) {
        return error?.message ?? false;
      }
    },
  };
};

export default endWithRule;
