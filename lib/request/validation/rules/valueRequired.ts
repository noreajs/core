import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * Required rule
 */
const requiredRule: Validator.RuleType = {
  message: (_value, field) => {
    return `The field \`${field}\` is required`;
  },
  validator: (value, _field) => {
    return isFilled(value);
  },
};

export default requiredRule;
