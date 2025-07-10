import type { ObserveFn } from '../hooks';
import type { Fn } from '../types';
import type { __UIID__ } from '../utils/helper';

declare module './types' {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface RegisteredComponents {}
}

type ObservableProps<T> = {
    [K in keyof T]: T[K] | ObserveFn<T[K]>;
};

type DisallowedLabelProp<T extends string, P> = T extends 'label'
    ? P & { for: string }
    : P;

type EnhanceNativeProps<T, N extends string> = DisallowedLabelProp<
    N,
    Omit<T, 'class' | 'style'> & {
        class?: ClassName;
        style?: StyleSheet;
    }
>;

export type Component<
    P = { [key: string]: unknown } & { children?: Child; $$?: boolean },
> = (props?: P) => Child | Child[];

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
    ? Partial<ObservableProps<EnhanceNativeProps<HTMLElementTagNameMap[T], T>>>
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
    [__UIID__]?: 2 | 1;
};

export type ComponentReturnType = {
    u: (anchor?: Text | Element) => void;
    d: () => void;
};

export type StyleSheet =
    | string
    | Record<string, unknown>
    | Record<string, unknown>[];

export type ClassName =
    | string
    | Record<string, boolean>
    | (string | Record<string, boolean>)[];
