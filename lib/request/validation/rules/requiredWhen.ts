import { Request } from "express";
import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * Required when a test function return true
 *
 * @param test closure to run
 * @returns Validator.RuleType
 */
function requiredWhenRule<T = any>(
  test: (
    data: T,
    value: any,
    request: Request
  ) => Promise<boolean | string> | boolean | string
): Validator.RuleType {
  return {
    message: (_value, field, _origin, def, data) => {
      return `\`${field}\` is required`;
    },
    validator: async (value, _field, _origin, _def, data, request) => {
      // run test closure
      const testResult = await test(data, value, request);
      // get required state
      const isRequired =
        (typeof testResult === "boolean" && testResult === true) ||
        typeof testResult === "string";
      // validation result
      const validationResult = !isRequired || isFilled(value);
      // return validation result
      return (
        validationResult ??
        (typeof testResult === "string" ? testResult : false)
      );
    },
  };
}

export default requiredWhenRule;
