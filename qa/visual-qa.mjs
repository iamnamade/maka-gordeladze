import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";
import { chromium, devices } from "playwright";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "qa-output");
const reportPath = path.join(outputDir, "report.json");

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const screenshots = [];
const consoleMessages = [];
const pageErrors = [];
const qaChecks = [];

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

function createStaticServer(baseDir) {
  return http.createServer((req, res) => {
    const url = new URL(req.url || "/", "http://localhost");
    let pathname = decodeURIComponent(url.pathname);

    if (pathname === "/") {
      pathname = "/index.html";
    }

    const safePath = path.normalize(path.join(baseDir, pathname));
    if (!safePath.startsWith(baseDir)) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    let filePath = safePath;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    const type = MIME_TYPES[extension] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type });
    fs.createReadStream(filePath).pipe(res);
  });
}

async function withServer(callback) {
  const server = createStaticServer(rootDir);
  await new Promise((resolve) => server.listen(4173, resolve));

  try {
    await callback("http://127.0.0.1:4173");
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function capture(page, name, options = {}) {
  const fileName = `${String(screenshots.length + 1).padStart(2, "0")}-${slugify(name)}.png`;
  const filePath = path.join(outputDir, fileName);

  if (options.scrollSelector) {
    await page.locator(options.scrollSelector).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
  }

  if (typeof options.before === "function") {
    await options.before();
  }

  await page.screenshot({
    path: filePath,
    fullPage: Boolean(options.fullPage),
  });

  screenshots.push({ name, path: filePath });
}

async function attachLogging(page, tag) {
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleMessages.push({ tag, text: message.text() });
    }
  });

  page.on("pageerror", (error) => {
    pageErrors.push({ tag, text: error.message });
  });
}

async function collectLayoutStats(page, tag) {
  const result = await page.evaluate(() => {
    const hasHorizontalOverflow = document.documentElement.scrollWidth > window.innerWidth + 1;
    const header = document.querySelector("[data-site-header] .site-header");
    const footer = document.querySelector("[data-site-footer] .site-footer");
    const colorStyles = getComputedStyle(document.documentElement);
    const images = [...document.images].map((img) => ({
      src: img.currentSrc || img.src,
      complete: img.complete,
      naturalWidth: img.naturalWidth,
      alt: img.alt,
    }));

    return {
      hasHorizontalOverflow,
      headerRendered: Boolean(header),
      footerRendered: Boolean(footer),
      colorPalette: {
        bg: colorStyles.getPropertyValue("--color-bg").trim(),
        bgAlt: colorStyles.getPropertyValue("--color-bg-alt").trim(),
        primary: colorStyles.getPropertyValue("--color-primary").trim(),
        primaryLt: colorStyles.getPropertyValue("--color-primary-lt").trim(),
        text: colorStyles.getPropertyValue("--color-text").trim(),
        muted: colorStyles.getPropertyValue("--color-text-muted").trim(),
      },
      brokenImages: images.filter((img) => img.complete && img.naturalWidth === 0),
    };
  });

  qaChecks.push({ tag, ...result });
}

async function setLoggedInUser(page) {
  await page.evaluate(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((entry) => entry.role === "user");
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    }
  });
}

async function testHomepage(baseUrl) {
  const browser = await chromium.launch({ headless: true });

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    await attachLogging(desktop, "home-desktop");
    await desktop.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle" });
    await desktop.waitForSelector(".site-header");
    await desktop.waitForSelector(".site-footer");
    await desktop.waitForTimeout(1200);

    await collectLayoutStats(desktop, "home-desktop");
    await capture(desktop, "home-desktop-top");
    await capture(desktop, "home-desktop-services", { scrollSelector: "#services" });
    await capture(desktop, "home-desktop-pricing", { scrollSelector: "#pricing" });
    await capture(desktop, "home-desktop-footer", {
      before: async () => {
        await desktop.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await desktop.waitForTimeout(400);
      },
    });

    await desktop.click("[data-hero-next]");
    await desktop.waitForTimeout(400);
    const activeSlideCount = await desktop.locator(".hero-slide.is-active").count();
    qaChecks.push({ tag: "home-desktop-slider", activeSlideCount });

    await desktop.click('[data-plan-button="yearly"]');
    await desktop.waitForTimeout(300);
    const yearlyPrice = await desktop.locator("[data-pricing-card]").first().locator("[data-price]").textContent();
    qaChecks.push({ tag: "home-desktop-pricing", yearlyStarterPrice: (yearlyPrice || "").trim() });

    const mobileContext = await browser.newContext({
      ...devices["iPhone 13"],
      locale: "ka-GE",
    });
    const mobile = await mobileContext.newPage();
    await attachLogging(mobile, "home-mobile");
    await mobile.goto(`${baseUrl}/index.html`, { waitUntil: "networkidle" });
    await mobile.waitForSelector(".site-header");
    await mobile.waitForTimeout(1000);

    await collectLayoutStats(mobile, "home-mobile");
    await capture(mobile, "home-mobile-top");
    await mobile.click("[data-nav-toggle]");
    await mobile.waitForTimeout(300);
    await capture(mobile, "home-mobile-menu");
    await mobile.click(".mobile-nav__header [data-nav-close]");
    await mobile.waitForTimeout(300);
    await capture(mobile, "home-mobile-services", { scrollSelector: "#services" });
    await capture(mobile, "home-mobile-footer", { scrollSelector: ".site-footer" });

    await mobileContext.close();
    await desktop.close();
  } finally {
    await browser.close();
  }
}

