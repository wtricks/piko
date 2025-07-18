/**
 * Creates a unique symbol.
 * @returns A unique symbol.
 */
export const uniqueSymbol = () => Symbol();

/**
 * Unique symbols used for internal purposes.
 */
export const __UIID__ = uniqueSymbol();

/**
 * The prefix used for component names.
 */
export const __COMPONENT_PREFIX = 'pinaka-';

/**
 * An empty object.
 */
export const VOID0 = void 0;

/**
 * Sets a property on an object with the specified key and value.
 * @param o - The object to which the property will be added.
 * @param key - The key for the new property.
 * @param value - The value for the new property.
 * @param writable - The value is writable or not
 * @returns The object with the new property added.
 */
export const def = <T>(
    o: object,
    key: PropertyKey,
    value: T,
    writable: boolean = false,
    enumerable: boolean = false
) => {
    return Object.defineProperty(o, key, { value, enumerable, writable });
};

/**
 * Checks if a value is a function.
 * @param v - The value to check.
 * @returns True if the value is a function, otherwise false.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (v: unknown): v is Function => {
    return typeof v === 'function';
};

/**
 * Checks if a value is a string.
 * @param v - The value to check.
 * @returns True if the value is a string, otherwise false.
 */
export const isString = (v: unknown): v is string => {
    return typeof v === 'string';
};

/**
 * Checks if a value is a boolean.
 * @param v - The value to check.
 * @returns True if the value is a boolean, otherwise false.
 */
export const isBool = (v: unknown): v is boolean => {
    return typeof v === 'boolean';
};

/**
 * Always returns false.
 * @returns False.
 */
export const falsy = () => {
    return false;
};

/**
 * Compares two values for equality.
 * @param a - The first value to compare.
 * @param b - The second value to compare.
 * @returns True if the values are equal, otherwise false.
 */
export const isEqual = (a: unknown, b: unknown): boolean => {
    return a === b;
};

/**
 * Returns the values of an object as an array.
 * @param o - The object to get the values from.
 * @returns An array of the object's values.
 */
export const values = <T>(o: { [key: string]: T }): T[] => Object.values(o);

/**
 * Check if given value is typeof `Object`
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
 */
export const isObject = (v: unknown) =>
    v !== null && typeof v === 'object' && !isArray(v);

/**
 * Check if given value is typeof `Array`
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
 */
export const isArray = Array.isArray;

/**
 * An empty freezed Array
 */
export const emptyArray = Object.freeze([]);

/**
 * An empty freezed Object
 */
export const emptyObject = Object.freeze({});

/**
 * Call each function from the array of functions.
 * @param functionArray A collection of functions.
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const runAll = (functionArray: (Function | unknown)[]) => {
    let runnableFunction;

    for (runnableFunction of functionArray) {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isFunction(runnableFunction) && runnableFunction();
    }
};

/**
 * Will be used for batch process
 */
export const scheduler = () => {
    return isFunction(queueMicrotask) ? queueMicrotask : Promise.resolve().then;
};

/**
 * Checks if an object has a property with the specified key.
 * @param obj - The object to check for the property.
 * @param key - The key of the property to check.
 * @returns True if the object has the specified property, otherwise false.
 */
export const hasProperty = (obj: unknown, key: string) => {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
