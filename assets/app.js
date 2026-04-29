import { contentData } from "./content-data.js";
import { learningDocs } from "./learning-data.js";
import { promptItems } from "./prompt-data.js";

const {
  profile,
  platforms,
  nowItems,
  videos,
  services: serviceItems,
  fitItems,
  unfitItems,
  processItems,
  contactItems,
  projects,
} = contentData;

const navItems = [
  { href: "./index.html", label: "首页", page: "home" },
  { href: "./signals.html", label: "视频", page: "signals" },
  { href: "./projects.html", label: "项目", page: "projects" },
  { href: "./learning.html", label: "AI学习资料", page: "learning" },
  { href: "./work-with-me.html", label: "合作", page: "work" },
  { href: "./about.html", label: "关于", page: "about" },
];

const learningItems = [
  {
    tag: "GPT Image 2",
    title: "GPT Image 2 Prompt 和玩法",
    description: "24 个实测 Prompt，包含原始参考图、生成结果和完整可复制提示词。",
    href: "./prompts.html",
  },
  ...learningDocs.map((doc) => ({
    tag: doc.tag,
    title: doc.title,
    description: doc.summary,
    href: doc.href,
  })),
];

const socialContacts = [
  {
    platform: "微信",
    handle: "risingjerrys",
    description: "添加微信交流合作、课程和 AI 工作流问题。",
    href: "",
    qr: "./assets/social/wechat-qr.jpg",
  },
  {
    platform: "抖音",
    handle: "risingjerrys",
    description: "短视频教程和 AI 工具实战更新。",
    href: "https://www.douyin.com/search/risingjerrys",
    qr: "./assets/social/douyin-qr.jpg",
  },
  {
    platform: "小红书",
    handle: "18683746359",
    description: "图文笔记、Prompt 玩法和 AI 实战教程。",
    href: "https://www.xiaohongshu.com/search_result?keyword=18683746359",
    qr: "./assets/social/xiaohongshu-qr.jpg",
  },
  {
    platform: "视频号",
    handle: "AI杰瑞斯",
    description: "微信生态的视频内容入口。",
    href: "",
    qr: "./assets/social/wechat-channels-qr.jpg",
  },
  {
    platform: "Bilibili",
    handle: "AI杰瑞斯",
    description: "长教程和系统性 AI 学习内容。",
    href: "https://space.bilibili.com/13562739",
    qr: "",
  },
  {
    platform: "GitHub",
    handle: "JNHFlow21",
    description: "开源项目和代码仓库。",
    href: "https://github.com/JNHFlow21",
    qr: "",
  },
];

const page = document.body.dataset.page;

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(value = "") {
  return escapeHtml(value).replaceAll("\n", " ");
}

function getPlatform(keyOrName) {
  return platforms.find((platform) => platform.key === keyOrName || platform.name === keyOrName) ?? platforms[0];
}

function firstAvailableLink(video) {
  return video.links.douyin || video.links.bilibili || video.links.xiaohongshu || "";
}

function buildNav() {
  const container = document.querySelector("[data-nav]");
  if (!container) return;

  container.innerHTML = `
    <div class="nav-bar">
      <a class="nav-brand" href="./index.html">${escapeHtml(profile.name)}</a>
      <nav class="nav-links">
        ${navItems
          .map((item) => {
            const active = item.page === page || (item.page === "learning" && (page === "prompts" || page === "learning-doc"));
            return `
              <a class="nav-link ${active ? "is-active" : ""}" href="${item.href}">
                ${escapeHtml(item.label)}
              </a>
            `;
          })
          .join("")}
      </nav>
    </div>
  `;
}

function coverMarkup(platform, title, image = "") {
  const safeTitle = escapeAttr(title);
  if (image) {
    return `
      <div class="cover cover--image" style="--platform-bg:${platform.accent}">
        <img src="${escapeAttr(image)}" alt="${safeTitle}" loading="lazy" />
        <span class="cover-tag">${escapeHtml(platform.name)}</span>
      </div>
    `;
  }

  return `
    <div class="cover" style="--platform-bg:${platform.accent}">
      <span class="cover-tag">${escapeHtml(platform.name)}</span>
      <span class="cover-mark">${escapeHtml(platform.mark)}</span>
    </div>
  `;
}

