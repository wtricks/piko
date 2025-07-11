import { observeSignal, type ObserveFn } from '../hooks';
import type { Fn, VoidFn } from '../types';
import type { ClassName, StyleSheet } from './types';
import {
    emptyObject,
    isArray,
    isFunction,
    isObject,
    isString,
} from '../utils/helper';
import { setAttribute, setListener } from './dom';

/**
 * Renders the given props on the given element.
 * @param element The element to render the props on.
 * @param props The props to render.
 * @param dep The dependencies to add to for tracking reactive props.
 */
export const renderPropsForElement = (
    element: HTMLElement | SVGElement,
    props: Record<string, unknown>,
    dep: VoidFn[]
) => {
    for (const key in props) {
        if (key == 'use') {
            continue;
        } else if (key == 'ref') {
            (props as { ref: Fn }).ref(element);
        } else if (key == 'class') {
            if (isString(props[key])) {
                setAttribute(element, 'class', props[key]);
            } else {
                resolveClassName(element, props[key] as ClassName, dep);
            }
        } else if (key == 'style') {
            if (isString(props[key])) {
                setAttribute(element, 'style', props[key]);
            } else {
                resolveStyle(element.style, props[key] as StyleSheet, dep);
            }
        } else if (/^on[A-Za-z]/.test(key)) {
            dep.push(setListener(element, key.slice(2), props[key] as Fn));
        } else if (isFunction(props[key])) {
            // Can be a reactive attribute
            observeSignal(
                () => setAttribute(element, key, props[key] as string),
                void 0,
                dep
            );
        } else {
            setAttribute(element, key, props[key] as string);
        }
    }
};

/**
 * Resolve a class name to be applied to the given element.
 *
 * @param element The element to set the class name on.
 * @param className The class name to resolve. This can be a string, an object, or an array of either.
 *                  If an object, the class name will be resolved to the string 'true' if the value is truthy.
 *                  If an array, the class name will be resolved to a space-separated string of all the values.
 * @param dep An optional array of functions that will be called when the observed signals change.
 *
 * @throws TypeError if the class name is not a string, object, or array.
 * @returns The resolved class name as a string.
 */
export const resolveClassName = (
    element: Element,
    className: ClassName,
    dep?: VoidFn[]
) => {
    // eslint-disable-next-line prefer-const
    let classNameFn: ObserveFn<ClassName> = (
        isFunction(className) ? className : () => className
    ) as ObserveFn<ClassName>;

    observeSignal(
        () => {
            let classNameStr = classNameFn();

            classNameStr = isArray(classNameStr)
                ? classNameStr
                : [classNameStr];

            const classNameArr = [];

            for (const className of classNameStr) {
                if (__DEV__ && !isString(className) && !isObject(className)) {
                    throw new TypeError(
                        "Class attribute's value must be a string or object."
                    );
                }

                if (isString(className)) {
                    classNameArr.push(className);
                } else {
                    for (const key in className) {
                        if ((className as Record<string, unknown>)[key]) {
                            classNameArr.push(key);
                        }
                    }
                }
            }

            setAttribute(element, 'class', classNameArr.join(' '));
        },
        void 0,
        dep
    );
};

/**
 * Resolves and applies styles to a given CSSStyleDeclaration object.
 *
 * @param elementStyle - The CSSStyleDeclaration object to apply styles to.
 * @param value - A StyleSheet object or a function that returns a StyleSheet.
 *                The StyleSheet can be a string, an object, or an array of objects.
 * @param dep - An optional array of functions that will be called when the observed
 *              signals change.
 *
 * @remarks
 * This function observes changes in the provided style definition and updates the
 * CSS styles applied to the element accordingly. It supports styles defined as
 * strings, objects, or arrays of objects. If the styles change, the old styles are
 * removed from the element.
 *
 * @throws TypeError if styles are not strings, objects, or arrays, or if style
 *                   values are not strings.
 */
export const resolveStyle = (
    elementStyle: CSSStyleDeclaration,
    value: StyleSheet | ObserveFn<StyleSheet>,
    dep?: VoidFn[]
) => {
    let oldStyle: StyleSheet = emptyObject as StyleSheet;
    // eslint-disable-next-line prefer-const
    let styleFn = (
        isFunction(value) ? value : () => value
    ) as ObserveFn<StyleSheet>;

    observeSignal(
        () => {
            const newStyle: StyleSheet = styleFn();

            if (
                __DEV__ &&
                !isString(newStyle) &&
                !isObject(newStyle) &&
                !isArray(newStyle)
            ) {
                throw new TypeError(
                    "Style attribute's value must be a string, an object or an array."
                );
            }

            if (isString(newStyle)) {
                elementStyle.cssText = newStyle;
                oldStyle = emptyObject as StyleSheet;
            } else {
                for (const styleObject of isArray(newStyle)
                    ? newStyle
                    : [newStyle]) {
                    if (__DEV__ && !isObject(styleObject)) {
                        throw new TypeError(
                            "If style attribute's value is given as an array, each item must be an object."
                        );
                    }

                    for (const property in styleObject) {
                        elementStyle.setProperty(
                            property,
                            styleObject[property] as string
                        );
                        delete (oldStyle as Record<string, unknown>)[property];
                    }
                }

                for (const property in oldStyle as Record<string, unknown>) {
                    elementStyle.removeProperty(property);
                }

                oldStyle = newStyle;
            }
        },
        void 0,
        dep
    );
};

/**
 * Builds properties for a component by iterating over the provided props
 * and setting them on the provided store object.
 *
 * For any key that is not 'ref' and does not start with 'on' followed by an
 * uppercase letter, the value is set on the store object using the `def`
 * utility.
 *
 * @param store - The object to set the component properties on.
 * @param props - The object containing the properties to set.
 * @returns The modified store object.
 */
export const renderPropsForComponent = (
    store: Record<string, unknown>,
    props: Record<string, unknown>
) => {
    let key;

    for (key in props) {
        if (key == 'ref' || /^on[A-Za-z]/.test(key)) {
            store[key] = props[key];
        } else {
            createReactiveProp(store, key, props[key]);
        }
    }
};

/**
 * Creates a reactive property on the provided store object.
 * If the value is a function, it will be called on every get.
 * Otherwise, the value will be returned as is.
 *
 * In development mode, the property will be made enumerable.
 *
 * @param store - The object to set the reactive property on.
 * @param key - The key of the property to set.
 * @param value - The value to set on the property.
 */
const createReactiveProp = (
    store: Record<string, unknown>,
    key: string,
    value: unknown
) => {
    Object.defineProperty(store, key, {
        ...(__DEV__ && { enumerable: true }),
        get() {
            return isFunction(value) ? value() : value;
        },
    });
};
