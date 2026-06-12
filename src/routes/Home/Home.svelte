<script lang="ts">
  import { type Lang } from '$lib/types/supported-langs';
  import { onMount } from 'svelte';
  import { appTitle } from '$lib/constans/app';
  import { translationsStore } from '$lib/stores/translations.store';
    import { currentLang } from '$lib/stores/current-lang.store';
    import Generator from './ui/Generator.svelte';
    import OldHome from './ui/OldHome.svelte';
    import Settings from './ui/Settings.svelte';

  type WordlistConfig = { url: string; name: string; locale: string };

  const WORDLISTS: Record<Lang, WordlistConfig> = {
    pl: {
      url: '/wordlists/diceware-pl.txt',
      name: 'diceware-pl.txt',
      locale: 'pl-PL',
    },
    en: {
      url: '/wordlists/diceware-en.txt',
      name: 'diceware-en.txt',
      locale: 'en-US',
    },
  }; 

  let wordlist = WORDLISTS.pl;

  onMount(() => {
    if (typeof window === 'undefined') {
      return;
    }

    wordlist = WORDLISTS[$currentLang];

    const jsConfig = {
      lang: $currentLang,
      locale: wordlist.locale,
      wordlistUrl: wordlist.url,
      dictName: wordlist.name,
      labels: $translationsStore,
    };

    (window as any).CYBERGURU_CONFIG = jsConfig;

    if (!document.querySelector('script[data-cyberguru-app]')) {
      const script = document.createElement('script');
      script.src = '/js/app.js?v=entropy-v11';
      script.defer = true;
      script.dataset.cyberguruApp = '1';
      document.body.appendChild(script);
    }
  });
</script>

<svelte:head>
  <meta name="description" content={$translationsStore.meta_description} />
  
  <title>{appTitle} — {$translationsStore.title_suffix}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <link rel="icon" href="/img/avatar.jpg?v=black-logo-20260607" type="image/jpeg" />
</svelte:head>

<div class="container">
<div class="home">
  <div class="home__heading">
    <span class="badge">{$translationsStore.badge}</span>
    <h1 class="hero__title">
      {$translationsStore.hero_title_main}<br /><span class="hero__accent">{$translationsStore.hero_title_accent}</span>
    </h1>
    <p class="hero__desc">
      {$translationsStore.hero_desc_before} <strong>{$translationsStore.hero_desc_strong}</strong> {$translationsStore.hero_desc_after}
    </p>
  </div>

  <div class="home__pass-gen">
    <Generator />
  </div>

  <div class="home__pass-settings">
    <Settings />
  </div>
</div>
</div>
<OldHome />