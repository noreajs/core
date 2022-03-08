import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * Check if the value is great or equal to the min
 *
 * @param min target
 * @returns Validator.RuleType
 */
const numberItemMinRule = (min: string | number): Validator.RuleType => {
  return {
    message: (_value, field, _origin) => {
      // load min value
      const minValue = typeof min === "number" ? min : Number(min);

      return `\`${field}\` item minimum value is ${minValue}`;
    },
    validator: (value, _field, _origin, def) => {
      try {
        if (isFilled(value)) {
          // load type
          const type = Array.isArray(def.type) ? def.type[0] : def.type;
          // load min value
          const minValue = typeof min === "number" ? min : Number(min);

          switch (type) {
            case "array":
              return Array.from(value).every(
                (item) => typeof item === "number" && item >= minValue
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

export default numberItemMinRule;
