/* =========================================
   MMD PRIVE - IMMIGRATION DASHBOARD
   - Webflow friendly
   - Resolve signed token via /member/api/invite/resolve?t=
   - Role-specific rendering for customer / model dashboards
========================================= */

(function () {
  "use strict";

  const root = document.getElementById("mmd-immigration-dashboard");
  if (!root || root.__MMD_IG_DASHBOARD_INIT__) return;
  root.__MMD_IG_DASHBOARD_INIT__ = true;

  const token = String(new URLSearchParams(window.location.search).get("t") || "").trim();

  const CONFIG = {
    role: String(root.getAttribute("data-dashboard-role") || "customer").trim().toLowerCase(),
    resolveEndpoint:
      root.getAttribute("data-resolve-endpoint") ||
      "https://www.mmdbkk.com/member/api/invite/resolve",
    title:
      root.getAttribute("data-title") ||
      (String(root.getAttribute("data-dashboard-role") || "customer").trim().toLowerCase() === "model"
        ? "แดชบอร์ดโมเดล"
        : "แดชบอร์ดลูกค้า"),
    subtitle:
      root.getAttribute("data-subtitle") ||
      "พื้นที่นี้จะแสดงบริบทการ immigrate, สิทธิ์การเข้าถึง และเส้นทาง dashboard ที่ผูกกับลิงก์นี้โดยตรง",
  };

  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toStr(value) {
    return String(value == null ? "" : value).trim();
  }

  function yesNo(value) {
    return value ? "ต้องทำ" : "ไม่บังคับ";
  }

  function fmtDate(value) {
    const raw = toStr(value);
    if (!raw) return "-";
    const d = new Date(raw);
    if (Number.isNaN(d.getTime())) return raw;
    return d.toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Bangkok",
    });
  }

  function roleLabel(role) {
    return role === "model" ? "โมเดล" : "ลูกค้า";
  }

  function laneLabel(lane) {
    return lane === "model_console" ? "ฝั่งคอนโซลโมเดล" : "ฝั่งลูกค้า";
  }

  function card(title, meta, body) {
    return `
      <section class="igd-card">
        <div class="igd-card__head">
          <div>
            <h2 class="igd-card__title">${esc(title)}</h2>
            <div class="igd-card__meta">${esc(meta)}</div>
          </div>
        </div>
        <div class="igd-card__body">${body}</div>
      </section>
    `;
  }

  function kvRows(rows) {
    return rows
      .map(
        ([label, value]) => `
          <div class="igd-kv">
            <div class="igd-kv__k">${esc(label)}</div>
            <div class="igd-kv__v">${esc(value || "-")}</div>
          </div>
        `,
      )
      .join("");
  }

  function routeRow(label, value) {
    const v = toStr(value);
    return `
      <div class="igd-route">
        <div class="igd-route__label">${esc(label)}</div>
        <div class="igd-route__value">${esc(v || "-")}</div>
      </div>
    `;
  }

  function actionLink(href, label) {
    const url = toStr(href);
    if (!url) return "";
    return `<a class="igd-btn" href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  }

  function injectShell() {
    const roleTitle = CONFIG.role === "model" ? "MODEL DESK" : "CUSTOMER DESK";
    const sideTitle =
      CONFIG.role === "model"
        ? "Model-side access ที่ผูกกับ invite เดียวกัน"
        : "Customer-side access ที่ผูกกับ invite เดียวกัน";
    const sideCopy =
      CONFIG.role === "model"
        ? "หน้านี้จะอ่าน signed token, resolve invite bundle และแสดงคอนเท็กซ์ของโมเดลเฉพาะเส้นทางนี้เท่านั้น"
        : "หน้านี้จะอ่าน signed token, resolve invite bundle และแสดงคอนเท็กซ์ของลูกค้าเฉพาะเส้นทางนี้เท่านั้น";

    root.innerHTML = `
      <div class="igd-wrap">
        <div class="igd-shell">
          <section class="igd-hero">
            <div class="igd-hero__main">
              <div class="igd-eyebrow">MMD PRIVÉ • ${esc(roleTitle)}</div>
              <h1 class="igd-title">${esc(CONFIG.title)}</h1>
              <p class="igd-sub">${esc(CONFIG.subtitle)}</p>
              <div id="igd-status" class="igd-status">กำลังตรวจ token และโหลดข้อมูล dashboard...</div>
            </div>
            <div class="igd-hero__side">
              <div class="igd-pill">SIGNED ACCESS</div>
              <div class="igd-side__title">${esc(sideTitle)}</div>
              <div class="igd-side__copy">${esc(sideCopy)}</div>
            </div>
          </section>
          <div id="igd-grid" class="igd-grid"></div>
        </div>
      </div>
    `;
  }

  function setStatus(message, tone) {
    const el = document.getElementById("igd-status");
    if (!el) return;
    el.className = "igd-status" + (tone ? " " + tone : "");
    el.textContent = message;
  }

  async function resolveInvite() {
    if (!token) throw new Error("ไม่พบ token ใน URL");
    const url = new URL(CONFIG.resolveEndpoint, window.location.origin);
    url.searchParams.set("t", token);
    const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      throw new Error(json?.error?.message || json?.message || ("HTTP " + res.status));
    }
    return json;
  }

  function renderCustomerDashboard(invite) {
    const prefill = invite.prefill || {};
    const routes = invite.routes || {};
    const requirements = invite.requirements || {};
    const modelProfile = invite.model_profile || {};

    return [
      card(
        "ข้อมูลลูกค้า",
        "ข้อมูลระบุตัวตนที่ resolve มาจาก signed customer token โดยตรง",
        kvRows([
          ["ชื่อที่ใช้แสดง", toStr(prefill.display_name || prefill.client_name)],
          ["Username", toStr(prefill.username)],
          ["ชื่อเล่น", toStr(prefill.nickname)],
          ["อีเมล", toStr(prefill.email)],
          ["LINE User ID", toStr(prefill.line_user_id)],
          ["Telegram", toStr(prefill.telegram_username)],
          ["Memberstack ID", toStr(prefill.memberstack_id)],
        ]),
      ),
      card(
        "บริบท Renewal / Immigration",
        "สถานะการเข้าถึงและอายุของลิงก์ชุดนี้",
        kvRows([
          ["Immigration ID", toStr(invite.immigration_id)],
          ["Invite ID", toStr(invite.invite_id)],
          ["เส้นทางใช้งาน", laneLabel(toStr(invite.lane))],
          ["บทบาทของ token", roleLabel(toStr(invite.role).toLowerCase())],
          ["หมดอายุ", fmtDate(invite.expires_at)],
        ]),
      ),
      card(
        "โมเดลที่ผูกไว้ / Route Bundle",
        "ข้อมูลโมเดลและลิงก์ปลายทางที่แนบมากับ dashboard ฝั่งลูกค้า",
        kvRows([
          ["ชื่อโมเดล", toStr(modelProfile.model_name || prefill.model_name)],
          ["Model record", toStr(modelProfile.model_record_id || prefill.model_record_id)],
          ["ลิงก์กติกา", toStr(routes.rules_url)],
          ["ลิงก์คอนโซล", toStr(routes.console_url)],
        ]),
      ),
      card(
        "สิ่งที่ลูกค้าทำต่อได้",
        "สิทธิ์ที่ token ฝั่งลูกค้าชุดนี้เปิดให้ใช้งานตอนนี้",
        [
          routeRow("บทบาทของ dashboard", roleLabel(CONFIG.role)),
          routeRow("ต้องยอมรับกติกา", yesNo(requirements.rules_ack_required)),
          routeRow("ต้อง bind กับโมเดล", yesNo(requirements.model_binding_required)),
          routeRow("สถานะ token", "ลงนามแล้วและใช้งานได้"),
          `<div class="igd-actions">
            ${actionLink(routes.rules_url, "เปิดหน้ากติกา")}
            ${actionLink(routes.console_url, "เปิดคอนโซล")}
          </div>`,
        ].join(""),
      ),
    ].join("");
  }

  function renderModelDashboard(invite) {
    const prefill = invite.prefill || {};
    const routes = invite.routes || {};
    const requirements = invite.requirements || {};
    const modelProfile = invite.model_profile || {};

    return [
      card(
        "ข้อมูลฝั่งโมเดล",
        "สิทธิ์เข้าถึงและตัวตนของโมเดลที่ resolve มาจาก signed model token",
        kvRows([
          ["ชื่อโมเดล", toStr(modelProfile.model_name || prefill.model_name)],
          ["Model record", toStr(modelProfile.model_record_id || prefill.model_record_id)],
          ["Username", toStr(prefill.username)],
          ["ชื่อเล่น", toStr(prefill.nickname)],
          ["Telegram", toStr(prefill.telegram_username)],
          ["บทบาทของ token", roleLabel(toStr(invite.role).toLowerCase())],
        ]),
      ),
      card(
        "Binding / Compliance",
        "เงื่อนไขการทำงานที่แนบมากับ dashboard ฝั่งโมเดล",
        kvRows([
          ["Immigration ID", toStr(invite.immigration_id)],
          ["Invite ID", toStr(invite.invite_id)],
          ["เส้นทางใช้งาน", laneLabel(toStr(invite.lane))],
          ["ต้องยอมรับกติกา", yesNo(requirements.rules_ack_required)],
          ["ต้อง bind กับโมเดล", yesNo(requirements.model_binding_required)],
          ["หมดอายุ", fmtDate(invite.expires_at)],
        ]),
      ),
      card(
        "บริบทของลูกค้า",
        "ข้อมูลฝั่งลูกค้าที่ถูกรวมมากับ token นี้เพื่อใช้ประกอบการดูแล",
        kvRows([
          ["ชื่อที่ใช้แสดง", toStr(prefill.display_name || prefill.client_name)],
          ["อีเมลลูกค้า", toStr(prefill.email)],
          ["LINE User ID", toStr(prefill.line_user_id)],
          ["Memberstack ID", toStr(prefill.memberstack_id)],
        ]),
      ),
      card(
        "เส้นทางของโมเดล",
        "ลิงก์คอนโซลและลิงก์ประกอบการทำงานที่ token นี้เปิดไว้",
        [
          routeRow("ลิงก์คอนโซล", toStr(routes.console_url)),
          routeRow("ลิงก์กติกา", toStr(routes.rules_url)),
          routeRow("สถานะ token", "ลงนามแล้วและใช้งานได้"),
          routeRow("บทบาทของ dashboard", roleLabel(CONFIG.role)),
          `<div class="igd-actions">
            ${actionLink(routes.console_url, "เปิดคอนโซล")}
            ${actionLink(routes.rules_url, "เปิดหน้ากติกา")}
          </div>`,
        ].join(""),
      ),
    ].join("");
  }

  function renderResolved(invite) {
    const grid = document.getElementById("igd-grid");
    if (!grid) return;
    grid.innerHTML =
      CONFIG.role === "model" ? renderModelDashboard(invite) : renderCustomerDashboard(invite);
  }

  async function init() {
    injectShell();

    if (!token) {
      setStatus("ไม่พบ token ใน URL", "bad");
      return;
    }

    try {
      const resolved = await resolveInvite();
      renderResolved(resolved);
      setStatus("ตรวจ token สำเร็จและโหลด dashboard เรียบร้อยแล้ว", "ok");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "โหลด dashboard ไม่สำเร็จ", "bad");
    }
  }

  init();
})();
