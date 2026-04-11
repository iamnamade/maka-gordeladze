(() => {
  const STORAGE_KEYS = {
    users: "users",
    courses: "courses",
    bookings: "bookings",
    currentUser: "currentUser",
  };
  let initialDataSeeded = false;
  let seedInProgress = false;
  let lastAuthSnapshot = "__unset__";

  const DEFAULT_USERS = [
    {
      id: "admin-001",
      name: "ადმინი",
      surname: "სისტემა",
      email: "admin@test.ge",
      password: "admin123",
      role: "admin",
      phone: "",
      categories: ["ადმინისტრირება"],
      createdAt: "2026-01-01T10:00:00.000Z",
      enrolledCourses: [],
      bookings: [],
      taskUploads: [],
      lessonSubmissions: [],
      lessonComments: [],
      reviews: [],
    },
    {
      id: "user-001",
      name: "ნინო",
      surname: "გორდელაძე",
      email: "user@test.ge",
      password: "test123",
      role: "user",
      phone: "",
      categories: ["ფსიქოლოგია", "კომუნიკაცია"],
      createdAt: "2026-01-02T09:30:00.000Z",
      enrolledCourses: [],
      bookings: [],
      taskUploads: [],
      lessonSubmissions: [],
      lessonComments: [],
      reviews: [],
    },
  ];

  function canUseStorage() {
    try {
      const key = "__maka_test__";
      window.localStorage.setItem(key, "1");
      window.localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function safeParse(value, fallback) {
    if (!value) {
      return fallback;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      return fallback;
    }
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function uid(prefix = "item") {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function normalizeUser(rawUser = {}) {
    return {
      id: rawUser.id || uid("user"),
      name: String(rawUser.name || "").trim(),
      surname: String(rawUser.surname || "").trim(),
      email: String(rawUser.email || "").trim().toLowerCase(),
      password: String(rawUser.password || ""),
      role: rawUser.role === "admin" ? "admin" : "user",
      phone: String(rawUser.phone || "").trim(),
      categories: normalizeArray(rawUser.categories),
      createdAt: rawUser.createdAt || new Date().toISOString(),
      enrolledCourses: normalizeArray(rawUser.enrolledCourses),
      bookings: normalizeArray(rawUser.bookings),
      taskUploads: normalizeArray(rawUser.taskUploads),
      lessonSubmissions: normalizeArray(rawUser.lessonSubmissions),
      lessonComments: normalizeArray(rawUser.lessonComments),
      reviews: normalizeArray(rawUser.reviews),
    };
  }

  function readStorageValue(key, fallback) {
    if (!canUseStorage()) {
      return clone(fallback);
    }

    return safeParse(window.localStorage.getItem(key), clone(fallback));
  }

  function writeStorageValue(key, value) {
    if (!canUseStorage()) {
      return value;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
    return value;
  }

  function readUsers() {
    return readStorageValue(STORAGE_KEYS.users, []).map(normalizeUser);
  }

  function readCurrentUserRaw() {
    return safeParse(window.localStorage.getItem(STORAGE_KEYS.currentUser), null);
  }

  function getAuthSnapshot(user) {
    return user ? `${user.id}|${user.email}|${user.role}` : "guest";
  }

  function emitAuthChange(user, options = {}) {
    document.documentElement.dataset.authState = user ? "authenticated" : "guest";
    document.documentElement.dataset.authRole = user?.role || "guest";

    const nextSnapshot = getAuthSnapshot(user);
    if (!options.force && nextSnapshot === lastAuthSnapshot) {
      return;
    }

    lastAuthSnapshot = nextSnapshot;
    document.dispatchEvent(new CustomEvent("auth:changed", { detail: { user } }));
  }

  function showAuthToast(message, type = "info") {
    if (window.MakaUI?.showToast) {
      window.MakaUI.showToast(message, type);
    }
  }

  function seedInitialData() {
    if (!canUseStorage()) {
      return { ok: false, reason: "storage-unavailable" };
    }

    if (seedInProgress) {
      return { ok: true, pending: true };
    }

    if (initialDataSeeded) {
      return { ok: true, cached: true };
    }

    seedInProgress = true;

    try {
      const users = readUsers();
      const bookings = readStorageValue(STORAGE_KEYS.bookings, []);
      const courses = readStorageValue(STORAGE_KEYS.courses, []);

      if (!users.length) {
        writeStorageValue(STORAGE_KEYS.users, DEFAULT_USERS.map(normalizeUser));
      } else {
        writeStorageValue(STORAGE_KEYS.users, users.map(normalizeUser));
      }

      if (!Array.isArray(bookings)) {
        writeStorageValue(STORAGE_KEYS.bookings, []);
      }

      if (!Array.isArray(courses)) {
        writeStorageValue(STORAGE_KEYS.courses, []);
      }

      const current = readCurrentUserRaw();
      if (current) {
        const fresh =
          readUsers().find((user) => user.id === current.id) ||
          readUsers().find((user) => user.email === current.email) ||
          null;

        if (fresh) {
          writeStorageValue(STORAGE_KEYS.currentUser, fresh);
          emitAuthChange(fresh, { force: true });
        } else {
          window.localStorage.removeItem(STORAGE_KEYS.currentUser);
          emitAuthChange(null, { force: true });
        }
      } else {
        emitAuthChange(null, { force: true });
      }

      initialDataSeeded = true;
      return { ok: true };
    } finally {
      seedInProgress = false;
    }
  }

  function getUsers() {
    seedInitialData();
    return readUsers();
  }

  function saveUsers(users) {
    return writeStorageValue(STORAGE_KEYS.users, users.map(normalizeUser));
  }

  function findUserByEmail(email) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    return getUsers().find((user) => user.email === normalizedEmail) || null;
  }

  function findUserById(id) {
    return getUsers().find((user) => user.id === id) || null;
  }

  function setCurrentUser(user) {
    const normalized = user ? normalizeUser(user) : null;

    if (!normalized) {
      window.localStorage.removeItem(STORAGE_KEYS.currentUser);
      emitAuthChange(null);
      return null;
    }

    writeStorageValue(STORAGE_KEYS.currentUser, normalized);
    emitAuthChange(normalized);
    return normalized;
  }

  function getCurrentUser() {
    seedInitialData();
    return readCurrentUserRaw();
  }

  function syncCurrentUser() {
    seedInitialData();
    return readCurrentUserRaw();
  }

  function register(payload = {}) {
    seedInitialData();
    const name = String(payload.name || "").trim();
    const surname = String(payload.surname || "").trim();
    const email = String(payload.email || "").trim().toLowerCase();
    const password = String(payload.password || "");
    const confirmPassword = String(payload.confirmPassword ?? payload.password ?? "");

    if (!name || !surname || !email || !password) {
      return { ok: false, message: "გთხოვთ შეავსოთ ყველა აუცილებელი ველი." };
    }

    if (!email.includes("@") || !email.includes(".")) {
      return { ok: false, message: "ელ-ფოსტის ფორმატი არასწორია." };
    }

    if (password.length < 6) {
      return { ok: false, message: "პაროლი მინიმუმ 6 სიმბოლოს უნდა შეიცავდეს." };
    }

    if (password !== confirmPassword) {
      return { ok: false, message: "პაროლები არ ემთხვევა." };
    }

    if (findUserByEmail(email)) {
      return { ok: false, message: "ამ ელ-ფოსტით მომხმარებელი უკვე არსებობს." };
    }

    const user = normalizeUser({
      id: uid("user"),
      name,
      surname,
      email,
      password,
      phone: String(payload.phone || "").trim(),
      role: payload.role === "admin" ? "admin" : "user",
      categories: normalizeArray(payload.categories),
      createdAt: new Date().toISOString(),
      enrolledCourses: [],
      bookings: [],
      taskUploads: [],
      lessonSubmissions: [],
      lessonComments: [],
      reviews: [],
    });

    const users = getUsers();
    users.push(user);
    saveUsers(users);
    setCurrentUser(user);

    return {
      ok: true,
      user,
      message: "რეგისტრაცია წარმატებით დასრულდა.",
    };
  }

  function login(email, password) {
    seedInitialData();
    const user = findUserByEmail(email);

    if (!user || user.password !== String(password || "")) {
      return { ok: false, message: "ელ-ფოსტა ან პაროლი არასწორია." };
    }

    setCurrentUser(user);
    return {
      ok: true,
      user,
      message: "შესვლა წარმატებით შესრულდა.",
    };
  }

  function logout(options = {}) {
    if (canUseStorage()) {
      window.localStorage.removeItem(STORAGE_KEYS.currentUser);
    }

    emitAuthChange(null);

    if (options.toast !== false) {
      showAuthToast("სესიიდან გამოხვედით.", "info");
    }

    if (options.redirectTo) {
      window.location.href = resolvePath(options.redirectTo);
    }

    return { ok: true };
  }

  function updateUser(updatedUser) {
    const normalized = normalizeUser(updatedUser);
    const users = getUsers();
    const index = users.findIndex((user) => user.id === normalized.id);

    if (index === -1) {
      return null;
    }

    users[index] = normalized;
    saveUsers(users);

    const current = getCurrentUser();
    if (current && current.id === normalized.id) {
      setCurrentUser(normalized);
    }

    return normalized;
  }

  function updateCurrentUser(updates = {}) {
    const current = getCurrentUser();

    if (!current) {
      return null;
    }

    return updateUser({ ...current, ...updates });
  }

  function addBookingToCurrentUser(booking) {
    const current = getCurrentUser();

    if (!current) {
      return { ok: false, message: "მომხმარებელი ავტორიზებული არ არის." };
    }

    const normalizedBooking = {
      id: booking.id || uid("booking"),
      type: booking.type || "",
      date: booking.date || "",
      time: booking.time || "",
      price: Number(booking.price || 0),
      status: booking.status || "pending",
    };

    const updatedUser = updateCurrentUser({
      bookings: [...normalizeArray(current.bookings), normalizedBooking],
    });

    const allBookings = readStorageValue(STORAGE_KEYS.bookings, []);
    allBookings.push({
      ...normalizedBooking,
      userId: current.id,
      userName: `${current.name} ${current.surname}`.trim(),
      userEmail: current.email,
    });
    writeStorageValue(STORAGE_KEYS.bookings, allBookings);

    return { ok: true, booking: normalizedBooking, user: updatedUser };
  }

  function resolvePath(path) {
    if (!path) {
      return "";
    }

    if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/")) {
      return path;
    }

    const normalizedPath = window.location.pathname.replace(/\\/g, "/");
    const inAdminDirectory = normalizedPath.includes("/admin/");

    if (inAdminDirectory && !path.startsWith("../")) {
      return `../${path}`;
    }

    return path;
  }

  function guardRoute(options = {}) {
    seedInitialData();
    const current = getCurrentUser();
    const requireAdminRole = Boolean(options.requireAdmin);
    const redirectTo = options.redirectTo || "login.html";

    if (!current) {
      if (options.redirect !== false) {
        window.location.href = resolvePath(redirectTo);
      }
      return false;
    }

    if (requireAdminRole && current.role !== "admin") {
      showAuthToast("ამ გვერდზე წვდომა მხოლოდ ადმინისტრატორს აქვს.", "error");
      if (options.redirect !== false) {
        window.location.href = resolvePath(redirectTo);
      }
      return false;
    }

    return true;
  }

  function requireAuth(redirectTo = "login.html") {
    return guardRoute({ redirectTo, requireAdmin: false });
  }

  function requireAdmin(redirectTo = "login.html") {
    return guardRoute({ redirectTo, requireAdmin: true });
  }

  function isAuthenticated() {
    return Boolean(getCurrentUser());
  }

  function isAdmin() {
    return getCurrentUser()?.role === "admin";
  }

  function simulateGoogleAuth(options = {}) {
    const nameInput = window.prompt("შეიყვანეთ თქვენი სახელი Google-ით შესასვლელად:", "მარიამი");

    if (!nameInput) {
      return { ok: false, message: "Google ავტორიზაცია გაუქმდა." };
    }

    const emailInput = window.prompt("შეიყვანეთ თქვენი Google ელ-ფოსტა:", "google@test.ge");

    if (!emailInput) {
      return { ok: false, message: "Google ავტორიზაცია გაუქმდა." };
    }

    const existing = findUserByEmail(emailInput);

    if (existing) {
      setCurrentUser(existing);
      return {
        ok: true,
        user: existing,
        message: "Google-ით შესვლა წარმატებით შესრულდა.",
      };
    }

    const generatedPassword = uid("google");
    const parts = nameInput.trim().split(/\s+/);
    const result = register({
      name: parts[0] || "მომხმარებელი",
      surname: parts.slice(1).join(" ") || "Google",
      email: emailInput.trim().toLowerCase(),
      password: generatedPassword,
      confirmPassword: generatedPassword,
      categories: normalizeArray(options.categories),
      role: "user",
    });

    if (result.ok) {
      result.message = "Google-ით რეგისტრაცია წარმატებით დასრულდა.";
    }

    return result;
  }

  function getPostAuthRedirect(user) {
    return user?.role === "admin" ? resolvePath("admin/index.html") : resolvePath("dashboard.html");
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    });

    form.querySelectorAll("[data-error-for]").forEach((element) => {
      element.textContent = "";
    });
  }

  function setFieldError(form, fieldName, message) {
    const field = form.elements.namedItem(fieldName);
    if (field instanceof HTMLElement) {
      field.classList.add("is-invalid");
      field.setAttribute("aria-invalid", "true");
    }

    const error = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (error) {
      error.textContent = message;
    }
  }

  function clearFieldInvalidState(form, fieldName) {
    const field = form.elements.namedItem(fieldName);
    if (field instanceof HTMLElement) {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    }
  }

  function setStatus(element, message, type = "") {
    if (!element) {
      return;
    }

    element.textContent = message || "";
    element.classList.remove("is-error", "is-success");

    if (type === "error") {
      element.classList.add("is-error");
    }

    if (type === "success") {
      element.classList.add("is-success");
    }
  }

  function initPasswordToggles(root = document) {
    const eyeIcon =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"></path><circle cx="12" cy="12" r="3.5"></circle></svg>';
    const eyeOffIcon =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4.5 21 19.5"></path><path d="M10.2 8.1A6.5 6.5 0 0 1 12 7.9c6.5 0 10.5 4.1 10.5 4.1s-1.5 1.9-4.2 3.3"></path><path d="M6.4 6.4C3.4 8.1 1.5 12 1.5 12s4 7 10.5 7c1.7 0 3.2-.3 4.5-.8"></path><path d="M14.6 14.6A3.5 3.5 0 0 1 9.4 9.4"></path></svg>';

    root.querySelectorAll("[data-password-toggle]").forEach((button) => {
      if (button.dataset.bound === "true") {
        return;
      }

      button.dataset.bound = "true";
      button.addEventListener("click", () => {
        const inputId = button.dataset.passwordToggle;
        const input = root.querySelector(`#${inputId}`);

        if (!(input instanceof HTMLInputElement)) {
          return;
        }

        const nextType = input.type === "password" ? "text" : "password";
        input.type = nextType;
        button.setAttribute("aria-pressed", String(nextType === "text"));
        const iconSlot = button.querySelector("[data-password-toggle-icon]");
        if (iconSlot) {
          iconSlot.innerHTML = nextType === "text" ? eyeOffIcon : eyeIcon;
        }
      });
    });
  }

  function validateRegisterCredentials(form) {
    clearFieldErrors(form);
    const values = {
      name: String(form.elements.name?.value || "").trim(),
      surname: String(form.elements.surname?.value || "").trim(),
      email: String(form.elements.email?.value || "").trim().toLowerCase(),
      password: String(form.elements.password?.value || ""),
      confirmPassword: String(form.elements.confirmPassword?.value || ""),
    };
    let isValid = true;

    if (!values.name) {
      setFieldError(form, "name", "სახელი სავალდებულოა.");
      isValid = false;
    }

    if (!values.surname) {
      setFieldError(form, "surname", "გვარი სავალდებულოა.");
      isValid = false;
    }

    if (!values.email) {
      setFieldError(form, "email", "ელ-ფოსტა სავალდებულოა.");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      setFieldError(form, "email", "ელ-ფოსტის ფორმატი არასწორია.");
      isValid = false;
    } else if (findUserByEmail(values.email)) {
      setFieldError(form, "email", "ამ ელ-ფოსტით ანგარიში უკვე არსებობს.");
      isValid = false;
    }

    if (!values.password) {
      setFieldError(form, "password", "პაროლი სავალდებულოა.");
      isValid = false;
    } else if (values.password.length < 6) {
      setFieldError(form, "password", "პაროლი მინიმუმ 6 სიმბოლოს უნდა შეიცავდეს.");
      isValid = false;
    }

    if (!values.confirmPassword) {
      setFieldError(form, "confirmPassword", "გაიმეორეთ პაროლი.");
      isValid = false;
    } else if (values.password !== values.confirmPassword) {
      setFieldError(form, "confirmPassword", "პაროლები არ ემთხვევა.");
      isValid = false;
    }

    return { isValid, values };
  }

  function validateLoginForm(form) {
    clearFieldErrors(form);
    const values = {
      email: String(form.elements.email?.value || "").trim().toLowerCase(),
      password: String(form.elements.password?.value || ""),
    };
    let isValid = true;

    if (!values.email) {
      setFieldError(form, "email", "ელ-ფოსტა სავალდებულოა.");
      isValid = false;
    }

    if (!values.password) {
      setFieldError(form, "password", "პაროლი სავალდებულოა.");
      isValid = false;
    }

    return { isValid, values };
  }

  function initRegisterPage() {
    const page = document.querySelector("[data-register-page]");

    if (!page) {
      return;
    }

    const form = page.querySelector("[data-register-form]");
    const stepPanels = {
      1: page.querySelector('[data-register-panel="1"]'),
      2: page.querySelector('[data-register-panel="2"]'),
    };
    const stepItems = [...page.querySelectorAll("[data-register-step-item]")];
    const backButton = page.querySelector("[data-register-back]");
    const googleButton = page.querySelector("[data-google-register]");
    const status = page.querySelector("[data-register-status]");
    const selectionError = page.querySelector("[data-selection-error]");
    const interestButtons = [...page.querySelectorAll("[data-interest-option]")];
    const passwordInput = form.querySelector("#register-password");
    const strengthMeter = form.querySelector("[data-password-strength]");
    const strengthLabel = form.querySelector("[data-strength-label]");
    let currentStep = 1;
    let draftValues = null;

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    const selectedCategories = new Set();
    const hasInterestStep = Boolean(stepPanels[2]) && interestButtons.length > 0;

    function getPasswordStrength(value) {
      const length = value.length;
      const hasNumber = /\d/.test(value);
      const hasSymbol = /[^a-zA-Z0-9]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasMixed = hasLower && hasUpper;

      if (!length) return { level: "", label: "" };
      if (length <= 2) return { level: "is-weak", label: "სუსტი" };
      if (length >= 12 && hasNumber && hasSymbol && hasMixed) return { level: "is-very-strong", label: "ძალიან ძლიერი" };
      if (length >= 8 && hasNumber && hasSymbol) return { level: "is-strong", label: "ძლიერი" };
      if (length >= 5 && length <= 7 && hasNumber) return { level: "is-medium", label: "საშუალო" };
      return { level: "is-weak", label: "სუსტი" };
    }

    function updateStrengthMeter() {
      if (!(strengthMeter instanceof HTMLElement) || !(passwordInput instanceof HTMLInputElement)) {
        return;
      }

      const { level, label } = getPasswordStrength(passwordInput.value);
      strengthMeter.classList.remove("is-weak", "is-medium", "is-strong", "is-very-strong");
      if (level) {
        strengthMeter.classList.add(level);
      }
      if (strengthLabel) {
        strengthLabel.textContent = label;
      }
    }

    passwordInput?.addEventListener("input", updateStrengthMeter);
    updateStrengthMeter();

    function updateStep(step) {
      currentStep = step;
      if (!hasInterestStep) {
        setStatus(status, "", "");
        return;
      }

      Object.entries(stepPanels).forEach(([panelStep, panel]) => {
        panel?.classList.toggle("is-active", Number(panelStep) === step);
      });

      stepItems.forEach((item) => {
        const itemStep = Number(item.dataset.registerStepItem);
        item.classList.toggle("is-active", itemStep === step);
        item.classList.toggle("is-complete", itemStep < step);
      });

      backButton?.classList.toggle("hide", step === 1);
      setStatus(selectionError, "", "");
      setStatus(status, "", "");
    }

    interestButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const value = button.dataset.interestOption || "";
        if (!value) {
          return;
        }

        if (selectedCategories.has(value)) {
          selectedCategories.delete(value);
        } else {
          selectedCategories.add(value);
        }

        button.classList.toggle("is-selected", selectedCategories.has(value));
        button.setAttribute("aria-pressed", String(selectedCategories.has(value)));
        setStatus(selectionError, "", "");
      });
    });

    backButton?.addEventListener("click", () => {
      if (hasInterestStep) {
        updateStep(1);
      }
    });

    googleButton?.addEventListener("click", () => {
      const result = simulateGoogleAuth();
      if (!result.ok) {
        showAuthToast(result.message, "info");
        return;
      }

      showAuthToast(result.message, "success");
      window.setTimeout(() => {
        window.location.href = getPostAuthRedirect(result.user);
      }, 450);
    });

    form.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      clearFieldInvalidState(form, target.name);
      const error = form.querySelector(`[data-error-for="${target.name}"]`);
      if (error) {
        error.textContent = "";
      }
      setStatus(status, "", "");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const validation = validateRegisterCredentials(form);
      if (!validation.isValid) {
        setStatus(status, "გთხოვთ გაასწოროთ მონიშნული ველები.", "error");
        return;
      }

      if (!hasInterestStep) {
        const result = register(validation.values);

        if (!result.ok) {
          setStatus(status, result.message, "error");
          showAuthToast(result.message, "error");
          return;
        }

        setStatus(status, result.message, "success");
        showAuthToast(result.message, "success");
        window.setTimeout(() => {
          window.location.href = getPostAuthRedirect(result.user);
        }, 500);
        return;
      }

      if (currentStep === 1) {
        draftValues = validation.values;
        updateStep(2);
        return;
      }

      if (!draftValues) {
        updateStep(1);
        return;
      }

      if (!selectedCategories.size) {
        setStatus(selectionError, "აირჩიე მინიმუმ ერთი საინტერესო სფერო.", "error");
        return;
      }

      const result = register({
        ...draftValues,
        categories: [...selectedCategories],
      });

      if (!result.ok) {
        setStatus(status, result.message, "error");
        showAuthToast(result.message, "error");
        return;
      }

      setStatus(status, result.message, "success");
      showAuthToast(result.message, "success");
      window.setTimeout(() => {
        window.location.href = getPostAuthRedirect(result.user);
      }, 500);
    });

    updateStep(1);
  }

  function initLoginPage() {
    const page = document.querySelector("[data-login-page]");

    if (!page) {
      return;
    }

    const form = page.querySelector("[data-login-form]");
    const googleButton = page.querySelector("[data-google-login]");
    const status = page.querySelector("[data-login-status]");
    const demoButtons = [...page.querySelectorAll("[data-fill-demo]")];

    if (!(form instanceof HTMLFormElement)) {
      return;
    }

    demoButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const role = button.dataset.fillDemo;
        if (role === "admin") {
          form.elements.email.value = "admin@test.ge";
          form.elements.password.value = "admin123";
        } else {
          form.elements.email.value = "user@test.ge";
          form.elements.password.value = "test123";
        }
        setStatus(status, "", "");
      });
    });

    googleButton?.addEventListener("click", () => {
      const result = simulateGoogleAuth();
      if (!result.ok) {
        showAuthToast(result.message, "info");
        return;
      }

      showAuthToast(result.message, "success");
      window.setTimeout(() => {
        window.location.href = getPostAuthRedirect(result.user);
      }, 450);
    });

    form.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      clearFieldInvalidState(form, target.name);
      const error = form.querySelector(`[data-error-for="${target.name}"]`);
      if (error) {
        error.textContent = "";
      }
      setStatus(status, "", "");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const validation = validateLoginForm(form);

      if (!validation.isValid) {
        setStatus(status, "გთხოვთ შეავსოთ ორივე ველი.", "error");
        return;
      }

      const result = login(validation.values.email, validation.values.password);
      if (!result.ok) {
        setStatus(status, result.message, "error");
        showAuthToast(result.message, "error");
        return;
      }

      setStatus(status, result.message, "success");
      showAuthToast(result.message, "success");
      window.setTimeout(() => {
        window.location.href = getPostAuthRedirect(result.user);
      }, 500);
    });
  }

  function initAuthPages() {
    initPasswordToggles(document);
    initRegisterPage();
    initLoginPage();
  }

  function init() {
    seedInitialData();
    window.MakaUI?.renderSiteChrome?.();
    window.MakaUI?.initStickyHeader?.();
    window.MakaUI?.initNewsletterForms?.();
    initAuthPages();
  }

  const Auth = {
    STORAGE_KEYS,
    seedInitialData,
    getUsers,
    saveUsers,
    findUserByEmail,
    findUserById,
    getCurrentUser,
    setCurrentUser,
    syncCurrentUser,
    register,
    login,
    logout,
    updateUser,
    updateCurrentUser,
    addBookingToCurrentUser,
    guardRoute,
    requireAuth,
    requireAdmin,
    isAuthenticated,
    isAdmin,
    simulateGoogleAuth,
    getPostAuthRedirect,
    resolvePath,
    initAuthPages,
  };

  window.Auth = Auth;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
