<script lang="ts">
    import { type CasingMode, type PasswordOptions } from "../app";
    import { translationsStore } from '$lib/stores/translations.store';
    import Slider from "$lib/components/Slider.svelte";
    import RadioGroup from "$lib/components/RadioGroup.svelte";
    import FormLabel from "$lib/components/FormLabel.svelte";
    import Switch from "$lib/components/Switch.svelte";
    import { generatorStore } from "./generator.store";
    import Card from "$lib/components/Card.svelte";
    import CardTitle from "$lib/components/CardTitle.svelte";
</script>

<Card>
    <CardTitle>
        {$translationsStore.settings_title}
    </CardTitle>

    <div class="settings-form-group">
        <div>
            <FormLabel>{$translationsStore.word_count}</FormLabel>
            <Slider
                min={3}
                max={15}
                bind:value={$generatorStore.wordCount}
            />
        </div>

        <div>
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
            {#if $generatorStore.separator === 'custom'}
                <input 
                    type="text" 
                    name="custom-separator" 
                    placeholder="Custom separator"
                    class="custom-separator"
                    required
                    minlength="1"
                    maxlength="5"
                    bind:value={$generatorStore.customSeparator} 
                />
            {/if}
        </div>

        <div>
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
        </div>

        <div>
            <Switch 
                label={$translationsStore.add_digit}
                bind:checked={$generatorStore.addDigit}
            />
        </div>

        <div>
            <Switch 
                label={$translationsStore.add_special}
                bind:checked={$generatorStore.addSpecial}
            />
        </div>
    </div>
</Card>

<style>
    .settings-form-group {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
</style>