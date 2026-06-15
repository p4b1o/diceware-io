<script lang="ts">
    import { translationsStore } from "$lib/stores/translations.store";
    import { getQuality } from "../app";

    type Props = {
        entropy: number;
    };

    const { entropy }: Props = $props<Props & {}>();
    const quality = getQuality(entropy);

    const convertQualityToLabel = (quality: number) => {
        return ($translationsStore as any)['qualityLabel' + quality];
    }
</script>

<div class="password-quality">
    <span class="password-quality__value">{convertQualityToLabel(quality.level)}</span>
    <div class="password-quality__bar" aria-hidden="true">
        {#each Array(5) as _, index}
            <span class="password-quality__seg" class:password-quality__seg--active={index < quality.level}></span>
        {/each}
    </div>
</div>

<style>
    .password-quality {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .password-quality__value {
        font-family: var(--font-heading);
        font-size: 0.95rem;
        font-weight: 600;
    }

    .password-quality__bar {
        display: flex;
        gap: 4px;
    }

    .password-quality__seg {
        flex: 1;
        height: 4px;
        background: var(--panel-2);
        border-radius: 2px;
        border: 1px solid var(--border);
        transition: background var(--transition);
    }

    .password-quality__seg--active {
        background: var(--red);
        border-color: var(--red);
    }
</style>