async function testRegister(baseUrl) {
  const browser = await chromium.launch({ headless: true });

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    await attachLogging(desktop, "register-desktop");
    await desktop.goto(`${baseUrl}/register.html`, { waitUntil: "networkidle" });
    await desktop.waitForSelector(".site-header");
    await collectLayoutStats(desktop, "register-desktop");
    await capture(desktop, "register-desktop-full", { fullPage: true });

    await desktop.fill("#register-name", "ანა");
    await desktop.fill("#register-surname", "გელაშვილი");
    await desktop.fill("#register-email", `ana-${Date.now()}@test.ge`);
    await desktop.fill("#register-password", "test123");
    await desktop.fill("#register-confirm-password", "test123");
    await desktop.click('button[type="submit"]');
    await desktop.waitForTimeout(400);
    const stepTwoVisible = await desktop.locator('[data-register-panel="2"].is-active').count();
    qaChecks.push({ tag: "register-desktop-step-flow", stepTwoVisible });
    await capture(desktop, "register-desktop-step2", { fullPage: true });

    const mobileContext = await browser.newContext({
      ...devices["iPhone 13"],
      locale: "ka-GE",
    });
    const mobile = await mobileContext.newPage();
    await attachLogging(mobile, "register-mobile");
    await mobile.goto(`${baseUrl}/register.html`, { waitUntil: "networkidle" });
    await mobile.waitForSelector(".site-header");
    await collectLayoutStats(mobile, "register-mobile");
    await capture(mobile, "register-mobile-top");
    await capture(mobile, "register-mobile-form", { scrollSelector: ".auth-card" });
    await mobileContext.close();
    await desktop.close();
  } finally {
    await browser.close();
  }
}

async function testLogin(baseUrl) {
  const browser = await chromium.launch({ headless: true });

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
    await attachLogging(desktop, "login-desktop");
    await desktop.goto(`${baseUrl}/login.html`, { waitUntil: "networkidle" });
    await desktop.waitForSelector(".site-header");
    await collectLayoutStats(desktop, "login-desktop");
    await capture(desktop, "login-desktop-full", { fullPage: true });

    const mobileContext = await browser.newContext({
      ...devices["iPhone 13"],
      locale: "ka-GE",
    });
    const mobile = await mobileContext.newPage();
    await attachLogging(mobile, "login-mobile");
    await mobile.goto(`${baseUrl}/login.html`, { waitUntil: "networkidle" });
    await mobile.waitForSelector(".site-header");
    await collectLayoutStats(mobile, "login-mobile");
    await capture(mobile, "login-mobile-top");
    await capture(mobile, "login-mobile-form", { scrollSelector: ".auth-card" });
    await mobileContext.close();
    await desktop.close();
  } finally {
    await browser.close();
  }
}

async function testTherapy(baseUrl) {
  const browser = await chromium.launch({ headless: true });

  try {
    const desktop = await browser.newPage({ viewport: { width: 1440, height: 1300 } });
    await attachLogging(desktop, "therapy-desktop");
    await desktop.goto(`${baseUrl}/therapy.html`, { waitUntil: "networkidle" });
    await desktop.waitForSelector(".site-header");
    await desktop.waitForTimeout(800);
    await setLoggedInUser(desktop);
    await desktop.reload({ waitUntil: "networkidle" });
    await desktop.waitForSelector("[data-therapy-page]");
    await collectLayoutStats(desktop, "therapy-desktop");
    await capture(desktop, "therapy-desktop-top");

    await desktop.click('[data-therapy-type="group"]');
    await desktop.click(".calendar-day:not(.is-disabled):not(.is-placeholder)");
    await desktop.waitForTimeout(300);
    await desktop.click(".slot-chip");
    await desktop.waitForTimeout(300);
    await capture(desktop, "therapy-desktop-selected", { scrollSelector: ".booking-layout" });

    const payDisabled = await desktop.locator("[data-open-payment]").isDisabled();
    qaChecks.push({ tag: "therapy-desktop-pay-state", payDisabled });
    await desktop.click("[data-open-payment]");
    await desktop.waitForSelector("#payment-modal:not([hidden])");
    await capture(desktop, "therapy-desktop-payment-modal");

    await desktop.fill("#payment-name", "ნინო");
    await desktop.fill("#payment-surname", "ტესტი");
    await desktop.fill("#payment-card-number", "4111111111111111");
    await desktop.fill("#payment-expiry", "12/30");
    await desktop.fill("#payment-cvv", "123");
    await desktop.click("[data-payment-submit]");
    await desktop.waitForTimeout(1800);
    const confirmationVisible = await desktop.locator("[data-payment-confirmation]:not(.hide)").count();
    qaChecks.push({ tag: "therapy-desktop-confirmation", confirmationVisible });
    await capture(desktop, "therapy-desktop-confirmation");

    const mobileContext = await browser.newContext({
      ...devices["iPhone 13"],
      locale: "ka-GE",
    });
    const mobile = await mobileContext.newPage();
    await attachLogging(mobile, "therapy-mobile");
    await mobile.goto(`${baseUrl}/therapy.html`, { waitUntil: "networkidle" });
    await mobile.waitForSelector(".site-header");
    await mobile.waitForTimeout(800);
    await collectLayoutStats(mobile, "therapy-mobile");
    await capture(mobile, "therapy-mobile-top");
    await capture(mobile, "therapy-mobile-calendar", { scrollSelector: ".calendar-shell" });
    await mobileContext.close();
    await desktop.close();
  } finally {
    await browser.close();
  }
}

await withServer(async (baseUrl) => {
  await testHomepage(baseUrl);
  await testRegister(baseUrl);
  await testLogin(baseUrl);
  await testTherapy(baseUrl);
});

fs.writeFileSync(
  reportPath,
  JSON.stringify(
    {
      screenshots,
      consoleMessages,
      pageErrors,
      qaChecks,
    },
    null,
    2
  )
);

console.log(JSON.stringify({ outputDir, reportPath }, null, 2));
