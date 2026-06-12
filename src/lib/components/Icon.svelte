<script lang="ts">
  export type IconName =
    | "add"
    | "content_copy"
    | "refresh"
    | "arrow_back_ios";

  const { name } = $props<{ name: IconName }>();
</script>

<span class="material-symbols-outlined">
  {name}
</span>

<style>
  .material-symbols-outlined {
    font-size: inherit;
    display: block;
  }
</style>
