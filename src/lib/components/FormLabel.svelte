<script lang="ts">
    const { children } = $props();
</script>

<label class="form-label">
    {@render children()}
</label>

<style>
    .form-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--muted);
        margin-bottom: 8px;
    }
</style>