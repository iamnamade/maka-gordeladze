(() => {
  const ADMIN_PAGES = ["dashboard", "users", "courses", "bookings", "reviews", "analytics"];
  const STORAGE_KEYS = {
    users: "users",
    courses: "courses",
    bookings: "bookings",
  };

  const state = {
    usersFilter: "",
    usersCategory: "all",
    bookingsView: "list",
    reviewFilter: "all",
    analyticsRange: 30,
    courseEditor: null,
  };

  const ICONS = {
    revenue: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
        <line x1="2" y1="10" x2="22" y2="10"></line>
      </svg>
    `,
    users: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    `,
    courses: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M2 4h8a4 4 0 0 1 4 4v12H6a4 4 0 0 0-4 4z"></path>
        <path d="M22 4h-8a4 4 0 0 0-4 4v12h8a4 4 0 0 1 4 4z"></path>
      </svg>
    `,
    bookings: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    `,
    trend: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
    `,
    arrowUp: `
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
        <path d="M8 13V3"></path>
        <path d="M4 7 8 3l4 4"></path>
      </svg>
    `,
    eye: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `,
    pencil: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"></path>
      </svg>
    `,
    trash: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
        <path d="M10 11v6"></path>
        <path d="M14 11v6"></path>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
      </svg>
    `,
    check: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `,
    hide: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.94 17.94A10.12 10.12 0 0 1 12 20c-7 0-11-8-11-8a20.29 20.29 0 0 1 5.06-6.94"></path>
        <path d="M1 1l22 22"></path>
      </svg>
    `,
    message: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    `,
  };

  const STATUS_LABELS = {
    published: "გამოქვეყნებული",
    draft: "დრაფტი",
    approved: "დამტკიცებული",
    pending: "მოლოდინში",
    hidden: "დამალული",
    confirmed: "დადასტურებული",
    completed: "დასრულებული",
  };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function getPageId() {
    return document.body.dataset.adminPage || "dashboard";
  }

  function getUsers() {
    return normalizeArray(window.Auth?.getUsers?.());
  }

  function saveUsers(users) {
    return window.Auth?.saveUsers?.(users) || users;
  }

  function getCourses() {
    return normalizeArray(window.MakaCourses?.getCourses?.() || []);
  }

  function saveCourses(courses) {
    if (window.MakaCourses?.seedCourses) {
      window.localStorage.setItem(STORAGE_KEYS.courses, JSON.stringify(courses));
      return courses;
    }

    return courses;
  }

  function getBookings() {
    return normalizeArray(JSON.parse(window.localStorage.getItem(STORAGE_KEYS.bookings) || "[]"));
  }

  function saveBookings(bookings) {
    window.localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
    return bookings;
  }

  function formatCurrency(value) {
    return Number(value || 0) > 0 ? `₾${Number(value)}` : "უფასო";
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("ka-GE", { day: "2-digit", month: "short", year: "numeric" }).format(date);
  }

  function formatDateTime(dateValue, timeValue) {
    return `${formatDate(dateValue)}${timeValue ? ` • ${timeValue}` : ""}`;
  }

  function normalizeStatusKey(status) {
    const value = String(status || "").toLowerCase();
    if (value.includes("დრაფ")) return "draft";
    if (value.includes("გამოქ") || value.includes("publish")) return "published";
    if (value.includes("დამალ") || value.includes("hide")) return "hidden";
    if (value.includes("დამტ") || value.includes("approve")) return "approved";
    if (value.includes("დადასტ") || value.includes("confirm")) return "confirmed";
    if (value.includes("დასრულ") || value.includes("complete")) return "completed";
    if (value.includes("მოლოდ") || value.includes("pending")) return "pending";
    return value;
  }

  function getStatusLabel(status) {
    const key = normalizeStatusKey(status);
    return STATUS_LABELS[key] || status || "უცნობი";
  }

  function getStatusClass(status) {
    const key = normalizeStatusKey(status);
    return key ? `status-${key}` : "status-default";
  }

  function getRandomId(prefix) {
    return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function getCourseById(courseId) {
    return getCourses().find((course) => Number(course.id) === Number(courseId)) || null;
  }

  function getCourseSales(courseId) {
    return getBookings().filter((booking) => booking.courseId && Number(booking.courseId) === Number(courseId)).length;
  }

  function getAdminUser() {
    return window.Auth?.getCurrentUser?.() || null;
  }

  function renderAdminUserCard(user) {
    if (!user) {
      return `
        <span class="admin-profile__name">ადმინი</span>
        <span class="admin-profile__email">admin@test.ge</span>
      `;
    }

    return `
      <span class="admin-profile__name">${escapeHtml(`${user.name} ${user.surname}`.trim() || "ადმინი")}</span>
      <span class="admin-profile__email">${escapeHtml(user.email || "admin@test.ge")}</span>
    `;
  }

  function setActiveNav() {
    const pageId = getPageId();
    document.querySelectorAll("[data-admin-nav]").forEach((link) => {
      link.classList.toggle("is-active", link.dataset.adminNav === pageId);
    });
  }

  function ensureAdminGuard() {
    if (!window.Auth?.requireAdmin?.("login.html")) {
      return false;
    }

    const current = getAdminUser();
    if (!current || current.role !== "admin") {
      window.location.href = window.Auth?.resolvePath?.("login.html") || "../login.html";
      return false;
    }

    return true;
  }

  function buildBarChart(container, labels, values) {
    if (!container) return;
    const maxValue = Math.max(...values, 1);
    const width = container.clientWidth || 600;
    const height = 240;
    const padding = 28;
    const barGap = 16;
    const barWidth = Math.max(24, (width - padding * 2 - barGap * (values.length - 1)) / values.length);
    const gridLines = 4;
    const grid = Array.from({ length: gridLines + 1 }, (_, index) => {
      const y = padding + ((height - padding * 2) * index) / gridLines;
      return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" />`;
    }).join("");
    const svgBars = values
      .map((value, index) => {
        const barHeight = (value / maxValue) * (height - padding * 2);
        const x = padding + index * (barWidth + barGap);
        const y = height - padding - barHeight;
        const labelX = x + barWidth / 2;
        return `
          <g class="bar-group" data-value="${value}">
            <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="8" fill="url(#barGradient)" />
            <text x="${labelX}" y="${height - 8}" text-anchor="middle">${escapeHtml(labels[index])}</text>
          </g>
        `;
      })
      .join("");

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="barGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="var(--admin-primary)"></stop>
            <stop offset="100%" stop-color="var(--admin-primary-lt)"></stop>
          </linearGradient>
        </defs>
        <g class="chart-grid">${grid}</g>
        <g class="chart-bars">${svgBars}</g>
      </svg>
    `;
  }

  function buildLineChart(container, points) {
    if (!container) return;
    const width = container.clientWidth || 600;
    const height = 240;
    const padding = 24;
    const maxValue = Math.max(...points.map((point) => point.value), 1);
    const step = (width - padding * 2) / (points.length - 1 || 1);
    const coords = points.map((point, index) => {
      const x = padding + step * index;
      const y = height - padding - (point.value / maxValue) * (height - padding * 2);
      return { x, y, label: point.label, value: point.value };
    });
    const path = coords.map((coord, index) => `${index === 0 ? "M" : "L"}${coord.x},${coord.y}`).join(" ");
    const areaPath = `${path} L${coords[coords.length - 1].x},${height - padding} L${coords[0].x},${
      height - padding
    } Z`;
    const dots = coords
      .map((coord) => `<circle cx="${coord.x}" cy="${coord.y}" r="4" data-value="${coord.value}" />`)
      .join("");
    const labels = coords
      .map((coord) => `<text x="${coord.x}" y="${height - 6}" text-anchor="middle">${escapeHtml(coord.label)}</text>`)
      .join("");
    const gridLines = 4;
    const grid = Array.from({ length: gridLines + 1 }, (_, index) => {
      const y = padding + ((height - padding * 2) * index) / gridLines;
      return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" />`;
    }).join("");

    container.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stop-color="rgba(139, 58, 42, 0.2)"></stop>
            <stop offset="100%" stop-color="rgba(139, 58, 42, 0)"></stop>
          </linearGradient>
        </defs>
        <g class="chart-grid">${grid}</g>
        <path d="${areaPath}" class="chart-area" fill="url(#lineGradient)" />
        <path d="${path}" class="chart-line" />
        <g class="chart-dots">${dots}</g>
        <g class="chart-labels">${labels}</g>
      </svg>
    `;
  }

  function buildPieChart(container, segments) {
    if (!container) return;
    const total = segments.reduce((sum, seg) => sum + seg.value, 0) || 1;
    const radius = 90;
    const circumference = 2 * Math.PI * radius;
    let offset = 0;
    const circles = segments
      .map((segment) => {
        const length = (segment.value / total) * circumference;
        const circle = `
          <circle
            class="chart-slice"
            r="${radius}"
            cx="120"
            cy="120"
            stroke="${segment.color}"
            stroke-dasharray="${length} ${circumference - length}"
            stroke-dashoffset="${-offset}"
          />
        `;
        offset += length;
        return circle;
      })
      .join("");

    container.innerHTML = `
      <svg viewBox="0 0 240 240" class="chart-pie">
        <g transform="rotate(-90 120 120)">${circles}</g>
      </svg>
    `;
  }

  function renderDashboard() {
    const users = getUsers();
    const bookings = getBookings();
    const courses = getCourses();
    const revenue = bookings.reduce((sum, booking) => sum + Number(booking.price || 0), 0);
    const now = new Date();
    const month = now.toLocaleDateString("ka-GE", { month: "long" });
    const recentBookings = bookings.slice(-10).reverse();
    const topCourses = courses.slice(0, 4).map((course) => ({
      title: course.title,
      sales: getCourseSales(course.id),
      rating: course.rating || 4.8,
      revenue: getCourseSales(course.id) * Number(course.price || 0),
    }));

    return `
      <section class="admin-section">
        <div class="admin-topbar">
          <div>
            <div class="admin-breadcrumb">ადმინი / დეშბორდი</div>
            <h1>ადმინისტრირება</h1>
          </div>
          <button class="admin-btn admin-btn--primary">ახალი ანგარიში</button>
        </div>

        <div class="admin-stats">
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.revenue}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>12%</span></span>
            </div>
            <div class="stat-value">${formatCurrency(revenue)}</div>
            <div class="stat-label">ამ თვის შემოსავალი (${escapeHtml(month)})</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.users}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>8%</span></span>
            </div>
            <div class="stat-value">${users.length}</div>
            <div class="stat-label">სულ მომხმარებელი</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.courses}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>6%</span></span>
            </div>
            <div class="stat-value">${courses.length}</div>
            <div class="stat-label">აქტიური კურსი</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.bookings}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>4%</span></span>
            </div>
            <div class="stat-value">${bookings.length}</div>
            <div class="stat-label">ამ კვირის დაჯავშნა</div>
          </div>
        </div>

        <div class="admin-grid">
          <div class="admin-card admin-chart">
            <div class="admin-chart-head">
              <h3>ბოლო 6 თვის შემოსავალი</h3>
              <span>${formatCurrency(revenue)}</span>
            </div>
            <div class="admin-chart-body" data-admin-chart="revenue-bars"></div>
          </div>
          <div class="admin-card admin-table-card">
            <h3>ბოლო დაჯავშნები</h3>
            ${
              recentBookings.length
                ? `
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>მომხმარებელი</th>
                      <th>ტიპი</th>
                      <th>თარიღი</th>
                      <th>ფასი</th>
                      <th>სტატუსი</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${recentBookings
                      .map(
                        (booking) => `
                          <tr>
                            <td>${escapeHtml(booking.userName || "ნინო")}</td>
                            <td>${escapeHtml(booking.type || "ინდივიდუალური")}</td>
                            <td>${escapeHtml(formatDate(booking.date))}</td>
                            <td>${formatCurrency(booking.price || 0)}</td>
                            <td><span class="badge ${getStatusClass(booking.status)}">${escapeHtml(getStatusLabel(booking.status))}</span></td>
                          </tr>
                        `,
                      )
                      .join("")}
                  </tbody>
                </table>
              `
                : `
                <div class="admin-empty">
                  <div class="admin-empty__icon">📭</div>
                  მონაცემები არ მოიძებნა
                </div>
              `
            }
          </div>
          <div class="admin-card admin-table-card">
            <h3>ტოპ კურსები</h3>
            ${
              topCourses.length
                ? `
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>კურსი</th>
                      <th>გაყიდვები</th>
                      <th>შემოსავალი</th>
                      <th>რეიტინგი</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${topCourses
                      .map(
                        (course) => `
                          <tr>
                            <td>${escapeHtml(course.title)}</td>
                            <td>${course.sales}</td>
                            <td>${formatCurrency(course.revenue)}</td>
                            <td>${course.rating} ⭐</td>
                          </tr>
                        `,
                      )
                      .join("")}
                  </tbody>
                </table>
              `
                : `
                <div class="admin-empty">
                  <div class="admin-empty__icon">📭</div>
                  მონაცემები არ მოიძებნა
                </div>
              `
            }
          </div>
        </div>
      </section>
    `;
  }

  function renderUsersPage() {
    const users = getUsers();
    const filtered = users.filter((user) => {
      const name = `${user.name || ""} ${user.surname || ""} ${user.email || ""}`.toLowerCase();
      const matchesSearch = !state.usersFilter || name.includes(state.usersFilter);
      const matchesCategory = state.usersCategory === "all" || normalizeArray(user.categories).includes(state.usersCategory);
      return matchesSearch && matchesCategory;
    });

    return `
      <section class="admin-section">
        <div class="admin-topbar">
          <div>
            <div class="admin-breadcrumb">ადმინი / მომხმარებლები</div>
            <h1>მომხმარებლების მართვა</h1>
          </div>
          <button class="admin-btn admin-btn--outline" data-users-export>Export CSV</button>
        </div>

        <div class="admin-filters">
          <input class="admin-filter" type="search" placeholder="ძიება..." data-users-search />
          <select class="admin-filter" data-users-filter>
            <option value="all">ყველა კატეგორია</option>
            <option value="არტთერაპია">არტთერაპია</option>
            <option value="მშობლებისთვის">მშობლებისთვის</option>
            <option value="კომუნიკაცია">კომუნიკაცია</option>
            <option value="ფსიქოლოგია">ფსიქოლოგია</option>
          </select>
        </div>

        <div class="admin-card admin-table-card">
          ${
            filtered.length
              ? `
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>სახელი</th>
                    <th>ელ-ფოსტა</th>
                    <th>კატეგორიები</th>
                    <th>ნაყიდი კურსები</th>
                    <th>რეგ. თარიღი</th>
                    <th>მოქმედება</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered
                    .map(
                      (user, index) => `
                      <tr>
                        <td>${index + 1}</td>
                        <td>${escapeHtml(`${user.name || ""} ${user.surname || ""}`.trim())}</td>
                        <td>${escapeHtml(user.email)}</td>
                        <td>${normalizeArray(user.categories).map(escapeHtml).join(", ") || "-"}</td>
                        <td>${normalizeArray(user.enrolledCourses).length}</td>
                        <td>${escapeHtml(formatDate(user.createdAt))}</td>
                        <td>
                          <div class="admin-actions">
                            <button class="action-btn action-btn--view" data-user-view="${user.id}" aria-label="ნახვა">
                              ${ICONS.eye}
                            </button>
                            <button class="action-btn action-btn--delete" data-user-delete="${user.id}" aria-label="წაშლა">
                              ${ICONS.trash}
                            </button>
                          </div>
                        </td>
                      </tr>
                    `,
                    )
                    .join("")}
                </tbody>
              </table>
            `
              : `
              <div class="admin-empty">
                <div class="admin-empty__icon">📭</div>
                მონაცემები არ მოიძებნა
              </div>
            `
          }
        </div>
      </section>
    `;
  }

  function renderCoursesPage() {
    const courses = getCourses();
    const filtered = courses.filter((course) => {
      if (!state.usersFilter) return true;
      return course.title?.toLowerCase().includes(state.usersFilter);
    });

    return `
      <section class="admin-section">
        <div class="admin-topbar">
          <div>
            <div class="admin-breadcrumb">ადმინი / კურსები</div>
            <h1>კურსების მართვა</h1>
          </div>
          <button class="admin-btn admin-btn--primary" data-course-create>+ ახალი კურსი</button>
        </div>

        <div class="admin-filters">
          <input class="admin-filter" type="search" placeholder="კურსის ძებნა..." data-course-search />
        </div>

        <div class="admin-card admin-table-card">
          ${
            filtered.length
              ? `
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>სათაური</th>
                    <th>კატეგორია</th>
                    <th>ფასი</th>
                    <th>სტატუსი</th>
                    <th>ლექციები</th>
                    <th>გაყიდვები</th>
                    <th>მოქმედება</th>
                  </tr>
                </thead>
                <tbody>
                  ${filtered
                    .map(
                      (course) => `
                      <tr>
                        <td>${escapeHtml(course.title)}</td>
                        <td>${escapeHtml(course.cat || course.category || "-")}</td>
                        <td>${course.free ? "უფასო" : formatCurrency(course.price || 0)}</td>
                        <td><span class="badge ${getStatusClass(course.status || "გამოქვეყნებული")}">${escapeHtml(getStatusLabel(course.status || "გამოქვეყნებული"))}</span></td>
                        <td>${course.lessons || 0}</td>
                        <td>${getCourseSales(course.id)}</td>
                        <td>
                          <div class="admin-actions">
                            <button class="action-btn action-btn--edit" data-course-edit="${course.id}" aria-label="რედაქტირება">
                              ${ICONS.pencil}
                            </button>
                            <button class="action-btn action-btn--delete" data-course-delete="${course.id}" aria-label="წაშლა">
                              ${ICONS.trash}
                            </button>
                          </div>
                        </td>
                      </tr>
                    `,
                    )
                    .join("")}
                </tbody>
              </table>
            `
              : `
              <div class="admin-empty">
                <div class="admin-empty__icon">📭</div>
                მონაცემები არ მოიძებნა
              </div>
            `
          }
        </div>
      </section>
    `;
  }

  function renderBookingsPage() {
    const bookings = getBookings();
    const view = state.bookingsView;
    const tableRows = bookings
      .map(
        (booking) => `
        <tr>
          <td>${escapeHtml(booking.userName || "ნინო")}</td>
          <td>${escapeHtml(booking.type || "ინდივიდუალური")}</td>
          <td>${escapeHtml(formatDate(booking.date))}</td>
          <td>${escapeHtml(booking.time || "-")}</td>
          <td>${formatCurrency(booking.price || 0)}</td>
            <td>
              <select class="admin-filter admin-filter--sm" data-booking-status="${booking.id}">
                <option value="pending" ${booking.status === "pending" ? "selected" : ""}>მოლოდინში</option>
                <option value="confirmed" ${booking.status === "confirmed" ? "selected" : ""}>დადასტურებული</option>
                <option value="completed" ${booking.status === "completed" ? "selected" : ""}>დასრულებული</option>
              </select>
            </td>
            <td>
              <button class="action-btn action-btn--delete" data-booking-delete="${booking.id}" aria-label="წაშლა">
                ${ICONS.trash}
              </button>
            </td>
          </tr>
      `,
      )
      .join("");

    return `
      <section class="admin-section">
        <div class="admin-topbar">
          <div>
            <div class="admin-breadcrumb">ადმინი / დაჯავშნები</div>
            <h1>დაჯავშნების მართვა</h1>
          </div>
          <div class="admin-tabs" data-bookings-toggle>
            <button class="${view === "list" ? "is-active" : ""}" data-view="list">სია</button>
            <button class="${view === "calendar" ? "is-active" : ""}" data-view="calendar">კალენდარი</button>
          </div>
        </div>

        <div class="admin-filters">
          <input class="admin-filter" type="date" />
          <select class="admin-filter">
            <option>ყველა ტიპი</option>
            <option>ინდივიდუალური</option>
            <option>ჯგუფური</option>
          </select>
          <select class="admin-filter">
            <option>ყველა სტატუსი</option>
            <option>მოლოდინში</option>
            <option>დადასტურებული</option>
            <option>დასრულებული</option>
          </select>
        </div>

        ${
          view === "calendar"
            ? `
              <div class="admin-card admin-calendar" data-admin-calendar>
                ${renderBookingsCalendar(bookings)}
              </div>
            `
              : `
                <div class="admin-card admin-table-card">
                  ${
                    bookings.length
                      ? `
                      <table class="admin-table">
                        <thead>
                          <tr>
                            <th>მომხმარებელი</th>
                            <th>ტიპი</th>
                            <th>თარიღი</th>
                            <th>დრო</th>
                            <th>ფასი</th>
                            <th>სტატუსი</th>
                            <th>მოქმედება</th>
                          </tr>
                        </thead>
                        <tbody>${tableRows}</tbody>
                      </table>
                    `
                      : `
                      <div class="admin-empty">
                        <div class="admin-empty__icon">📭</div>
                        მონაცემები არ მოიძებნა
                      </div>
                    `
                  }
                </div>
              `
          }
        </section>
      `;
    }

  function renderBookingsCalendar(bookings) {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = (firstDay.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i += 1) {
      cells.push(`<div class="admin-calendar-cell is-empty"></div>`);
    }
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateKey = new Date(year, month, day).toISOString().split("T")[0];
      const count = bookings.filter((booking) => booking.date === dateKey).length;
      cells.push(`
        <div class="admin-calendar-cell">
          <span class="admin-calendar-day">${day}</span>
          ${count ? `<span class="admin-calendar-count">${count}</span>` : ""}
        </div>
      `);
    }

      return `
        <div class="admin-calendar-header">
          <strong>${now.toLocaleDateString("ka-GE", { month: "long", year: "numeric" })}</strong>
          <div>დაჯავშნები: ${bookings.length}</div>
        </div>
        <div class="admin-calendar-weekdays">
          <div>ორშ</div>
          <div>სამ</div>
          <div>ოთხ</div>
          <div>ხუთ</div>
          <div>პარ</div>
          <div>შაბ</div>
          <div>კვი</div>
        </div>
        <div class="admin-calendar-grid">
          ${cells.join("")}
        </div>
      `;
    }

    function renderStars(rating) {
      const safeRating = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
      const filled = "★".repeat(safeRating);
      const empty = Array.from({ length: 5 - safeRating }, () => '<span class="star-empty">☆</span>').join("");
      return `<span class="review-stars">${filled}${empty}</span>`;
    }

    function renderReviewsPage() {
      const users = getUsers();
      const reviews = users.flatMap((user) =>
        normalizeArray(user.reviews).map((review) => ({
          ...review,
          userName: `${user.name || ""} ${user.surname || ""}`.trim() || "მომხმარებელი",
        })),
      );
      const sampleReviews = [
        {
          userName: "ნინო მ.",
          courseTitle: "არტთერაპია",
          rating: 5,
          comment: "საუკეთესო კურსი! ძალიან ბევრი ვისწავლე.",
          date: "2026-03-15",
          status: "pending",
        },
        {
          userName: "გიორგი კ.",
          courseTitle: "მშობლების კურსი",
          rating: 4,
          comment: "ძალიან სასარგებლო მასალა მშობლებისთვის.",
          date: "2026-03-20",
          status: "approved",
        },
        {
          userName: "მარიამ ბ.",
          courseTitle: "სტრესთან გამკლავება",
          rating: 5,
          comment: "მაკა გორდელაძე ბრწყინვალე მასწავლებელია!",
          date: "2026-04-01",
          status: "pending",
        },
      ];

      const hydrated = (reviews.length ? reviews : sampleReviews).map((review) => ({
        ...review,
        courseTitle: review.courseTitle || getCourseById(review.courseId)?.title || review.course || "კურსი",
        comment: review.comment || "",
      }));
      const filtered = hydrated.filter((review) => state.reviewFilter === "all" || review.status === state.reviewFilter);

    return `
      <section class="admin-section">
        <div class="admin-topbar">
          <div>
            <div class="admin-breadcrumb">ადმინი / შეფასებები</div>
            <h1>მოდერაცია</h1>
          </div>
          <div class="admin-tabs" data-review-filter>
            <button data-filter="all" class="${state.reviewFilter === "all" ? "is-active" : ""}">ყველა</button>
            <button data-filter="approved" class="${state.reviewFilter === "approved" ? "is-active" : ""}">დამტკიცებული</button>
            <button data-filter="pending" class="${state.reviewFilter === "pending" ? "is-active" : ""}">მოლოდინში</button>
            <button data-filter="hidden" class="${state.reviewFilter === "hidden" ? "is-active" : ""}">დამალული</button>
          </div>
        </div>

          <div class="admin-card admin-table-card">
            ${
              filtered.length
                ? `
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>მომხმარებელი</th>
                      <th>კურსი</th>
                      <th>ვარსკვლავები</th>
                      <th>კომენტარი</th>
                      <th>თარიღი</th>
                      <th>სტატუსი</th>
                      <th>მოქმედება</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${filtered
                      .map((review, index) => {
                        const comment = review.comment || "";
                        const shortComment = comment.length > 80 ? `${comment.slice(0, 80)}...` : comment;
                        return `
                        <tr>
                          <td>${escapeHtml(review.userName)}</td>
                          <td>${escapeHtml(review.courseTitle || "კურსი")}</td>
                          <td>${renderStars(review.rating || 5)}</td>
                          <td title="${escapeHtml(comment)}">${escapeHtml(shortComment)}</td>
                          <td>${escapeHtml(formatDate(review.date))}</td>
                          <td><span class="badge ${getStatusClass(review.status)}">${escapeHtml(getStatusLabel(review.status))}</span></td>
                          <td>
                            <div class="admin-actions">
                              <button class="action-btn action-btn--success" data-review-approve="${index}" aria-label="დამტკიცება">
                                ${ICONS.check}
                              </button>
                              <button class="action-btn action-btn--warning" data-review-hide="${index}" aria-label="დამალვა">
                                ${ICONS.hide}
                              </button>
                              <button class="action-btn action-btn--view" data-review-reply="${index}" aria-label="პასუხი">
                                ${ICONS.message}
                              </button>
                              <button class="action-btn action-btn--delete" data-review-delete="${index}" aria-label="წაშლა">
                                ${ICONS.trash}
                              </button>
                            </div>
                          </td>
                        </tr>
                        <tr class="review-reply-row" data-review-reply-row="${index}">
                          <td colspan="7">
                            <div class="review-reply">
                              <textarea placeholder="პასუხი..." data-review-reply-input="${index}"></textarea>
                              <div class="review-reply-actions">
                                <button class="admin-btn admin-btn--primary" data-review-reply-send="${index}">გაგზავნა</button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      `;
                      })
                      .join("")}
                  </tbody>
                </table>
              `
                : `
                <div class="admin-empty">
                  <div class="admin-empty__icon">📭</div>
                  მონაცემები არ მოიძებნა
                </div>
              `
            }
          </div>
      </section>
    `;
  }

  function renderAnalyticsPage() {
    const topCourses = getCourses().slice(0, 5);
    return `
      <section class="admin-section">
        <div class="admin-topbar">
          <div>
            <div class="admin-breadcrumb">ადმინი / ანალიტიკა</div>
            <h1>შემოსავლის ანალიზი</h1>
          </div>
          <div class="admin-tabs" data-analytics-range>
            <button data-range="7" class="${state.analyticsRange === 7 ? "is-active" : ""}">ბოლო 7 დღე</button>
            <button data-range="30" class="${state.analyticsRange === 30 ? "is-active" : ""}">ბოლო 30 დღე</button>
            <button data-range="90" class="${state.analyticsRange === 90 ? "is-active" : ""}">ბოლო 3 თვე</button>
            <button data-range="365" class="${state.analyticsRange === 365 ? "is-active" : ""}">ამ წელს</button>
          </div>
        </div>

        <div class="admin-stats">
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.revenue}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>10%</span></span>
            </div>
            <div class="stat-value">₾4,850</div>
            <div class="stat-label">შემოსავალი</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.courses}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>6%</span></span>
            </div>
            <div class="stat-value">132</div>
            <div class="stat-label">გაყიდვები</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.users}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>4%</span></span>
            </div>
            <div class="stat-value">28</div>
            <div class="stat-label">ახალი მომხმარებელი</div>
          </div>
          <div class="stat-card">
            <div class="stat-card__top">
              <div class="stat-icon">${ICONS.trend}</div>
              <span class="stat-trend positive">${ICONS.arrowUp}<span>2%</span></span>
            </div>
            <div class="stat-value">4.8%</div>
            <div class="stat-label">Conversion Rate</div>
          </div>
        </div>

        <div class="admin-grid">
          <div class="admin-card admin-chart">
            <div class="admin-chart-head">
              <h3>დღიური შემოსავალი</h3>
            </div>
            <div class="admin-chart-body" data-admin-chart="revenue-line"></div>
          </div>
          <div class="admin-card admin-chart">
            <div class="admin-chart-head">
              <h3>კურსების გაყიდვები</h3>
            </div>
            <div class="admin-chart-body" data-admin-chart="course-bars"></div>
          </div>
          <div class="admin-card admin-chart">
            <div class="admin-chart-head">
              <h3>კატეგორიების განაწილება</h3>
            </div>
            <div class="admin-chart-body" data-admin-chart="category-pie"></div>
          </div>
          <div class="admin-card admin-table-card">
            <h3>Top კურსები</h3>
            ${
              topCourses.length
                ? `
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>კურსი</th>
                      <th>გაყიდვები</th>
                      <th>შემოსავალი</th>
                      <th>რეიტინგი</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${topCourses
                      .map(
                        (course) => `
                          <tr>
                            <td>${escapeHtml(course.title)}</td>
                            <td>${getCourseSales(course.id)}</td>
                            <td>${formatCurrency(Number(course.price || 0) * getCourseSales(course.id))}</td>
                            <td>${course.rating || 4.7} ⭐</td>
                          </tr>
                        `,
                      )
                      .join("")}
                  </tbody>
                </table>
              `
                : `
                <div class="admin-empty">
                  <div class="admin-empty__icon">📭</div>
                  მონაცემები არ მოიძებნა
                </div>
              `
            }
          </div>
        </div>
      </section>
    `;
  }

  function renderCourseEditorModal(course) {
    const data = course || {
      id: getRandomId("course"),
      title: "",
      cat: "",
      desc: "",
      price: 0,
      originalPrice: 0,
      freeLessons: 2,
      status: "გამოქვეყნებული",
    };

    return `
      <div class="modal admin-modal" id="course-editor-modal" hidden aria-hidden="true">
        <div class="modal__backdrop" data-modal-dismiss></div>
        <div class="modal__dialog">
          <div class="admin-modal__header">
            <h2>${course ? "კურსის რედაქტირება" : "ახალი კურსი"}</h2>
            <button class="admin-modal__close" data-modal-close type="button">×</button>
          </div>
          <div class="admin-modal__tabs">
            <button class="is-active" data-course-tab="info" type="button">ძირითადი ინფო</button>
            <button data-course-tab="structure" type="button">ლექციები</button>
            <button data-course-tab="pricing" type="button">ფასი</button>
          </div>
          <div class="admin-modal__body">
            <div class="admin-tab is-active" data-course-panel="info">
              <div class="admin-field-grid">
                <label class="admin-field">სათაური
                  <input data-course-field="title" value="${escapeHtml(data.title)}" />
                </label>
                <label class="admin-field">კატეგორია
                  <input data-course-field="cat" value="${escapeHtml(data.cat)}" />
                </label>
                <label class="admin-field is-full">მოკლე აღწერა
                  <textarea data-course-field="desc">${escapeHtml(data.desc || "")}</textarea>
                </label>
                <label class="admin-field">ფასი
                  <input type="number" data-course-field="price" value="${data.price || 0}" />
                </label>
                <label class="admin-field">ორიგინალი ფასი
                  <input type="number" data-course-field="originalPrice" value="${data.originalPrice || 0}" />
                </label>
                <label class="admin-field">უფასო ლექციები
                  <input type="number" data-course-field="freeLessons" value="${data.freeLessons || 2}" />
                </label>
                <label class="admin-field">სტატუსი
                  <input data-course-field="status" value="${escapeHtml(data.status)}" />
                </label>
              </div>
            </div>
            <div class="admin-tab" data-course-panel="structure">
              <p class="muted">ვერსია 1.0: სტრუქტურის რედაქტირება არის ვიზუალური.</p>
            </div>
            <div class="admin-tab" data-course-panel="pricing">
              <p class="muted">ფასდაკლება და ხელმისაწვდომობა განისაზღვრება ძირითად ტაბში.</p>
            </div>
          </div>
          <div class="admin-modal__footer">
            <button class="admin-btn admin-btn--outline" data-modal-close type="button">გაუქმება</button>
            <button class="admin-btn admin-btn--primary" data-course-save type="button">შენახვა</button>
          </div>
        </div>
      </div>
    `;
  }

  function mountModals() {
    if (!document.getElementById("course-editor-modal")) {
      document.body.insertAdjacentHTML("beforeend", renderCourseEditorModal(state.courseEditor));
    }
    if (!document.getElementById("user-view-modal")) {
      document.body.insertAdjacentHTML(
        "beforeend",
        `
          <div class="modal admin-modal" id="user-view-modal" hidden aria-hidden="true">
            <div class="modal__backdrop" data-modal-dismiss></div>
            <div class="modal__dialog">
              <div class="admin-modal__header">
                <h2>მომხმარებლის პროფილი</h2>
                <button class="admin-modal__close" data-modal-close type="button">×</button>
              </div>
              <div class="admin-modal__body" data-user-modal-body></div>
              <div class="admin-modal__footer">
                <button class="admin-btn admin-btn--primary" data-modal-close type="button">დახურვა</button>
              </div>
            </div>
          </div>
        `,
      );
    }
  }

  function renderPage() {
    const pageId = getPageId();
    const container = document.querySelector("[data-admin-content]");
    if (!container) return;

    if (pageId === "dashboard") container.innerHTML = renderDashboard();
    if (pageId === "users") container.innerHTML = renderUsersPage();
    if (pageId === "courses") container.innerHTML = renderCoursesPage();
    if (pageId === "bookings") container.innerHTML = renderBookingsPage();
    if (pageId === "reviews") container.innerHTML = renderReviewsPage();
    if (pageId === "analytics") container.innerHTML = renderAnalyticsPage();
  }

  function bindAdminEvents() {
    document.body.addEventListener("input", (event) => {
      if (event.target.matches("[data-users-search], [data-course-search]")) {
        state.usersFilter = event.target.value.toLowerCase();
        renderPage();
        return;
      }

      if (event.target.matches("[data-users-filter]")) {
        state.usersCategory = event.target.value;
        renderPage();
        return;
      }
    });

    document.body.addEventListener("click", (event) => {
      const target = event.target.closest("button");
      if (!target) return;

      if (target.matches("[data-users-export]")) {
        showToast("CSV მზადაა ექსპორტისთვის", "success");
        return;
      }

      if (target.matches("[data-course-tab]")) {
        const modal = target.closest(".modal");
        if (!modal) return;
        const tabKey = target.dataset.courseTab;
        modal.querySelectorAll("[data-course-tab]").forEach((button) => {
          button.classList.toggle("is-active", button.dataset.courseTab === tabKey);
        });
        modal.querySelectorAll("[data-course-panel]").forEach((panel) => {
          panel.classList.toggle("is-active", panel.dataset.coursePanel === tabKey);
        });
        return;
      }

      if (target.matches("[data-user-view]")) {
        const user = getUsers().find((entry) => String(entry.id) === target.dataset.userView);
        const body = document.querySelector("[data-user-modal-body]");
        if (body) {
          body.innerHTML = `
            <p><strong>სახელი:</strong> ${escapeHtml(`${user?.name || ""} ${user?.surname || ""}`.trim())}</p>
            <p><strong>ელ-ფოსტა:</strong> ${escapeHtml(user?.email || "")}</p>
            <p><strong>კატეგორიები:</strong> ${normalizeArray(user?.categories).join(", ") || "-"}</p>
          `;
        }
        openModal("user-view-modal");
        return;
      }

      if (target.matches("[data-user-delete]")) {
        const users = getUsers().filter((user) => String(user.id) !== target.dataset.userDelete);
        saveUsers(users);
        renderPage();
        showToast("მომხმარებელი წაიშალა", "info");
        return;
      }

      if (target.matches("[data-course-create]")) {
        state.courseEditor = null;
        document.getElementById("course-editor-modal")?.remove();
        mountModals();
        openModal("course-editor-modal");
        return;
      }

      if (target.matches("[data-course-edit]")) {
        const course = getCourseById(target.dataset.courseEdit);
        state.courseEditor = course;
        document.getElementById("course-editor-modal")?.remove();
        mountModals();
        const modal = document.getElementById("course-editor-modal");
        if (modal) {
          modal.querySelector("[data-course-field='title']").value = course?.title || "";
          modal.querySelector("[data-course-field='cat']").value = course?.cat || "";
          modal.querySelector("[data-course-field='desc']").value = course?.desc || "";
          modal.querySelector("[data-course-field='price']").value = course?.price || 0;
          modal.querySelector("[data-course-field='originalPrice']").value = course?.originalPrice || 0;
          modal.querySelector("[data-course-field='freeLessons']").value = course?.freeLessons || 2;
          modal.querySelector("[data-course-field='status']").value = course?.status || "გამოქვეყნებული";
        }
        openModal("course-editor-modal");
        return;
      }

      if (target.matches("[data-course-delete]")) {
        const courses = getCourses().filter((course) => String(course.id) !== target.dataset.courseDelete);
        saveCourses(courses);
        renderPage();
        showToast("კურსი წაიშალა", "info");
        return;
      }

      if (target.matches("[data-course-save]")) {
        const modal = document.getElementById("course-editor-modal");
        if (!modal) return;
        const fields = modal.querySelectorAll("[data-course-field]");
        const data = {};
        fields.forEach((field) => {
          data[field.dataset.courseField] = field.value;
        });
        const courses = getCourses();
        const existingIndex = courses.findIndex((course) => String(course.id) === String(state.courseEditor?.id || data.id));
        const payload = {
          ...state.courseEditor,
          id: state.courseEditor?.id || getRandomId("course"),
          title: data.title,
          cat: data.cat,
          desc: data.desc,
          price: Number(data.price || 0),
          originalPrice: Number(data.originalPrice || 0),
          freeLessons: Number(data.freeLessons || 0),
          status: data.status || "გამოქვეყნებული",
          free: Number(data.price || 0) === 0,
        };
        if (existingIndex >= 0) {
          courses[existingIndex] = payload;
        } else {
          courses.push(payload);
        }
        saveCourses(courses);
        closeModal("course-editor-modal");
        renderPage();
        showToast("კურსი შენახულია", "success");
        return;
      }

      if (target.matches("[data-bookings-toggle] button")) {
        state.bookingsView = target.dataset.view;
        renderPage();
        return;
      }

      if (target.matches("[data-review-filter] button")) {
        state.reviewFilter = target.dataset.filter;
        renderPage();
        return;
      }

      if (target.matches("[data-review-reply]")) {
        const row = document.querySelector(`[data-review-reply-row="${target.dataset.reviewReply}"]`);
        if (row) {
          row.classList.toggle("is-open");
        }
        return;
      }

      if (target.matches("[data-review-reply-send]")) {
        const row = document.querySelector(`[data-review-reply-row="${target.dataset.reviewReplySend}"]`);
        if (row) {
          row.classList.remove("is-open");
        }
        showToast("პასუხი გაიგზავნა", "success");
        return;
      }

      if (target.matches("[data-review-approve], [data-review-hide], [data-review-delete]")) {
        showToast("შეფასება განახლდა", "info");
        return;
      }

      if (target.matches("[data-analytics-range] button")) {
        state.analyticsRange = Number(target.dataset.range);
        renderPage();
        renderCharts();
        return;
      }

      if (target.matches("[data-admin-logout]")) {
        window.Auth?.logout?.();
        window.location.href = window.Auth?.resolvePath?.("login.html") || "../login.html";
      }
    });

    document.body.addEventListener("change", (event) => {
      if (event.target.matches("[data-booking-status]")) {
        const bookings = getBookings();
        const booking = bookings.find((entry) => String(entry.id) === event.target.dataset.bookingStatus);
        if (booking) {
          booking.status = event.target.value;
          saveBookings(bookings);
          showToast("სტატუსი განახლდა", "success");
        }
      }

      if (event.target.matches("[data-analytics-range]")) {
        state.analyticsRange = Number(event.target.value);
        renderPage();
        renderCharts();
      }
    });
  }

  function renderCharts() {
    const revenueBars = document.querySelector("[data-admin-chart='revenue-bars']");
    if (revenueBars) {
      buildBarChart(
        revenueBars,
        ["ნოე", "დეკ", "იან", "თებ", "მარ", "აპრ"],
        [1200, 1800, 2600, 2100, 3200, 3800],
      );
    }

    const revenueLine = document.querySelector("[data-admin-chart='revenue-line']");
    if (revenueLine) {
      buildLineChart(revenueLine, [
        { label: "1", value: 120 },
        { label: "5", value: 280 },
        { label: "10", value: 220 },
        { label: "15", value: 360 },
        { label: "20", value: 300 },
        { label: "25", value: 420 },
        { label: "30", value: 460 },
      ]);
    }

    const courseBars = document.querySelector("[data-admin-chart='course-bars']");
    if (courseBars) {
      buildBarChart(
        courseBars,
        ["არტთერაპია", "მშობლობა", "კომუნიკაცია", "ფსიქოლოგია"],
        [1200, 1600, 800, 1400],
      );
    }

    const categoryPie = document.querySelector("[data-admin-chart='category-pie']");
    if (categoryPie) {
      buildPieChart(categoryPie, [
        { label: "არტთერაპია", value: 40, color: "#8B3A2A" },
        { label: "მშობლებისთვის", value: 30, color: "#C4623A" },
        { label: "კომუნიკაცია", value: 20, color: "#D9BBA0" },
        { label: "ფსიქოლოგია", value: 10, color: "#F0EBE1" },
      ]);
    }
  }

  function init() {
    if (!ensureAdminGuard()) return;
    setActiveNav();
    const userCard = document.querySelector("[data-admin-user]");
    if (userCard) {
      userCard.innerHTML = renderAdminUserCard(getAdminUser());
    }
    mountModals();
    renderPage();
    renderCharts();
    bindAdminEvents();
  }

  onReady(init);
})();
