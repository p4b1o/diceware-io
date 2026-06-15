<script lang="ts">
  export type IconName =
    | "add"
    | "content_copy"
    | "download"
    | "refresh"
    | "settings"
    | "visibility"
    | "visibility_off"
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
