<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        children: Snippet;
        glow?: boolean;
    }

    const { 
        children,
        glow
    }: Props = $props<Props & {}>();
</script>

<div 
    class="card"
>
    <div class="card__glow"></div>
    <div class="card__inner">
        {@render children()}
    </div>
</div>

<style>
    .card {
        position: relative;
    }

    .card__glow {
        position: absolute;
        inset: -2px;
        border-radius: calc(var(--radius-lg) + 2px);
        background: linear-gradient(135deg, var(--red), var(--burgundy), transparent);
        opacity: 0.35;
        filter: blur(8px);
        z-index: 0;
        animation: pulse-glow 4s ease-in-out infinite;
    }

    .card__inner {
        position: relative;
        background-color: var(--panel);
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        width: 100%;
        margin-bottom: 10px;
        padding: 1rem;
        overflow: hidden;
    }

    @keyframes pulse-glow {
        0%, 100% { opacity: 0.25; }
        50% { opacity: 0.85; }
    }

    @media all and (min-width: 500px) {
        .card {
            padding: 1.5rem;
        }
    }
</style>