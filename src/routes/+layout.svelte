<script lang="ts">
  import '../app.css';
  import { isSupportedLang, type Lang } from '$lib/types/supported-langs';
  import { translationsStore } from '$lib/stores/translations.store';
  import { currentLang } from '$lib/stores/current-lang.store';
  import Toast from '$lib/components/Toast.svelte';
    import Icon from '$lib/components/Icon.svelte';
 
	let { children, data } = $props();

  let menuExpanded = $state(false);

  const changeLang = (lang: Lang) => {
    currentLang.set(lang);
  }

  if(isSupportedLang(data.langFromQuery)) {
    changeLang(data.langFromQuery);
  }
</script>

<Toast />

<div class="page-bg" aria-hidden="true"></div>

<header class="header">
  <div class="container header__inner">
    <a href="/" class="brand">
      <img src="/img/avatar.jpg?v=black-logo-20260607" alt="CyberGuru Diceware" class="brand__avatar" />
      <div class="brand__text">
        <span class="brand__title">CyberGuru <span class="brand__accent">Diceware</span></span>
        <span class="brand__subtitle">{$translationsStore.brand_subtitle}</span>
      </div>
    </a>

    <button 
      type="button" 
      class="menu-toggle" 
      id="nav-toggle" 
      aria-label="Menu" 
      aria-expanded="false"
      onclick={() => menuExpanded = !menuExpanded}
    >
      <!-- <span></span><span></span><span></span> -->
       <Icon name={menuExpanded ? 'close' : 'menu'} />
    </button>

    <nav class="nav" class:nav--expanded={menuExpanded} aria-label="Nawigacja">
      <a href="#how-it-works" class="nav__link">{$translationsStore.nav_how}</a>
      <a href="#security" class="nav__link">{$translationsStore.nav_security}</a>
      <a
        href="https://github.com/p4b1o/diceware-io"
        class="nav__link nav__link--github"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
          ><path
            d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 1.005-.315 3.3 1.23 3.3 1.23a9.192 9.192 0 0 1 2.46-.33c.84 0 1.68.12 2.46.33 0 0 2.295-1.545 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"
          /></svg>
        {$translationsStore.nav_source}
      </a>
      <div class="language-switcher" aria-label="Language">
        <a 
          href="?lang=pl" 
          class="language-switcher__link" 
          class:active={$currentLang === 'pl'} 
          aria-label={$translationsStore.lang_pl} 
          title={$translationsStore.lang_pl}
          onclick={() => changeLang('pl')}
        >
          🇵🇱
        </a>
        <a 
          href="?lang=en" 
          class="language-switcher__link" 
          class:active={$currentLang === 'en'} 
          aria-label={$translationsStore.lang_en} 
          title={$translationsStore.lang_en}
          onclick={() => changeLang('en')}
        >
          🇬🇧
        </a>
      </div>
    </nav>

    
  </div>
</header>

<main>
  {@render children()}
</main>

<footer class="footer">
  <div class="container footer__inner">
    <div class="footer__brand">
      <img src="/img/avatar.jpg?v=black-logo-20260607" alt="" class="footer__logo" aria-hidden="true" />
      <span>Paweł Hordyński <strong>CyberGuru</strong></span>
    </div>
    <p class="footer__copy">© {new Date().getFullYear()} Paweł Hordyński Cyberguru</p>
    <a href="mailto:sklep@pawelhordynski.com" class="footer__contact">{$translationsStore.contact}</a>
  </div>
</footer>

<style>
    .menu-toggle {
      background-color: transparent;
      border: none;
      color: var(--font);
      font-size: 2rem;
    }

    .nav {
      width: 100%;
      display: none;
      flex-direction: column;
      gap: 1rem;
      align-items: start;
    }

    .nav--expanded { 
      display: flex;
    }

    @media all and (min-width: 768px) {
      .menu-toggle {
        display: none;
      }

      .nav {
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
      }

      .brand {
        width: auto;
      }
    }
</style>