function metricText(metrics = {}) {
  const parts = [];
  if (metrics.views) parts.push(`${metrics.views} 播放`);
  if (metrics.favorites) parts.push(`${metrics.favorites} 收藏`);
  if (metrics.likes) parts.push(`${metrics.likes} 点赞`);
  if (metrics.followers) parts.push(`涨粉 ${metrics.followers}`);
  return parts.join(" · ");
}

function videoCard(video, platformKey = "douyin", options = {}) {
  const platform = getPlatform(platformKey);
  const href = platformKey === "wechatChannels" ? "" : video.links[platformKey];
  const metrics = metricText(video.metrics[platformKey]);
  const tag = href ? "a" : "article";
  const attrs = href ? `href="${escapeAttr(href)}" target="_blank" rel="noreferrer"` : "";
  const wechatId = platformKey === "wechatChannels" && video.links.wechatChannelsId
    ? `<p class="muted-line">视频号作品 ID：${escapeHtml(video.links.wechatChannelsId)}</p>`
    : "";

  return `
    <${tag} class="${options.compact ? "mixed-card" : "platform-card video-card"}" ${attrs}>
      ${coverMarkup(platform, video.title, video.cover)}
      <div class="card-meta">
        <span>${escapeHtml(platform.name)}</span>
        <span>${escapeHtml(video.date)}</span>
        ${video.duration ? `<span>${escapeHtml(video.duration)}</span>` : ""}
      </div>
      <h3>${escapeHtml(video.title)}</h3>
      <p>${escapeHtml(options.compact ? video.summary : video.excerpt || video.summary)}</p>
      ${metrics ? `<p class="metric-line">${escapeHtml(metrics)}</p>` : ""}
      ${wechatId}
    </${tag}>
  `;
}

