import {
    createDOMNodes,
    createTextNode,
    createVNode,
    insertElement,
    removeElement,
    type Component,
    type ComponentReturnType,
    type PropsFor,
    type RegisteredComponents,
    type VNode,
} from '../dom';
import { renderPropsForComponent } from '../dom/props';
import {
    __EFFECTS,
    createEffect,
    observeSignal,
    type ObserveFn,
} from '../hooks';
import type { VoidFn } from '../types';
import {
    __UIID__,
    emptyObject,
    falsy,
    isArray,
    isFunction,
    runAll,
} from '../utils/helper';

let isPikoAlreadyMounted = false;

export const componentRegistry = {} as {
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
    anchor?: Element
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

    __EFFECTS[__UIID__] = true;

    renderPropsForComponent(store, (vnode as VNode).p);
    store.children ||= (vnode as VNode).c;
    const componentValue = ((vnode as VNode).t as Component)(
        (vnode as VNode)[__UIID__] == 1 || (vnode as VNode).p.$$
            ? (vnode as VNode).p
            : store
    ) as VNode;

    __EFFECTS[__UIID__] = false;

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
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                componentEffects[current] && componentEffects[current]();
                componentEffects[current] = (effect() ||
                    falsy) as ObserveFn<VoidFn>;

                if (
                    __DEV__ &&
                    componentEffects[current] &&
                    !isFunction(componentEffects[current])
                ) {
                    throw new TypeError(
                        'Function used in `' +
                            createEffect.name +
                            '()` can return only function or void.'
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

type AppOptions = {
    props: Record<string, unknown>;
    components: Record<string, Component>;
};
/**
 * Instantiate `Piko` Application
 * @param component
 * @param target
 * @param options
 */
export const createApp = (
    component: Component,
    target: Node,
    options?: AppOptions
) => {
    if (__DEV__) {
        if (!(target instanceof Node)) {
            throw new TypeError(
                'Invalid DOM node provided in ' +
                    createApp.name +
                    ' Expected a valid DOM node.'
            );
        }

        if (!isFunction(component)) {
            throw new TypeError(
                'Invalid component provided in `' +
                    createApp.name +
                    '()`. Expected a valid component.'
            );
        }

        if (isPikoAlreadyMounted) {
            throw new TypeError(
                'An instance of `' + createApp.name + '()` is already mounted.'
            );
        }

        isPikoAlreadyMounted = true;
    }

    let props = emptyObject;
    if (options) {
        props = options.props;
        Object.assign(componentRegistry, options.components);
    }

    const destroy = createComponent(
        target as Element,
        createVNode(component, props)
    ).d;
    return () => {
        destroy();
        isPikoAlreadyMounted = false;
    };
};
