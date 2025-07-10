import {
    createDOMNodes,
    createTextNode,
    insertElement,
    removeElement,
    type Component,
    type ComponentReturnType,
    type VNode,
} from '../dom';
import { renderPropsForComponent } from '../dom/props';
import { __EFFECTS, observeSignal, type ObserveFn } from '../hooks';
import type { VoidFn } from '../types';
import { __UIID__, falsy, isArray, isFunction, runAll } from '../utils/helper';

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
    anchor: Element
): ComponentReturnType => {
    if (__DEV__ && !isFunction(vnode.t)) {
        throw new TypeError(
            'Component must be a function. Received: ' + vnode.t
        );
    }

    const emptyTextNode = createTextNode();
    insertElement(emptyTextNode as unknown as Element, element, anchor);

    const store: Record<string, unknown> = {};
    const dep: VoidFn[] = [];
    const holder: (Element | Text | ComponentReturnType)[] = [];

    renderPropsForComponent(store, (vnode as VNode).p);
    store.children ||= (vnode as VNode).c;
    const componentValue = ((vnode as VNode).t as Component)(
        (vnode as VNode)[__UIID__] == 1 || (vnode as VNode).p.$$
            ? (vnode as VNode).p
            : store
    ) as VNode;

    if (
        __DEV__ &&
        (!componentValue ||
            (isArray(componentValue) && componentValue.length == 0))
    ) {
        throw new TypeError(
            'Component must return a valid VNode. Received: ' + componentValue
        );
    }

    createDOMNodes(
        element,
        componentValue,
        emptyTextNode as unknown as Element,
        dep,
        holder
    );

    let index = 0;
    const componentEffects: ObserveFn<VoidFn>[] = [];

    for (const effect of __EFFECTS) {
        const current = index++;

        observeSignal(
            () => {
                componentEffects[current]();
                componentEffects[current] = (effect() ||
                    falsy) as ObserveFn<VoidFn>;

                if (
                    __DEV__ &&
                    componentEffects[current] &&
                    !isFunction(componentEffects[current])
                ) {
                    throw new TypeError(
                        'Function used in `createEffect()` can return only function or void.'
                    );
                }
            },
            void 0,
            dep
        );
    }

    return {
        u: (anchor?: Element | Text) => {
            insertElement(
                emptyTextNode as unknown as Element,
                element,
                anchor as Element
            );
            for (const node of holder) {
                if ((node as ComponentReturnType).u) {
                    (node as ComponentReturnType).u(emptyTextNode);
                } else {
                    insertElement(
                        node as Element,
                        element,
                        emptyTextNode as unknown as Element
                    );
                }
            }
        },
        d: () => {
            runAll(componentEffects);
            runAll(dep);

            for (const node of holder) {
                if ((node as ComponentReturnType).d) {
                    (node as ComponentReturnType).d();
                } else {
                    removeElement(node as Element, element);
                }
            }

            removeElement(emptyTextNode as unknown as Element, element);
        },
    };
};
