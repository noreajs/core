import { isFilled } from "../helpers";
import { Validator } from "../validator";

export type DistinctRuleOptionsType<T = any> = {
  /**
   * When item type is not a string or a number, this function will be use to convert to string
   */
  toString?: (value: T) => string;

  /**
   * Custom error message
   */
  message?: string;
};

/**
 * Check the uniqueness of array elements
 * @param {DistinctRuleOptionsType} options
 * @returns Validator.RuleType
 */
function distinctRule<T = any>(
  options?: DistinctRuleOptionsType<T>
): Validator.RuleType {
  return {
    message: (value, field, _origin, def, data) => {
      // load type
      const type = Array.isArray(def.type) ? def.type[0] : def.type;
      if (typeof options?.message === "string") {
        return options?.message
          .replace(new RegExp("{{value}}", "g"), value)
          .replace(new RegExp("{{field}}", "g"), field);
      } else {
        return `The field \`${field}\` items must be unique`;
      }
    },
    validator: (value, field, _origin, def, data) => {
      try {
        // load type
        const type = Array.isArray(def.type) ? def.type[0] : def.type;

        /**
         * Sort object by property name
         * @param o object
         * @returns object
         */
        function sortObject(o): any {
          let sorted = {},
            key,
            a = [];

          for (key in o) {
            if (o.hasOwnProperty(key)) {
              a.push(key);
            }
          }

          a.sort();

          for (key = 0; key < a.length; key++) {
            const val = o[a[key]];
            sorted[a[key]] = typeof val === "object" ? sortObject(val) : val;
          }
          return sorted;
        }

        /**
         * Get items as string
         * @param value array
         * @returns string[]
         */
        const getItemsAsString = (value) => {
          const strArr: string[] = [];
          // only array authorized
          if (Array.isArray(value)) {
            for (const item of value) {
              if (["string", "number"].includes(typeof item)) {
                strArr.push(`${item}`);
              } else {
                if (
                  options?.toString !== null &&
                  options?.toString !== undefined
                ) {
                  switch (typeof item) {
                    case "object":
                      strArr.push(options.toString(sortObject(item)));
                      break;

                    default:
                      strArr.push(options.toString(item));
                      break;
                  }
                } else {
                  throw {
                    message: `\`toString\` function is needed when element types are not \`string\` or \`number\``,
                  };
                }
              }
            }
            return strArr;
          } else {
            throw { message: `The field \`${field}\` value must be an array` };
          }
        };

        // the value is filled
        if (isFilled(value)) {
          // get value items as string
          const values = getItemsAsString(value);
          const tested = [];

          for (const item of values) {
            if (tested.includes(item)) {
              return false;
            } else {
              tested.push(item);
            }
          }
          return true;
        } else {
          return true;
        }
      } catch (error) {
        return error.message ?? false;
      }
    },
  };
}

export default distinctRule;
