import { Validator } from "../validator";

/**
 * Check if the value is among the given elements
 * @param list list of elements
 */
const notAmongRule = (list: (string | number)[]): Validator.RuleType => {
  if (list.length !== 0) {
    return {
      message: (_value, field) => {
        return `\`${field}\` value must not be among [${list.join(", ")}]`;
      },
      validator: (value, _field, origin) => {
        if (origin === "body") {
          return !list.includes(value);
        } else {
          return !list.includes(value) || !list.includes(parseInt(value));
        }
      },
    };
  } else {
    return undefined;
  }
};

export default notAmongRule;
