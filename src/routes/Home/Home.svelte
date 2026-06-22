<script lang="ts">
  import { type Lang } from '$lib/types/supported-langs';
  import { onMount } from 'svelte';
  import { appTitle } from '$lib/constans/app';
  import { translationsStore } from '$lib/stores/translations.store';
    import { currentLang } from '$lib/stores/current-lang.store';
    import Generator from './ui/Generator.svelte';
    import OldHome from './ui/OldHome.svelte';
    import Settings from './ui/Settings.svelte';
    import CrackTime from './ui/CrackTime.svelte';

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

    <div class="home__crack-time">
      <CrackTime />
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            ><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
        </div>
        <div>
          <strong>{$translationsStore.feature_local_title}</strong>
          <span>{$translationsStore.feature_local_desc}</span>
        </div>
      </div>
      <div class="feature">
        <div class="feature__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            ><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1" fill="currentColor" /><circle cx="16" cy="8" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="8" cy="16" r="1" fill="currentColor" /><circle cx="16" cy="16" r="1" fill="currentColor" /></svg>
        </div>
        <div>
          <strong>{$translationsStore.feature_diceware_title}</strong>
          <span>{$translationsStore.feature_diceware_desc}</span>
        </div>
      </div>
      <div class="feature">
        <div class="feature__icon">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
            ><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
        </div>
        <div>
          <strong>{$translationsStore.feature_secure_title}</strong>
          <span>{$translationsStore.feature_secure_desc}</span>
        </div>
      </div>
    </div>
  </div>

  <section class="content-grid">
    <div class="content-grid__inner">
      <div class="portrait-wrap">
        <img src="/img/pawel.jpg" alt="Paweł Hordyński — CyberGuru" class="portrait" width="400" height="500" loading="lazy" />
      </div>

      <div class="panel panel--info" id="entropy-info">
        <h2 class="panel__title">{$translationsStore.entropy_title}</h2>
        <p class="panel__text">{$translationsStore.entropy_desc}</p>
        <table class="entropy-table">
          <thead>
            <tr><th>{$translationsStore.entropy_column}</th><th>{$translationsStore.rating_column}</th></tr>
          </thead>
          <tbody>
            <tr><td>{$translationsStore.weak_bits}</td><td class="quality-weak">{$translationsStore.weak}</td></tr>
            <tr><td>{$translationsStore.medium_bits}</td><td class="quality-medium">{$translationsStore.medium}</td></tr>
            <tr><td>{$translationsStore.good_bits}</td><td class="quality-good">{$translationsStore.good}</td></tr>
            <tr><td>{$translationsStore.strong_bits}</td><td class="quality-strong">{$translationsStore.strong}</td></tr>
          </tbody>
        </table>
        <div class="panel__icon" aria-hidden="true">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
            ><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><rect x="9" y="10" width="6" height="5" rx="1" fill="currentColor" opacity="0.3" /></svg>
        </div>
      </div>

      <div class="panel panel--info" id="how-it-works">
        <h2 class="panel__title">{$translationsStore.how_title}</h2>
        <ol class="steps">
          <li><span class="steps__num">1</span>{$translationsStore.step_1}</li>
          <li><span class="steps__num">2</span>{$translationsStore.step_2_before} <code>crypto.getRandomValues()</code>.</li>
          <li><span class="steps__num">3</span>{$translationsStore.step_3}</li>
          <li><span class="steps__num">4</span>{$translationsStore.step_4}</li>
        </ol>
        <div class="panel__dice" aria-hidden="true">
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
            <path d="M50 5 L90 30 L90 70 L50 95 L10 70 L10 30 Z" stroke="#e52329" stroke-width="1.5" fill="none" opacity="0.6" />
            <path d="M50 15 L80 35 L80 65 L50 85 L20 65 L20 35 Z" stroke="#871714" stroke-width="1" fill="rgba(229,35,41,0.08)" />
            <circle cx="50" cy="50" r="4" fill="#e52329" />
            <circle cx="35" cy="38" r="3" fill="#e52329" opacity="0.7" />
            <circle cx="65" cy="38" r="3" fill="#e52329" opacity="0.7" />
            <circle cx="35" cy="62" r="3" fill="#e52329" opacity="0.7" />
            <circle cx="65" cy="62" r="3" fill="#e52329" opacity="0.7" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</div>

<section class="security-bar" id="security">
  <div class="container">
    <h2 class="security-bar__title">{$translationsStore.security_title}</h2>
    <ul class="security-bar__list">
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          ><polyline points="20 6 9 17 4 12" /></svg>
        {$translationsStore.security_local}
      </li>
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          ><polyline points="20 6 9 17 4 12" /></svg>
        {$translationsStore.security_no_server}
      </li>
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          ><polyline points="20 6 9 17 4 12" /></svg>
        {$translationsStore.security_no_history}
      </li>
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          ><polyline points="20 6 9 17 4 12" /></svg>
        {$translationsStore.security_crypto}
      </li>
      <li>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
          ><polyline points="20 6 9 17 4 12" /></svg>
        {$translationsStore.security_offline}
      </li>
    </ul>
  </div>
</section>
<!-- <OldHome /> -->

<style>
  @media all and (min-width: 768px) {
    .home {
      display: grid;
      grid-template-columns: 1fr 300px;
      grid-template-rows: 4;
      gap: 1rem;
    }

    .home__heading {
      grid-column: span 2;
    }

    .home__pass-gen {
      grid-column: 1;
      grid-row: 2;
    }

    .home__pass-settings {
      grid-column: 2;
      grid-row: 2 / 4;
    }
    
    .home__crack-time {
      grid-column: 1;
      grid-row: 3;
    }
  }

  @media all and (min-width: 1024px) {
    .home {
      display: grid;
      grid-template-columns: 1fr 400px;
      grid-template-rows: 4;
    }

    .home__heading {
      grid-column: span 2;
    }

    .home__pass-gen {
      grid-column: 1;
      grid-row: 2;
    }

    .home__pass-settings {
      grid-column: 2;
      grid-row: 2 / 4;
    }
    
    .home__crack-time {
      grid-column: 1;
      grid-row: 3;
    }
  }
</style>