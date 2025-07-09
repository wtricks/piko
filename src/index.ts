export const Piko = {
    name: 'Piko',
    version: '0.0.1',
};

export {
    createEffect as effect,
    createSignal as signal,
    createMemo as memo,
    withoutBatch as instant,
    untrackSignal as untrack,
    observeSignal as observe,
    createRef as ref,
    nextTick as next,
} from './hooks';

export type { Signal, Setter, Getter } from './hooks';

export { createVNode as h } from './dom';

export type { VNode, Child, Component } from './dom';
