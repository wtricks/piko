import { componentRegistry, createComponent } from '../components';
import type { ObserveFn } from '../hooks';
import type { VoidFn } from '../types';
import {
    __UIID__,
    emptyObject,
    hasProperty,
    isArray,
    isFunction,
    isObject,
    isString,
} from '../utils/helper';
import {
    createElement,
    createExpression,
    createTextNode,
    insertElement,
} from './dom';
import { renderPropsForElement } from './props';
import type {
    Child,
    ComponentReturnType,
    PropsFor,
    RegisteredComponents,
    TagOrComponent,
    VNode,
} from './types';

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
    } as VNode<T, PropsFor<T>>;

    if (isString(tag) && hasProperty(componentRegistry, tag)) {
        vnode.t = componentRegistry[tag as keyof RegisteredComponents];
    }

    if (isFunction(vnode.t)) {
        vnode[__UIID__] = hasProperty(vnode.t, __UIID__) ? 1 : 2;
    }

    return vnode;
}

/**
 * Recursively creates DOM nodes from the given virtual node and its children.
 * If the virtual node is an array, it will recursively call itself on each of the children.
 * If the virtual node is a string, it will create a text node.
 * If the virtual node is an object, it will create an element with the given tag name and properties.
 * @param parent The parent element to insert the created DOM nodes into.
 * @param vnode The virtual node to create DOM nodes from.
 * @param anchor The element to insert the DOM nodes before.
 * @returns The created DOM node, or the component if the virtual node is a component.
 */
export const createDOMNodes = (
    parent: Element,
    vnode: Child | Child[],
    anchor?: Element | Text,
    dep?: VoidFn[],
    holder?: (Element | Text | ComponentReturnType)[]
) => {
    if (!vnode) return;

    let nextElement: Element | Text | ComponentReturnType | void = void 0;

    if (isArray(vnode)) {
        for (const node of vnode) {
            createDOMNodes(parent, node, anchor, dep, holder);
        }
    } else if (isFunction(vnode)) {
        nextElement = createExpression(
            vnode as ObserveFn<string>,
            dep as ObserveFn<void>[]
        );
    } else if ((vnode as VNode)[__UIID__]) {
        nextElement = createComponent(
            parent,
            vnode as VNode,
            anchor as Element
        );
    } else if (isObject(vnode)) {
        nextElement = createElement((vnode as VNode).t as string) as Element;
        renderPropsForElement(
            nextElement as HTMLElement,
            (vnode as VNode).p,
            dep as VoidFn[]
        );
        createDOMNodes(nextElement, (vnode as VNode).c, anchor, dep);
    } else {
        nextElement = createTextNode(vnode as string);
    }

    if (!nextElement) {
        return;
    }

    if (nextElement && !(nextElement as unknown as ComponentReturnType).d) {
        insertElement(nextElement as Element, parent, anchor as Element);
    }

    if (holder) {
        holder.push(nextElement as Element | Text | ComponentReturnType);
    } else if ((nextElement as unknown as ComponentReturnType).d) {
        dep!.push((nextElement as unknown as ComponentReturnType).d);
    }
};
