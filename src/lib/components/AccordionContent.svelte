<script lang="ts">
    import type { Snippet } from "svelte";

    type Props = {
        expanded: boolean;
        children: Snippet;
    }

    const { expanded = false, children } = $props<Props & {}>();
</script>

<div class="accordion-content" class:accordion-content--expanded={expanded}>
    <div class="accordion-content__inner">
        {#if children}
            {@render children()}
        {/if}
    </div>
</div>

<style>
    .accordion-content {
        display: grid;
        grid-template-rows: 0fr;
        transition: grid-template-rows 0.3s ease;
        overflow: hidden;
        color: var(--color-text-default);
    }

    .accordion-content--expanded {
        grid-template-rows: 1fr;
        padding-top: 1rem;
    }

    .accordion-content__inner {
        min-height: 0;
    }
</style>