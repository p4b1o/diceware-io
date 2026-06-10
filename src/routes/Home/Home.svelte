<script lang="ts">
  import { type Lang } from '$lib/types/supported-langs';
  import { onMount } from 'svelte';
  import { appTitle } from '$lib/constans/app';
  import { translationsStore } from '$lib/stores/translations.store';
    import { currentLang } from '$lib/stores/current-lang.store';
    import Generator from './ui/Generator.svelte';

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






  <section class="hero">
    <div class="container hero__grid">
      <div class="hero__content">
        <span class="badge">{$translationsStore.badge}</span>
        <h1 class="hero__title">
          {$translationsStore.hero_title_main}<br /><span class="hero__accent">{$translationsStore.hero_title_accent}</span>
        </h1>
        <p class="hero__desc">
          {$translationsStore.hero_desc_before} <strong>{$translationsStore.hero_desc_strong}</strong> {$translationsStore.hero_desc_after}
        </p>

        <Generator />

        <div class="generator-card" id="generator">
          <div class="generator-card__glow" aria-hidden="true"></div>
          <div class="generator-card__inner">
            <h2 class="generator-card__label">{$translationsStore.your_password}</h2>
            <div class="password-display">
              <p class="password-display__text" id="password-output" aria-live="polite">{$translationsStore.loading_wordlist}</p>
              <button type="button" class="password-display__copy" id="btn-copy-inline" aria-label={$translationsStore.copy_password}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  ><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              </button>
            </div>

            <div class="stats">
              <div class="stat">
                <span class="stat__label">{$translationsStore.entropy}</span>
                <span class="stat__value stat__value--accent" id="stat-entropy">—</span>
              </div>
              <div class="stat">
                <span class="stat__label">{$translationsStore.quality}</span>
                <div class="stat__quality">
                  <span class="stat__value" id="stat-quality">—</span>
                  <div class="quality-bar" id="quality-bar" aria-hidden="true">
                    <span class="quality-bar__seg"></span>
                    <span class="quality-bar__seg"></span>
                    <span class="quality-bar__seg"></span>
                    <span class="quality-bar__seg"></span>
                    <span class="quality-bar__seg"></span>
                  </div>
                </div>
              </div>
              <div class="stat">
                <span class="stat__label">{$translationsStore.word_count}</span>
                <span class="stat__value" id="stat-words">
                  7 {$translationsStore.words}
                </span>
              </div>
              <div class="stat">
                <span class="stat__label">{$translationsStore.dictionary}</span>
                <span class="stat__value stat__value--small" id="stat-dict">{wordlist.name}</span>
              </div>
            </div>
            <p class="entropy-breakdown" id="entropy-breakdown" aria-live="polite"></p>
            <div class="crack-estimate" aria-live="polite">
              <span class="crack-estimate__label">{$translationsStore.crack_time}</span>
              <strong class="crack-estimate__value" id="crack-time">—</strong>
              <span class="crack-estimate__meta" id="crack-algorithm">—</span>
            </div>

            <div class="actions">
              <button type="button" class="btn btn--primary" id="btn-generate">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  ><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8" cy="8" r="1" fill="currentColor" /><circle cx="16" cy="8" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="8" cy="16" r="1" fill="currentColor" /><circle cx="16" cy="16" r="1" fill="currentColor" /></svg>
                {$translationsStore.generate}
              </button>
              <button type="button" class="btn btn--outline" id="btn-copy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  ><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                {$translationsStore.copy_password}
              </button>
              <button type="button" class="btn btn--outline" id="btn-toggle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  ><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                {$translationsStore.show_hide}
              </button>
              <button type="button" class="btn btn--outline" id="btn-export">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                  ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                {$translationsStore.export_txt}
              </button>
            </div>

            <p class="privacy-note">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                ><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              {$translationsStore.privacy_note}
            </p>
          </div>
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

      <div class="panel panel--settings" id="settings">
        <h2 class="panel__title">{$translationsStore.settings_title}</h2>

        <div class="setting">
          <label class="setting__label" for="word-count">{$translationsStore.word_count}</label>
          <div class="word-count-control">
            <button type="button" class="stepper" id="btn-minus" aria-label={`${$translationsStore.word_count} −`}>−</button>
            <input type="range" id="word-count" min="3" max="15" value="7" class="slider" />
            <span class="word-count-value" id="word-count-value">7</span>
            <button type="button" class="stepper" id="btn-plus" aria-label={`${$translationsStore.word_count} +`}>+</button>
          </div>
        </div>

        <div class="setting">
          <span class="setting__label">{$translationsStore.separator}</span>
          <div class="toggle-group" role="group" aria-label="Separator">
            <button type="button" class="toggle-btn active" data-separator=" ">{$translationsStore.space}</button>
            <button type="button" class="toggle-btn" data-separator="-">{$translationsStore.hyphen}</button>
            <button type="button" class="toggle-btn" data-separator=".">{$translationsStore.dot}</button>
            <button type="button" class="toggle-btn" data-separator="">{$translationsStore.none}</button>
            <button type="button" class="toggle-btn" data-separator="custom">{$translationsStore.custom}</button>
          </div>
          <input
            type="text"
            class="custom-separator"
            id="custom-separator"
            maxlength="3"
            placeholder={$translationsStore.custom_separator}
            hidden
          />
        </div>

        <div class="setting">
          <span class="setting__label">{$translationsStore.casing}</span>
          <div class="toggle-group" role="group" aria-label="Wielkość liter">
            <button type="button" class="toggle-btn active" data-casing="title">{$translationsStore.title_case}</button>
            <button type="button" class="toggle-btn" data-casing="lower">{$translationsStore.lower_case}</button>
            <button type="button" class="toggle-btn" data-casing="upper">{$translationsStore.upper_case}</button>
            <button type="button" class="toggle-btn" data-casing="random">{$translationsStore.random_case}</button>
          </div>
        </div>

        <label class="setting setting--switch">
          <span class="switch">
            <input type="checkbox" id="add-digit" aria-label={$translationsStore.add_digit} />
            <span class="switch__slider"></span>
          </span>
          <span class="setting__label">{$translationsStore.add_digit}</span>
        </label>

        <label class="setting setting--switch">
          <span class="switch">
            <input type="checkbox" id="add-special" aria-label={$translationsStore.add_special} />
            <span class="switch__slider"></span>
          </span>
          <span class="setting__label">{$translationsStore.add_special}</span>
        </label>

        <div class="setting">
          <label class="setting__label" for="crack-algorithm-select">{$translationsStore.crack_algorithm}</label>
          <select class="setting__select" id="crack-algorithm-select">
            <option value="md5">MD5 — 300 GH/s</option>
            <option value="ntlm">NTLM — 300 GH/s</option>
            <option value="sha1">SHA-1 — 100 GH/s</option>
            <option value="sha256">SHA-256 — 45 GH/s</option>
            <option value="bcrypt">bcrypt cost 12 — 200 kH/s</option>
          </select>
          <p class="setting__hint">{$translationsStore.crack_algorithm_hint}</p>
        </div>

        <div class="setting setting--dict">
          <span class="setting__label">{$translationsStore.dictionary}</span>
          <span class="setting__dict-info" id="dict-info">{wordlist.name}</span>
        </div>
      </div>
    </div>
  </section>

  <section class="content-grid">
    <div class="container content-grid__inner">
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


