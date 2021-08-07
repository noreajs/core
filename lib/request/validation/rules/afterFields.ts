import moment, { relativeTimeRounding } from "moment";
import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * After a field rule
 * @param dependencies dependencies
 * @param strict strict mode
 * @returns Validator.RuleType
 */
const afterFieldsRule = (
  dependencies: string | string[],
  strict: boolean = true
): Validator.RuleType => {
  return {
    message: (_value, field, _origin, def, data) => {
      // load type
      const type = Array.isArray(def.type) ? def.type[0] : def.type;
      if (Array.isArray(dependencies)) {
        return `\`${field}\` field value must be after the following fields: ${dependencies
          .map((d) => `\`${d}\``)
          .join(", ")}`;
      } else {
        return `\`${field}\` field value must be after ${dependencies}`;
      }
    },
    validator: (value, _field, _origin, def, data) => {
      /**
       * Test a single dependency
       * @param dependencyValue depenency value
       * @returns boolean
       */
      const singleTest = (dependencyValue: any) => {
        // load type
        const type = Array.isArray(def.type) ? def.type[0] : def.type;
        // dependency value filled
        if (isFilled(dependencyValue)) {
          switch (type) {
            case "int":
            case "long":
            case "timestamp":
            case "decimal":
            case "double":
              if (strict) {
                return Number(value) > dependencyValue;
              } else {
                return Number(value) >= dependencyValue;
              }

            case "date":
              if (strict) {
                return moment(value).isAfter(moment(dependencyValue));
              } else {
                return moment(value).isSameOrAfter(moment(dependencyValue));
              }

            case "array":
              if (strict) {
                return (
                  Array.from(value).length > Array.from(dependencyValue).length
                );
              } else {
                return (
                  Array.from(value).length >= Array.from(dependencyValue).length
                );
              }

            case "string":
              if (typeof dependencyValue === "string") {
                if (strict) {
                  return `${value}`.length > dependencyValue.length;
                } else {
                  return `${value}`.length >= dependencyValue.length;
                }
              } else {
                return true;
              }
          }
          return true;
        }
      };

      try {
        if (isFilled(value)) {
          if (Array.isArray(dependencies)) {
            for (const dependency of dependencies) {
              // test dependency
              if (!singleTest(data[dependency])) {
                return false;
              }
            }
            return true;
          } else {
            return singleTest(data[dependencies]);
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

export default afterFieldsRule;
