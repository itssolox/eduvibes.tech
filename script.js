/**
 * AI Practicals 1 to 11 - Study Guide & Code Hub
 * Client-Side Controller for Navigation, Search, Dark Mode, & Clipboard
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selectors ---
  const sidebar = document.getElementById('appSidebar');
  const overlay = document.getElementById('sidebarOverlay');
  const menuToggle = document.getElementById('menuToggle');
  const themeToggle = document.getElementById('themeToggle');
  const searchInput = document.getElementById('sidebarSearch');
  const navLinks = document.querySelectorAll('.nav-link');
  const practicalSections = document.querySelectorAll('.practical-section');

  const practicalIds = [
    'overview',
    'pract1',
    'pract2',
    'pract3',
    'pract4',
    'pract5',
    'pract6',
    'pract7',
    'pract8',
    'pract9',
    'pract10',
    'pract11',
    'comparisons'
  ];

  // SVG Icons
  const sunIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg><span>Light</span>`;
  const moonIcon = `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg><span>Dark</span>`;
  const checkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Copied!</span>`;
  const copyDefaultIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg><span>Copy Code</span>`;

  // --- Theme Management ---
  const getPreferredTheme = () => {
    const saved = localStorage.getItem('ai_pract_theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('ai_pract_theme', theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };

  setTheme(getPreferredTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // --- Mobile Drawer Management ---
  const openSidebar = () => {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closeSidebar);
  }

  // --- Tab & Route Switching System ---
  function showSection(targetId, updateHash = true, scrollToTop = true) {
    if (!targetId || !document.getElementById(targetId)) {
      targetId = 'overview';
    }

    // Toggle active practical sections
    practicalSections.forEach(sec => {
      if (sec.id === targetId) {
        sec.classList.add('active');
      } else {
        sec.classList.remove('active');
      }
    });

    // Update active nav links
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${targetId}`) {
        link.classList.add('active');
        link.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      } else {
        link.classList.remove('active');
      }
    });

    // Update hash in URL
    if (updateHash) {
      window.history.pushState(null, '', `#${targetId}`);
    }

    // Dynamic Title Update
    const activeSec = document.getElementById(targetId);
    if (activeSec) {
      const headerTitle = activeSec.querySelector('.pract-title');
      const titleText = headerTitle ? headerTitle.textContent.trim() : 'AI Practicals 1-11';
      document.title = `${titleText} | AI Lab Prep`;
    }

    if (scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Close mobile sidebar if open
    closeSidebar();
  }

  // Handle URL hash changes
  function handleHash() {
    const rawHash = window.location.hash.replace('#', '');
    if (!rawHash) {
      showSection('overview', false, false);
      return;
    }

    if (document.getElementById(rawHash) && practicalIds.includes(rawHash)) {
      showSection(rawHash, false, true);
    } else {
      // Anchor link e.g. #p1-code
      const parts = rawHash.split('-');
      if (parts.length > 0) {
        const prefixMatch = parts[0].match(/^p(\d+)$/);
        if (prefixMatch) {
          const mainTarget = `pract${prefixMatch[1]}`;
          showSection(mainTarget, false, false);
          setTimeout(() => {
            const anchorEl = document.getElementById(rawHash);
            if (anchorEl) {
              anchorEl.scrollIntoView({ behavior: 'smooth' });
            }
          }, 50);
          return;
        }
      }
      showSection('overview', false, false);
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // Intercept nav clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (targetHref.startsWith('#')) {
        const targetId = targetHref.slice(1);
        e.preventDefault();
        showSection(targetId, true, true);
      }
    });
  });

  // Delegate clicks for overview cards and prev/next buttons
  document.addEventListener('click', (e) => {
    const routeTrigger = e.target.closest('[data-route]');
    if (routeTrigger) {
      e.preventDefault();
      const target = routeTrigger.getAttribute('data-route');
      showSection(target, true, true);
    }
  });

  // --- Real-Time Search / Filter in Sidebar ---
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const navItems = sidebar.querySelectorAll('.nav-link');

      navItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        const searchKeywords = item.getAttribute('data-keywords') || '';
        if (text.includes(query) || searchKeywords.toLowerCase().includes(query)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });

    // Keyboard shortcut '/' to search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      if (e.key === 'Escape') {
        if (document.activeElement === searchInput) {
          searchInput.value = '';
          searchInput.dispatchEvent(new Event('input'));
          searchInput.blur();
        }
        closeSidebar();
      }
    });
  }

  // --- Copy Code to Clipboard ---
  document.addEventListener('click', async (e) => {
    const copyBtn = e.target.closest('.copy-btn');
    if (!copyBtn) return;

    const codeBox = copyBtn.closest('.code-container');
    if (!codeBox) return;

    const codeElement = codeBox.querySelector('pre code');
    if (!codeElement) return;

    const rawCode = codeElement.textContent;

    try {
      await navigator.clipboard.writeText(rawCode);
      copyBtn.classList.add('copied');
      copyBtn.innerHTML = checkIcon;

      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = copyDefaultIcon;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      const textarea = document.createElement('textarea');
      textarea.value = rawCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      copyBtn.classList.add('copied');
      copyBtn.innerHTML = checkIcon;
      setTimeout(() => {
        copyBtn.classList.remove('copied');
        copyBtn.innerHTML = copyDefaultIcon;
      }, 2000);
    }
  });

  // --- Keyboard Shortcuts for Prev / Next Practical ---
  document.addEventListener('keydown', (e) => {
    if (['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
      return;
    }

    const currentHash = window.location.hash.replace('#', '') || 'overview';
    const currentIndex = practicalIds.indexOf(currentHash);

    if (e.key === 'ArrowRight' || e.key === ']') {
      if (currentIndex !== -1 && currentIndex < practicalIds.length - 1) {
        e.preventDefault();
        showSection(practicalIds[currentIndex + 1], true, true);
      }
    } else if (e.key === 'ArrowLeft' || e.key === '[') {
      if (currentIndex > 0) {
        e.preventDefault();
        showSection(practicalIds[currentIndex - 1], true, true);
      }
    }
  });
});
