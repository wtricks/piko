import {
    createTextNode,
    insertElement,
    type Component,
    type ComponentReturnType,
    type VNode,
} from '../dom';
import { renderPropsForComponent } from '../dom/props';
import type { VoidFn } from '../types';
import { __UIID__ } from '../utils/helper';

/**
 * Marks a component as a built-in component by setting a unique identifier.
 *
 * @param fn The component to be marked as a built-in component.
 */
export const markBuiltInComponent = (fn: Component) => {
    (fn as unknown as VNode)[__UIID__] = 1;
};

export const createComponent = (
    element: Element,
    vnode: VNode,
    anchor: Element,
    dep: VoidFn[]
): ComponentReturnType => {
    const emptyTextNode = createTextNode();
    insertElement(emptyTextNode as unknown as Element, element, anchor);

    const store: Record<string, unknown> = {};

    renderPropsForComponent(store, (vnode as VNode).p);
    const componentValue = ((vnode as VNode).t as Component)(
        (vnode as VNode)[__UIID__] == 1 || (vnode as VNode).p.$$
            ? (vnode as VNode).p
            : store
    ) as VNode;

    console.log(componentValue, dep);

    return {
        l: () => {
            //
        },
        u: (anchor?: Element | Text) => {
            console.log(anchor);
        },
        d: (removeAnchor?: boolean) => {
            console.log(removeAnchor);
        },
    };
};
