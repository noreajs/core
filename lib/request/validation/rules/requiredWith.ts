import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * Required with rule
 * 
 * @param dependencies dependencies
 * @param strict true for AND connector and false for OR connector
 * @returns Validator.RuleType
 */
const requiredWithRule = (
  dependencies: string | string[],
  strict: boolean = false
): Validator.RuleType => {
  return {
    message: (_value, field, _origin, def, data) => {
      if (Array.isArray(dependencies)) {
        if (strict) {
          return `\`${field}\` is required when all of the following fields are filled: ${dependencies
            .map((d) => `\`${d}\``)
            .join(", ")} `;
        } else {
          return `\`${field}\` is required when one of the following fields is filled: ${dependencies
            .map((d) => `\`${d}\``)
            .join(", ")} `;
        }
      } else {
        return `\`${field}\` is required when \`${dependencies}\` is filled`;
      }
    },
    validator: (value, _field, _origin, def, data) => {
      if (Array.isArray(dependencies)) {
        // no value
        if (!isFilled(value)) {
          // all dependencies are verified
          if (strict) {
            let filledCount = 0;
            for (const dependency of dependencies) {
              if (isFilled(data[dependency])) {
                filledCount += 1;
              }
            }
            return filledCount !== dependencies.length;
          } else {
            let filledCount = 0;
            for (const dependency of dependencies) {
              if (isFilled(data[dependency])) {
                filledCount += 1;
              }
            }
            return filledCount === 0;
          }
        } 
        // value exists
        return true;
      } else {
        return !isFilled(value) && !isFilled(dependencies);
      }
    },
  };
};

export default requiredWithRule;
