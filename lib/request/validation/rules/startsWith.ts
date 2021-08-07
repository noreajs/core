import { Validator } from "../validator";

/**
 * Check if the value or item's of value starts with the given pattern
 *
 * @param pattern pattern
 * @param caseSensitive case sensitive
 * @returns Validator.RuleType
 */
const startWithRule = (
  pattern: string,
  caseSensitive: boolean = true
): Validator.RuleType => {
  return {
    message: (value, field) => {
      if (Array.isArray(value)) {
        return `Each item of \`${field}\` must start with \`${pattern}\``;
      } else {
        return `The field \`${field}\` value must start with \`${pattern}\``;
      }
    },
    validator: (value: string | string[], _field, _origin, def) => {
      try {
        if (Array.isArray(value)) {
          for (const item of value) {
            if (caseSensitive) {
              if (!item.startsWith(pattern)) {
                return false;
              }
            } else {
              if (!item.toLowerCase().startsWith(pattern.toLowerCase())) {
                return false;
              }
            }
          }
          return true;
        } else {
          if (caseSensitive) {
            return value.startsWith(pattern);
          } else {
            return value.toLowerCase().startsWith(pattern.toLowerCase());
          }
        }
      } catch (error) {
        return error?.message ?? false;
      }
    },
  };
};

export default startWithRule;
