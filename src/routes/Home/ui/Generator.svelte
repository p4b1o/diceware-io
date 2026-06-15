<script lang="ts">
    import { onMount } from "svelte";
    import { currentLang } from '$lib/stores/current-lang.store';
    import { generatePassword, getQuality, parseWordlist } from "../app";
    import { translationsStore } from '$lib/stores/translations.store';
    import Card from "$lib/components/Card.svelte";
    import CardTitle from "$lib/components/CardTitle.svelte";
    import { generatorStore, passwordStore } from "./generator.store";
    import Icon from "$lib/components/Icon.svelte";
    import Stat from "$lib/components/Stat.svelte";
    import PasswordQuality from "./PasswordQuality.svelte";
    import { toast } from "$lib/stores/toast.store";
    import FormLabel from "$lib/components/FormLabel.svelte";

    let words = $state<string[]>([]);
    let visible = $state(true);
    let floatingPasswordVisible = $state(false);
    let containerRef: HTMLElement;

    const generate = () => {
        const result = generatePassword(words, $generatorStore);
        
        passwordStore.set({
            ...result
        })

        console.log(result, getQuality($passwordStore.entropy))
    }

    const copy = async () => {
        try {
            await navigator.clipboard.writeText($passwordStore.phrase);
        } catch {
            const ta = document.createElement("textarea");
            ta.value = $passwordStore.phrase;
            ta.style.position = "fixed";
            ta.style.opacity = "0";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);
        }

        toast.show($translationsStore.copied, 'success')
    }

    const scrollToSettings = () => {
        const containerPos = containerRef.offsetTop;
        const containerHeight = containerRef.clientHeight;

        window.scrollTo({
            top: containerPos + containerHeight
        })
    }

    const exportPassword = () => {
        const blob = new Blob([$passwordStore.phrase], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'password.txt';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
    };

    let observer: IntersectionObserver | null = null;
    let observerElement: HTMLElement;

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
        });

        observer = new IntersectionObserver((entries) => {
                const entry = entries[0];

                floatingPasswordVisible = entry.intersectionRatio === 0;

                if (entry.intersectionRatio === 0) {
                    console.log("Completely invisible");
                }

                if (entry.intersectionRatio > 0) {
                    console.log("Completely visible");
                }
            }, { threshold: 0 }
        );

        observer.observe(observerElement);
    });
    
</script>

<div bind:this={containerRef}>
<Card glow>
    <CardTitle>
        <div class="password-header">
            {$translationsStore.your_password}

            <button class="settings-btn" onclick={() => scrollToSettings()}>
                <Icon name="settings" />
            </button>
        </div>
    </CardTitle>

    <div 
        class="password" 
        class:hidden={!visible}
        bind:this={observerElement}
    >
        {$passwordStore.phrase}
    </div>

    <div class="password-stats">
        {#key $passwordStore.entropy}
            <Stat label={$translationsStore.entropy} accent>
                {$passwordStore.entropy.toFixed(2)} {$translationsStore.bits}
            </Stat>
            <Stat label={$translationsStore.quality}>
                <PasswordQuality entropy={$passwordStore.entropy} />
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
        
        <!-- <button
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
            onclick={() => exportPassword()}
        >
            <span class="btn__icon">
                <Icon name="download"/>
            </span>
            {$translationsStore.export_txt}
        </button> -->
    </div>

    <p class="privacy-note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg> Your passphrase never leaves your device. Generation happens 100% locally.
    </p>
</Card>
</div>

{#if floatingPasswordVisible}
    <div class="floating-password">
        <FormLabel>{$translationsStore.your_password}</FormLabel>
        <div class="floating-password__content">
            <div class="floating-password__pass">
                {$passwordStore.phrase}
            </div>
            <div class="floating-password__btns">
                <button 
                    class="btn btn--outline floating-password__btn"
                    onclick={() => generate()}
                >
                    <Icon name="refresh" />
                </button>
                <button 
                    class="btn btn--outline floating-password__btn"
                    onclick={() => copy()}
                >
                    <Icon name="content_copy" />
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .password-header {
        display: flex;
        justify-content: space-between;
    }

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

    .password.hidden {
        filter: blur(8px);
        user-select: none;
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

    .settings-btn {
        background-color: transparent;
        border: none;
        color: var(--muted);
        font-size: 1rem;
    }

    .btn__icon {
        font-size: 1.5em;
    }

    .floating-password {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: var(--panel-2);
        z-index: 100;
        padding: 0.75rem var(--standard-padding);
        border-top: 1px solid var(--border);
    }

    .floating-password__content {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }

    .floating-password__pass {
        flex: 1;
        word-break: break-word;
    }

    .floating-password__btns {
        display: flex;
        gap: 0.25rem;
    }

    .floating-password__btn {
        font-size: 1.25rem;
        padding: 0.25rem 0.75rem;
    }

    @media all and (min-width: 768px) {
        .floating-password {
            display: none;
        }
    }
</style>