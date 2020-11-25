import { Validator } from "../validator";

/**
 * Check if the value is among the given elements
 * @param list list of elements
 */
const maxRule = (max: string | number): Validator.RuleType => {
  return {
    message: (_value, field, _origin, def, data) => {
      // load type
      const type = Array.isArray(def.type) ? def.type[0] : def.type;
      // load max value
      const maxValue = typeof max === "number" ? max : Number(max);

      return `\`${field}\` field maximum ${
        type === "string" ? "length" : type === "array" ? "size" : "value"
      } is ${maxValue}`;
    },
    validator: (value, _field, _origin, def) => {
      try {
        // load type
        const type = Array.isArray(def.type) ? def.type[0] : def.type;
        // load max value
        const maxValue = typeof max === "number" ? max : Number(max);

        switch (type) {
          case "int":
          case "long":
          case "timestamp":
          case "decimal":
          case "double":
            return Number(value) <= maxValue;

          case "string":
            return `${value}`.length <= maxValue;

          case "array":
            return Array.from(value).length <= maxValue;

          default:
            return true;
        }
      } catch (error) {
        return error.message ?? false;
      }
    },
  };
};

export default maxRule;
