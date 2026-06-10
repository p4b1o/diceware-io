<script lang="ts">
    import { onMount } from "svelte";
    import { currentLang } from '$lib/stores/current-lang.store';
    import { generatePassword, parseWordlist } from "../app";
    import { translationsStore } from '$lib/stores/translations.store';
    import Card from "$lib/components/Card.svelte";
    import CardTitle from "$lib/components/CardTitle.svelte";

    let password = $state('');
    let words = $state<string[]>([]);

    const generate = () => {
        password = generatePassword(
            words, 
            { 
                addDigit: false, 
                wordCount: 3, 
                addSpecial: false, 
                separator: '-', 
                casing: 'lower', 
                customSeparator: '-', 
                crackAlgorithm: 'bcrypt' 
            }
        ).password;
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
</Card>

<style>

</style>