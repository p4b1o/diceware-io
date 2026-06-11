<script lang="ts">
  type Props = {
    checked: boolean;
    disabled?: boolean;
    name?: string;
    label: string;
    onChange?: (checked: boolean) => void;
  }

  let {
    checked = $bindable(),
    disabled,
    name,
    value = $bindable(),
    ariaLabel,
    label,
    onChange,
  } = $props<Props & {}>();


  function handleChange(event: Event) {
    checked = (event.target as HTMLInputElement).checked;
    onChange && onChange(checked);
  }
</script>

<label class="form-switch">
  <input
    type="checkbox"
    class="form-switch__input"
    {name}
    bind:checked
    disabled={disabled}
    aria-label={ariaLabel}
    onchange={handleChange}
  />
  <span class="form-switch__toggle"></span>
  <span class="form-switch__label">
    {label}
  </span>
</label>

<style>
    .form-switch {
        display: flex;
        gap: 1rem;
        align-items: center;
        cursor: pointer;

        --form-switch-toggle-btn-size: 18px;
        --form-switch-toggle-btn-offset: 2px;
    }

    .form-switch__input {
        position: absolute;
        z-index: 1;
        opacity: 0;
    }

    .form-switch__label {
        font-size: 0.8rem;
        font-weight: 500;
        color: var(--muted);
    }

    .form-switch__toggle {
        position: relative;
        inset: 0;
        height: calc(var(--form-switch-toggle-btn-size) + 2 * var(--form-switch-toggle-btn-offset) + 2px);
        width: 40px;
        background: var(--panel-2);
        border: 1px solid var(--border);
        border-radius: 24px;
        cursor: pointer;
        transition: var(--transition);
    }

    .form-switch__toggle::before {
        content: "";
        position: absolute;
        width: var(--form-switch-toggle-btn-size);
        height: var(--form-switch-toggle-btn-size);
        left: var(--form-switch-toggle-btn-offset);
        top: 50%;
        transform: translateY(-50%);
        background: var(--muted);
        border-radius: 50%;
        transition: var(--transition);
    }

    .form-switch input:checked + .form-switch__toggle {
        background: rgba(229, 35, 41, 0.2);
        border-color: var(--red);
    }
    
    .form-switch input:checked + .form-switch__toggle::before {
        /* transform: translate(20px, -50%); */
        left: calc(100% - var(--form-switch-toggle-btn-size) - var(--form-switch-toggle-btn-offset));
        background: var(--red);
    }
</style>