import type { ObserveFn } from '../hooks';
import type { Fn } from '../types';
import type { __UIID__ } from '../utils/helper';

declare module './types' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RegisteredComponents {}
}

type EnhanceNativeProps<T> = Omit<T, 'class' | 'className' | 'style'> & {
    class?: ClassName | ObserveFn<ClassName>;
    className?: ClassName | ObserveFn<ClassName>;
    style?: StyleSheet | ObserveFn<StyleSheet>;
};

export type Component<P = { [key: string]: unknown } & { children?: Child }> = (
    props: P
) => VNode;

export type ComponentReturnVNode<T> =
    T extends Component<infer P> ? VNode<T, P> : never;

export type Child = string | number | VNode | Fn;

export type ComponentProps<T> = T extends Component<infer P> ? P : never;

export type NativeTag = keyof HTMLElementTagNameMap;

export type TagOrComponent =
    | NativeTag
    | keyof RegisteredComponents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | Component<any>;

export type PropsFor<T> = T extends NativeTag
    ? Partial<EnhanceNativeProps<HTMLElementTagNameMap[T]>>
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
    c: Child[];
    [__UIID__]?: 0 | 1;
};

export type ComponentReturnType = {
    l: () => void;
    u: (anchor?: Text | Element) => void;
    d: (removeAnchor?: boolean) => void;
};

export type StyleSheet =
    | string
    | Record<string, unknown>
    | Record<string, unknown>[];

export type ClassName =
    | string
    | Record<string, boolean>
    | (string | Record<string, boolean>)[];