function renderHome() {
  const intro = document.querySelector("[data-profile-intro]");
  if (intro) intro.textContent = profile.bio;

  const links = document.querySelector("[data-profile-links]");
  if (links) {
    links.innerHTML = profile.links
      .map((link) => `<a class="neo-button" href="${escapeAttr(link.href)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
      .join("");
  }

  const nowGrid = document.querySelector("[data-now-grid]");
  if (nowGrid) {
    nowGrid.innerHTML = nowItems
      .map(
        (item) => `
          <article class="now-card">
            <span class="meta-pill">${escapeHtml(item.tag)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `,
      )
      .join("");
  }

  const latestFeed = document.querySelector("[data-latest-feed]");
  if (latestFeed) {
    latestFeed.innerHTML = videos.slice(0, 6).map((item) => videoCard(item, "douyin", { compact: true })).join("");
  }

  const serviceGrid = document.querySelector("[data-service-grid]");
  if (serviceGrid) {
    serviceGrid.innerHTML = serviceItems
      .map(
        (item) => `
          <article class="service-card">
            <span class="meta-pill">方向</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </article>
        `,
      )
      .join("");
  }
}

function setupHeroTyping() {
  const heroTitle = document.querySelector("[data-hero-typing]");
  const prefix = document.querySelector("[data-hero-prefix]");
  const sticker = document.querySelector("[data-hero-sticker]");
  if (!heroTitle || !prefix) return;

  const fullText = prefix.dataset.text ?? "";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    prefix.textContent = fullText;
    if (sticker) {
      sticker.classList.remove("is-hidden");
      sticker.classList.add("is-visible");
    }
    return;
  }

  const getTypeDelay = (char) => {
    if ("，、。！？：；".includes(char)) return 260;
    if (/[A-Za-z]/.test(char)) return 120;
    if (/\s/.test(char)) return 90;
    return 155;
  };

  const resetTitle = () => {
    heroTitle.classList.remove("is-typing");
    heroTitle.classList.remove("is-resetting");
    prefix.textContent = "";
    if (sticker) {
      sticker.classList.remove("is-visible", "is-stamping");
      sticker.classList.add("is-hidden");
    }
  };

  const runCycle = () => {
    resetTitle();
    heroTitle.classList.add("is-typing");

    let index = 0;
    const typeNext = () => {
      if (index < fullText.length) {
        const char = fullText[index];
        prefix.textContent += char;
        index += 1;
        window.setTimeout(typeNext, getTypeDelay(char));
        return;
      }

      heroTitle.classList.remove("is-typing");
      window.setTimeout(() => {
        heroTitle.classList.add("is-resetting");
        window.setTimeout(runCycle, 560);
      }, 2600);
    };

    window.setTimeout(typeNext, 860);
  };

  runCycle();
}

function renderSignals() {
  const jump = document.querySelector("[data-platform-jump]");
  if (jump) {
    jump.innerHTML = platforms
      .map((platform) => `<a class="jump-chip" href="#${platform.slug}">${escapeHtml(platform.name)}</a>`)
      .join("");
  }

  const stack = document.querySelector("[data-platform-stack]");
  if (!stack) return;

  stack.innerHTML = platforms
    .map((platform, platformIndex) => {
      const items = videos.filter((video) => {
        if (platform.key === "wechatChannels") return Boolean(video.links.wechatChannelsId);
        return Boolean(video.links[platform.key]);
      });
      const action = platform.link
        ? `<a class="neo-button" href="${escapeAttr(platform.link)}" target="_blank" rel="noreferrer">平台主页</a>`
        : `<span class="platform-count">${items.length} 条内容</span>`;

      return `
        <section class="platform-section" id="${platform.slug}">
          <div class="platform-head">
            <div>
              <p class="eyebrow">${escapeHtml(platform.mark)}</p>
              <h2>${escapeHtml(platform.name)}</h2>
            </div>
            ${action}
          </div>
          <div class="rail-shell">
            <div class="rail-controls" aria-label="${escapeAttr(platform.name)}视频浏览控制">
              <button class="rail-button rail-button--prev" type="button" aria-label="向左浏览${escapeAttr(platform.name)}视频" data-rail-target="rail-${platformIndex}" data-rail-dir="-1">←</button>
              <button class="rail-button rail-button--next" type="button" aria-label="向右浏览${escapeAttr(platform.name)}视频" data-rail-target="rail-${platformIndex}" data-rail-dir="1">→</button>
            </div>
            <div class="platform-rail" id="rail-${platformIndex}" data-rail>
              ${items.map((item) => videoCard(item, platform.key)).join("")}
            </div>
          </div>
        </section>
      `;
    })
    .join("");
}

function renderLearning() {
  const resourceGrid = document.querySelector("[data-learning-grid]");
  if (resourceGrid) {
    resourceGrid.innerHTML = learningItems
      .map(
        (item) => `
          <a class="learning-card" href="${escapeAttr(item.href)}" ${item.href.startsWith("http") ? 'target="_blank" rel="noreferrer"' : ""}>
            <span class="meta-pill">${escapeHtml(item.tag)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
          </a>
        `,
      )
      .join("");
  }
}

function contactCard(item) {
  return `
    <article class="social-card">
      <div class="social-copy">
        <span class="meta-pill">${escapeHtml(item.platform)}</span>
        <h3>${escapeHtml(item.handle)}</h3>
        <p>${escapeHtml(item.description)}</p>
        ${item.href ? `<a class="neo-button neo-button--black" href="${escapeAttr(item.href)}" target="_blank" rel="noreferrer">打开链接</a>` : `<span class="platform-count">扫码关注</span>`}
      </div>
      ${
        item.qr
          ? `<img class="social-qr" src="${escapeAttr(item.qr)}" alt="${escapeAttr(item.platform)}二维码" loading="lazy" />`
          : `<div class="social-no-qr">NO QR<br />LINK ONLY</div>`
      }
    </article>
  `;
}

function renderAbout() {
  const contactGrid = document.querySelector("[data-about-contact-grid]");
  if (contactGrid) contactGrid.innerHTML = socialContacts.map((item) => contactCard(item)).join("");
}

function renderLearningArticle() {
  const key = document.body.dataset.docKey;
  const doc = learningDocs.find((item) => item.key === key);
  if (!doc) return;

  const title = document.querySelector("[data-learning-doc-title]");
  if (title) title.textContent = doc.title;

  const tag = document.querySelector("[data-learning-doc-tag]");
  if (tag) tag.textContent = doc.tag;

  const summary = document.querySelector("[data-learning-doc-summary]");
  if (summary) summary.textContent = doc.summary;

  const article = document.querySelector("[data-learning-article]");
  if (article) article.innerHTML = doc.html;
}

function renderWork() {
  const serviceMenu = document.querySelector("[data-service-menu]");
  if (serviceMenu) {
    serviceMenu.innerHTML = serviceItems
      .map(
        (item) => `
          <article class="service-card">
            <span class="meta-pill">Service</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.description)}</p>
            <p><strong>适合谁：</strong>${escapeHtml(item.audience)}</p>
            <p><strong>交付形式：</strong>${escapeHtml(item.delivery)}</p>
          </article>
        `,
      )
      .join("");
  }

  const fitList = document.querySelector("[data-fit-list]");
  if (fitList) fitList.innerHTML = fitItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const unfitList = document.querySelector("[data-unfit-list]");
  if (unfitList) unfitList.innerHTML = unfitItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("");

  const processList = document.querySelector("[data-process-list]");
  if (processList) processList.innerHTML = processItems.map((item) => `<div class="flow-item">${escapeHtml(item)}</div>`).join("");

  const contactList = document.querySelector("[data-contact-list]");
  if (contactList) contactList.innerHTML = contactItems.map((item) => `<div class="contact-item">${escapeHtml(item)}</div>`).join("");
}

function renderProjects() {
  const grid = document.querySelector("[data-project-grid]");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (project) => `
        <article class="project-card">
          <div class="project-media project-media--${project.images.length > 3 ? "icons" : "screens"}">
            ${project.images
              .map((image) => `<img src="${escapeAttr(image)}" alt="${escapeAttr(project.name)} screenshot" loading="lazy" />`)
              .join("")}
          </div>
          <div class="project-body">
            <div class="card-meta">
              <span>${escapeHtml(project.language)}</span>
              <span>Updated ${escapeHtml(project.updated)}</span>
              <span>${escapeHtml(project.stars)} stars</span>
            </div>
            <h3>${escapeHtml(project.name)}</h3>
            <p>${escapeHtml(project.description)}</p>
            <ul class="feature-list">
              ${project.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
            </ul>
            <div class="button-row project-actions">
              ${
                project.download
                  ? `<a class="neo-button neo-button--black" href="${escapeAttr(project.download)}" download>${escapeHtml(project.downloadLabel || "直接下载")}</a>`
                  : ""
              }
              <a class="neo-button" href="${escapeAttr(project.repo)}" target="_blank" rel="noreferrer">查看 GitHub</a>
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderPrompts() {
  const stats = document.querySelector("[data-prompt-count]");
  if (stats) stats.textContent = `${promptItems.length} 个实测 Prompt`;

  const categories = [...new Set(promptItems.map((item) => item.category))];
  const jump = document.querySelector("[data-prompt-jump]");
  if (jump) {
    jump.innerHTML = categories
      .map((category) => `<a class="jump-chip" href="#${encodeURIComponent(category)}">${escapeHtml(category)}</a>`)
      .join("");
  }

  const gallery = document.querySelector("[data-prompt-gallery]");
  if (!gallery) return;

  gallery.innerHTML = categories
    .map((category) => {
      const items = promptItems.filter((item) => item.category === category);
      return `
        <section class="prompt-category" id="${encodeURIComponent(category)}">
          <div class="section-head">
            <p class="eyebrow">GPT Image 2</p>
            <h2>${escapeHtml(category)}</h2>
          </div>
          <div class="prompt-grid">
            ${items
              .map(
                (item, index) => {
                  const promptIndex = promptItems.indexOf(item);
                  return `
                  <article class="prompt-card">
                    <div class="prompt-compare">
                      <figure>
                        <img src="${escapeAttr(item.referenceImage)}" alt="原始参考图" loading="lazy" />
                        <figcaption>Before</figcaption>
                      </figure>
                      <figure>
                        <img src="${escapeAttr(item.resultImage)}" alt="${escapeAttr(item.title)}" loading="lazy" />
                        <figcaption>After</figcaption>
                      </figure>
                    </div>
                    <div class="prompt-body">
                      <span class="meta-pill">${String(index + 1).padStart(2, "0")}</span>
                      <h3>${escapeHtml(item.title)}</h3>
                      <pre>${escapeHtml(item.prompt)}</pre>
                      <button class="neo-button neo-button--black" type="button" data-prompt-index="${promptIndex}">复制 Prompt</button>
                    </div>
                  </article>
                `;
                },
              )
              .join("")}
          </div>
        </section>
      `;
    })
    .join("");
}

function setupCopyPrompts() {
  document.querySelectorAll("[data-prompt-index]").forEach((button) => {
    button.addEventListener("click", async () => {
      const item = promptItems[Number(button.getAttribute("data-prompt-index"))];
      const text = item?.prompt ?? "";
      try {
        await navigator.clipboard.writeText(text);
        const original = button.textContent;
        button.textContent = "已复制";
        window.setTimeout(() => {
          button.textContent = original;
        }, 1200);
      } catch {
        button.textContent = "复制失败";
      }
    });
  });
}

function setupAutoScrollRails() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const rails = document.querySelectorAll("[data-autoscroll]");

  rails.forEach((rail, index) => {
    if (rail.scrollWidth <= rail.clientWidth) return;

    let direction = 1;
    let paused = false;
    const speed = 0.1 + index * 0.015;
    const pause = () => {
      paused = true;
    };
    const resume = () => {
      paused = false;
    };

    rail.addEventListener("mouseenter", pause);
    rail.addEventListener("mouseleave", resume);
    rail.addEventListener("focusin", pause);
    rail.addEventListener("focusout", resume);
    rail.addEventListener("touchstart", pause, { passive: true });
    rail.addEventListener("touchend", resume, { passive: true });

    const tick = () => {
      if (!paused) {
        rail.scrollLeft += speed * direction;
        const maxScroll = rail.scrollWidth - rail.clientWidth;
        if (rail.scrollLeft >= maxScroll - 2) direction = -1;
        if (rail.scrollLeft <= 2) direction = 1;
      }

      window.requestAnimationFrame(tick);
    };

    window.requestAnimationFrame(tick);
  });
}

function setupRailControls() {
  document.querySelectorAll("[data-rail-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const rail = document.getElementById(button.getAttribute("data-rail-target") ?? "");
      if (!rail) return;
      const direction = Number(button.getAttribute("data-rail-dir")) || 1;
      rail.scrollBy({
        left: direction * Math.min(rail.clientWidth * 0.9, 640),
        behavior: "smooth",
      });
    });
  });
}

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function applyRandomMotion(selector, type, options = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const {
    duration = [10, 14],
    x = [-3, 3],
    y = [-5, -1],
    rotate = [-1.2, 1.2],
    scale = [1.0, 1.012],
  } = options;

  document.querySelectorAll(selector).forEach((element) => {
    element.classList.add(`motion-${type}-random`);
    element.style.setProperty("--motion-duration", `${randomBetween(duration[0], duration[1]).toFixed(2)}s`);
    element.style.setProperty("--motion-delay", `${randomBetween(-3.5, 0).toFixed(2)}s`);
    element.style.setProperty("--motion-x", `${randomBetween(x[0], x[1]).toFixed(1)}px`);
    element.style.setProperty("--motion-y", `${randomBetween(y[0], y[1]).toFixed(1)}px`);
    element.style.setProperty("--motion-rotate-delta", `${randomBetween(rotate[0], rotate[1]).toFixed(2)}deg`);
    element.style.setProperty("--motion-scale", `${randomBetween(scale[0], scale[1]).toFixed(3)}`);
  });
}

