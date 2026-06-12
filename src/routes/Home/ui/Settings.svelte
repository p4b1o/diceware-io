<script lang="ts">
    import { type CasingMode, type PasswordOptions } from "../app";
    import { translationsStore } from '$lib/stores/translations.store';
    import Slider from "$lib/components/Slider.svelte";
    import RadioGroup from "$lib/components/RadioGroup.svelte";
    import FormLabel from "$lib/components/FormLabel.svelte";
    import Switch from "$lib/components/Switch.svelte";
    import { generatorStore } from "./generator.store";
</script>

<FormLabel>{$translationsStore.word_count}</FormLabel>
<Slider
    min={3}
    max={15}
    bind:value={$generatorStore.wordCount}
/>

<FormLabel>{$translationsStore.separator}</FormLabel>
<RadioGroup 
    options={[
        { label: $translationsStore.space, value: ' ' },
        { label: $translationsStore.hyphen, value: '-' },
        { label: $translationsStore.dot, value: '.' },
        { label: $translationsStore.none, value: '' },
        { label: $translationsStore.custom, value: 'custom' },
    ] satisfies { label: string, value: PasswordOptions['separator'] }[]}
    name=""
    bind:value={$generatorStore.separator}
/>

<FormLabel>{$translationsStore.casing}</FormLabel>
<RadioGroup 
    options={[
        { label: $translationsStore.title_case, value: 'title' },
        { label: $translationsStore.lower_case, value: 'lower' },
        { label: $translationsStore.upper_case, value: 'upper' },
        { label: $translationsStore.random_case, value: 'random' },
    ] satisfies { label: string, value: CasingMode }[]}
    name=""
    bind:value={$generatorStore.casing}
/>

<Switch 
    label={$translationsStore.add_digit}
    bind:checked={$generatorStore.addDigit}
/>

<Switch 
    label={$translationsStore.add_special}
    bind:checked={$generatorStore.addSpecial}
/>