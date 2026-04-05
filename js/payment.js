(() => {
  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }

    callback();
  }

  function getBookingState() {
    return window.MakaTherapyBooking?.getState?.() || null;
  }

  function stripDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function formatCardNumber(value) {
    return stripDigits(value)
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();
  }

  function formatExpiry(value) {
    const digits = stripDigits(value).slice(0, 4);
    if (digits.length < 3) {
      return digits;
    }
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
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

  function resetInvalidState(form) {
    form.querySelectorAll(".is-invalid").forEach((field) => {
      field.classList.remove("is-invalid");
      field.removeAttribute("aria-invalid");
    });
  }

  function invalidateField(field) {
    if (!(field instanceof HTMLElement)) {
      return;
    }

    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");
  }

  function validatePaymentForm(form) {
    resetInvalidState(form);
    const values = {
      name: String(form.elements.name?.value || "").trim(),
      surname: String(form.elements.surname?.value || "").trim(),
      cardNumber: formatCardNumber(form.elements.cardNumber?.value || ""),
      expiry: formatExpiry(form.elements.expiry?.value || ""),
      cvv: stripDigits(form.elements.cvv?.value || "").slice(0, 3),
    };
    let isValid = true;

    if (!values.name) {
      invalidateField(form.elements.name);
      isValid = false;
    }

    if (!values.surname) {
      invalidateField(form.elements.surname);
      isValid = false;
    }

    if (stripDigits(values.cardNumber).length !== 16) {
      invalidateField(form.elements.cardNumber);
      isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry)) {
      invalidateField(form.elements.expiry);
      isValid = false;
    }

    if (values.cvv.length < 3) {
      invalidateField(form.elements.cvv);
      isValid = false;
    }

    return { isValid, values };
  }

  function init() {
    const page = document.querySelector("[data-therapy-page]");

    if (!page) {
      return;
    }

    const openButton = page.querySelector("[data-open-payment]");
    const modal = document.getElementById("payment-modal");
    const form = modal?.querySelector("[data-payment-form]");
    const paymentEntry = modal?.querySelector("[data-payment-entry]");
    const confirmation = modal?.querySelector("[data-payment-confirmation]");
    const footer = modal?.querySelector(".modal__footer");
    const submitButton = modal?.querySelector("[data-payment-submit]");
    const status = modal?.querySelector("[data-payment-status]");
    const dashboardLink = modal?.querySelector("[data-payment-dashboard]");
    const cardNumberInput = modal?.querySelector('input[name="cardNumber"]');
    const expiryInput = modal?.querySelector('input[name="expiry"]');
    const cvvInput = modal?.querySelector('input[name="cvv"]');
    const previewName = modal?.querySelector("[data-card-preview-name]");
    const previewNumber = modal?.querySelector("[data-card-preview-number]");
    const previewExpiry = modal?.querySelector("[data-card-preview-expiry]");
    const modalType = modal?.querySelector("[data-modal-type]");
    const modalDate = modal?.querySelector("[data-modal-date]");
    const modalTime = modal?.querySelector("[data-modal-time]");
    const modalTotal = modal?.querySelector("[data-modal-total]");
    const confirmType = modal?.querySelector("[data-confirm-type]");
    const confirmDate = modal?.querySelector("[data-confirm-date]");
    const confirmTime = modal?.querySelector("[data-confirm-time]");

    if (!(openButton instanceof HTMLButtonElement) || !(modal instanceof HTMLElement) || !(form instanceof HTMLFormElement)) {
      return;
    }

    function syncPreview() {
      if (previewName) {
        const name = String(form.elements.name?.value || "").trim();
        const surname = String(form.elements.surname?.value || "").trim();
        previewName.textContent = `${name || "სახელი"} ${surname || "გვარი"}`.trim();
      }

      if (previewNumber) {
        previewNumber.textContent = form.elements.cardNumber?.value || "0000 0000 0000 0000";
      }

      if (previewExpiry) {
        previewExpiry.textContent = form.elements.expiry?.value || "MM/YY";
      }
    }

    function resetModalState() {
      paymentEntry?.classList.remove("hide");
      confirmation?.classList.add("hide");
      footer?.classList.remove("hide");
      form.reset();
      resetInvalidState(form);
      setStatus(status, "", "");
      submitButton.disabled = false;
      submitButton.textContent = "გადახდა";

      const currentUser = window.Auth?.getCurrentUser?.();
      if (currentUser) {
        form.elements.name.value = currentUser.name || "";
        form.elements.surname.value = currentUser.surname || "";
      }

      syncPreview();
      updateModalSummary();
    }

    function updateModalSummary() {
      const booking = getBookingState();
      if (!booking) {
        return;
      }

      if (modalType) {
        modalType.textContent = booking.type.label;
      }

      if (modalDate) {
        modalDate.textContent = booking.selectedDateLabel || "არ არის არჩეული";
      }

      if (modalTime) {
        modalTime.textContent = booking.selectedTime || "აირჩიე დრო";
      }

      if (modalTotal) {
        modalTotal.textContent = `₾${booking.price}`;
      }

      if (submitButton && !submitButton.disabled) {
        submitButton.textContent = `გადახდა ₾${booking.price}`;
      }
    }

    function ensureAuthenticated() {
      const currentUser = window.Auth?.getCurrentUser?.();
      if (currentUser) {
        return currentUser;
      }

      window.MakaUI?.showToast?.("დაჯავშნის გასაგრძელებლად გაიარე შესვლა.", "info");
      window.setTimeout(() => {
        window.location.href = window.Auth?.resolvePath?.("login.html") || "login.html";
      }, 500);
      return null;
    }

    function openPaymentFlow() {
      const booking = getBookingState();

      if (!booking || !booking.ready) {
        window.MakaUI?.showToast?.("ჯერ აირჩიე თარიღი და დრო.", "error");
        return;
      }

      if (!ensureAuthenticated()) {
        return;
      }

      resetModalState();
      updateModalSummary();
      window.openModal(modal);
    }

    openButton.addEventListener("click", openPaymentFlow);

    document.addEventListener("therapy:booking-change", () => {
      updateModalSummary();
    });

    [form.elements.name, form.elements.surname].forEach((field) => {
      field?.addEventListener("input", syncPreview);
    });

    cardNumberInput?.addEventListener("input", () => {
      cardNumberInput.value = formatCardNumber(cardNumberInput.value);
      syncPreview();
    });

    expiryInput?.addEventListener("input", () => {
      expiryInput.value = formatExpiry(expiryInput.value);
      syncPreview();
    });

    cvvInput?.addEventListener("input", () => {
      cvvInput.value = stripDigits(cvvInput.value).slice(0, 3);
    });

    form.addEventListener("input", () => {
      setStatus(status, "", "");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const booking = getBookingState();
      const currentUser = ensureAuthenticated();

      if (!booking || !booking.ready || !currentUser) {
        return;
      }

      const validation = validatePaymentForm(form);

      if (!validation.isValid) {
        setStatus(status, "გთხოვთ შეავსო ყველა ველი სწორად.", "error");
        return;
      }

      setStatus(status, "მიმდინარეობს გადახდის დამუშავება...", "success");
      submitButton.disabled = true;
      submitButton.textContent = `გადახდა ₾${booking.price}`;

      window.setTimeout(() => {
        const result = window.Auth?.addBookingToCurrentUser?.({
          type: booking.type.label,
          date: booking.selectedDate,
          time: booking.selectedTime,
          price: booking.price,
          status: "confirmed",
        });

        if (!result?.ok) {
          submitButton.disabled = false;
          submitButton.textContent = "გადახდა";
          setStatus(status, result?.message || "შეცდომა დაფიქსირდა.", "error");
          return;
        }

        paymentEntry?.classList.add("hide");
        confirmation?.classList.remove("hide");
        footer?.classList.add("hide");
        if (confirmType) {
          confirmType.textContent = booking.type.label;
        }
        if (confirmDate) {
          confirmDate.textContent = booking.selectedDateLabel;
        }
        if (confirmTime) {
          confirmTime.textContent = booking.selectedTime;
        }
        if (dashboardLink instanceof HTMLAnchorElement) {
          dashboardLink.href = window.Auth?.resolvePath?.("dashboard.html") || "dashboard.html";
        }
        window.MakaTherapyBooking?.resetTime?.();
        window.MakaUI?.showToast?.("დაჯავშნა წარმატებით შესრულდა.", "success");
      }, 950);
    });

    updateModalSummary();
    syncPreview();
  }

  onReady(init);
})();
