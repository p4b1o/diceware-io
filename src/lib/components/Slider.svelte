<script lang="ts">
  type Props = {
    min: number;
    max: number;
    value: number;
    onChange?: (value: number) => void;
  }

  const step = 1;
  let {
    min,
    max, 
    value = $bindable(),
    onChange
  } = $props<Props & {}>();

  function update(newValue: number) {
    value = newValue;
    onChange && onChange(newValue);
  }

  function decrease() {
    if (value <= min) return;
    update(Math.max(min, value - step));
  }

  function increase() {
    if (value >= max) return;
    update(value + step);
  }

  function handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    update(Number(input.value));
  }
</script>

<div class="slider-control">
  <button
    type="button"
    class="stepper"
    onclick={decrease}
    aria-label="Decrease"
    disabled={value <= min}
  >
    −
  </button>

  <input
    type="range"
    class="slider"
    min={min}
    max={max}
    step={step}
    bind:value
    oninput={handleInput}
  />

  <span class="slider-value">{value}</span>

  <button
    type="button"
    class="stepper"
    onclick={increase}
    aria-label="Increase"
    disabled={value >= max}
  >
    +
  </button>
</div>

<style>
  .slider-control {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .slider-value {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.05rem;
    min-width: 32px;
    text-align: center;
  }

  button.stepper:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>
