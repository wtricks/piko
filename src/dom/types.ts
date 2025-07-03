export type Component<P = { [key: string]: unknown }> = (props: P) => VNode;

export type ComponentReturnVNode<T> =
    T extends Component<infer P> ? VNode<T, P> : never;

export type Child = string | number | VNode | Child[];

export type ComponentProps<T> = T extends Component<infer P> ? P : never;

export type NativeTag = keyof HTMLElementTagNameMap;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TagOrComponent = NativeTag | Component<any>;

export type PropsFor<T> = T extends NativeTag
    ? Partial<HTMLElementTagNameMap[T]>
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
    $?: 0 | 1;
};
