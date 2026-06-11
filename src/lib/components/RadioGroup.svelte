<script lang="ts">
  type RadioOption = {
    value: string | number;
    label: string;
  };

  type Props = {
    options: RadioOption[];
    value: string | number | null;
    name: string;
    disabled?: boolean;
    onChange?: (value: any) => void;
  }

  let {
    options,
    value = $bindable(),
    name,
    disabled,
    onChange,
  } = $props<Props &  {}>();


  function select(option: RadioOption) {
    value = option.value;
    onChange && onChange(value);
  }
</script>

<div class="radio-group" role="radiogroup" aria-disabled={disabled}>
  {#each options as option}
    <button
      type="button"
      class="radio-button {value === option.value ? 'radio-button--selected' : ''}"
      aria-checked={value === option.value}
      role="radio"
      disabled={disabled || option.disabled}
      onclick={() => select(option)}
    >
      {option.label}
    </button>
  {/each}
</div>

<style>
  .radio-group {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .radio-button {
    padding: 7px 11px;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 500;
    background: var(--panel-2);
    border: 1px solid var(--border);
    color: var(--muted);
    border-radius: var(--radius);
    cursor: pointer;
    transition: all var(--transition);
    min-height: 36px;
  }

  .radio-button:hover:not(:disabled) {
    border-color: var(--red);
    color: var(--text);
  }

  .radio-button--selected {
    background: rgba(229, 35, 41, 0.15);
    border-color: var(--red);
    color: var(--red);
  }

  .radio-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
