(() => {
  const DASHBOARD_TABS = ["overview", "courses", "bookings", "tasks", "comments", "settings"];
  const INTEREST_OPTIONS = [
    "ბავშვის ფსიქოლოგია",
    "მშობლობა",
    "ინდივიდუალური თერაპია",
    "ჯგუფური თერაპია",
    "არტთერაპია",
    "კომუნიკაცია",
    "ფსიქოლოგია",
  ];

  const state = {
    activeTab: "overview",
    courseFilter: "all",
    editingReviewIndex: -1,
    interestDraft: null,
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

  function renderArrowIcon(direction = "up-right", className = "") {
    const icons = {
      left:
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M13 8H3"></path><path d="M7 4 3 8l4 4"></path></svg>',
      right:
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M3 8h10"></path><path d="m9 4 4 4-4 4"></path></svg>',
      up:
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 13V3"></path><path d="M4 7 8 3l4 4"></path></svg>',
      down:
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M8 3v10"></path><path d="m4 9 4 4 4-4"></path></svg>',
      "up-right":
        '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M4 12 12 4"></path><path d="M6 4h6v6"></path></svg>',
    };
    const classes = ["icon-arrow", `icon-arrow--${direction}`, className].filter(Boolean).join(" ");
    return `<span class="${classes}" aria-hidden="true">${icons[direction] || icons["up-right"]}</span>`;
  }

  function getCurrentUser() {
    return window.Auth?.getCurrentUser?.() || null;
  }

  function getAllUsers() {
    return normalizeArray(window.Auth?.getUsers?.());
  }

  function getCourses() {
    return normalizeArray(window.MakaCourses?.getCourses?.() || []);
  }

  function getCourseById(courseId) {
    return getCourses().find((course) => Number(course.id) === Number(courseId)) || null;
  }

  function flattenLessons(course) {
    return normalizeArray(course?.sections).flatMap((section) =>
      normalizeArray(section.lessons).map((lesson) => ({
        ...lesson,
        sectionId: section.id,
        sectionTitle: section.title,
      })),
    );
  }

  function getEnrollment(user, courseId) {
    return normalizeArray(user?.enrolledCourses).find((entry) => Number(entry.courseId) === Number(courseId)) || null;
  }

  function isLessonCompleted(enrollment, lessonId) {
    const value = enrollment?.progress?.[lessonId];
    if (typeof value === "boolean") {
      return value;
    }

    return Boolean(value?.completed);
  }

  function getCourseProgress(course, user) {
    const enrollment = getEnrollment(user, course.id);
    const lessons = flattenLessons(course);

    if (!enrollment || !lessons.length) {
      return 0;
    }

    const completed = lessons.filter((lesson) => isLessonCompleted(enrollment, lesson.id)).length;
    return Math.round((completed / lessons.length) * 100);
  }

  function getCompletedLessonsCount(course, user) {
    const enrollment = getEnrollment(user, course.id);
    if (!enrollment) {
      return 0;
    }

    return flattenLessons(course).filter((lesson) => isLessonCompleted(enrollment, lesson.id)).length;
  }

  function countCompletedTasks(user) {
    return normalizeArray(user?.enrolledCourses).reduce((total, enrollment) => {
      return (
        total +
        Object.values(enrollment?.taskState || {}).reduce((lessonTotal, lessonState) => {
          return lessonTotal + Object.values(lessonState || {}).filter(Boolean).length;
        }, 0)
      );
    }, 0);
  }

  function getEnrolledCourses(user) {
    return normalizeArray(user?.enrolledCourses)
      .map((entry) => {
        const course = getCourseById(entry.courseId);
        if (!course) {
          return null;
        }

        return {
          ...course,
          enrollment: entry,
          progress: getCourseProgress(course, user),
          completedLessons: getCompletedLessonsCount(course, user),
          totalLessons: flattenLessons(course).length,
        };
      })
      .filter(Boolean);
  }

  function getCompletedCoursesCount(user) {
    return getEnrolledCourses(user).filter((course) => course.progress >= 100).length;
  }

  function getInitials(user) {
    return `${String(user?.name || "").slice(0, 1)}${String(user?.surname || "").slice(0, 1)}`.trim() || "MG";
  }

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("ka-GE", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  }

  function parseBookingDate(booking) {
    if (!booking?.date) {
      return null;
    }

    const safeTime = booking.time || "00:00";
    const parsed = new Date(`${booking.date}T${safeTime}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  function getSortedBookings(user) {
    return normalizeArray(user?.bookings)
      .slice()
      .sort((left, right) => {
        const leftDate = parseBookingDate(left)?.getTime() || 0;
        const rightDate = parseBookingDate(right)?.getTime() || 0;
        return rightDate - leftDate;
      });
  }

  function getUpcomingBooking(user) {
    const now = Date.now();
    return (
      getSortedBookings(user)
        .slice()
        .reverse()
        .find((booking) => {
          const timestamp = parseBookingDate(booking)?.getTime();
          return timestamp && timestamp >= now && booking.status !== "completed";
        }) || null
    );
  }

  function getStatusClass(status) {
    if (status === "confirmed") {
      return "badge-free";
    }

    if (status === "pending") {
      return "badge-warning";
    }

    return "badge";
  }

  function getStatusLabel(status) {
    const labels = {
      pending: "მოლოდინში",
      confirmed: "დადასტურებული",
      completed: "დასრულებული",
    };

    return labels[status] || "უცნობი";
  }

  function getReviewCourseName(review) {
    const course = getCourseById(review?.courseId);
    return course?.title || "კურსი";
  }

  function getReviewStars(rating) {
    const safeRating = Math.max(1, Math.min(5, Number(rating || 0)));
    return "⭐".repeat(safeRating);
  }

  function downloadCertificate(course, user) {
    const content = [
      "სერტიფიკატი",
      "",
      `ეს სერტიფიკატი ადასტურებს, რომ ${user.name} ${user.surname}`.trim(),
      `წარმატებით დაასრულა კურსი: ${course.title}`,
      `თარიღი: ${formatDate(new Date().toISOString())}`,
      "",
      "მაკა გორდელაძე",
      "ფსიქოლოგი | პედაგოგი | კოუჩი",
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${course.title}-certificate.txt`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(url);
  }

  function persistBookings(nextBookings) {
    const storageKey = window.Auth?.STORAGE_KEYS?.bookings || "bookings";
    const allBookings = normalizeArray(JSON.parse(window.localStorage.getItem(storageKey) || "[]"));
    const currentUser = getCurrentUser();
    const filtered = allBookings.filter((booking) => {
      if (!currentUser) {
        return true;
      }

      return !(booking.userId === currentUser.id && nextBookings.every((item) => item.id !== booking.id));
    });

    nextBookings.forEach((booking) => {
      const index = filtered.findIndex((item) => item.id === booking.id);
      const payload = {
        ...booking,
        userId: currentUser?.id || "",
        userName: `${currentUser?.name || ""} ${currentUser?.surname || ""}`.trim(),
        userEmail: currentUser?.email || "",
      };

      if (index >= 0) {
        filtered[index] = payload;
      } else {
        filtered.push(payload);
      }
    });

    window.localStorage.setItem(storageKey, JSON.stringify(filtered));
  }

  function cancelBooking(bookingId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    const nextBookings = normalizeArray(currentUser.bookings).filter((booking) => booking.id !== bookingId);
    window.Auth?.updateCurrentUser?.({ bookings: nextBookings });
    persistBookings(nextBookings);
    window.MakaUI?.showToast?.("დაჯავშნა გაუქმდა.", "success");
  }

  function updateReviews(nextReviews) {
    window.Auth?.updateCurrentUser?.({ reviews: nextReviews });
  }

  function getTaskGroups(user) {
    return getEnrolledCourses(user)
      .map((course) => {
        const lessons = flattenLessons(course);
        const enrollment = getEnrollment(user, course.id);
        const tasks = lessons.flatMap((lesson) =>
          normalizeArray(lesson.tasks).map((task, index) => {
            const upload = normalizeArray(user?.taskUploads).find(
              (entry) =>
                Number(entry.courseId) === Number(course.id) &&
                entry.lessonId === lesson.id &&
                Number(entry.taskIndex) === Number(index),
            );

            return {
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              taskTitle: task.title,
              taskDetails: task.details,
              checked: Boolean(enrollment?.taskState?.[lesson.id]?.[index]),
              upload: upload?.imageBase64 || "",
            };
          }),
        );

        return {
          course,
          tasks,
        };
      })
      .filter((group) => group.tasks.length > 0);
  }

  function renderSidebarUser(user) {
    return `
      <div class="dashboard-user-card">
        <div class="dashboard-avatar">${escapeHtml(getInitials(user))}</div>
        <div class="stack-sm">
          <h3>${escapeHtml(`${user.name} ${user.surname}`.trim())}</h3>
          <p>${escapeHtml(user.email)}</p>
          <span class="badge">${user.role === "admin" ? "ადმინი" : "მომხმარებელი"}</span>
        </div>
      </div>
    `;
  }

  function renderPanelHeader(title, subtitle) {
    return `
      <header class="dashboard-panel__header animate-on-scroll">
        <div class="stack-sm">
          <span class="section-label">პირადი სივრცე</span>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
      </header>
    `;
  }

  function renderOverview(user) {
    const enrolledCourses = getEnrolledCourses(user);
    const continueCourses = enrolledCourses.length ? enrolledCourses.slice(0, 2) : getCourses().slice(0, 2);
    const upcomingBooking = getUpcomingBooking(user);
    const stats = [
      { label: "კურსი", value: enrolledCourses.length, icon: "📚" },
      { label: "დაჯავშნა", value: normalizeArray(user.bookings).length, icon: "📅" },
      { label: "დავალება", value: countCompletedTasks(user), icon: "✅" },
      { label: "სერტიფიკატი", value: getCompletedCoursesCount(user), icon: "🏆" },
    ];

    return `
      <div class="dashboard-panel dashboard-panel--overview">
        ${renderPanelHeader(`გამარჯობა, ${escapeHtml(user.name)}! 👋`, "აქ ნახავ შენს პროგრესს, მომდევნო ნაბიჯებს და აქტიურ სესიებს ერთ სივრცეში.")}
        <section class="dashboard-stats">
          ${stats
            .map(
              (item) => `
                <article class="card dashboard-stat animate-on-scroll">
                  <span class="dashboard-stat__icon" aria-hidden="true">${item.icon}</span>
                  <strong>${escapeHtml(item.value)}</strong>
                  <span>${escapeHtml(item.label)}</span>
                </article>
              `,
            )
            .join("")}
        </section>

        <div class="dashboard-overview-grid">
          <section class="card dashboard-card animate-on-scroll">
            <div class="space-between">
              <div class="stack-sm">
                <h3>გააგრძელე სწავლა</h3>
                <p class="muted">ის კურსები, რომლებსაც ახლა ყველაზე მეტი ყურადღება სჭირდება.</p>
              </div>
              <button class="btn btn-outline btn-sm" type="button" data-dashboard-tab-jump="courses">ყველას ნახვა</button>
            </div>
            <div class="dashboard-progress-list">
              ${continueCourses
                .map((course) => {
                  const enrolled = Boolean(getEnrollment(user, course.id));
                  const progress = getCourseProgress(course, user);
                  return `
                    <article class="dashboard-course-inline">
                      <img src="${escapeHtml(course.image)}" alt="${escapeHtml(course.title)}">
                      <div class="stack-sm">
                        <div class="space-between">
                          <h4>${escapeHtml(course.title)}</h4>
                          <span class="badge ${course.free ? "badge-free" : "badge-paid"}">${course.free ? "უფასო" : "ფასიანი"}</span>
                        </div>
                        <p class="muted">${enrolled ? `${progress}% პროგრესი` : "ჯერ არ არის დაწყებული"}</p>
                        <div class="progress"><span style="width: ${enrolled ? progress : 6}%"></span></div>
                        <a class="link-arrow" href="${enrolled ? `course-detail.html?id=${course.id}` : `courses.html`}"><span>${enrolled ? "გაგრძელება" : "დაიწყე"}</span>${renderArrowIcon("right", "link-arrow__icon")}</a>
                      </div>
                    </article>
                  `;
                })
                .join("")}
            </div>
          </section>

          <section class="card dashboard-card dashboard-session-card animate-on-scroll">
            <div class="stack-sm">
              <h3>მომდევნო სესია</h3>
              ${
                upcomingBooking
                  ? `
                    <div class="dashboard-session-card__date">${escapeHtml(formatDate(upcomingBooking.date))}</div>
                    <div class="dashboard-session-card__time">${escapeHtml(upcomingBooking.time)}</div>
                    <p>${escapeHtml(upcomingBooking.type)}</p>
                    <span class="badge ${getStatusClass(upcomingBooking.status)}">${escapeHtml(getStatusLabel(upcomingBooking.status))}</span>
                  `
                  : `
                    <div class="empty-state">
                      ჯერ აქტიური სესია არ გაქვს.
                      <div class="empty-state__actions">
                        <a class="btn btn-primary" href="therapy.html">ახალი დაჯავშნა ${renderArrowIcon("up-right", "btn-arrow")}</a>
                      </div>
                    </div>
                  `
              }
            </div>
          </section>
        </div>
      </div>
    `;
  }

  function renderCourses(user) {
    const filters = [
      { value: "all", label: "ყველა" },
      { value: "progress", label: "პროგრესში" },
      { value: "completed", label: "დასრულებული" },
    ];

    const courses = getEnrolledCourses(user).filter((course) => {
      if (state.courseFilter === "progress") {
        return course.progress > 0 && course.progress < 100;
      }

      if (state.courseFilter === "completed") {
        return course.progress >= 100;
      }

      return true;
    });

    return `
      <div class="dashboard-panel dashboard-panel--courses">
        ${renderPanelHeader("ჩემი კურსები", "ნახე შეძენილი და აქტიური პროგრამები, პროგრესი და სწრაფი წვდომა გაკვეთილებზე.")}
        <section class="card dashboard-card animate-on-scroll">
          <div class="dashboard-filter-bar">
            ${filters
              .map(
                (filter) => `
                  <button class="filter-chip${state.courseFilter === filter.value ? " is-active" : ""}" type="button" data-dashboard-course-filter="${filter.value}">
                    ${escapeHtml(filter.label)}
                  </button>
                `,
              )
              .join("")}
          </div>

          ${
            courses.length
              ? `
                <div class="dashboard-courses-grid">
                  ${courses
                    .map(
                      (course) => `
                        <article class="dashboard-course-card">
                          <img src="${escapeHtml(course.image)}" alt="${escapeHtml(course.title)}">
                          <div class="stack-sm">
                            <div class="space-between">
                              <h3>${escapeHtml(course.title)}</h3>
                              <span class="badge ${course.progress >= 100 ? "badge-free" : "badge"}">${course.progress >= 100 ? "დასრულებული" : "აქტიური"}</span>
                            </div>
                            <p class="muted">${escapeHtml(course.cat)} • ${course.completedLessons}/${course.totalLessons} გაკვეთილი</p>
                            <div class="progress"><span style="width: ${course.progress}%"></span></div>
                            <div class="course-card__footer">
                              <a class="btn btn-outline btn-sm" href="course-detail.html?id=${course.id}">გაგრძელება</a>
                              ${
                                course.progress >= 100
                                  ? `<button class="btn btn-primary btn-sm" type="button" data-certificate-course="${course.id}">სერტიფიკატი ${renderArrowIcon("down", "btn-arrow")}</button>`
                                  : ""
                              }
                            </div>
                          </div>
                        </article>
                      `,
                    )
                    .join("")}
                </div>
              `
              : `
                <div class="empty-state">
                  ამ ფილტრში კურსი არ მოიძებნა.
                  <div class="empty-state__actions">
                    <a class="btn btn-primary" href="courses.html">კურსების ნახვა ${renderArrowIcon("up-right", "btn-arrow")}</a>
                  </div>
                </div>
              `
          }
        </section>
      </div>
    `;
  }

  function renderBookings(user) {
    const bookings = getSortedBookings(user);

    return `
      <div class="dashboard-panel dashboard-panel--bookings">
        ${renderPanelHeader("დაჯავშნები", "მართე თერაპიის სესიები, ნახე სტატუსი და სწრაფად გადადი ახალ ჯავშანზე.")}
        <section class="card dashboard-card animate-on-scroll">
          <div class="space-between">
            <div class="stack-sm">
              <h3>ჩემი სესიები</h3>
              <p class="muted">ცხრილი აჩვენებს შენს ყველა აქტიურ და დასრულებულ ჩანაწერს.</p>
            </div>
            <a class="btn btn-primary btn-sm" href="therapy.html">ახალი დაჯავშნა ${renderArrowIcon("up-right", "btn-arrow")}</a>
          </div>

          ${
            bookings.length
              ? `
                <div class="table-wrap">
                  <table class="table dashboard-table">
                    <thead>
                      <tr>
                        <th>თარიღი</th>
                        <th>დრო</th>
                        <th>ტიპი</th>
                        <th>სტატუსი</th>
                        <th>მოქმედება</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${bookings
                        .map(
                          (booking) => `
                            <tr>
                              <td>${escapeHtml(formatDate(booking.date))}</td>
                              <td>${escapeHtml(booking.time)}</td>
                              <td>${escapeHtml(booking.type)}</td>
                              <td><span class="badge ${getStatusClass(booking.status)}">${escapeHtml(getStatusLabel(booking.status))}</span></td>
                              <td>
                                ${
                                  booking.status === "completed"
                                    ? `<span class="help-text">დასრულებულია</span>`
                                    : `<button class="btn btn-outline btn-xs" type="button" data-booking-cancel="${escapeHtml(booking.id)}">გაუქმება</button>`
                                }
                              </td>
                            </tr>
                          `,
                        )
                        .join("")}
                    </tbody>
                  </table>
                </div>
              `
              : `
                <div class="empty-state">
                  ჯერ დაჯავშნა არ გაქვს.
                  <div class="empty-state__actions">
                    <a class="btn btn-primary" href="therapy.html">ახალი დაჯავშნა ${renderArrowIcon("up-right", "btn-arrow")}</a>
                  </div>
                </div>
              `
          }
        </section>
      </div>
    `;
  }

  function renderTasks(user) {
    const taskGroups = getTaskGroups(user);

    return `
      <div class="dashboard-panel dashboard-panel--tasks">
        ${renderPanelHeader("დავალებები", "კურსების მიხედვით დაათვალიერე შენი სავარჯიშოები, შესრულების სტატუსი და ატვირთული მასალა.")}
        ${
          taskGroups.length
            ? `
              <div class="dashboard-task-groups">
                ${taskGroups
                  .map(
                    (group) => `
                      <section class="card dashboard-card dashboard-task-group animate-on-scroll">
                        <div class="space-between">
                          <div class="stack-sm">
                            <h3>${escapeHtml(group.course.title)}</h3>
                            <p class="muted">${group.tasks.filter((task) => task.checked).length}/${group.tasks.length} დავალება მონიშნულია</p>
                          </div>
                          <a class="btn btn-outline btn-sm" href="course-detail.html?id=${group.course.id}">კურსის გახსნა</a>
                        </div>
                        <div class="dashboard-task-list">
                          ${group.tasks
                            .map(
                              (task) => `
                                <article class="dashboard-task-row${task.checked ? " is-complete" : ""}">
                                  <div class="dashboard-task-row__main">
                                    <span class="dashboard-task-row__check" aria-hidden="true">${task.checked ? "✓" : "○"}</span>
                                    <div class="stack-sm">
                                      <strong>${escapeHtml(task.taskTitle)}</strong>
                                      <span class="help-text">${escapeHtml(task.lessonTitle)}</span>
                                      <p>${escapeHtml(task.taskDetails)}</p>
                                    </div>
                                  </div>
                                  ${
                                    task.upload
                                      ? `<img class="dashboard-task-row__preview" src="${task.upload}" alt="${escapeHtml(task.taskTitle)}">`
                                      : `<span class="help-text">ფაილი არ არის</span>`
                                  }
                                </article>
                              `,
                            )
                            .join("")}
                        </div>
                      </section>
                    `,
                  )
                  .join("")}
              </div>
            `
            : `
              <section class="card dashboard-card animate-on-scroll">
                <div class="empty-state">
                  ამ დროისთვის დავალებები ჯერ არ გაქვს.
                  <div class="empty-state__actions">
                    <a class="btn btn-primary" href="courses.html">კურსების ნახვა ${renderArrowIcon("up-right", "btn-arrow")}</a>
                  </div>
                </div>
              </section>
            `
        }
      </div>
    `;
  }

  function renderComments(user) {
    const reviews = normalizeArray(user?.reviews);

    return `
      <div class="dashboard-panel dashboard-panel--comments">
        ${renderPanelHeader("კომენტარები", "აქ ინახება შენი შეფასებები და შეგიძლია ნებისმიერ დროს ჩაასწორო ან წაშალო ისინი.")}
        <section class="card dashboard-card animate-on-scroll">
          ${
            reviews.length
              ? `
                <div class="dashboard-comments-list">
                  ${reviews
                    .map((review, index) => {
                      const isEditing = state.editingReviewIndex === index;
                      return `
                        <article class="dashboard-comment-card">
                          <div class="space-between">
                            <div class="stack-sm">
                              <h3>${escapeHtml(getReviewCourseName(review))}</h3>
                              <span class="muted">${escapeHtml(formatDate(review.date))} • ${escapeHtml(getReviewStars(review.rating))}</span>
                            </div>
                            <div class="dashboard-comment-card__actions">
                              <button class="btn btn-outline btn-xs" type="button" data-review-edit="${index}">${isEditing ? "გაუქმება" : "რედაქტირება"}</button>
                              <button class="btn btn-outline btn-xs" type="button" data-review-delete="${index}">წაშლა</button>
                            </div>
                          </div>
                          ${
                            isEditing
                              ? `
                                <form class="stack-sm" data-review-form="${index}">
                                  <div class="field">
                                    <label class="field-label" for="review-rating-${index}">რეიტინგი</label>
                                    <select id="review-rating-${index}" name="rating">
                                      ${[5, 4, 3, 2, 1]
                                        .map((rating) => `<option value="${rating}" ${Number(review.rating) === rating ? "selected" : ""}>${rating} ⭐</option>`)
                                        .join("")}
                                    </select>
                                  </div>
                                  <div class="field">
                                    <label class="field-label" for="review-comment-${index}">კომენტარი</label>
                                    <textarea id="review-comment-${index}" name="comment" rows="4">${escapeHtml(review.comment)}</textarea>
                                  </div>
                                  <div class="course-card__footer">
                                    <button class="btn btn-primary btn-sm" type="submit">შენახვა</button>
                                  </div>
                                </form>
                              `
                              : `
                                <p>${escapeHtml(review.comment)}</p>
                                ${
                                  review.adminReply
                                    ? `<div class="dashboard-admin-reply"><strong>ადმინისტრატორის პასუხი:</strong><p>${escapeHtml(review.adminReply)}</p></div>`
                                    : ""
                                }
                              `
                          }
                        </article>
                      `;
                    })
                    .join("")}
                </div>
              `
              : `
                <div class="empty-state">
                  ჯერ შეფასება არ გაქვს დატოვებული.
                  <div class="empty-state__actions">
                    <a class="btn btn-primary" href="courses.html">კურსების ნახვა ${renderArrowIcon("up-right", "btn-arrow")}</a>
                  </div>
                </div>
              `
          }
        </section>
      </div>
    `;
  }

  function renderSettings(user) {
    const selectedInterests = state.interestDraft || new Set(normalizeArray(user.categories));

    return `
      <div class="dashboard-panel dashboard-panel--settings">
        ${renderPanelHeader("პარამეტრები", "განაახლე პირადი მონაცემები, პაროლი და ინტერესები შენს საჭიროებებზე მორგებული გამოცდილებისთვის.")}
        <div class="dashboard-settings-grid">
          <section class="card dashboard-card animate-on-scroll">
            <div class="stack-sm">
              <h3>პირადი მონაცემები</h3>
              <p class="muted">ეს მონაცემები გამოიყენება პროფილსა და კომუნიკაციაში.</p>
            </div>
            <form class="stack" data-profile-form novalidate>
              <div class="dashboard-form-grid">
                <div class="field">
                  <label class="field-label" for="settings-name">სახელი</label>
                  <input id="settings-name" name="name" type="text" value="${escapeHtml(user.name)}" required>
                </div>
                <div class="field">
                  <label class="field-label" for="settings-surname">გვარი</label>
                  <input id="settings-surname" name="surname" type="text" value="${escapeHtml(user.surname)}" required>
                </div>
                <div class="field">
                  <label class="field-label" for="settings-email">ელ-ფოსტა</label>
                  <input id="settings-email" name="email" type="email" value="${escapeHtml(user.email)}" required>
                </div>
                <div class="field">
                  <label class="field-label" for="settings-phone">ტელეფონი</label>
                  <input id="settings-phone" name="phone" type="tel" value="${escapeHtml(user.phone || "")}">
                </div>
              </div>
              <div class="auth-status" data-profile-status></div>
              <div class="course-card__footer">
                <button class="btn btn-primary" type="submit">შენახვა</button>
              </div>
            </form>
          </section>

          <section class="card dashboard-card animate-on-scroll">
            <div class="stack-sm">
              <h3>პაროლის შეცვლა</h3>
              <p class="muted">უსაფრთხოების მიზნით შეიყვანე მიმდინარე პაროლი და შემდეგ ახალი კომბინაცია.</p>
            </div>
            <form class="stack" data-password-form novalidate>
              <div class="field">
                <label class="field-label" for="settings-current-password">მიმდინარე პაროლი</label>
                <input id="settings-current-password" name="currentPassword" type="password" required>
              </div>
              <div class="dashboard-form-grid">
                <div class="field">
                  <label class="field-label" for="settings-new-password">ახალი პაროლი</label>
                  <input id="settings-new-password" name="newPassword" type="password" required>
                </div>
                <div class="field">
                  <label class="field-label" for="settings-confirm-password">დადასტურება</label>
                  <input id="settings-confirm-password" name="confirmPassword" type="password" required>
                </div>
              </div>
              <div class="auth-status" data-password-status></div>
              <div class="course-card__footer">
                <button class="btn btn-primary" type="submit">შეცვლა</button>
              </div>
            </form>
          </section>
        </div>

        <section class="card dashboard-card animate-on-scroll">
          <div class="stack-sm">
            <h3>ინტერესები</h3>
            <p class="muted">აირჩიე სფეროები, რომელთა მიხედვითაც გინდა პერსონალიზებული რეკომენდაციები.</p>
          </div>
          <form class="stack" data-interest-form novalidate>
            <div class="dashboard-interest-chips">
              ${INTEREST_OPTIONS.map((item) => {
                const isSelected = selectedInterests.has(item);
                return `
                  <button class="dashboard-chip${isSelected ? " is-selected" : ""}" type="button" data-interest-chip="${escapeHtml(item)}" aria-pressed="${isSelected}">
                    ${escapeHtml(item)}
                  </button>
                `;
              }).join("")}
            </div>
            <div class="auth-status" data-interest-status></div>
            <div class="course-card__footer">
              <button class="btn btn-primary" type="submit">შენახვა</button>
            </div>
          </form>
        </section>
      </div>
    `;
  }

  function renderTabContent(user) {
    if (state.activeTab === "courses") {
      return renderCourses(user);
    }

    if (state.activeTab === "bookings") {
      return renderBookings(user);
    }

    if (state.activeTab === "tasks") {
      return renderTasks(user);
    }

    if (state.activeTab === "comments") {
      return renderComments(user);
    }

    if (state.activeTab === "settings") {
      return renderSettings(user);
    }

    return renderOverview(user);
  }

  function syncNavStates(root) {
    root.querySelectorAll("[data-dashboard-tab-target]").forEach((button) => {
      const isActive = button.dataset.dashboardTabTarget === state.activeTab;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function bindStaticNav(root, rerender) {
    root.querySelectorAll("[data-dashboard-tab-target]").forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const nextTab = button.dataset.dashboardTabTarget;
        if (!DASHBOARD_TABS.includes(nextTab)) {
          return;
        }

        state.activeTab = nextTab;
        state.editingReviewIndex = -1;
        rerender();
      });
    });
  }

  function bindDynamicActions(root, rerender) {
    const user = getCurrentUser();
    if (!user) {
      return;
    }

    root.querySelectorAll("[data-dashboard-tab-jump]").forEach((button) => {
      button.addEventListener("click", () => {
        state.activeTab = button.dataset.dashboardTabJump || "overview";
        rerender();
      });
    });

    root.querySelectorAll("[data-dashboard-course-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        state.courseFilter = button.dataset.dashboardCourseFilter || "all";
        rerender();
      });
    });

    root.querySelectorAll("[data-certificate-course]").forEach((button) => {
      button.addEventListener("click", () => {
        const course = getCourseById(button.dataset.certificateCourse);
        if (!course) {
          return;
        }

        downloadCertificate(course, user);
        window.MakaUI?.showToast?.("სერტიფიკატი მზადაა ჩამოსატვირთად.", "success");
      });
    });

    root.querySelectorAll("[data-booking-cancel]").forEach((button) => {
      button.addEventListener("click", () => {
        const bookingId = button.dataset.bookingCancel;
        if (!bookingId || !window.confirm("გსურს ამ დაჯავშნის გაუქმება?")) {
          return;
        }

        cancelBooking(bookingId);
        rerender();
      });
    });

    root.querySelectorAll("[data-review-edit]").forEach((button) => {
      button.addEventListener("click", () => {
        const reviewIndex = Number(button.dataset.reviewEdit);
        state.editingReviewIndex = state.editingReviewIndex === reviewIndex ? -1 : reviewIndex;
        rerender();
      });
    });

    root.querySelectorAll("[data-review-delete]").forEach((button) => {
      button.addEventListener("click", () => {
        const reviewIndex = Number(button.dataset.reviewDelete);
        if (Number.isNaN(reviewIndex) || !window.confirm("გსურს შეფასების წაშლა?")) {
          return;
        }

        const nextReviews = normalizeArray(getCurrentUser()?.reviews).filter((_, index) => index !== reviewIndex);
        updateReviews(nextReviews);
        state.editingReviewIndex = -1;
        window.MakaUI?.showToast?.("კომენტარი წაიშალა.", "success");
        rerender();
      });
    });

    root.querySelectorAll("[data-review-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const reviewIndex = Number(form.dataset.reviewForm);
        const rating = Number(form.elements.rating?.value || 5);
        const comment = String(form.elements.comment?.value || "").trim();

        if (!comment) {
          window.MakaUI?.showToast?.("კომენტარი ცარიელი ვერ იქნება.", "error");
          return;
        }

        const nextReviews = normalizeArray(getCurrentUser()?.reviews).map((review, index) =>
          index === reviewIndex ? { ...review, rating, comment } : review,
        );

        updateReviews(nextReviews);
        state.editingReviewIndex = -1;
        window.MakaUI?.showToast?.("კომენტარი განახლდა.", "success");
        rerender();
      });
    });

    const profileForm = root.querySelector("[data-profile-form]");
    profileForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = root.querySelector("[data-profile-status]");
      const payload = {
        name: String(profileForm.elements.name?.value || "").trim(),
        surname: String(profileForm.elements.surname?.value || "").trim(),
        email: String(profileForm.elements.email?.value || "").trim().toLowerCase(),
        phone: String(profileForm.elements.phone?.value || "").trim(),
      };

      if (!payload.name || !payload.surname || !payload.email) {
        status.textContent = "შეავსე ყველა აუცილებელი ველი.";
        status.className = "auth-status is-error";
        return;
      }

      const duplicate = getAllUsers().find((entry) => entry.email === payload.email && entry.id !== user.id);
      if (duplicate) {
        status.textContent = "ამ ელ-ფოსტით სხვა ანგარიში უკვე არსებობს.";
        status.className = "auth-status is-error";
        return;
      }

      window.Auth?.updateCurrentUser?.(payload);
      status.textContent = "პირადი მონაცემები განახლდა.";
      status.className = "auth-status is-success";
      window.MakaUI?.showToast?.("პროფილი განახლდა.", "success");
      rerender();
    });

    const passwordForm = root.querySelector("[data-password-form]");
    passwordForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = root.querySelector("[data-password-status]");
      const currentPassword = String(passwordForm.elements.currentPassword?.value || "");
      const newPassword = String(passwordForm.elements.newPassword?.value || "");
      const confirmPassword = String(passwordForm.elements.confirmPassword?.value || "");
      const freshUser = getCurrentUser();

      if (currentPassword !== freshUser?.password) {
        status.textContent = "მიმდინარე პაროლი არასწორია.";
        status.className = "auth-status is-error";
        return;
      }

      if (newPassword.length < 6) {
        status.textContent = "ახალი პაროლი მინიმუმ 6 სიმბოლოს უნდა შეიცავდეს.";
        status.className = "auth-status is-error";
        return;
      }

      if (newPassword !== confirmPassword) {
        status.textContent = "ახალი პაროლები არ ემთხვევა.";
        status.className = "auth-status is-error";
        return;
      }

      window.Auth?.updateCurrentUser?.({ password: newPassword });
      passwordForm.reset();
      status.textContent = "პაროლი შეიცვალა.";
      status.className = "auth-status is-success";
      window.MakaUI?.showToast?.("პაროლი წარმატებით შეიცვალა.", "success");
    });

    root.querySelectorAll("[data-interest-chip]").forEach((button) => {
      button.addEventListener("click", () => {
        if (!(state.interestDraft instanceof Set)) {
          state.interestDraft = new Set(normalizeArray(getCurrentUser()?.categories));
        }

        const value = button.dataset.interestChip || "";
        if (!value) {
          return;
        }

        if (state.interestDraft.has(value)) {
          state.interestDraft.delete(value);
        } else {
          state.interestDraft.add(value);
        }

        button.classList.toggle("is-selected", state.interestDraft.has(value));
        button.setAttribute("aria-pressed", String(state.interestDraft.has(value)));
      });
    });

    const interestForm = root.querySelector("[data-interest-form]");
    interestForm?.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = root.querySelector("[data-interest-status]");
      if (!(state.interestDraft instanceof Set) || !state.interestDraft.size) {
        status.textContent = "აირჩიე მინიმუმ ერთი ინტერესი.";
        status.className = "auth-status is-error";
        return;
      }

      window.Auth?.updateCurrentUser?.({ categories: [...state.interestDraft] });
      status.textContent = "ინტერესები განახლდა.";
      status.className = "auth-status is-success";
      window.MakaUI?.showToast?.("ინტერესები შენახულია.", "success");
      rerender();
    });
  }

  function initDashboardPage() {
    const page = document.querySelector("[data-dashboard-page]");
    if (!page) {
      return;
    }

    if (!window.Auth?.requireAuth?.("login.html")) {
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      return;
    }

    if (currentUser.role === "admin") {
      window.location.href = window.Auth?.resolvePath?.("admin/index.html") || "admin/index.html";
      return;
    }

    const userCardMount = page.querySelector("[data-dashboard-user-card]");
    const contentMount = page.querySelector("[data-dashboard-content]");
    const navMount = page.querySelector("[data-dashboard-nav]");
    const mobileNavMount = document.querySelector("[data-dashboard-mobile-nav]");
    const logoutButton = page.querySelector("[data-dashboard-logout]");

    if (!(contentMount instanceof HTMLElement) || !(userCardMount instanceof HTMLElement)) {
      return;
    }

    function rerender() {
      const user = getCurrentUser();
      if (!user) {
        return;
      }

      if (!(state.interestDraft instanceof Set)) {
        state.interestDraft = new Set(normalizeArray(user.categories));
      }

      userCardMount.innerHTML = renderSidebarUser(user);
      contentMount.innerHTML = renderTabContent(user);
      syncNavStates(navMount || page);
      syncNavStates(mobileNavMount || document);
      bindDynamicActions(contentMount, rerender);
      window.MakaUI?.initScrollAnimations?.();
    }

    bindStaticNav(page, rerender);
    bindStaticNav(document, rerender);

    if (logoutButton instanceof HTMLButtonElement) {
      logoutButton.addEventListener("click", () => {
        window.Auth?.logout?.({ redirectTo: "login.html", toast: true });
      });
    }

    document.addEventListener("auth:changed", () => {
      const nextUser = getCurrentUser();
      if (!nextUser) {
        window.location.href = window.Auth?.resolvePath?.("login.html") || "login.html";
        return;
      }

      if (nextUser.role === "admin") {
        window.location.href = window.Auth?.resolvePath?.("admin/index.html") || "admin/index.html";
        return;
      }

      if (!(state.interestDraft instanceof Set)) {
        state.interestDraft = new Set(normalizeArray(nextUser.categories));
      }

      rerender();
    });

    rerender();
  }

  onReady(initDashboardPage);
})();
