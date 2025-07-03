import {
    __UIID__,
    emptyObject,
    hasProperty,
    isFunction,
    isObject,
    isString,
} from '../utils/helper';
import type {
    Child,
    Component,
    PropsFor,
    RegisteredComponents,
    TagOrComponent,
    VNode,
} from './types';

const componentRegistry = {} as {
    [K in keyof RegisteredComponents]: Component<PropsFor<K>>;
};

export const registerComponent = <K extends keyof RegisteredComponents>(
    name: K,
    component: RegisteredComponents[K]
) => {
    componentRegistry[name] = component;
};

/**
 * Creates a virtual node (VNode) from the given tag.
 *
 * If the tag is a string, it is treated as an HTML tag name.
 * If the tag is an object, it is assumed to be a component.
 * If the tag is a function, it is assumed to be a component function.
 *
 * The VNode's `tag` property will be set to the given tag.
 * The VNode's `props` property will be set to an empty object.
 *
 * @param tag The tag to create the VNode from.
 * @returns The created VNode.
 */
export function createVNode<T extends TagOrComponent>(
    tag: T
): VNode<T, PropsFor<T>>;

/**
 * Creates a virtual node (VNode) from the given tag and props.
 *
 * The VNode's `tag` property will be set to the given tag.
 * The VNode's `props` property will be set to a shallow copy of the given props.
 * The VNode's `children` property will be set to an empty array.
 *
 * @param tag The tag to create the VNode from.
 * @param props The props to set on the VNode.
 * @returns The created VNode.
 */
export function createVNode<T extends TagOrComponent>(
    tag: T,
    props: PropsFor<T>
): VNode<T, PropsFor<T>>;

/**
 * Creates a virtual node (VNode) from the given tag and children.
 *
 * The VNode's `tag` property will be set to the given tag.
 * The VNode's `props` property will be set to an empty object.
 * The VNode's `children` property will be set to a shallow copy of the given children.
 *
 * @param tag The tag to create the VNode from.
 * @param children The children to set on the VNode.
 * @returns The created VNode.
 */
export function createVNode<T extends TagOrComponent>(
    tag: T,
    children: Child
): VNode<T, PropsFor<T>>;

/**
 * Creates a virtual node (VNode) from the given tag, props, and children.
 *
 * The VNode's `tag` property will be set to the given tag.
 * The VNode's `props` property will be set to a shallow copy of the given props.
 * The VNode's `children` property will be set to a shallow copy of the given children.
 *
 * @param tag The tag to create the VNode from.
 * @param props The props to set on the VNode.
 * @param children The children to set on the VNode.
 * @returns The created VNode.
 */
export function createVNode<T extends TagOrComponent>(
    tag: T,
    props: PropsFor<T>,
    children: Child
): VNode<T, PropsFor<T>>;

export function createVNode<T extends TagOrComponent>(
    tag: T,
    propsOrChildren?: PropsFor<T> | Child,
    maybeChildren?: Child
): VNode<T, PropsFor<T>> {
    if (__DEV__ && !isString(tag) && !isFunction(tag)) {
        throw new TypeError(
            'The first parameter of `' +
                createVNode.name +
                '()` must be a string or a function.'
        );
    }

    if (!isObject(propsOrChildren) || hasProperty(propsOrChildren, __UIID__)) {
        maybeChildren = propsOrChildren as Child;
        propsOrChildren = emptyObject as PropsFor<T>;
    }

    if (!maybeChildren) {
        maybeChildren = [] as Child;
    }

    return {
        t: tag,
        p: propsOrChildren as PropsFor<T>,
        c: maybeChildren as Child,
        [__UIID__]: 0,
    };
}
