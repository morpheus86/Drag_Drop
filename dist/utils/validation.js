export function validate(InputToValidate) {
    let isValid = true;
    if (InputToValidate.required) {
        isValid = isValid && InputToValidate.value.toString().length !== 0;
    }
    if (InputToValidate.minLength != null &&
        typeof InputToValidate.value === "string") {
        isValid =
            isValid && InputToValidate.value.length > InputToValidate.minLength;
    }
    if (InputToValidate.maxLength != null &&
        typeof InputToValidate.value === "string") {
        isValid =
            isValid && InputToValidate.value.length < InputToValidate.maxLength;
    }
    if (InputToValidate.min != null &&
        typeof InputToValidate.value === "number") {
        isValid = isValid && InputToValidate.value > InputToValidate.min;
    }
    if (InputToValidate.max != null &&
        typeof InputToValidate.value === "number") {
        isValid = isValid && InputToValidate.value < InputToValidate.max;
    }
    return isValid;
}
//# sourceMappingURL=validation.js.map