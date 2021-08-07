import { Validator } from "../validator";

/**
 * Check if the value or item's of value ends with the given pattern
 * @param pattern pattern
 * @returns Validator.RuleType
 */
const endWithRule = (pattern: string): Validator.RuleType => {
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
            if (!item.endsWith(pattern)) {
              return false;
            }
          }
          return true;
        } else {
          return value.endsWith(pattern);
        }
      } catch (error) {
        return error?.message ?? false;
      }
    },
  };
};

export default endWithRule;
