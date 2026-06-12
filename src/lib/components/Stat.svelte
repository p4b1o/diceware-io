<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        label: string;
        children: Snippet;
        accent?: boolean;
    };

    const { label, children, accent }: Props = $props<Props & {}>();
</script>

<div class="stat-tile">
    <span class="stat-tile__label">{label}</span>
    <div class="stat-tile__value" class:stat-tile__value--accent={accent}>
        {@render children()}
    </div>
</div>

<style>
    .stat-tile__label {
        display: block;
        font-size: 0.7rem;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 4px;
    }

    .stat-tile__value {
        font-family: var(--font-heading);
        font-size: 0.95rem;
        font-weight: 600;
    }

    .stat-tile__value--accent {
        color: var(--red);
    }

    .stat-tile__value--small {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--muted);
    }
</style>
