import { isFilled } from "../helpers";
import { Validator } from "../validator";
import moment from "moment";

/**
 * Required rule
 */
const dateRule: Validator.RuleType = {
  message: (_value, field) => {
    return `The field \`${field}\` must be a valid date`;
  },
  validator: (value, _field) => {
    return isFilled(value) ? moment(value).isValid() : true;
  },
};

export default dateRule;
