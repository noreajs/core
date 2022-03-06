import amongRule from "./among";
import minRule from "./min";
import maxRule from "./max";
import notAmongRule from "./notAmong";
import requiredRule from "./valueRequired";
import requiredWithRule from "./requiredWith";
import requiredWithoutRule from "./requiredWithout";
import requiredWhenRule from "./requiredWhen";
import startsWithRule from "./startsWith";
import endsWithRule from "./endsWith";
import dateRule from "./date";
import afterFieldsRule from "./afterFields";
import beforeFieldsRule from "./beforeFields";
import afterDateRule from "./afterDate";
import beforeDateRule from "./beforeDate";
import distinctRule from "./distinct";
import numberItemMinRule from "./numberItemMin";
import numberItemMaxRule from "./numberItemMax";

export namespace Rule {
  export const among = amongRule;
  export const min = minRule;
  export const numberItemMin = numberItemMinRule;
  export const numberItemMax = numberItemMaxRule;
  export const max = maxRule;
  export const notAmong = notAmongRule;
  export const valueRequired = requiredRule;
  export const requiredWith = requiredWithRule;
  export const requiredWithout = requiredWithoutRule;
  export const requiredWhen = requiredWhenRule;
  export const startsWith = startsWithRule;
  export const endsWith = endsWithRule;
  export const date = dateRule;
  export const afterFields = afterFieldsRule;
  export const beforeFields = beforeFieldsRule;
  export const afterDate = afterDateRule;
  export const beforeDate = beforeDateRule;
  export const distinct = distinctRule;
}
