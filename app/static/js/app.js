/**
 * CyberGuru Diceware — client-side password generator
 * Uses crypto.getRandomValues() for cryptographically secure randomness.
 */

(function () {
  "use strict";

  const config = window.CYBERGURU_CONFIG || {};
  const labels = config.labels || {};
  const WORDLIST_URL = config.wordlistUrl || "/static/wordlists/diceware-pl.txt";
  const DICT_NAME = config.dictName || "diceware-pl.txt";
  const LOCALE = config.locale || "pl-PL";
  const SPECIAL_CHARS = "!@#$%^&*-_=+";
  const BUILTIN_SEPARATOR_CHOICES = 3; // space, hyphen, dot
  const CUSTOM_SEPARATOR_CHARSET_SIZE = 94; // printable ASCII estimate
  const CRACK_ALGORITHMS = {
    md5: { name: "MD5", guessesPerSecond: 300_000_000_000 },
    ntlm: { name: "NTLM", guessesPerSecond: 300_000_000_000 },
    sha1: { name: "SHA-1", guessesPerSecond: 100_000_000_000 },
    sha256: { name: "SHA-256", guessesPerSecond: 45_000_000_000 },
    bcrypt: { name: "bcrypt cost 12", guessesPerSecond: 200_000 },
  };
  const COPY_FEEDBACK_MS = 2000;
  const IS_LOCAL_DEV = ["127.0.0.1", "localhost", "::1"].includes(window.location.hostname);

  const state = {
    words: [],
    password: "",
    wordCount: 7,
    separator: " ",
    customSeparator: "",
    casing: "title",
    addDigit: false,
    addSpecial: false,
    crackAlgorithm: "md5",
    hidden: false,
    ready: false,
    selectedWords: [],
  };

  const els = {};

  function $(id) {
    return document.getElementById(id);
  }

  function cacheElements() {
    els.passwordOutput = $("password-output");
    els.statEntropy = $("stat-entropy");
    els.statQuality = $("stat-quality");
    els.statWords = $("stat-words");
    els.statDict = $("stat-dict");
    els.entropyBreakdown = $("entropy-breakdown");
    els.crackTime = $("crack-time");
    els.crackAlgorithm = $("crack-algorithm");
    els.crackAlgorithmSelect = $("crack-algorithm-select");
    els.qualityBar = $("quality-bar");
    els.wordCount = $("word-count");
    els.wordCountValue = $("word-count-value");
    els.customSeparator = $("custom-separator");
    els.dictInfo = $("dict-info");
    els.btnGenerate = $("btn-generate");
    els.btnCopy = $("btn-copy");
    els.btnCopyHeader = $("btn-copy-header");
    els.btnCopyInline = $("btn-copy-inline");
    els.btnToggle = $("btn-toggle");
    els.btnExport = $("btn-export");
    els.btnMinus = $("btn-minus");
    els.btnPlus = $("btn-plus");
    els.addDigit = $("add-digit");
    els.addSpecial = $("add-special");
    els.navToggle = $("nav-toggle");
    els.header = document.querySelector(".header");
  }

  /**
   * Parse wordlist text: skip empty lines, comments, extract word from "11111 word" format.
   */
  function parseWordlist(text) {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.startsWith("#"))
      .map((line) => {
        const match = line.match(/^\d+\s+(.+)$/);
        return match ? match[1].trim() : line;
      })
      .filter((word) => word.length > 0);
  }

  /**
   * Cryptographically secure random integer in [0, max).
   */
  function secureRandomInt(max) {
    if (max <= 0) return 0;
    const range = max;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8) || 1;
    const maxValid = Math.floor(256 ** bytesNeeded / range) * range - 1;
    const arr = new Uint8Array(bytesNeeded);

    let value;
    do {
      crypto.getRandomValues(arr);
      value = 0;
      for (let i = 0; i < bytesNeeded; i++) {
        value = value * 256 + arr[i];
      }
    } while (value > maxValid);

    return value % range;
  }

  function applyCasing(word, mode) {
    switch (mode) {
      case "lower":
        return word.toLowerCase();
      case "upper":
        return word.toUpperCase();
      case "title":
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      case "random":
        return word
          .split("")
          .map((char) => {
            if (char.toLowerCase() === char.toUpperCase()) return char;
            return secureRandomInt(2) ? char.toUpperCase() : char.toLowerCase();
          })
          .join("");
      default:
        return word;
    }
  }

  function countCaseVariableCharacters(word) {
    return word.split("").filter((char) => char.toLowerCase() !== char.toUpperCase()).length;
  }

  function getSeparator() {
    if (state.separator === "custom") {
      return state.customSeparator || "";
    }
    return state.separator;
  }

  function generatePassword() {
    if (!state.words.length) return "";

    const selected = [];
    const selectedWords = [];
    for (let i = 0; i < state.wordCount; i++) {
      const idx = secureRandomInt(state.words.length);
      const word = state.words[idx];
      selectedWords.push(word);
      const cased =
        state.casing === "random"
          ? applyCasing(word, "random")
          : applyCasing(word, state.casing);
      selected.push(cased);
    }
    state.selectedWords = selectedWords;

    let password = selected.join(getSeparator());

    if (state.addDigit) {
      password += secureRandomInt(10).toString();
    }

    if (state.addSpecial) {
      password += SPECIAL_CHARS[secureRandomInt(SPECIAL_CHARS.length)];
    }

    return password;
  }

  function calculateEntropyDetails() {
    if (!state.words.length || state.wordCount < 1) {
      return { total: 0, parts: [] };
    }

    // Entropy is log2(number of possible generated outputs). Separator entropy
    // is included as a practical search-space estimate when separators are used.
    const parts = [];
    const wordEntropy = state.wordCount * Math.log2(state.words.length);
    parts.push({
      key: "words",
      label: labels.entropyWords || "słowa",
      bits: wordEntropy,
    });

    const separator = getSeparator();
    if (state.wordCount > 1 && separator.length > 0) {
      const separatorBits =
        state.separator === "custom"
          ? separator.length * Math.log2(CUSTOM_SEPARATOR_CHARSET_SIZE)
          : Math.log2(BUILTIN_SEPARATOR_CHOICES);

      parts.push({
        key: "separator",
        label: labels.entropySeparator || "separator",
        bits: separatorBits * (state.wordCount - 1),
      });
    }

    if (state.casing === "random" && state.selectedWords.length) {
      const caseChoices = state.selectedWords.reduce(
        (sum, word) => sum + countCaseVariableCharacters(word),
        0
      );
      if (caseChoices > 0) {
        parts.push({
          key: "case",
          label: labels.entropyCase || "losowa wielkość liter",
          bits: caseChoices, // one unbiased upper/lower choice per case-variable character
        });
      }
    }

    if (state.addDigit) {
      parts.push({
        key: "digit",
        label: labels.entropyDigit || "cyfra",
        bits: Math.log2(10),
      });
    }

    if (state.addSpecial) {
      parts.push({
        key: "special",
        label: labels.entropySpecial || "znak specjalny",
        bits: Math.log2(SPECIAL_CHARS.length),
      });
    }

    return {
      total: parts.reduce((sum, part) => sum + part.bits, 0),
      parts,
    };
  }

  function getQuality(entropy) {
    if (entropy < 50) return { label: labels.qualityWeak || "Słabe", level: 1 };
    if (entropy < 70) return { label: labels.qualityMedium || "Średnie", level: 2 };
    if (entropy < 90) return { label: labels.qualityGood || "Dobra", level: 3 };
    return { label: labels.qualityStrong || "Bardzo mocne", level: 5 };
  }

  function formatLargeNumber(value) {
    if (value >= 1_000_000_000_000) return `${(value / 1_000_000_000_000).toFixed(0)} TH/s`;
    if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(0)} GH/s`;
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} MH/s`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(0)} kH/s`;
    return `${value.toLocaleString(LOCALE)} H/s`;
  }

  function formatCrackDuration(seconds) {
    if (!Number.isFinite(seconds)) return labels.crackForever || "praktycznie nieskończony";
    if (seconds < 1) return labels.crackInstant || "mniej niż sekunda";

    const units = [
      { seconds: 31557600000, label: labels.crackBillionYears || "mld lat" },
      { seconds: 31557600, label: labels.crackYears || "lat" },
      { seconds: 2629800, label: labels.crackMonths || "mies." },
      { seconds: 86400, label: labels.crackDays || "dni" },
      { seconds: 3600, label: labels.crackHours || "godz." },
      { seconds: 60, label: labels.crackMinutes || "min" },
      { seconds: 1, label: labels.crackSeconds || "s" },
    ];
    const unit = units.find((item) => seconds >= item.seconds) || units[units.length - 1];
    const value = seconds / unit.seconds;
    const maximumFractionDigits = value >= 100 ? 0 : value >= 10 ? 1 : 2;
    const formatted = value.toLocaleString(LOCALE, { maximumFractionDigits });

    return `${formatted} ${unit.label}`;
  }

  function calculateCrackEstimate(entropy) {
    const algorithm = CRACK_ALGORITHMS[state.crackAlgorithm] || CRACK_ALGORITHMS.md5;
    // Average exhaustive search is half the full keyspace.
    const averageGuesses = 2 ** Math.max(entropy - 1, 0);
    return {
      algorithm,
      seconds: averageGuesses / algorithm.guessesPerSecond,
    };
  }

  function updateQualityBar(level) {
    const segments = els.qualityBar.querySelectorAll(".quality-bar__seg");
    segments.forEach((seg, i) => {
      seg.classList.toggle("active", i < level);
    });
  }

  function updateStats() {
    const entropyDetails = calculateEntropyDetails();
    const entropy = entropyDetails.total;
    const quality = getQuality(entropy);

    els.statEntropy.textContent = `${entropy.toFixed(2)} ${labels.bits || "bitów"}`;
    els.statQuality.textContent = quality.label;
    els.statWords.textContent = `${state.wordCount} ${labels.words || "słów"}`;
    els.statDict.textContent = `${DICT_NAME} (~ ${state.words.length.toLocaleString(LOCALE)} ${labels.words || "słów"})`;
    els.dictInfo.textContent = `${DICT_NAME} (~ ${state.words.length.toLocaleString(LOCALE)} ${labels.words || "słów"})`;
    els.entropyBreakdown.textContent = entropyDetails.parts
      .map((part) => `${part.label}: ${part.bits.toFixed(2)} ${labels.bits || "bitów"}`)
      .join(" + ");
    const crackEstimate = calculateCrackEstimate(entropy);
    els.crackTime.textContent = formatCrackDuration(crackEstimate.seconds);
    els.crackAlgorithm.textContent = `${crackEstimate.algorithm.name} (~${formatLargeNumber(
      crackEstimate.algorithm.guessesPerSecond
    )})`;
    updateQualityBar(quality.level);
  }

  function renderPassword() {
    if (state.hidden) {
      els.passwordOutput.textContent = "•".repeat(Math.min(state.password.length, 40));
      els.passwordOutput.classList.add("hidden");
    } else {
      els.passwordOutput.textContent = state.password || "—";
      els.passwordOutput.classList.remove("hidden");
    }
    updateStats();
  }

  function regenerate() {
    if (!state.ready) return;
    state.password = generatePassword();
    renderPassword();
  }

  async function copyPassword(buttons) {
    if (!state.password) return;

    try {
      await navigator.clipboard.writeText(state.password);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = state.password;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    const btns = Array.isArray(buttons) ? buttons : [buttons];
    btns.forEach((btn) => {
      if (!btn || btn.dataset.copying) return;
      btn.dataset.copying = "1";
      if (!btn.dataset.originalHtml) {
        btn.dataset.originalHtml = btn.innerHTML;
      }
      btn.classList.add("btn--copied");

      const svg = btn.querySelector("svg");
      btn.textContent = "";
      if (svg) btn.appendChild(svg.cloneNode(true));
      if (btn.id !== "btn-copy-inline") {
        btn.appendChild(document.createTextNode(` ${labels.copied || "Skopiowano"}`));
      } else {
        btn.setAttribute("aria-label", labels.copied || "Skopiowano");
      }

      setTimeout(() => {
        btn.innerHTML = btn.dataset.originalHtml;
        btn.classList.remove("btn--copied");
        delete btn.dataset.copying;
        if (btn.id === "btn-copy-inline") {
          btn.setAttribute("aria-label", labels.copyPassword || "Kopiuj hasło");
        }
      }, COPY_FEEDBACK_MS);
    });
  }

  function exportPassword() {
    if (!state.password) return;

    const blob = new Blob([state.password + "\n"], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = labels.downloadFile || "cyberguru-diceware-haslo.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function setWordCount(value) {
    const min = parseInt(els.wordCount.min, 10);
    const max = parseInt(els.wordCount.max, 10);
    state.wordCount = Math.max(min, Math.min(max, value));
    els.wordCount.value = state.wordCount;
    els.wordCountValue.textContent = state.wordCount;
    regenerate();
  }

  function bindEvents() {
    els.btnGenerate.addEventListener("click", regenerate);

    const copyBtns = [els.btnCopy, els.btnCopyHeader, els.btnCopyInline];
    copyBtns.forEach((btn) => {
      btn.addEventListener("click", () => copyPassword(copyBtns));
    });

    els.btnToggle.addEventListener("click", () => {
      state.hidden = !state.hidden;
      renderPassword();
    });

    els.btnExport.addEventListener("click", exportPassword);

    els.btnMinus.addEventListener("click", () => setWordCount(state.wordCount - 1));
    els.btnPlus.addEventListener("click", () => setWordCount(state.wordCount + 1));

    els.wordCount.addEventListener("input", () => {
      setWordCount(parseInt(els.wordCount.value, 10));
    });

    document.querySelectorAll("[data-separator]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-separator]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.separator = btn.dataset.separator;
        els.customSeparator.hidden = state.separator !== "custom";
        regenerate();
      });
    });

    els.customSeparator.addEventListener("input", () => {
      state.customSeparator = els.customSeparator.value;
      if (state.separator === "custom") regenerate();
    });

    document.querySelectorAll("[data-casing]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-casing]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.casing = btn.dataset.casing;
        regenerate();
      });
    });

    els.addDigit.addEventListener("change", () => {
      state.addDigit = els.addDigit.checked;
      regenerate();
    });

    els.addSpecial.addEventListener("change", () => {
      state.addSpecial = els.addSpecial.checked;
      regenerate();
    });

    els.crackAlgorithmSelect.addEventListener("change", () => {
      state.crackAlgorithm = els.crackAlgorithmSelect.value;
      updateStats();
    });

    els.navToggle.addEventListener("click", () => {
      const open = els.header.classList.toggle("nav-open");
      els.navToggle.setAttribute("aria-expanded", open);
    });
  }

  async function loadWordlist() {
    try {
      const response = await fetch(WORDLIST_URL);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      state.words = parseWordlist(text);

      if (state.words.length === 0) {
        throw new Error(labels.emptyWordlist || "Słownik jest pusty");
      }

      state.ready = true;
      regenerate();
    } catch (err) {
      els.passwordOutput.textContent =
        labels.wordlistError || "Błąd ładowania słownika. Sprawdź połączenie.";
      console.error("Wordlist load error:", err);
    }
  }

  function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;

    if (IS_LOCAL_DEV) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      });
      if ("caches" in window) {
        caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
      }
      return;
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/static/js/sw.js?v=entropy-v11").catch((err) => {
        console.warn("Service Worker registration failed:", err);
      });
    }
  }

  async function init() {
    cacheElements();
    bindEvents();
    registerServiceWorker();
    await loadWordlist();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
