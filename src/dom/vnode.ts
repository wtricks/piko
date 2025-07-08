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

/**
 * Registers a component with the given name and component implementation.
 *
 * The component will be stored in the component registry.
 *
 * @param name The name of the component to register.
 * @param component The component implementation to register.
 */
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
 * Creates a virtual node (VNode) from the given tag, props, and children.
 *
 * @param tag The tag to create the VNode from.
 * @param props The props to set on the VNode.
 * @param children The children of the VNode.
 * @returns The created VNode.
 */
export function createVNode<T extends TagOrComponent>(
    tag: T,
    props: PropsFor<T>,
    ...children: Child[]
): VNode<T, PropsFor<T>>;

/**
 * Creates a virtual node (VNode) from the given tag and children.
 *
 * If the tag is a string, it is treated as an HTML tag name.
 * If the tag is an object, it is assumed to be a component.
 * If the tag is a function, it is assumed to be a component function.
 *
 * The VNode's `tag` property will be set to the given tag.
 * The VNode's `props` property will be set to an empty object.
 * The VNode's `children` property will be set to the given children.
 *
 * @param tag The tag to create the VNode from.
 * @param children The children of the VNode.
 * @returns The created VNode.
 */
export function createVNode<T extends TagOrComponent>(
    tag: T,
    ...children: Child[]
): VNode<T, PropsFor<T>>;

export function createVNode<T extends TagOrComponent>(
    tag: T,
    ...propsOrChildren: (PropsFor<T> | Child)[]
): VNode<T, PropsFor<T>> {
    if (__DEV__ && !isString(tag) && !isFunction(tag)) {
        throw new TypeError(
            'The first parameter of `' +
                createVNode.name +
                '()` must be a string or a function.'
        );
    }

    let props: PropsFor<T> = emptyObject as PropsFor<T>;
    let maybeChildren: Child[] = propsOrChildren as Child[];

    if (
        isObject(propsOrChildren[0]) &&
        !hasProperty(propsOrChildren[0], __UIID__)
    ) {
        props = propsOrChildren[0] as PropsFor<T>;
        maybeChildren = propsOrChildren.slice(1) as Child[];
    }

    // eslint-disable-next-line prefer-const
    let vnode = {
        t: tag,
        p: props,
        c: maybeChildren,
        [__UIID__]: 0,
    } as VNode<T, PropsFor<T>>;

    if (isString(tag) && hasProperty(componentRegistry, tag)) {
        vnode.t = componentRegistry[tag as keyof RegisteredComponents];
        vnode[__UIID__] = 1;
    }

    return vnode;
}
