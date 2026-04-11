(() => {
  const MONTHS_KA = [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ];

  const SLOT_OPTIONS = ["10:00", "11:00", "13:00", "15:00", "16:00", "18:00"];

  const THERAPY_TYPES = {
    individual: {
      key: "individual",
      label: "ინდივიდუალური თერაპია",
      description: "1-on-1 სესია",
      duration: "50 წთ",
      price: 80,
      priceLabel: "₾80/სესია",
    },
    group: {
      key: "group",
      label: "ჯგუფური თერაპია",
      description: "4-8 ადამიანი",
      duration: "90 წთ",
      price: 40,
      priceLabel: "₾40/ადამიანი",
    },
  };

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function stripTime(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function formatMonth(date) {
    return `${MONTHS_KA[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatDateLabel(date) {
    if (!date) {
      return "აირჩიე თარიღი";
    }

    return `${date.getDate()} ${MONTHS_KA[date.getMonth()]} ${date.getFullYear()}`;
  }

  function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function isSameDay(left, right) {
    if (!left || !right) {
      return false;
    }

    return (
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate()
    );
  }

  function getMondayOffset(dayIndex) {
    return (dayIndex + 6) % 7;
  }

  function isPastDate(date, today) {
    return stripTime(date) < stripTime(today);
  }

  function isDateAvailable(date, today) {
    if (isPastDate(date, today)) {
      return false;
    }

    const weekday = date.getDay();
    if (weekday === 0) {
      return false;
    }

    const seed = date.getDate() + date.getMonth() * 3;
    if (weekday === 4) {
      return seed % 2 === 0;
    }

    return seed % 4 !== 0;
  }

  function createCalendarController(root) {
    const monthTitle = root.querySelector("[data-calendar-month]");
    const grid = root.querySelector("[data-calendar-grid]");
    const slotsGrid = root.querySelector("[data-slots-grid]");
    const slotsTitle = root.querySelector("[data-slots-title]");
    const summaryDate = root.querySelector("[data-summary-date]");
    const summaryTime = root.querySelector("[data-summary-time]");
    const summaryType = root.querySelector("[data-summary-type]");
    const summaryPrice = root.querySelector("[data-summary-price]");
    const summaryDuration = root.querySelector("[data-summary-duration]");
    const summaryStatus = root.querySelector("[data-summary-status]");
    const summaryPlaceholder = root.querySelector("[data-summary-placeholder]");
    const summaryContent = root.querySelector("[data-summary-content]");
    const summaryNote = root.querySelector("[data-summary-note]");
    const payButton = root.querySelector("[data-open-payment]");
    const typeButtons = [...root.querySelectorAll("[data-therapy-type]")];
    const prevButton = root.querySelector("[data-calendar-prev]");
    const nextButton = root.querySelector("[data-calendar-next]");
    const today = stripTime(new Date());
    const params = new URLSearchParams(window.location.search);
    const initialType = params.get("type") === "group" ? "group" : "individual";
    const state = {
      month: new Date(today.getFullYear(), today.getMonth(), 1),
      typeKey: initialType,
      selectedDate: null,
      selectedTime: "",
    };

    function emitChange() {
      document.dispatchEvent(new CustomEvent("therapy:booking-change", { detail: api.getState() }));
    }

    function renderTypeCards() {
      typeButtons.forEach((button) => {
        const isSelected = button.dataset.therapyType === state.typeKey;
        button.classList.toggle("is-selected", isSelected);
        button.setAttribute("aria-pressed", String(isSelected));
      });
    }

    function renderSummary() {
      const type = THERAPY_TYPES[state.typeKey];
      const currentUser = window.Auth?.getCurrentUser?.() || null;
      const hasSelection = Boolean(state.selectedDate);
      const isReady = Boolean(state.selectedDate && state.selectedTime);

      if (summaryPlaceholder instanceof HTMLElement) {
        summaryPlaceholder.hidden = hasSelection;
      }

      if (summaryContent instanceof HTMLElement) {
        summaryContent.hidden = !hasSelection;
      }

      if (summaryDate) {
        summaryDate.textContent = hasSelection ? formatDateLabel(state.selectedDate) : "აირჩიე თარიღი";
      }

      if (summaryTime) {
        summaryTime.textContent = state.selectedTime || "აირჩიე დრო";
      }

      if (summaryType) {
        summaryType.textContent = type.label;
      }

      if (summaryDuration) {
        summaryDuration.textContent = type.duration;
      }

      if (summaryPrice) {
        summaryPrice.textContent = `₾${type.price}`;
      }

      if (summaryStatus) {
        summaryStatus.textContent = hasSelection ? "ხელმისაწვდომია" : "აირჩიე დღე";
      }

      if (summaryNote) {
        if (!hasSelection) {
          summaryNote.textContent = "აირჩიე თარიღი, რომ დაჯავშნა გააქტიურდეს.";
        } else if (currentUser) {
          summaryNote.textContent = `ჯავშანი შენს ანგარიშზე შეინახება: ${currentUser.email}`;
        } else {
          summaryNote.textContent = "დაჯავშნის დასასრულებლად საჭირო იქნება შესვლა.";
        }
      }

      if (payButton instanceof HTMLButtonElement) {
        payButton.disabled = !isReady;
      }
    }

    function renderSlots() {
      if (!(slotsGrid instanceof HTMLElement)) {
        return;
      }

      slotsGrid.innerHTML = "";

      if (!state.selectedDate) {
        if (slotsTitle) {
          slotsTitle.textContent = "აირჩიე დრო";
        }

        slotsGrid.innerHTML = '<div class="calendar-empty">ჯერ თარიღი არ არის არჩეული.</div>';
        return;
      }

      if (slotsTitle) {
        slotsTitle.textContent = `${formatDateLabel(state.selectedDate)} — დრო`;
      }

      SLOT_OPTIONS.forEach((slot) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `slot-chip${state.selectedTime === slot ? " is-selected" : ""}`;
        button.textContent = slot;
        button.addEventListener("click", () => {
          state.selectedTime = slot;
          renderSlots();
          renderSummary();
          emitChange();
        });
        slotsGrid.append(button);
      });
    }

    function renderCalendar() {
      if (!(grid instanceof HTMLElement)) {
        return;
      }

      const currentMonth = new Date(state.month.getFullYear(), state.month.getMonth(), 1);
      const firstDayIndex = getMondayOffset(currentMonth.getDay());
      const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();

      if (monthTitle) {
        monthTitle.textContent = formatMonth(currentMonth);
      }

      grid.innerHTML = "";

      for (let index = 0; index < firstDayIndex; index += 1) {
        const placeholder = document.createElement("div");
        placeholder.className = "calendar-day is-placeholder";
        grid.append(placeholder);
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const available = isDateAvailable(date, today);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "calendar-day";

        if (available) {
          button.classList.add("is-available");
        } else {
          button.classList.add("is-disabled");
          button.disabled = true;
        }

        if (isSameDay(date, today)) {
          button.classList.add("is-today");
        }

        if (isSameDay(date, state.selectedDate)) {
          button.classList.add("is-selected");
        }

        button.innerHTML = `
          <span class="calendar-day__number">${day}</span>
          <span class="calendar-day__dot" aria-hidden="true"></span>
        `;

        if (available) {
          button.addEventListener("click", () => {
            state.selectedDate = date;
            state.selectedTime = SLOT_OPTIONS[0];
            renderCalendar();
            renderSlots();
            renderSummary();
            emitChange();
          });
        }

        grid.append(button);
      }
    }

    function setType(typeKey) {
      if (!THERAPY_TYPES[typeKey]) {
        return;
      }

      state.typeKey = typeKey;

      if (state.selectedDate && !state.selectedTime) {
        state.selectedTime = SLOT_OPTIONS[0];
      }

      renderTypeCards();
      renderSummary();
      renderSlots();
      emitChange();
    }

    typeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setType(button.dataset.therapyType || "individual");
      });
    });

    prevButton?.addEventListener("click", () => {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() - 1, 1);
      renderCalendar();
    });

    nextButton?.addEventListener("click", () => {
      state.month = new Date(state.month.getFullYear(), state.month.getMonth() + 1, 1);
      renderCalendar();
    });

    const api = {
      getState() {
        const type = THERAPY_TYPES[state.typeKey];
        return {
          typeKey: state.typeKey,
          type,
          selectedDate: state.selectedDate ? toIsoDate(state.selectedDate) : "",
          selectedDateLabel: state.selectedDate ? formatDateLabel(state.selectedDate) : "აირჩიე თარიღი",
          selectedTime: state.selectedTime,
          price: type.price,
          ready: Boolean(state.selectedDate && state.selectedTime),
        };
      },
      resetTime() {
        state.selectedTime = "";
        renderSlots();
        renderSummary();
        emitChange();
      },
      initialize() {
        renderTypeCards();
        renderCalendar();
        renderSlots();
        renderSummary();
        emitChange();
      },
    };

    return api;
  }

  function init() {
    const root = document.querySelector("[data-therapy-page]");

    if (!root) {
      return;
    }

    const controller = createCalendarController(root);
    window.MakaTherapyBooking = controller;
    controller.initialize();
  }

  onReady(init);
})();
