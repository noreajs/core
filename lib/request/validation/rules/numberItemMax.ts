import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * Check if the value is less or equal to the given max value
 *
 * @param max target
 * @returns Validator.RuleType
 */
const numberItemMaxRule = (max: string | number): Validator.RuleType => {
  return {
    message: (_value, field, _origin) => {
      // load max value
      const maxValue = typeof max === "number" ? max : Number(max);

      return `\`${field}\` item maximum value is ${maxValue}`;
    },
    validator: (value, _field, _origin, def) => {
      try {
        if (isFilled(value)) {
          // load type
          const type = Array.isArray(def.type) ? def.type[0] : def.type;
          // load max value
          const maxValue = typeof max === "number" ? max : Number(max);

          switch (type) {
            case "array":
              return Array.from(value).every(
                (item) => typeof item === "number" && item <= maxValue
              );

            default:
              return true;
          }
        } else {
          return true;
        }
      } catch (error) {
        return error.message ?? false;
      }
    },
  };
};

export default numberItemMaxRule;
