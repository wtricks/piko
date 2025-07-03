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
 * Create a new virtual node.
 *
 * @param tag The tag name of the virtual node. Can be a string or a component.
 * @param props The properties of the virtual node.
 * @param children The children of the virtual node.
 *
 * @returns A new virtual node.
 */
export const createVNode = <T extends TagOrComponent>(
    tag: T,
    props: PropsFor<T> = {} as PropsFor<T>,
    children: Child = []
): VNode<T, PropsFor<T>> => ({
    t: tag,
    p: props,
    c: children,
    $: 0,
});
