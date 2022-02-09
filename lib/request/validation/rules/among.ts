import { isFilled } from "../helpers";
import { Validator } from "../validator";

/**
 * Check if the value is among the given elements
 * @param list list of elements
 */
const amongRule = (list: (string | number)[]): Validator.RuleType => {
  var localValues: any[] = list;
  if (!Array.isArray(list)) {
    localValues = [list];
  }

  if (localValues.length !== 0) {
    return {
      message: (value, field, _origin, _def, _data) => {
        if (Array.isArray(value)) {
          return `Each item of \`${field}\` must be among [${localValues
            .map((v) => `\`${v}\``)
            .join(", ")}]`;
        } else {
          return `\`${field}\` must be among [${localValues
            .map((v) => `\`${v}\``)
            .join(", ")}]`;
        }
      },
      validator: (value, _field, origin, _def) => {
        try {
          if (isFilled(value)) {
            if (Array.isArray(value)) {
              for (const item of value) {
                if (origin === "body") {
                  if (!localValues.includes(item)) {
                    return false;
                  }
                } else {
                  if (
                    !localValues.includes(item) &&
                    !localValues.map((v) => `${v}`).includes(item)
                  ) {
                    return false;
                  }
                }
              }
              return true;
            } else {
              if (origin === "body") {
                return localValues.includes(value);
              } else {
                return (
                  localValues.includes(value) ||
                  localValues.map((v) => `${v}`).includes(value)
                );
              }
            }
          } else {
            return true;
          }
        } catch (error) {
          return error?.message ?? false;
        }
      },
    };
  } else {
    // don't want to loose any time for no reason
    return {
      message: undefined,
      validator: () => {
        return true;
      },
    };
  }
};

export default amongRule;