function setupRandomMotionSystem() {
  applyRandomMotion(".nav-brand", "drift", {
    duration: [12, 15],
    x: [-2, 2],
    y: [-3, -1],
    rotate: [-0.8, 0.8],
    scale: [1.0, 1.008],
  });

  applyRandomMotion(".hero-avatar, .hero-badge, .sticker-card, .ambient-orb", "drift", {
    duration: [11, 16],
    x: [-4, 4],
    y: [-8, -2],
    rotate: [-1.6, 1.6],
    scale: [1.0, 1.015],
  });

  applyRandomMotion(".ambient-chip, .section-head .eyebrow, .platform-head .eyebrow", "sway", {
    duration: [10, 13.5],
    x: [-2, 2],
    y: [-2, 0],
    rotate: [-1.2, 1.2],
    scale: [1.0, 1.008],
  });

  applyRandomMotion(".meta-pill, .cta-panel .neo-button:last-child, .contact-panel .eyebrow", "pulse", {
    duration: [7.2, 9.8],
    x: [0, 0],
    y: [0, 0],
    rotate: [-0.4, 0.4],
    scale: [1.0, 1.018],
  });

  applyRandomMotion(".platform-card .cover-mark", "sway", {
    duration: [11, 15],
    x: [-2, 2],
    y: [-4, -1],
    rotate: [-1.5, 1.5],
    scale: [1.0, 1.01],
  });
}

buildNav();

if (page === "home") renderHome();
if (page === "signals") renderSignals();
if (page === "work") renderWork();
if (page === "projects") renderProjects();
if (page === "prompts") renderPrompts();
if (page === "learning") renderLearning();
if (page === "learning-doc") renderLearningArticle();
if (page === "about") renderAbout();

setupHeroTyping();
setupRandomMotionSystem();
setupAutoScrollRails();
setupRailControls();
setupCopyPrompts();
