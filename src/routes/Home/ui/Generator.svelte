<script lang="ts">
    import { onMount } from "svelte";
    import { currentLang } from '$lib/stores/current-lang.store';
    import { generatePassword, getQuality, parseWordlist } from "../app";
    import { translationsStore } from '$lib/stores/translations.store';
    import Card from "$lib/components/Card.svelte";
    import CardTitle from "$lib/components/CardTitle.svelte";
    import { generatorStore } from "./generator.store";
    import Icon from "$lib/components/Icon.svelte";
    import Stat from "$lib/components/Stat.svelte";
    import PasswordQuality from "./PasswordQuality.svelte";

    let password = $state('');
    let entropy = $state(0);
    let words = $state<string[]>([]);
    let visible = $state(true);

    const generate = () => {
        const result = generatePassword(words, $generatorStore);
        password = result.phrase;
        entropy = result.entropy;

        console.log(result, getQuality(entropy))
    }

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(password);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = password;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }
    }

    onMount(async () => {
        currentLang.subscribe(async (lang) => {
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

<Card glow>
    <CardTitle>
        {$translationsStore.your_password}
    </CardTitle>

    <div class="password">
        {password}
    </div>

    <div class="password-stats">
        {#key entropy}
            <Stat label={$translationsStore.entropy} accent>
                {entropy.toFixed(2)} {$translationsStore.bits}
            </Stat>
            <Stat label={$translationsStore.quality}>
                <PasswordQuality entropy={entropy} />
            </Stat>
        {/key}
    </div>

    <div class="password-actions">
        <button
            onclick={() => generate()}
            class="btn btn--outline"
        >
            <span class="btn__icon">
                <Icon name="refresh"/>
            </span>
            {$translationsStore.generateNewPassword}
        </button>

        <button
            class="btn btn--outline"
            onclick={() => copy()}
        >
            <span class="btn__icon">
                <Icon name="content_copy"/>
            </span>
            {$translationsStore.copyPassPhrase}
        </button>

        <button
            class="btn btn--outline"
            onclick={() => visible = !visible}
        >
            <span class="btn__icon">
                <Icon name={visible ? 'visibility_off' : 'visibility'}/>
            </span>
            {visible ? $translationsStore.hide : $translationsStore.show}
        </button>

        <button
            class="btn btn--outline"
            onclick={() => copy()}
        >
            <span class="btn__icon">
                <Icon name="download"/>
            </span>
            {$translationsStore.export_txt}
        </button>
    </div>
</Card>

<style>
    .password {
        position: relative;
        background: var(--panel-2);
        border: 1px solid var(--border);
        border-left: none;
        border-right: none;
        padding: 20px var(--standard-padding);
        margin-bottom: 24px;
        display: flex;


        font-family: var(--font-heading);
        font-size: clamp(1rem, 2.5vw, 1.5rem);
        font-weight: 500;
        line-height: 1.4;
        word-break: break-word;
        overflow-wrap: anywhere;
        text-align: center;

        width: calc(100% + 2 * var(--standard-padding));
        transform: translateX(calc(-1 * var(--standard-padding)));
    }

    .password-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        margin-bottom: 1rem;
    }

    .password-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }

    .btn__icon {
        font-size: 1.5em;
    }
</style>