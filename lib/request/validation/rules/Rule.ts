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

export namespace Rule {
  export const among = amongRule;
  export const min = minRule;
  export const max = maxRule;
  export const notAmong = notAmongRule;
  export const valueRequired = requiredRule;
  export const requiredWith = requiredWithRule;
  export const requiredWithout = requiredWithoutRule;
  export const requiredWhen = requiredWhenRule;
  export const startsWith = startsWithRule;
  export const endsWith = endsWithRule;
}
