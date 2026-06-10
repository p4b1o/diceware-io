<script lang="ts">
    const { children } = $props();
</script>

<div class="card">
    {@render children()}
</div>

<style>
    .card {
        position: relative;
        border: 1px solid var(--border);
        border-radius: var(--radius-lg);
        width: 100%;
        margin-bottom: 10px;
        padding: 1.5rem;
    }
</style>