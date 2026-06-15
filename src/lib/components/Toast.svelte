<script lang="ts">
    import { toast, type ToastType } from '$lib/stores/toast.store';
    import { derived } from 'svelte/store';

    const toastState = toast;

    const toastClasses = derived(toastState, ($toast) => {
        return [
            'toast',
            $toast.visible ? 'toast--visible' : '',
            `toast--${$toast.type}`,
        ].filter(Boolean).join(' ');
    });
</script>

<div class={$toastClasses} aria-live="polite" aria-atomic="true">
    <span class="toast__message">{$toastState.message}</span>
</div>

<style>
    .toast {
        position: fixed;
        top: 24px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        min-width: 260px;
        max-width: min(90vw, 360px);
        padding: 0.95rem 1rem;
        border-radius: var(--radius-lg);
        background: rgba(18, 18, 18, 0.96);
        border: 1px solid rgba(255, 255, 255, 0.08);
        color: var(--text);
        font-size: 0.95rem;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
        z-index: 200;
    }

    .toast--visible {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
    }

    .toast--success {
        border-color: rgba(52, 211, 153, 0.45);
        background-color: rgba(52, 211, 62, 1);
    }

    .toast--warning {
        border-color: rgba(249, 115, 22, 0.45);
    }

    .toast--error {
        border-color: rgba(239, 68, 68, 0.45);
    }

    .toast__message {
        display: block;
        line-height: 1.4;
    }
</style>
