import { Validator } from "../validator";

/**
 * Check if the value is among the given elements
 * @param list list of elements
 */
const minRule = (min: string | number): Validator.RuleType => {
  return {
    message: (_value, field, _origin, def, data) => {
      // load type
      const type = Array.isArray(def.type) ? def.type[0] : def.type;
      // load min value
      const minValue = typeof min === "number" ? min : Number(min);

      return `\`${field}\` field minimum ${
        type === "string" ? "length" : type === "array" ? "size" : "value"
      } is ${minValue}`;
    },
    validator: (value, _field, _origin, def) => {
      try {
        // load type
        const type = Array.isArray(def.type) ? def.type[0] : def.type;
        // load min value
        const minValue = typeof min === "number" ? min : Number(min);

        switch (type) {
          case "int":
          case "long":
          case "timestamp":
          case "decimal":
          case "double":
            return Number(value) >= minValue;

          case "string":
            return `${value}`.length >= minValue;

          case "array":
            return Array.from(value).length >= minValue;

          default:
            return true;
        }
      } catch (error) {
        return error.message ?? false;
      }
    },
  };
};

export default minRule;
