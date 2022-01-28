import { NextFunction, Request, Response } from "express";
import requiredRule from "./rules/valueRequired";

export namespace Validator {
  export type DataOriginType = "query" | "body" | "params";
  export type FieldType =
    | "any"
    | "string"
    | "object"
    | "array"
    | "bool"
    | "date"
    | "timestamp"
    | "number"
    | "double"
    | "int"
    | "long"
    | "decimal";

  export interface RuleType {
    message?:
      | string
      | ((
          value: any,
          field: string,
          origin: DataOriginType,
          options: FieldValidationOptions,
          data: any,
          request: Request
        ) => string | Promise<string>);
    validator: (
      value: any,
      field: string,
      origin: DataOriginType,
      options: FieldValidationOptions,
      data: any,
      request: Request
    ) => Promise<string | boolean> | string | boolean;
  }

  export interface FieldValidationOptions<Type = any> {
    type: FieldType | [FieldType, string];
    required?: boolean | string;
    rules?: RuleType[];
    validator?: ValidateOptions<Type>;
  }

  export type ValidateOptions<BodyType = any> = {
    [key in keyof BodyType]: FieldValidationOptions;
  };

  export interface ValidationError {
    origin: DataOriginType;
    field: string;
    type: FieldType;
    value: any;
    message: string[];
  }

  export interface ValidationResult {
    message?: string;
    errors: ValidationError[];
  }

  /**
   * Validation middleware
   * @param origin data origin
   * @param options validation options
   */
  export function validateRequest<BodyType = any>(
    origin: DataOriginType,
    options: ValidateOptions<BodyType>
  ) {
    return async (request: Request, response: Response, next: NextFunction) => {
      // validate the request
      const validationResult = await validate(request, origin, options);

      // no errors
      if (validationResult.errors.length === 0) {
        return next();
      } else {
        return response.status(422).json(validationResult);
      }
    };
  }

  /**
   * Validate a request data
   *
   * @param request express request
   * @param origin data origin
   * @param options validation options
   */
  export async function validate<BodyType = any>(
    request: Request,
    origin: "query" | "body" | "params",
    options: ValidateOptions<BodyType>
  ): Promise<ValidationResult> {
    // load data
    const data = request[origin];

    // initialize error
    const result: ValidationResult = {
      errors: [],
    };

    // validate data
    await validateContent(request, data, origin, options, result);

    return {
      message: result.errors
        .map((error) => {
          return error.message.join("; ");
        })
        .join("; "),
      errors: result.errors,
    };
  }

