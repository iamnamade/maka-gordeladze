(() => {
  const focusableSelector =
    'a[href], area[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
  const modalState = {
    activeModal: null,
    lastFocusedElement: null,
  };
  const REMOVED_COURSE_TITLES = new Set([
    "ემოციური წიგნიერება",
    "ოჯახური კომუნიკაცია",
    "შემოქმედებითი თვითგამოხატვა",
    "სტრესთან გამკლავება",
  ]);
  const FALLBACK_SEARCH_COURSES = [
    { id: 1, title: "არტთერაპია", cat: "არტთერაპია" },
    { id: 2, title: "კურსი მშობლებისთვის", cat: "მშობლებისთვის" },
    { id: 3, title: "ინტერპერსონალური კომუნიკაცია", cat: "კომუნიკაცია" },
    { id: 4, title: "ფსიქოლოგიის საფუძვლები", cat: "ფსიქოლოგია" },
  ];
  const SITE_CONTACT = {
    phone: "+995 555 12 34 56",
    phoneHref: "tel:+995555123456",
    email: "info@makagordeladze.ge",
    emailHref: "mailto:info@makagordeladze.ge",
    location: "თბილისი, საქართველო",
  };
  const SITE_SOCIALS = [];
  const NAV_DROPDOWN_CLOSE_DELAY = 160;
  let globalEventsBound = false;
  let activeDesktopNavDropdown = null;
  let activeDesktopNavCloseTimer = 0;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function createElement(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
  }

  function debounce(callback, wait = 120) {
    let timeoutId = 0;

    return (...args) => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => callback(...args), wait);
    };
  }

  function normalizePath(pathname = window.location.pathname) {
    return pathname.replace(/\\/g, "/");
  }

  function getBasePath() {
    return normalizePath().includes("/admin/") ? "../" : "";
  }

  function getCurrentPageId() {
    const explicitPage = document.body.dataset.page;

    if (explicitPage) {
      return explicitPage;
    }

    const path = normalizePath();

    if (path.endsWith("/therapy.html")) {
      return "therapy";
    }

    if (path.endsWith("/courses.html")) {
      return "courses";
    }

    if (path.endsWith("/contact.html")) {
      return "contact";
    }

    if (path.endsWith("/maka.html")) {
      return "maka";
    }

    return "home";
  }

  function getPageHref(pageId) {
    const base = getBasePath();
    const current = getCurrentPageId();

    const routes = {
      home: current === "home" ? "#home" : `${base}index.html`,
      therapy: `${base}therapy.html`,
      courses: `${base}courses.html`,
      about: `${base}maka.html`,
      contact: `${base}contact.html`,
      login: `${base}login.html`,
      dashboard: `${base}dashboard.html`,
      admin: `${base}admin/index.html`,
    };

    return routes[pageId] || `${base}index.html`;
  }

  function getIcon(name) {
    const icons = {
      location:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-6.2 7-13a7 7 0 1 0-14 0c0 6.8 7 13 7 13z"></path><circle cx="12" cy="9" r="2.5"></circle></svg>',
      phone:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.77 19.77 0 0 1-8.63-3.07A19.52 19.52 0 0 1 5.15 12.8 19.77 19.77 0 0 1 2.08 4.11 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.33 1.76.62 2.59a2 2 0 0 1-.45 2.11L8 9.94a16 16 0 0 0 6.06 6.06l1.52-1.23a2 2 0 0 1 2.11-.45c.83.29 1.7.5 2.59.62A2 2 0 0 1 22 16.92z"></path></svg>',
      mail:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v.4L12 13 2 6.4V6a2 2 0 0 1 2-2z"></path><path d="M22 8.3V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.3l9.4 6.27a1 1 0 0 0 1.2 0L22 8.3z"></path></svg>',
      clock:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 3"></path><circle cx="12" cy="12" r="9"></circle></svg>',
      search:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>',
      close:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg>',
      facebook:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 8h3V4h-3c-3 0-5 2-5 5v3H7v4h3v4h4v-4h3l1-4h-4V9c0-.7.3-1 1-1z"></path></svg>',
      instagram:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.2" cy="6.8" r="1"></circle></svg>',
      linkedin:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 8v9"></path><path d="M7 5.5a1 1 0 1 0 0 .01"></path><path d="M12 17v-5a2 2 0 0 1 4 0v5"></path><path d="M12 10v7"></path><path d="M12 12a3 3 0 0 1 5-2.3"></path></svg>',
      x:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 5 14 14"></path><path d="M19 5 5 19"></path></svg>',
      logo:
        '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M7 24c0-5 4-9 9-9 3.6 0 6.3 1.8 8 5.3C22.3 25.2 19.6 27 16 27c-5 0-9-4-9-9Z"></path><path d="M41 24c0 5-4 9-9 9-3.6 0-6.3-1.8-8-5.3C25.7 22.8 28.4 21 32 21c5 0 9 4 9 9Z"></path><path d="M16 24c2.2-4.2 4.9-6.3 8-6.3S29.8 19.8 32 24c-2.2 4.2-4.9 6.3-8 6.3S18.2 28.2 16 24Z"></path><path d="M20.5 29.5 16.6 33.4"></path></svg>',
    };

    return icons[name] || "";
  }

  function renderSocialLinks(variant = "header") {
    return SITE_SOCIALS.filter((item) => item?.href)
      .map(
        (item) => `
          <a class="social-link social-link--${variant}" href="${escapeHtml(item.href)}" aria-label="${escapeHtml(item.label)}" target="_blank" rel="noreferrer noopener">
            ${item.svg}
          </a>
        `,
      )
      .join("");
  }

  function getTopbarSocialItems() {
    return [
      {
        label: "Facebook",
        href: "#",
        svg:
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
      },
      {
        label: "X",
        href: "#",
        svg:
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21.5l-7.112 8.127L22.75 22h-6.548l-5.128-6.689L5.22 22H1.96l7.607-8.694L1.55 2h6.714l4.635 6.113L18.244 2Zm-1.143 18.05h1.805L7.276 3.855H5.34L17.101 20.05Z"/></svg>',
      },
      {
        label: "Instagram",
        href: "#",
        svg:
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>',
      },
      {
        label: "LinkedIn",
        href: "#",
        svg:
          '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>',
      },
    ];
  }

  function renderContactTopbarSocialLinks() {
    const items = getTopbarSocialItems();

    return items
      .map(
        (item) => `
          <a class="social-link social-link--header" href="${escapeHtml(item.href)}" aria-label="${escapeHtml(item.label)}" target="_blank" rel="noreferrer noopener">
            ${item.svg}
          </a>
        `,
      )
      .join("");
  }

  function renderMobileMenuSocialLinks() {
    const items = getTopbarSocialItems();

    return items
      .map(
        (item) => `
          <a class="mobile-nav__social-link" href="${escapeHtml(item.href)}" aria-label="${escapeHtml(item.label)}" target="_blank" rel="noreferrer noopener">
            ${item.svg}
          </a>
        `,
      )
      .join("");
  }

  function renderSiteLogo({ href, variant = "" }) {
    const classes = ["site-logo", variant].filter(Boolean).join(" ");

    return `
      <a class="${classes}" href="${href}" aria-label="მაკა გორდელაძე">
        <span class="site-logo__mark">${getIcon("logo")}</span>
        <span class="site-logo__text">მაკა გორდელაძე</span>
      </a>
    `;
  }

  function renderSiteHeader() {
    const mounts = [...document.querySelectorAll("[data-site-header]")];

    if (!mounts.length) {
      return;
    }

    const currentPage = getCurrentPageId();
    const leftLinks = [
      { id: "home", label: "მთავარი", href: getPageHref("home") },
      { id: "about", label: "მაკას შესახებ", href: getPageHref("about") },
    ];
    const therapyLinks = [
      { label: "ინდივიდუალური", href: `${getPageHref("therapy")}?type=individual` },
      { label: "ჯგუფური", href: `${getPageHref("therapy")}?type=group` },
    ];
    const courseLinks = [
      { label: "არტთერაპია", href: `${getPageHref("courses")}?category=${encodeURIComponent("არტთერაპია")}` },
      { label: "კურსი მშობლებისთვის", href: `${getPageHref("courses")}?category=${encodeURIComponent("მშობლებისთვის")}` },
      { label: "ინტერპერსონალური კომუნიკაცია", href: `${getPageHref("courses")}?category=${encodeURIComponent("კომუნიკაცია")}` },
      { label: "ფსიქოლოგიის საფუძვლები", href: `${getPageHref("courses")}?category=${encodeURIComponent("ფსიქოლოგია")}` },
    ];
    const rightLinks = [
      { id: "contact", label: "კონტაქტი", href: getPageHref("contact") },
    ];
    const socialMarkup = renderContactTopbarSocialLinks();
    const mobileMenuSocialMarkup = renderMobileMenuSocialLinks();

    const currentHash = window.location.hash || "";
    const topbarSocialLabel = socialMarkup ? "გამოგვყევი:" : "";
    const renderDesktopLink = (link) => {
      const isActive =
        (link.id === "home" && currentPage === "home" && (!currentHash || currentHash === "#home")) ||
        (link.id === "about" && (currentPage === "maka" || (currentPage === "home" && currentHash === "#about"))) ||
        (link.id === "contact" && ["contact", "login", "register"].includes(currentPage));

      return `<a class="nav-link${isActive ? " is-active" : ""}" href="${link.href}">${link.label}</a>`;
    };
    const renderDropdown = (label, href, items, isActive) => `
      <div class="nav-dropdown${isActive ? " is-active" : ""}">
        <a class="nav-link nav-link--dropdown${isActive ? " is-active" : ""}" href="${href}">
          <span>${label}</span>
          <span class="nav-caret" aria-hidden="true">▪</span>
        </a>
        <div class="nav-dropdown__menu">
          ${items
            .map(
              (item) => `
                <a class="nav-dropdown__item" href="${item.href}">
                  <span>${item.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              `,
            )
            .join("")}
        </div>
      </div>
    `;
    const centerNavMarkup = `
      ${leftLinks.map(renderDesktopLink).join("")}
      ${renderDropdown("თერაპია", getPageHref("therapy"), therapyLinks, currentPage === "therapy")}
      ${renderDropdown("კურსები", getPageHref("courses"), courseLinks, currentPage === "courses")}
      ${rightLinks.map(renderDesktopLink).join("")}
    `;

    const markup = `
      <header class="site-header" data-sticky-header>
        <div class="topbar">
          <div class="topbar__inner">
            <div class="topbar__info">
              <a href="${SITE_CONTACT.phoneHref}">${getIcon("phone")} <span data-latin>${SITE_CONTACT.phone}</span></a>
              <a href="${SITE_CONTACT.emailHref}">${getIcon("mail")} <span data-latin>${SITE_CONTACT.email}</span></a>
              <a href="${getPageHref("contact")}">${getIcon("location")} <span>${SITE_CONTACT.location}</span></a>
            </div>
            <div class="topbar__side">
              ${socialMarkup
                ? `
                  <div class="topbar__social" aria-label="სოციალური ქსელები">
                    ${topbarSocialLabel ? `<span>${topbarSocialLabel}</span>` : ""}
                    <div class="social-links">${socialMarkup}</div>
                  </div>
                `
                : ""}
            </div>
          </div>
        </div>
        <div class="navbar" data-search-component>
          <div class="navbar__inner navbar-shell">
            <div class="nav-content" data-nav-content>
              <div class="nav-layout">
                <div class="nav-brand">
                  ${renderSiteLogo({ href: getPageHref("home"), variant: "site-logo--header" })}
                </div>
                <nav class="nav-group nav-group--center" aria-label="მთავარი ნავიგაცია">
                  ${centerNavMarkup}
                </nav>
                <div class="nav-actions">
                  <button class="nav-search" type="button" aria-label="ძიება" aria-expanded="false" data-search-trigger>
                    ${getIcon("search")}
                  </button>
                  <a class="btn btn-primary" href="${getPageHref("therapy")}">დაჯავშნა <span class="btn-arrow">↗</span></a>
                  <button class="hamburger" type="button" aria-label="მენიუს გახსნა" aria-expanded="false" data-nav-toggle>
                    <span class="hamburger__box" aria-hidden="true">
                      <span class="hamburger__line"></span>
                      <span class="hamburger__line"></span>
                      <span class="hamburger__line"></span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="nav-search-bar search-bar-inline" data-search-bar>
            <div class="nav-search-bar__inner">
              <div class="nav-search-field">
                <input type="search" class="nav-search-input" placeholder="შეიყვანე საკვანძო სიტყვა" aria-label="ძებნა" data-search-input>
                <span class="nav-search-field__icon" aria-hidden="true">${getIcon("search")}</span>
              </div>
            </div>
            <button class="nav-search-close" type="button" aria-label="დახურვა" data-search-close>
              ${getIcon("close")}
            </button>
          </div>
          <div class="nav-search-results" data-search-results></div>
        </div>
      </header>
      <div class="mobile-nav" data-mobile-nav>
        <div class="mobile-nav__backdrop" data-nav-close></div>
        <div class="mobile-nav__panel">
          <div class="mobile-nav__header">
            ${renderSiteLogo({ href: getPageHref("home"), variant: "site-logo--mobile" })}
            <button class="nav-search mobile-nav__close" type="button" aria-label="მენიუს დახურვა" data-nav-close>
              ${getIcon("close")}
            </button>
          </div>
          <form class="mobile-nav__search" role="search" data-mobile-menu-search-form>
            <span aria-hidden="true">${getIcon("search")}</span>
            <label class="sr-only" for="mobile-menu-search">ძებნა</label>
            <input id="mobile-menu-search" type="search" placeholder="ძიება" autocomplete="off" data-mobile-menu-search>
          </form>
          <div class="mobile-nav__links" aria-label="მობილური ნავიგაცია">
            ${leftLinks.map((link) => `<a href="${link.href}"><span>${link.label}</span><span>↗</span></a>`).join("")}
            <a class="btn btn-primary mobile-nav__booking" href="${getPageHref("therapy")}">დაჯავშნა <span class="btn-arrow">↗</span></a>
            <div class="mobile-nav__group">
              <strong>თერაპია</strong>
              <div class="mobile-nav__sublinks">
                ${therapyLinks.map((item) => `<a href="${item.href}"><span>${item.label}</span><span>↗</span></a>`).join("")}
              </div>
            </div>
            <div class="mobile-nav__group">
              <strong>კურსები</strong>
              <div class="mobile-nav__sublinks">
                ${courseLinks.map((item) => `<a href="${item.href}"><span>${item.label}</span><span>↗</span></a>`).join("")}
              </div>
            </div>
            ${rightLinks.map((link) => `<a href="${link.href}"><span>${link.label}</span><span>↗</span></a>`).join("")}
          </div>
          <footer class="mobile-nav__footer" aria-label="საკონტაქტო ინფორმაცია">
            <div class="mobile-nav__contact">
              <span class="mobile-nav__contact-label">კონტაქტი</span>
              <a class="mobile-nav__contact-link" href="${SITE_CONTACT.phoneHref}">
                <span class="mobile-nav__contact-icon" aria-hidden="true">${getIcon("phone")}</span>
                <span data-latin>${SITE_CONTACT.phone}</span>
              </a>
              <a class="mobile-nav__contact-link" href="${SITE_CONTACT.emailHref}">
                <span class="mobile-nav__contact-icon" aria-hidden="true">${getIcon("mail")}</span>
                <span data-latin>${SITE_CONTACT.email}</span>
              </a>
              <a class="mobile-nav__contact-link" href="${getPageHref("contact")}">
                <span class="mobile-nav__contact-icon" aria-hidden="true">${getIcon("location")}</span>
                <span>${SITE_CONTACT.location}</span>
              </a>
              ${mobileMenuSocialMarkup
                ? `
                  <div class="mobile-nav__socials" aria-label="სოციალური ქსელები">
                    ${mobileMenuSocialMarkup}
                  </div>
                `
                : ""}
            </div>
          </footer>
        </div>
      </div>
    `;

    mounts.forEach((mount) => {
      mount.innerHTML = markup;
    });
  }

  function renderSiteFooter() {
    const mounts = [...document.querySelectorAll("[data-site-footer]")];

    if (!mounts.length) {
      return;
    }

    const year = new Date().getFullYear();
    const footerSocialMarkup = renderSocialLinks("footer");
    const markup = `
      <footer class="site-footer">
        <div class="footer__main">
          <div class="container footer__grid">
            <div class="footer__column footer__column--brand">
              ${renderSiteLogo({ href: getPageHref("home"), variant: "site-logo--footer" })}
              <p>ფსიქოლოგიური, თერაპიული და საგანმანათლებლო სივრცე, სადაც ყურადღება ეთმობა ნდობას, ემპათიას და შინაგანი ბალანსის მშვიდად პოვნას.</p>
              <div class="footer__contact-list">
                <a href="${SITE_CONTACT.phoneHref}"><span data-latin>${SITE_CONTACT.phone}</span></a>
                <a href="${SITE_CONTACT.emailHref}"><span data-latin>${SITE_CONTACT.email}</span></a>
              </div>
              ${footerSocialMarkup ? `<div class="social-links">${footerSocialMarkup}</div>` : ""}
            </div>
            <div class="footer__column">
              <strong class="footer__title">ნავიგაცია</strong>
              <div class="footer__links">
                <a href="${getPageHref("home")}">მთავარი</a>
                <a href="${getPageHref("about")}">მაკას შესახებ</a>
                <a href="${getPageHref("therapy")}">თერაპია</a>
                <a href="${getPageHref("courses")}">კურსები</a>
                <a href="${getPageHref("contact")}">კონტაქტი</a>
              </div>
            </div>
            <div class="footer__column">
              <strong class="footer__title">მიმართულებები</strong>
              <div class="footer__links">
                <a href="${getPageHref("therapy")}?type=individual">ინდივიდუალური თერაპია</a>
                <a href="${getPageHref("therapy")}?type=group">ჯგუფური თერაპია</a>
                <a href="${getPageHref("courses")}?category=${encodeURIComponent("არტთერაპია")}">არტთერაპია</a>
                <a href="${getPageHref("courses")}?category=${encodeURIComponent("მშობლებისთვის")}">კურსი მშობლებისთვის</a>
                <a href="${getPageHref("courses")}?category=${encodeURIComponent("კომუნიკაცია")}">ინტერპერსონალური კომუნიკაცია</a>
                <a href="${getPageHref("courses")}?category=${encodeURIComponent("ფსიქოლოგია")}">ფსიქოლოგიის საფუძვლები</a>
              </div>
            </div>
            <div class="footer__column footer__column--newsletter">
              <strong class="footer__title">სიახლეების გამოწერა</strong>
              <p>მიიღე ახალი კურსების, ჯგუფური შეხვედრებისა და სასარგებლო მასალების შესახებ ინფორმაცია ელ-ფოსტაზე.</p>
              <form class="newsletter-form" data-newsletter-form novalidate>
                <div class="newsletter-form__row">
                  <input type="email" name="email" placeholder="შენი ელ-ფოსტა" required>
                  <button class="btn btn-primary" type="submit">გამოწერა <span class="btn-arrow">↗</span></button>
                </div>
                <label class="custom-checkbox">
                  <input type="checkbox" name="consent" required>
                  <span class="checkmark"></span>
                  <span class="label-text">ვეთანხმები სიახლეების მიღებას</span>
                </label>
              </form>
            </div>
          </div>
        </div>
        <div class="footer__bottom">
          <p>© ${year} მაკა გორდელაძე. ყველა უფლება დაცულია.</p>
        </div>
      </footer>
    `;

    mounts.forEach((mount) => {
      mount.innerHTML = markup;
    });
  }

  function renderSiteChrome() {
    renderSiteHeader();
    renderSiteFooter();
    initDesktopNavDropdowns();
  }

  function getToastRegion() {
    let region = document.querySelector("[data-toast-region]");

    if (!region) {
      region = document.createElement("div");
      region.className = "toast-region";
      region.setAttribute("data-toast-region", "");
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-atomic", "false");
      document.body.append(region);
    }

    return region;
  }

  function getToastMeta(type) {
    if (type === "success") {
      return { icon: "✓", title: "წარმატება" };
    }

    if (type === "error") {
      return { icon: "!", title: "შეცდომა" };
    }

    return { icon: "i", title: "ინფორმაცია" };
  }

  function removeToast(toast) {
    if (!toast || toast.dataset.leaving === "true") {
      return;
    }

    toast.dataset.leaving = "true";
    toast.classList.add("is-leaving");
    window.setTimeout(() => toast.remove(), 220);
  }

  function showToast(message, type = "info", options = {}) {
    const region = getToastRegion();
    const meta = getToastMeta(type);
    const duration = Number(options.duration ?? 4200);
    const title = escapeHtml(options.title ?? meta.title);
    const safeMessage = escapeHtml(message);
    const toast = createElement(`
      <article class="toast toast--${escapeHtml(type)}" role="status">
        <div class="toast__icon" aria-hidden="true">${meta.icon}</div>
        <div class="toast__body">
          <strong class="toast__title">${title}</strong>
          <p class="toast__message">${safeMessage}</p>
        </div>
        <button class="toast__close" type="button" aria-label="შეტყობინების დახურვა" data-toast-close>×</button>
      </article>
    `);

    region.append(toast);

    toast.querySelector("[data-toast-close]")?.addEventListener("click", () => {
      removeToast(toast);
    });

    if (duration > 0) {
      window.setTimeout(() => removeToast(toast), duration);
    }

    return toast;
  }

  function resolveElement(target) {
    if (!target) {
      return null;
    }

    if (target instanceof HTMLElement) {
      return target;
    }

    if (typeof target === "string") {
      if (target.startsWith("#") || target.startsWith(".")) {
        return document.querySelector(target);
      }

      return document.getElementById(target) || document.querySelector(`[data-modal-id="${target}"]`);
    }

    return null;
  }

  function getFocusableElements(container) {
    return [...container.querySelectorAll(focusableSelector)].filter((element) => {
      const style = window.getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden";
    });
  }

  function syncBodyLockState() {
    const hasOpenModal = Boolean(document.querySelector(".modal.is-open"));
    const hasOpenNav = Boolean(document.querySelector(".mobile-nav.is-open"));
    document.body.classList.toggle("modal-open", hasOpenModal);
    document.body.classList.toggle("nav-open", hasOpenNav);
  }

  function focusFirstInModal(modal) {
    const dialog = modal.querySelector(".modal__dialog") || modal;
    const focusable = getFocusableElements(dialog);
    const target = focusable[0] || dialog;
    target.focus({ preventScroll: true });
  }

  function openModal(target) {
    const modal = resolveElement(target);

    if (!modal) {
      return null;
    }

    modalState.lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    modalState.activeModal = modal;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");

    window.requestAnimationFrame(() => {
      modal.classList.add("is-open");
      focusFirstInModal(modal);
      syncBodyLockState();
    });

    return modal;
  }

  function closeModal(target) {
    const modal = resolveElement(target) || modalState.activeModal;

    if (!modal) {
      return null;
    }

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      if (!modal.classList.contains("is-open")) {
        modal.hidden = true;
      }
    }, 220);

    if (modalState.activeModal === modal) {
      modalState.activeModal = null;
      if (modalState.lastFocusedElement) {
        modalState.lastFocusedElement.focus({ preventScroll: true });
      }
    }

    syncBodyLockState();
    return modal;
  }

  function showSpinner(target = document.body, options = {}) {
    const fullscreen = Boolean(options.fullscreen ?? target === document.body);
    const label = escapeHtml(options.label ?? "იტვირთება...");
    const spinner = createElement(
      fullscreen
        ? `
          <div class="spinner-overlay" data-spinner>
            <div class="spinner" aria-hidden="true"></div>
            <div class="spinner-label" role="status">${label}</div>
          </div>
        `
        : `
          <div class="spinner-inline" data-spinner>
            <div class="spinner spinner--sm" aria-hidden="true"></div>
            <span class="spinner-label">${label}</span>
          </div>
        `,
    );

    target.append(spinner);
    return spinner;
  }

  function hideSpinner(targetOrSpinner) {
    const spinner =
      targetOrSpinner instanceof HTMLElement && targetOrSpinner.matches("[data-spinner]")
        ? targetOrSpinner
        : targetOrSpinner instanceof HTMLElement
          ? targetOrSpinner.querySelector("[data-spinner]")
          : document.querySelector("[data-spinner]");

    spinner?.remove();
  }

  function initScrollAnimations(root = document) {
    const items = [...root.querySelectorAll(".animate-on-scroll")];

    if (!items.length) {
      return null;
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("visible"));
      return null;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.14,
      },
    );

    items.forEach((item) => observer.observe(item));
    return observer;
  }

  function handleSmoothAnchorClick(event) {
    const link = event.target.closest('a[href^="#"]');

    if (!link) {
      return;
    }

    const href = link.getAttribute("href");

    if (!href || href === "#") {
      return;
    }

    const target = document.querySelector(href);

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    closeMobileNav();
  }

  function initStickyHeader() {
    const header = document.querySelector("[data-sticky-header]") || document.querySelector(".site-header");

    if (!header) {
      return null;
    }

    const onScroll = () => {
      header.classList.toggle("is-sticky", window.scrollY > 50);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return header;
  }

  function ensureBackToTopButton() {
    let button = document.querySelector("[data-back-to-top]");

    if (!button) {
      button = createElement(`
        <button class="back-to-top" type="button" aria-label="ზემოთ ასვლა" data-back-to-top>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </button>
      `);
      document.body.append(button);
    }

    return button;
  }

  function initBackToTop() {
    const button = ensureBackToTopButton();

    const onScroll = () => {
      button.classList.toggle("is-visible", window.scrollY > 300);
    };

    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return button;
  }

  function getMobileNav() {
    return document.querySelector("[data-mobile-nav]") || document.querySelector(".mobile-nav");
  }

  function getNavToggleButtons() {
    return [...document.querySelectorAll("[data-nav-toggle]")];
  }

  function getDesktopNavDropdowns() {
    return [...document.querySelectorAll(".nav-dropdown")];
  }

  function clearDesktopNavDropdownCloseTimer() {
    if (activeDesktopNavCloseTimer) {
      window.clearTimeout(activeDesktopNavCloseTimer);
      activeDesktopNavCloseTimer = 0;
    }
  }

  function setDesktopNavDropdownState(dropdown, isOpen) {
    if (!(dropdown instanceof HTMLElement)) {
      return;
    }

    const trigger = dropdown.querySelector(".nav-link--dropdown");
    dropdown.classList.toggle("is-open", isOpen);

    if (trigger instanceof HTMLElement) {
      trigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }
  }

  function closeDesktopNavDropdown(dropdown) {
    if (!(dropdown instanceof HTMLElement)) {
      return;
    }

    setDesktopNavDropdownState(dropdown, false);

    if (activeDesktopNavDropdown === dropdown) {
      activeDesktopNavDropdown = null;
    }
  }

  function initDesktopNavDropdowns() {
    getDesktopNavDropdowns().forEach((dropdown, index) => {
      if (dropdown.dataset.hoverReady === "true") {
        return;
      }

      const trigger = dropdown.querySelector(".nav-link--dropdown");
      const menu = dropdown.querySelector(".nav-dropdown__menu");

      if (!(trigger instanceof HTMLElement) || !(menu instanceof HTMLElement)) {
        return;
      }

      dropdown.dataset.hoverReady = "true";

      if (!menu.id) {
        menu.id = `nav-dropdown-menu-${index + 1}`;
      }

      trigger.setAttribute("aria-haspopup", "true");
      trigger.setAttribute("aria-controls", menu.id);
      trigger.setAttribute("aria-expanded", "false");

      const openDropdown = () => {
        clearDesktopNavDropdownCloseTimer();

        if (activeDesktopNavDropdown && activeDesktopNavDropdown !== dropdown) {
          closeDesktopNavDropdown(activeDesktopNavDropdown);
        }

        activeDesktopNavDropdown = dropdown;
        setDesktopNavDropdownState(dropdown, true);
      };

      const scheduleClose = () => {
        clearDesktopNavDropdownCloseTimer();
        activeDesktopNavCloseTimer = window.setTimeout(() => {
          if (activeDesktopNavDropdown !== dropdown) {
            return;
          }

          if (dropdown.matches(":hover") || dropdown.matches(":focus-within")) {
            return;
          }

          closeDesktopNavDropdown(dropdown);
        }, NAV_DROPDOWN_CLOSE_DELAY);
      };

      dropdown.addEventListener("mouseenter", openDropdown);
      dropdown.addEventListener("mouseleave", scheduleClose);
      dropdown.addEventListener("focusin", openDropdown);
      dropdown.addEventListener("focusout", () => {
        window.setTimeout(() => {
          if (activeDesktopNavDropdown !== dropdown) {
            return;
          }

          if (dropdown.matches(":focus-within")) {
            return;
          }

          scheduleClose();
        }, 0);
      });
    });
  }

  function closeDesktopNavDropdowns({ immediate = false } = {}) {
    clearDesktopNavDropdownCloseTimer();

    if (immediate) {
      getDesktopNavDropdowns().forEach((dropdown) => {
        setDesktopNavDropdownState(dropdown, false);
      });
      activeDesktopNavDropdown = null;
      return;
    }

    if (activeDesktopNavDropdown && !activeDesktopNavDropdown.matches(":hover") && !activeDesktopNavDropdown.matches(":focus-within")) {
      closeDesktopNavDropdown(activeDesktopNavDropdown);
    }
  }

  function openMobileNav() {
    const nav = getMobileNav();

    if (!nav) {
      return null;
    }

    nav.classList.add("is-open");
    getNavToggleButtons().forEach((button) => {
      button.classList.add("is-active");
      button.setAttribute("aria-expanded", "true");
    });
    syncBodyLockState();
    return nav;
  }

  function closeMobileNav() {
    const nav = getMobileNav();

    if (!nav) {
      return null;
    }

    nav.classList.remove("is-open");
    getNavToggleButtons().forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-expanded", "false");
    });
    syncBodyLockState();
    return nav;
  }

  function toggleMobileNav() {
    const nav = getMobileNav();

    if (!nav) {
      return null;
    }

    return nav.classList.contains("is-open") ? closeMobileNav() : openMobileNav();
  }

  function getSearchBar() {
    return document.querySelector("[data-search-bar]");
  }

  function getSearchComponent() {
    return document.querySelector("[data-search-component]");
  }

  function getNavContent() {
    return document.querySelector("[data-nav-content]");
  }

  function getSearchResults() {
    return document.querySelector("[data-search-results]");
  }

  function getSearchInputField() {
    return document.querySelector("[data-search-input]");
  }

  function getSearchTriggerButtons() {
    return [...document.querySelectorAll("[data-search-trigger]")];
  }

  function updateSearchBarOffset() {
    const topbar = document.querySelector(".topbar");
    const navbar = document.querySelector(".navbar");
    const topbarHeight =
      topbar && window.getComputedStyle(topbar).display !== "none" ? Math.round(topbar.getBoundingClientRect().height) : 0;
    const navbarHeight = navbar ? Math.round(navbar.getBoundingClientRect().height) : 0;
    const searchBar = getSearchBar();
    const isSearchOpen = searchBar?.classList.contains("is-open") || searchBar?.classList.contains("search-open");
    const searchBarHeight = isSearchOpen && searchBar ? Math.round(searchBar.getBoundingClientRect().height) + 8 : 0;
    document.documentElement.style.setProperty("--search-dropdown-top", `${topbarHeight + navbarHeight + searchBarHeight}px`);
  }

  function getSearchablePages() {
    const currentUser = window.Auth?.getCurrentUser?.() || null;
    const pages = [
      { title: "მთავარი", tag: "გვერდი", href: getPageHref("home") },
      { title: "თერაპია", tag: "გვერდი", href: getPageHref("therapy") },
      { title: "კურსები", tag: "გვერდი", href: getPageHref("courses") },
      { title: "მაკას შესახებ", tag: "გვერდი", href: getPageHref("about") },
      { title: "კონტაქტი", tag: "გვერდი", href: getPageHref("contact") },
    ];

    if (currentUser) {
      pages.push({
        title: currentUser.role === "admin" ? "ადმინ პანელი" : "პროფილი",
        tag: "გვერდი",
        href: currentUser.role === "admin" ? getPageHref("admin") : getPageHref("dashboard"),
      });
    }

    return pages;
  }

  function getSearchableCourses() {
    let storedCourses = [];

    try {
      storedCourses = JSON.parse(window.localStorage.getItem("courses") || "[]");
    } catch (error) {
      storedCourses = [];
    }

    const source =
      window.MakaCourses?.getCourses?.() || (Array.isArray(storedCourses) && storedCourses.length ? storedCourses : FALLBACK_SEARCH_COURSES);

    return source
      .filter((course) => !REMOVED_COURSE_TITLES.has(String(course?.title || "")))
      .map((course) => ({
      title: course.title,
      tag: course.cat || "კურსი",
      href: `${getBasePath()}course-detail.html?id=${course.id}`,
      }));
  }

  function findSearchMatches(query) {
    const normalized = query.trim().toLowerCase();

    if (normalized.length < 2) {
      return [];
    }

    const seen = new Set();

    return [...getSearchablePages(), ...getSearchableCourses()]
      .filter((item) => String(item.title || "").toLowerCase().includes(normalized))
      .filter((item) => {
        const key = `${item.title}|${item.href}`;

        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .slice(0, 8);
  }

  function renderSearchResults(query) {
    const searchBar = getSearchBar();
    const results = getSearchResults();

    if (!searchBar || !results) {
      return;
    }

    const trimmedQuery = query.trim();

    if (!searchBar.classList.contains("is-open") || trimmedQuery.length < 2) {
      results.classList.remove("is-visible");
      results.innerHTML = "";
      return;
    }

    const matches = findSearchMatches(trimmedQuery);

    results.innerHTML = matches.length
      ? matches
          .map(
            (item) => `
              <a class="nav-search-result" href="${escapeHtml(item.href)}" data-search-result>
                <span class="nav-search-result__title">${escapeHtml(item.title)}</span>
                <span class="nav-search-result__tag">${escapeHtml(item.tag)}</span>
              </a>
            `,
          )
          .join("")
      : '<div class="nav-search-empty">ვერაფერი მოიძებნა</div>';

    results.classList.add("is-visible");
  }

  function openSearchBar() {
    const component = getSearchComponent();
    const bar = getSearchBar();
    if (!component || !bar) return;
    component.classList.add("is-open");
    bar.classList.add("is-open");
    updateSearchBarOffset();
    getSearchTriggerButtons().forEach((button) => {
      button.classList.add("is-active");
      button.setAttribute("aria-expanded", "true");
    });
    const input = bar.querySelector("[data-search-input]");
    renderSearchResults(input instanceof HTMLInputElement ? input.value : "");
    input?.focus();
  }

  function closeSearchBar() {
    const component = getSearchComponent();
    const bar = getSearchBar();
    if (!component || !bar) return;
    component.classList.remove("is-open");
    bar.classList.remove("is-open");
    getSearchTriggerButtons().forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-expanded", "false");
    });
    renderSearchResults("");
    updateSearchBarOffset();
  }

  function applyCourseSearch(query) {
    const coursesPage = document.querySelector("[data-courses-page]");
    const input = coursesPage?.querySelector("[data-course-search]");
    if (input instanceof HTMLInputElement) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
      return true;
    }
    return false;
  }

  function handleSearchInput(value) {
    const query = value.trim();
    if (applyCourseSearch(query)) {
      localStorage.removeItem("courseSearchQuery");
      return;
    }

    if (!query) {
      localStorage.removeItem("courseSearchQuery");
    }
  }

  function initNewsletterForms() {
    document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
      if (form.dataset.bound === "true") {
        return;
      }

      form.dataset.bound = "true";
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const email = String(data.get("email") || "").trim();
        const consent = Boolean(data.get("consent"));

        if (!email) {
          showToast("გთხოვთ ელ-ფოსტა შეიყვანოთ.", "error");
          return;
        }

        if (!consent) {
          showToast("გთხოვთ დაადასტუროთ გამოწერაზე თანხმობა.", "error");
          return;
        }

        form.reset();
        showToast("გამოწერა წარმატებით შესრულდა.", "success");
      });
    });
  }

  function initContactForms() {
    document.querySelectorAll("[data-contact-form]").forEach((form) => {
      if (form.dataset.bound === "true") {
        return;
      }

      form.dataset.bound = "true";
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const requiredFields = ["name", "email", "message"];
        const hasMissing = requiredFields.some((field) => !String(data.get(field) || "").trim());

        if (hasMissing || !data.get("agreement")) {
          showToast("გთხოვთ შეავსოთ ყველა სავალდებულო ველი.", "error");
          return;
        }

        form.reset();
        const success = form.querySelector("[data-contact-success]");
        if (success) {
          success.hidden = false;
          window.setTimeout(() => {
            success.hidden = true;
          }, 4000);
        }
        showToast("შეტყობინება წარმატებით გაიგზავნა.", "success");
      });
    });
  }

  function initHeroSliders() {
    document.querySelectorAll("[data-hero-slider]").forEach((slider) => {
      if (slider.dataset.initialized === "true") {
        return;
      }

      slider.dataset.initialized = "true";

      const slides = [...slider.querySelectorAll("[data-hero-slide]")];
      const dotsMount = slider.querySelector("[data-hero-dots]");
      const prevButton = slider.querySelector("[data-hero-prev]");
      const nextButton = slider.querySelector("[data-hero-next]");
      let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
      let intervalId = 0;

      if (!slides.length) {
        return;
      }

      if (activeIndex < 0) {
        activeIndex = 0;
      }

      const dots = slides.map((slide, index) => {
        const button = createElement(
          `<button class="slider-dot${index === activeIndex ? " is-active" : ""}" type="button" aria-label="სლაიდი ${index + 1}"></button>`,
        );
        button.addEventListener("click", () => {
          setActive(index);
          restartAutoplay();
        });
        dotsMount?.append(button);
        return button;
      });

      function setActive(index) {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
          slide.classList.toggle("is-active", slideIndex === activeIndex);
        });
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === activeIndex);
        });
      }

      function stopAutoplay() {
        window.clearInterval(intervalId);
      }

      function startAutoplay() {
        stopAutoplay();
        intervalId = window.setInterval(() => {
          setActive(activeIndex + 1);
        }, 5000);
      }

      function restartAutoplay() {
        stopAutoplay();
        startAutoplay();
      }

      prevButton?.addEventListener("click", () => {
        setActive(activeIndex - 1);
        restartAutoplay();
      });

      nextButton?.addEventListener("click", () => {
        setActive(activeIndex + 1);
        restartAutoplay();
      });

      slider.addEventListener("mouseenter", stopAutoplay);
      slider.addEventListener("mouseleave", startAutoplay);
      slider.addEventListener("focusin", stopAutoplay);
      slider.addEventListener("focusout", startAutoplay);

      setActive(activeIndex);
      startAutoplay();
    });
  }

  function getVisibleCount(carousel) {
    const mobile = Number(carousel.dataset.visibleMobile || 1);
    const tablet = Number(carousel.dataset.visibleTablet || mobile || 1);
    const desktop = Number(carousel.dataset.visibleDesktop || tablet || 1);

    if (window.innerWidth < 768) {
      return mobile;
    }

    if (window.innerWidth < 1025) {
      return tablet;
    }

    return desktop;
  }

  function initCarousels() {
    document.querySelectorAll("[data-carousel]").forEach((carousel) => {
      if (carousel.dataset.initialized === "true") {
        return;
      }

      carousel.dataset.initialized = "true";

      const track = carousel.querySelector("[data-carousel-track]");
      const viewport = carousel.querySelector("[data-carousel-viewport]");
      const prevButton = carousel.querySelector("[data-carousel-prev]");
      const nextButton = carousel.querySelector("[data-carousel-next]");
      const dotsMount = carousel.querySelector("[data-carousel-dots]");
      const isSwipeEnabled = carousel.dataset.carouselSwipe === "true";
      const items = track ? [...track.children] : [];
      let activeIndex = 0;
      let visibleCount = getVisibleCount(carousel);
      let maxIndex = Math.max(0, items.length - visibleCount);
      let dots = [];
      let dragStartX = 0;
      let dragStartY = 0;
      let dragBaseOffset = 0;
      let dragPointerId = null;
      let dragDirection = "";
      let isPointerDown = false;

      if (!track || !viewport || !items.length) {
        return;
      }

      function getTrackMetrics() {
        const firstItem = items[0];
        const gap =
          Number.parseFloat(window.getComputedStyle(track).gap || "0") ||
          Number.parseFloat(window.getComputedStyle(track).columnGap || "0") ||
          0;
        const itemWidth = firstItem ? firstItem.getBoundingClientRect().width : 0;

        return {
          gap,
          itemWidth,
          step: itemWidth + gap,
        };
      }

      function setTrackOffset(offset, { immediate = false } = {}) {
        if (immediate) {
          track.style.transition = "none";
        } else {
          track.style.removeProperty("transition");
        }

        track.style.transform = `translateX(-${offset}px)`;
      }

      function resetDragState() {
        isPointerDown = false;
        dragPointerId = null;
        dragDirection = "";
        carousel.classList.remove("is-dragging");
      }

      function buildDots() {
        if (!dotsMount) {
          return;
        }

        dotsMount.innerHTML = "";
        dots = [];
        const pages = maxIndex + 1;

        for (let index = 0; index < pages; index += 1) {
          const button = createElement(
            `<button class="slider-dot${index === activeIndex ? " is-active" : ""}" type="button" aria-label="გვერდი ${index + 1}"></button>`,
          );
          button.addEventListener("click", () => {
            activeIndex = index;
            updatePosition();
          });
          dotsMount.append(button);
          dots.push(button);
        }
      }

      function updatePosition() {
        visibleCount = getVisibleCount(carousel);
        maxIndex = Math.max(0, items.length - visibleCount);
        activeIndex = Math.min(activeIndex, maxIndex);
        carousel.style.setProperty("--visible-count", String(visibleCount));

        const { step } = getTrackMetrics();
        const offset = activeIndex * step;
        setTrackOffset(offset);

        if (prevButton) {
          prevButton.disabled = activeIndex <= 0;
        }

        if (nextButton) {
          nextButton.disabled = activeIndex >= maxIndex;
        }

        if (dots.length !== maxIndex + 1) {
          buildDots();
        }

        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === activeIndex);
        });

        if (dotsMount) {
          dotsMount.classList.toggle("hide", maxIndex === 0);
        }

      }

      prevButton?.addEventListener("click", () => {
        resetDragState();
        activeIndex = Math.max(0, activeIndex - 1);
        updatePosition();
      });

      nextButton?.addEventListener("click", () => {
        resetDragState();
        activeIndex = Math.min(maxIndex, activeIndex + 1);
        updatePosition();
      });

      function handlePointerDown(event) {
        if (!isSwipeEnabled || maxIndex <= 0) {
          return;
        }

        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        dragPointerId = event.pointerId;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        dragBaseOffset = activeIndex * getTrackMetrics().step;
        dragDirection = "";
        isPointerDown = true;
      }

      function handlePointerMove(event) {
        if (!isPointerDown || event.pointerId !== dragPointerId) {
          return;
        }

        const deltaX = event.clientX - dragStartX;
        const deltaY = event.clientY - dragStartY;

        if (!dragDirection) {
          if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) {
            return;
          }

          dragDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "horizontal" : "vertical";
        }

        if (dragDirection !== "horizontal") {
          return;
        }

        const { step } = getTrackMetrics();

        if (!step) {
          return;
        }

        const edgeResistance =
          (activeIndex === 0 && deltaX > 0) || (activeIndex === maxIndex && deltaX < 0) ? 0.35 : 1;
        const minOffset = 0;
        const maxOffset = maxIndex * step;
        const nextOffset = Math.min(maxOffset, Math.max(minOffset, dragBaseOffset - deltaX * edgeResistance));

        carousel.classList.add("is-dragging");
        setTrackOffset(nextOffset, { immediate: true });
        event.preventDefault();
      }

      function handlePointerEnd(event) {
        if (!isPointerDown || event.pointerId !== dragPointerId) {
          return;
        }

        const deltaX = event.clientX - dragStartX;
        const { step } = getTrackMetrics();
        const threshold = Math.min(96, Math.max(52, step * 0.18));

        if (dragDirection === "horizontal" && Math.abs(deltaX) > threshold) {
          activeIndex = deltaX < 0 ? Math.min(maxIndex, activeIndex + 1) : Math.max(0, activeIndex - 1);
        }

        resetDragState();
        updatePosition();
      }

      if (isSwipeEnabled) {
        viewport.addEventListener("pointerdown", handlePointerDown);
        viewport.addEventListener("dragstart", (event) => event.preventDefault());
        window.addEventListener("pointermove", handlePointerMove, { passive: false });
        window.addEventListener("pointerup", handlePointerEnd);
        window.addEventListener("pointercancel", handlePointerEnd);
      }

      const onResize = debounce(updatePosition, 90);
      window.addEventListener("resize", onResize);

      buildDots();
      updatePosition();
    });
  }

  function initAccordions() {
    document.querySelectorAll("[data-accordion]").forEach((accordion) => {
      const items = [...accordion.querySelectorAll("[data-accordion-item]")];

      if (!items.length || accordion.dataset.initialized === "true") {
        return;
      }

      accordion.dataset.initialized = "true";

      function setItemState(targetItem = null) {
        items.forEach((item) => {
          const isTarget = item === targetItem;
          item.classList.toggle("is-open", isTarget);
          const trigger = item.querySelector("[data-accordion-trigger]");
          if (trigger) {
            trigger.setAttribute("aria-expanded", String(isTarget));
          }
        });
      }

      items.forEach((item, index) => {
        const trigger = item.querySelector("[data-accordion-trigger]");
        if (!trigger) {
          return;
        }

        trigger.setAttribute("aria-expanded", String(item.classList.contains("is-open")));
        trigger.addEventListener("click", () => {
          const isCurrentlyOpen = item.classList.contains("is-open");
          setItemState(isCurrentlyOpen ? null : item);
        });

        if (index === 0 && !items.some((entry) => entry.classList.contains("is-open"))) {
          item.classList.add("is-open");
        }
      });

      const initiallyOpen = items.find((item) => item.classList.contains("is-open")) || items[0];
      setItemState(initiallyOpen);
    });
  }

  function initPricingToggle() {
    document.querySelectorAll("[data-pricing-toggle]").forEach((wrapper) => {
      if (wrapper.dataset.initialized === "true") {
        return;
      }

      wrapper.dataset.initialized = "true";

      const buttons = [...wrapper.querySelectorAll("[data-plan-button]")];
      const cards = [...document.querySelectorAll("[data-pricing-card]")];

      function setPlan(mode) {
        buttons.forEach((button) => {
          button.classList.toggle("is-active", button.dataset.planButton === mode);
        });

        cards.forEach((card) => {
          const price = card.querySelector("[data-price]");
          const period = card.querySelector("[data-period]");
          const note = card.querySelector("[data-pricing-note]");

          if (price) {
            price.textContent = card.dataset[`${mode}Price`] || price.textContent;
          }

          if (period) {
            period.textContent = card.dataset[`${mode}Period`] || period.textContent;
          }

          if (note) {
            note.textContent = card.dataset[`${mode}Note`] || note.textContent;
          }
        });
      }

      buttons.forEach((button) => {
        button.addEventListener("click", () => {
          setPlan(button.dataset.planButton || "monthly");
        });
      });

      setPlan(wrapper.dataset.defaultPlan || "monthly");
    });
  }

  function initHomeCourseFilters() {
    const groups = [...document.querySelectorAll("[data-home-course-filter-group]")];

    groups.forEach((group) => {
      if (group.dataset.initialized === "true") {
        return;
      }

      group.dataset.initialized = "true";

      const buttons = [...group.querySelectorAll("[data-home-course-filter]")];
      const switchControl = group.querySelector("[data-home-course-switch]");
      const cards = [...document.querySelectorAll("[data-home-course-card]")];

      function applyFilter(filter) {
        group.dataset.activeFilter = filter;

        buttons.forEach((button) => {
          const isActive = button.dataset.homeCourseFilter === filter;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-pressed", String(isActive));
        });

        cards.forEach((card) => {
          const kind = card.dataset.homeCourseCard || "all";
          card.hidden = filter !== "all" && kind !== filter;
        });
      }

      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
        button.addEventListener("click", () => {
          applyFilter(button.dataset.homeCourseFilter || "free");
        });
      });

      switchControl?.addEventListener("click", () => {
        const currentFilter = group.dataset.activeFilter || group.dataset.defaultFilter || "free";
        applyFilter(currentFilter === "paid" ? "free" : "paid");
      });

      applyFilter(group.dataset.defaultFilter || "free");
    });
  }

  function initHomepageInteractions() {
    if (!document.querySelector("[data-homepage]")) {
      return;
    }

    initHeroSliders();
    initCarousels();
    initAccordions();
    initPricingToggle();
    initHomeCourseFilters();
  }

  function handleDocumentClick(event) {
    if (!event.target.closest(".nav-dropdown")) {
      closeDesktopNavDropdowns({ immediate: true });
    }

    const modalOpenTrigger = event.target.closest("[data-modal-open]");

    if (modalOpenTrigger) {
      event.preventDefault();
      openModal(modalOpenTrigger.dataset.modalOpen);
      return;
    }

    const modalCloseTrigger = event.target.closest("[data-modal-close]");

    if (modalCloseTrigger) {
      event.preventDefault();
      closeModal(modalCloseTrigger.closest(".modal"));
      return;
    }

    if (event.target.matches(".modal__backdrop") || event.target.matches("[data-modal-dismiss]")) {
      closeModal(event.target.closest(".modal"));
      return;
    }

    if (event.target.closest("[data-nav-toggle]")) {
      event.preventDefault();
      toggleMobileNav();
      return;
    }

    if (event.target.closest("[data-nav-close]")) {
      event.preventDefault();
      closeMobileNav();
      return;
    }

    if (event.target.closest("[data-search-trigger]")) {
      event.preventDefault();
      if (getSearchBar()?.classList.contains("is-open")) {
        closeSearchBar();
      } else {
        openSearchBar();
      }
      return;
    }

    if (event.target.closest("[data-search-close]")) {
      event.preventDefault();
      closeSearchBar();
      return;
    }

    if (event.target.closest("[data-search-result]")) {
      closeSearchBar();
      return;
    }

    const navLink = event.target.closest(".mobile-nav__links a");

    if (navLink) {
      closeMobileNav();
    }

    if (getSearchComponent()?.classList.contains("is-open") && !getSearchComponent().contains(event.target)) {
      closeSearchBar();
    }
  }

  function handleDocumentSubmit(event) {
    const form = event.target instanceof Element ? event.target.closest("[data-mobile-menu-search-form]") : null;

    if (!form) {
      return;
    }

    event.preventDefault();
    const input = form.querySelector("[data-mobile-menu-search]");
    const query = input instanceof HTMLInputElement ? input.value.trim() : "";

    if (query) {
      localStorage.setItem("courseSearchQuery", query);
    }

    closeMobileNav();
    window.location.href = getPageHref("courses");
  }

  function handleDocumentKeydown(event) {
    if (event.key === "Escape") {
      if (modalState.activeModal) {
        closeModal(modalState.activeModal);
        return;
      }

      if (document.querySelector(".mobile-nav.is-open")) {
        closeMobileNav();
      }

      if (document.querySelector(".nav-search-bar.is-open")) {
        closeSearchBar();
        return;
      }

      closeDesktopNavDropdowns({ immediate: true });
    }

    if (event.key === "Enter" && event.target instanceof HTMLInputElement && event.target.matches("[data-search-input]")) {
      const query = event.target.value.trim();
      if (!applyCourseSearch(query)) {
        localStorage.setItem("courseSearchQuery", query);
        window.location.href = getPageHref("courses");
      }
      closeSearchBar();
    }

    if (event.key === "Tab" && modalState.activeModal) {
      const dialog = modalState.activeModal.querySelector(".modal__dialog") || modalState.activeModal;
      const focusable = getFocusableElements(dialog);

      if (!focusable.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  function bindGlobalEvents() {
    if (globalEventsBound) {
      return;
    }

    globalEventsBound = true;
    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("click", handleSmoothAnchorClick);
    document.addEventListener("submit", handleDocumentSubmit);
    document.addEventListener("keydown", handleDocumentKeydown);
    document.addEventListener("input", (event) => {
      const input = event.target.closest("[data-search-input]");
      if (input instanceof HTMLInputElement) {
        handleSearchInput(input.value);
        renderSearchResults(input.value);
      }
    });
    window.addEventListener("resize", debounce(updateSearchBarOffset, 100));
  }

  function init() {
    renderSiteChrome();
    bindGlobalEvents();
    updateSearchBarOffset();
    initStickyHeader();
    initBackToTop();
    initNewsletterForms();
    initContactForms();
    initHomepageInteractions();
    initScrollAnimations();
    document.dispatchEvent(new CustomEvent("maka:ui-ready"));
  }

  const MakaUI = {
    init,
    renderSiteChrome,
    initNewsletterForms,
    initContactForms,
    showToast,
    removeToast,
    openModal,
    closeModal,
    showSpinner,
    hideSpinner,
    initScrollAnimations,
    initStickyHeader,
    initBackToTop,
    initHomepageInteractions,
    openMobileNav,
    closeMobileNav,
    toggleMobileNav,
  };

  window.MakaUI = MakaUI;
  window.showToast = showToast;
  window.openModal = openModal;
  window.closeModal = closeModal;

  onReady(init);
})();
