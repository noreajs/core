import moment, { relativeTimeRounding } from "moment";
import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * After date rule
 * @param date moment.MomentInput
 * @param strict strict mode
 * @returns Validator.RuleType
 */
const afterDateRule = (
  date: moment.MomentInput,
  strict: boolean = true
): Validator.RuleType => {
  return {
    message: (_value, field, _origin, def, data) => {
      return `\`${field}\` field value must be after \`${moment(
        date
      ).calendar()}\``;
    },
    validator: (value, _field, _origin, def, data) => {
      try {
        if (isFilled(value)) {
          if (strict) {
            return moment(value).isAfter(moment(date));
          } else {
            return moment(value).isSameOrAfter(moment(date));
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

export default afterDateRule;
