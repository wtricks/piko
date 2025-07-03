import type { __UIID__ } from '../utils/helper';

declare module './types' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RegisteredComponents {}
}

export type Component<P = { [key: string]: unknown } & { children?: Child }> = (
    props: P
) => VNode;

export type ComponentReturnVNode<T> =
    T extends Component<infer P> ? VNode<T, P> : never;

export type Child = string | number | VNode | Child[];

export type ComponentProps<T> = T extends Component<infer P> ? P : never;

export type NativeTag = keyof HTMLElementTagNameMap;

export type TagOrComponent =
    | NativeTag
    | keyof RegisteredComponents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Component<any>;

export type PropsFor<T> = T extends NativeTag
    ? Partial<HTMLElementTagNameMap[T]>
    : T extends keyof RegisteredComponents
      ? RegisteredComponents[T] extends Component<infer P>
          ? P
          : never
      : T extends Component<infer P>
        ? P
        : never;

export type VNode<
    T extends TagOrComponent = TagOrComponent,
    P = PropsFor<T>,
> = {
    t: T;
    p: P;
    c: Child;
    [__UIID__]?: 0 | 1;
};