  /**
   * Validate a request data
   *
   * @param data any
   * @param origin data origin
   * @param options validation options
   */
  export async function validateContent<ContentType = any>(
    request: Request,
    data: any,
    origin: "query" | "body" | "params",
    options: ValidateOptions<ContentType>,
    result: ValidationResult,
    prefix?: string
  ): Promise<void> {
    /**
     * Add error in the result
     * @param error error payload
     */
    const addError = (error: ValidationError) => {
      var found = false;
      for (let index = 0; index < result.errors.length; index++) {
        const element = result.errors[index];
        if (error.field === element.field) {
          element.message.push(...error.message);
          found = true;
          break;
        }
      }
      if (!found) {
        result.errors.push(error);
      }
    };

    // browse fields
    for (const field of Object.keys(options)) {
      // load options
      const def: FieldValidationOptions = options[field];

      // load field type
      const fieldType = Array.isArray(def.type) ? def.type[0] : def.type;

      // load value
      const value = data[field];

      // is required
      const isRequired = ((): boolean => {
        if (typeof def.required === "boolean") {
          return def.required === true;
        } else if (typeof def.required === "string") {
          return true;
        } else {
          return false;
        }
      })();

      /**
       * Required Rule validation
       * --------------------------------------
       */
      if (isRequired) {
        if (def.rules) {
          def.rules.unshift(requiredRule);
        } else {
          def.rules = [requiredRule];
        }
      }

      /**
       * Type validation
       * ---------------------------------------
       */

      // is empty or not defined
      const isFilled = value !== null && value !== undefined;

      if (isRequired || isFilled) {
        const typeErrorMessage = Array.isArray(def.type)
          ? def.type[1]
          : `The value of \`${
              prefix ? `${prefix}.${field}` : field
            }\` must be a valid ${fieldType}`;

        switch (fieldType) {
          /**
           * string
           */
          case "string":
            if (typeof value !== "string") {
              addError({
                origin,
                field: prefix ? `${prefix}.${field}` : field,
                type: fieldType,
                value: value,
                message: [typeErrorMessage],
              });
            }
            break;

          /**
           * array
           */
          case "array":
            if (!Array.isArray(value)) {
              addError({
                origin,
                field: prefix ? `${prefix}.${field}` : field,
                type: fieldType,
                value,
                message: [typeErrorMessage],
              });
            } else {
              /**
               * Nested validator defined
               * --------------------------------
               */
              if (def.validator) {
                for (let index = 0; index < value.length; index++) {
                  // nested element
                  const element = value[index];
                  // validate nested element
                  await validateContent(
                    request,
                    element,
                    origin,
                    def.validator,
                    result,
                    prefix ? `${prefix}.${field}.${index}` : `${field}.${index}`
                  );
                }
              }
            }
            break;

          /**
           * boolean
           */
          case "bool":
            switch (origin) {
              case "query":
              case "params":
                if (
                  typeof value === "string" &&
                  value.length !== 0 &&
                  !["true", "false"].includes(value.toLowerCase())
                ) {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                }
                break;

              case "body":
                if (typeof value !== "boolean") {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                }
                break;
            }
            break;

          /**
           * date
           */
          case "date":
            try {
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                throw {
                  message: typeErrorMessage,
                };
              }
            } catch (error) {
              addError({
                origin,
                field: prefix ? `${prefix}.${field}` : field,
                type: fieldType,
                value,
                message: [typeErrorMessage],
              });
            }
            break;

          /**
           * Integer
           */
          case "int":
          case "long":
          case "timestamp":
            switch (origin) {
              case "body":
                if (typeof value !== "number") {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                }
                break;

              case "query":
              case "params":
                if (isNaN(parseInt(`${value}`))) {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                }
                break;
            }
            break;
          /**
           * Decimal types
           */
          case "decimal":
          case "double":
            switch (origin) {
              case "body":
                if (typeof value !== "number") {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                }
                break;

              case "query":
              case "params":
                if (isNaN(parseFloat(`${value}`))) {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                }
                break;
            }
            break;

          /**
           * Global number
           */
          case "number":
            if (`${value}` !== `${Number(value)}`) {
              addError({
                origin,
                field: prefix ? `${prefix}.${field}` : field,
                type: fieldType,
                value,
                message: [typeErrorMessage],
              });
            }
            break;

          /**
           * Object
           */
          case "object":
            switch (origin) {
              case "body":
                if (typeof value !== "object") {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                } else {
                  /**
                   * Validation defined
                   * ------------------
                   */
                  if (def.validator) {
                    await validateContent(
                      request,
                      data[field],
                      origin,
                      def.validator,
                      result,
                      prefix ? `${prefix}.${field}` : field
                    );
                  }
                }
                break;

              case "query":
              case "params":
                try {
                  JSON.parse(decodeURIComponent(value));

                  /**
                   * Validation defined
                   * ------------------
                   */
                  if (def.validator) {
                    await validateContent(
                      request,
                      data[field],
                      origin,
                      def.validator,
                      result,
                      prefix ? `${prefix}.${field}` : field
                    );
                  }
                } catch (error) {
                  addError({
                    origin,
                    field: prefix ? `${prefix}.${field}` : field,
                    type: fieldType,
                    value,
                    message: [typeErrorMessage],
                  });
                }
                break;
            }

            break;

          default:
            break;
        }
      }

      /**
       * Rules validation
       */
      for (const rule of def.rules ?? []) {
        // define the error message
        let errorMessage = rule.message
          ? typeof rule.message === "string"
            ? rule.message
            : await rule.message(
                value,
                prefix ? `${prefix}.${field}` : field,
                origin,
                def,
                data,
                request
              )
          : `\`${prefix ? `${prefix}.${field}` : field}\` value is not valid`;

        // validation result
        const result = await rule.validator(
          value,
          prefix ? `${prefix}.${field}` : field,
          origin,
          def,
          data,
          request
        );

        // validation fails
        if (typeof result === "string" || result === false) {
          addError({
            origin,
            field: prefix ? `${prefix}.${field}` : field,
            type: fieldType,
            value,
            message: [typeof result === "string" ? result : errorMessage],
          });

          // stop progression after the first error
          break;
        }
      }
    }
  }
}
