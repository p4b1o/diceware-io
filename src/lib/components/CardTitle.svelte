<script lang="ts">
    const { children } = $props();
</script>

<h2 class="card-title">
    {@render children()}
</h2>

<style>
    .card-title {
        font-family: var(--font-heading);
        font-size: 0.7rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        color: var(--muted);
        text-transform: uppercase;
        margin-bottom: 1rem;
    }
</style>