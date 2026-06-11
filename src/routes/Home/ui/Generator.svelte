<script lang="ts">
    import { onMount } from "svelte";
    import { currentLang } from '$lib/stores/current-lang.store';
    import { generatePassword, parseWordlist } from "../app";
    import { translationsStore } from '$lib/stores/translations.store';
    import Card from "$lib/components/Card.svelte";
    import CardTitle from "$lib/components/CardTitle.svelte";
    import Slider from "$lib/components/Slider.svelte";
    import RadioGroup from "$lib/components/RadioGroup.svelte";
    import FormLabel from "$lib/components/FormLabel.svelte";
    import Switch from "$lib/components/Switch.svelte";
    import { generatorStore } from "./generator.store";

    let password = $state('');
    let words = $state<string[]>([]);

    const generate = () => {
        const result = generatePassword(words, $generatorStore);
        password = result.phrase;
        console.log(result)
    }

    onMount(async () => {
        console.log("mount")
        currentLang.subscribe(async (lang) => {
            console.log({ lang });

            const res = await fetch(`/wordlists/diceware-${lang}.txt`);

            if(!res.ok) {
                alert('error');
                return;
            }

            words = parseWordlist(await res.text());

            generate();
        });

        generatorStore.subscribe(options => {
            generate();
        })
    });

    
</script>

<Card>
    <CardTitle>
        {$translationsStore.your_password}
    </CardTitle>

    {password}

            <button
                onclick={() => generate()}
                class="btn btn--outline"
            >
                Generuj
            </button>

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
                ]}
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
                ]}
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
</Card>

<style>

</style>