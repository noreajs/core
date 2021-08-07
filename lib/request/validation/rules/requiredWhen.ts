import { Validator } from "../validator";

/**
 * Required when a test function return true
 *
 * @param test closure to run
 * @returns Validator.RuleType
 */
function requiredWhenRule<T = any>(
  test: (data: T, value: any) => Promise<boolean> | boolean
): Validator.RuleType {
  return {
    message: (_value, field, _origin, def, data) => {
      return `\`${field}\` is required`;
    },
    validator: async (value, _field, _origin, _def, data) => {
      return await test(data, value);
    },
  };
}

export default requiredWhenRule;
