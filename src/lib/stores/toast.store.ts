import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export interface ToastState {
    message: string;
    type: ToastType;
    visible: boolean;
}

const defaultToast: ToastState = {
    message: '',
    type: 'info',
    visible: false,
};

const { subscribe, set, update } = writable<ToastState>(defaultToast);
let hideTimer: number | undefined;

function show(message: string, type: ToastType = 'info', duration = 3000) {
    if (hideTimer) {
        window.clearTimeout(hideTimer);
    }

    set({ message, type, visible: true });

    if (duration > 0) {
        hideTimer = window.setTimeout(() => {
            hide();
            hideTimer = undefined;
        }, duration);
    }
}

function hide() {
    update((state) => ({ ...state, visible: false }));
}

export const toast = {
    subscribe,
    show,
    hide,
};
