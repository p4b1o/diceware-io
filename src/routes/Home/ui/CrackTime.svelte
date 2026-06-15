<script lang="ts">
    import { onMount } from 'svelte';
    import { translationsStore } from '$lib/stores/translations.store';
    import { generatorStore, passwordStore } from './generator.store';
    import {
        calculateCrackEstimate,
        formatCrackDuration,
        type CrackAlghoritm,
    } from '../app';
    import Card from '$lib/components/Card.svelte';

    let crackAlghoritm = $state<CrackAlghoritm>('md5');
    let entropy = $state(0);

    const calc = (crackAlghoritm: CrackAlghoritm) => {
        const estimate = calculateCrackEstimate(entropy, crackAlghoritm);
        
        return {
            crackTime: formatCrackDuration(estimate.seconds),
            algorithmMeta: `${estimate.algorithm.name} — ${formatGuessRate(estimate.algorithm.guessesPerSecond)}`
        }
    }

    let results = $derived(calc(crackAlghoritm));

    function formatGuessRate(guessesPerSecond: number) {
        if (guessesPerSecond >= 1_000_000_000_000) return `${(guessesPerSecond / 1_000_000_000_000).toFixed(0)} TH/s`;
        if (guessesPerSecond >= 1_000_000_000) return `${(guessesPerSecond / 1_000_000_000).toFixed(0)} GH/s`;
        if (guessesPerSecond >= 1_000_000) return `${(guessesPerSecond / 1_000_000).toFixed(0)} MH/s`;
        if (guessesPerSecond >= 1_000) return `${(guessesPerSecond / 1_000).toFixed(0)} kH/s`;
        return `${guessesPerSecond.toLocaleString('en-US')} H/s`;
    }

    onMount(() => {
        const unsubscribePasswordStore = passwordStore.subscribe(val => {
            entropy = val.entropy;
        })

        return () => {
            unsubscribePasswordStore();
        };
    });
</script>

<Card>
    <div class="crack-estimate" aria-live="polite">
        <span class="crack-estimate__label">{$translationsStore.crack_time}</span>
        <strong class="crack-estimate__value">{results.crackTime}</strong>
        <span class="crack-estimate__meta">{results.algorithmMeta}</span>
    </div>

    <select 
        class="setting__select" 
        bind:value={crackAlghoritm}
        name="crack-alghoritm"
    >
        <option value="md5">MD5 — 300 GH/s</option>
        <option value="ntlm">NTLM — 300 GH/s</option>
        <option value="sha1">SHA-1 — 100 GH/s</option>
        <option value="sha256">SHA-256 — 45 GH/s</option>
        <option value="bcrypt">bcrypt cost 12 — 200 kH/s</option>
    </select>
</Card>


<style>
    .crack-estimate {
        display: grid;
        gap: 4px;
        margin: -4px 0 20px;
        padding: 14px 16px;
        background: rgba(229, 35, 41, 0.08);
        border: 1px solid var(--border);
        border-radius: var(--radius);
    }

    .crack-estimate__label,
    .crack-estimate__meta {
        color: var(--muted);
        font-size: 0.72rem;
    }

    .crack-estimate__label {
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    .crack-estimate__value {
        font-family: var(--font-heading);
        font-size: clamp(1.15rem, 2vw, 1.55rem);
        color: var(--red);
        line-height: 1.2;
    }
</style>