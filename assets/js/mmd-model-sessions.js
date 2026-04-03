(function () {
  var app = document.getElementById("mmdSessionStageApp");
  if (!app) return;

  var els = {
    brandLogo: document.getElementById("brandLogo"),
    heroLogo: document.getElementById("heroLogo"),
    heroImage: document.getElementById("heroImage"),
    langThBtn: document.getElementById("langThBtn"),
    langEnBtn: document.getElementById("langEnBtn"),
    topTelegramLink: document.getElementById("topTelegramLink"),
    topEmergencyLink: document.getElementById("topEmergencyLink"),
    sidebarTelegramLink: document.getElementById("sidebarTelegramLink"),
    sidebarEmergencyLink: document.getElementById("sidebarEmergencyLink"),
    heroEyebrow: document.getElementById("heroEyebrow"),
    heroTitle: document.getElementById("heroTitle"),
    heroSubtitle: document.getElementById("heroSubtitle"),
    heroStatusText: document.getElementById("heroStatusText"),
    heroTimeText: document.getElementById("heroTimeText"),
    heroEtaText: document.getElementById("heroEtaText"),
    heroTravelModeText: document.getElementById("heroTravelModeText"),
    heroMiniBrandText: document.getElementById("heroMiniBrandText"),
    pillStatusLabel: document.getElementById("pillStatusLabel"),
    pillTimeLabel: document.getElementById("pillTimeLabel"),
    pillEtaLabel: document.getElementById("pillEtaLabel"),
    pillTravelModeLabel: document.getElementById("pillTravelModeLabel"),
    priorityLabelText: document.getElementById("priorityLabelText"),
    districtLabelText: document.getElementById("districtLabelText"),
    priorityText: document.getElementById("priorityText"),
    districtText: document.getElementById("districtText"),
    stageAssigned: document.getElementById("stageAssigned"),
    stageTraveling: document.getElementById("stageTraveling"),
    stageArrived: document.getElementById("stageArrived"),
    stageMet: document.getElementById("stageMet"),
    stageAssignedText: document.getElementById("stageAssignedText"),
    stageTravelingText: document.getElementById("stageTravelingText"),
    stageArrivedText: document.getElementById("stageArrivedText"),
    stageMetText: document.getElementById("stageMetText"),
    statusBadge: document.getElementById("statusBadge"),
    detailsEyebrow: document.getElementById("detailsEyebrow"),
    detailsTitle: document.getElementById("detailsTitle"),
    labelClient: document.getElementById("labelClient"),
    labelDate: document.getElementById("labelDate"),
    labelTime: document.getElementById("labelTime"),
    labelLocation: document.getElementById("labelLocation"),
    labelMeetingPoint: document.getElementById("labelMeetingPoint"),
    labelDuration: document.getElementById("labelDuration"),
    labelType: document.getElementById("labelType"),
    labelDress: document.getElementById("labelDress"),
    labelNotes: document.getElementById("labelNotes"),
    detailClient: document.getElementById("detailClient"),
    detailDate: document.getElementById("detailDate"),
    detailTime: document.getElementById("detailTime"),
    detailLocation: document.getElementById("detailLocation"),
    detailMeetingPoint: document.getElementById("detailMeetingPoint"),
    detailDuration: document.getElementById("detailDuration"),
    detailType: document.getElementById("detailType"),
    detailDress: document.getElementById("detailDress"),
    detailNotes: document.getElementById("detailNotes"),
    miniSessionIdLabel: document.getElementById("miniSessionIdLabel"),
    miniEtaLabel: document.getElementById("miniEtaLabel"),
    miniTravelModeLabel: document.getElementById("miniTravelModeLabel"),
    miniCompensationLabel: document.getElementById("miniCompensationLabel"),
    detailSessionId: document.getElementById("detailSessionId"),
    detailEta: document.getElementById("detailEta"),
    detailTravelMode: document.getElementById("detailTravelMode"),
    detailCompensation: document.getElementById("detailCompensation"),
    travelEyebrow: document.getElementById("travelEyebrow"),
    travelTitle: document.getElementById("travelTitle"),
    routeStartTitle: document.getElementById("routeStartTitle"),
    routeStartCopy: document.getElementById("routeStartCopy"),
    routeShareTitle: document.getElementById("routeShareTitle"),
    routeArrivedTitle: document.getElementById("routeArrivedTitle"),
    shareLocationDot: document.getElementById("shareLocationDot"),
    arrivedDot: document.getElementById("arrivedDot"),
    shareLocationStatusText: document.getElementById("shareLocationStatusText"),
    arrivedStatusText: document.getElementById("arrivedStatusText"),
    mapTitle: document.getElementById("mapTitle"),
    mapSubtext: document.getElementById("mapSubtext"),
    mapEtaBadge: document.getElementById("mapEtaBadge"),
    fromLabel: document.getElementById("fromLabel"),
    toLabel: document.getElementById("toLabel"),
    locationStatusLabel: document.getElementById("locationStatusLabel"),
    progressLabel: document.getElementById("progressLabel"),
    fromText: document.getElementById("fromText"),
    toText: document.getElementById("toText"),
    locationStatusText: document.getElementById("locationStatusText"),
    progressText: document.getElementById("progressText"),
    actionEyebrow: document.getElementById("actionEyebrow"),
    actionTitle: document.getElementById("actionTitle"),
    actionCopy: document.getElementById("actionCopy"),
    assignedActions: document.getElementById("assignedActions"),
    travelingActions: document.getElementById("travelingActions"),
    arrivedActions: document.getElementById("arrivedActions"),
    startTravelBtn: document.getElementById("startTravelBtn"),
    shareLocationBtn: document.getElementById("shareLocationBtn"),
    sendUpdateBtn: document.getElementById("sendUpdateBtn"),
    arrivedBtn: document.getElementById("arrivedBtn"),
    metClientBtn: document.getElementById("metClientBtn"),
    openSessionBtnA: document.getElementById("openSessionBtnA"),
    openSessionBtnB: document.getElementById("openSessionBtnB"),
    successBox: document.getElementById("successBox"),
    successTitle: document.getElementById("successTitle"),
    successCopy: document.getElementById("successCopy"),
    rulesEyebrow: document.getElementById("rulesEyebrow"),
    rulesTitle: document.getElementById("rulesTitle"),
    rule1: document.getElementById("rule1"),
    rule2: document.getElementById("rule2"),
    rule3: document.getElementById("rule3"),
    rule4: document.getElementById("rule4"),
    toast: document.getElementById("mmdToast")
  };

  var CONFIG = {
    apiBase: app.getAttribute("data-api-base") || "",
    sessionUrl: app.getAttribute("data-session-url") || "/model/session",
    contactAdminUrl: app.getAttribute("data-contact-admin-url") || "https://t.me/Per_MMD",
    telegramUrl: app.getAttribute("data-telegram-url") || "https://t.me/MMDModelBot",
    logoUrl: app.getAttribute("data-logo-url") || "",
    heroImage: app.getAttribute("data-hero-image") || "",
    defaultLang: app.getAttribute("data-default-lang") || "th",
    startTravelPathTemplate: app.getAttribute("data-start-travel-path-template") || "/model/sessions/{sessionId}/start-travel",
    shareLocationPathTemplate: app.getAttribute("data-share-location-path-template") || "/model/sessions/{sessionId}/share-location",
    arrivedPathTemplate: app.getAttribute("data-arrived-path-template") || "/model/sessions/{sessionId}/arrived",
    metClientPathTemplate: app.getAttribute("data-met-client-path-template") || "/model/sessions/{sessionId}/met-client"
  };

  var url = new URL(window.location.href);
  var tParam = url.searchParams.get("t") || "";
  var external = window.MMD_SESSION_STAGE_DATA || {};

  var i18n = {
    th: {
      openTelegram: "เปิด Telegram",
      emergencyContact: "คุยกับต้า / ฉุกเฉิน",
      currentSession: "Current Session",
      heroMiniBrand: "Tar T กำลังดู flow ให้คุณอยู่ · MMD Privé",
      pillStatus: "Status",
      pillTime: "Start Time",
      pillEta: "ETA",
      pillTravelMode: "Travel Mode",
      priorityLabel: "Priority",
      districtLabel: "District",
      stageAssigned: "Assigned",
      stageTraveling: "Traveling",
      stageArrived: "Arrived",
      stageMet: "Met Client",
      detailsEyebrow: "Session Details",
      detailsTitle: "รายละเอียดงานของคุณ",
      labelClient: "ลูกค้า",
      labelDate: "วันที่",
      labelTime: "เวลา",
      labelLocation: "สถานที่",
      labelMeetingPoint: "จุดนัดพบ",
      labelDuration: "ระยะเวลา",
      labelType: "ประเภท",
      labelDress: "การแต่งตัว",
      labelNotes: "หมายเหตุ",
      miniSessionId: "Session ID",
      miniEta: "ETA",
      miniTravelMode: "Travel Mode",
      miniCompensation: "ค่าตอบแทน",
      travelEyebrow: "Travel Panel",
      travelTitle: "ต้าอัปเดต route ให้คุณตรงนี้",
      routeStartTitle: "Start Travel",
      routeStartCopy: "ถ้าพร้อมแล้วกดเริ่มเดินทางได้เลย เดี๋ยวต้าดู flow ต่อให้",
      routeShareTitle: "Share Location",
      routeArrivedTitle: "Arrived",
      mapTitle: "สรุปการเดินทาง",
      fromLabel: "ต้นทาง",
      toLabel: "ปลายทาง",
      locationStatusLabel: "Live Location",
      progressLabel: "ความคืบหน้า",
      actionEyebrow: "Your Next Action",
      rulesEyebrow: "System Rules",
      rulesTitle: "ต้าย้ำไว้ก่อนนะ",
      rule4Html: 'ใช้ session token ล่าสุดใน query param <code>t</code>',
      assigned: {
        heroTitle: "พร้อมออกเดินทางแล้วใช่ไหม",
        heroSubtitle: "งานนี้ assign ให้คุณแล้วนะ ถ้าพร้อมเมื่อไหร่กดเริ่มเดินทางได้เลย เดี๋ยวต้าดู flow ต่อให้แบบเงียบและลื่นที่สุด",
        status: "Assigned",
        actionTitle: "เริ่มเดินทางเมื่อพร้อม",
        actionCopy: "ถ้าคุณพร้อมแล้วกด Start Travel ได้เลย จากนั้นหน้านี้จะขยับไปช่วง Traveling ให้ทันที",
        startTravelBtn: "Start Travel",
        openSessionBtn: "Open Session",
        successTitle: "ต้าเปิดช่วงเดินทางให้แล้ว",
        successCopy: "เข้า session view ต่อได้เลย แล้วค่อยอัปเดต route ตามจริงระหว่างทาง",
        shareLocationStatus: "ตอนนี้ยังไม่ได้เปิดการแชร์ตำแหน่งนะ",
        arrivedStatus: "พอถึงจุดนัดพบแล้วค่อยกด Arrived",
        mapSubtext: "ตอนนี้ยังรอคุณเริ่มเดินทางอยู่",
        locationStatus: "ยังไม่เปิด",
        progress: "ยังไม่เริ่ม",
        etaBadge: "ETA ",
        rule1: "หน้านี้ครอบคลุม Assigned → Traveling → Arrived",
        rule2: "ช่วง Traveling action หลักคือ Share Location กับ Arrived",
        rule3: "Telegram ควรเปิดไว้ตลอด เผื่อต้าหรือแอดมินต้องส่ง reminder ด่วน"
      },
      traveling: {
        heroTitle: "โอเค ตอนนี้กำลังเดินทางอยู่",
        heroSubtitle: "ระหว่างทางถ้าสะดวกให้แชร์ location ไว้ด้วยนะ แบบนี้ต้ากับฝั่ง emergency จะตาม route ของคุณได้ง่ายและนิ่งขึ้น",
        status: "Traveling",
        actionTitle: "จัดการช่วงเดินทางตรงนี้",
        actionCopy: "ตอนนี้คุณกด Share Location, Send Update หรือ Arrived ได้ตามสถานการณ์จริงเลย",
        shareLocationBtn: "Share Location",
        sendUpdateBtn: "Send Update",
        arrivedBtn: "Arrived",
        successTitle: "ต้ากำลังตาม route ให้อยู่",
        successCopyInactive: "ถ้ายังไม่ได้แชร์ตำแหน่ง กดได้เลยเมื่อสะดวก หรือกด Arrived ตอนถึงจุดนัดพบ",
        successCopyActive: "เปิด live location แล้ว แบบนี้ฝั่ง emergency จะตาม route ของคุณได้ง่ายขึ้นมาก",
        shareLocationStatusInactive: "ถ้าพร้อม กด Share Location เพื่อเปิด live update ได้เลย",
        shareLocationStatusActive: "ตอนนี้ live location เปิดอยู่แล้ว",
        arrivedStatus: "พอถึงจุดนัดพบแล้วกด Arrived ได้เลย",
        mapSubtext: "ตอนนี้กำลังเดินทางอยู่ ถ้ามีอะไรเปลี่ยนค่อยอัปเดต ETA ให้ต้าได้เลย",
        locationStatusInactive: "รอเปิด",
        locationStatusActive: "กำลังแชร์",
        progress: "กำลังเดินทาง",
        etaBadge: "ETA "
      },
      arrived: {
        heroTitle: "ถึงสถานที่แล้วใช่ไหม",
        heroSubtitle: "โอเค ตอนนี้รอที่จุดนัดพบก่อนนะ แล้วค่อยกดต่อเมื่อเจอลูกค้าแล้วจริง ๆ",
        status: "Arrived",
        actionTitle: "ขั้นถัดไปของคุณ",
        actionCopy: "ถ้าคุณถึงจุดนัดพบและเจอลูกค้าแล้ว ค่อยกด Met Client เพื่อไปต่อขั้นถัดไป",
        metClientBtn: "Met Client",
        openSessionBtn: "Open Session",
        successTitle: "ต้า log การมาถึงให้แล้ว",
        successCopy: "เรียบร้อย ตอนนี้รอที่จุดนัดพบก่อน แล้วค่อยไปต่อเมื่อเจอลูกค้า",
        shareLocationStatus: "การแชร์ตำแหน่งจบเรียบร้อยแล้ว",
        arrivedStatus: "บันทึกการมาถึงเรียบร้อยแล้ว",
        mapSubtext: "ตอนนี้คุณอยู่ที่จุดนัดพบแล้ว",
        locationStatus: "เสร็จสิ้น",
        progress: "ถึงแล้ว",
        etaBadge: "ถึงสถานที่แล้ว"
      },
      met: {
        heroTitle: "โอเค ต้ารับรู้แล้วว่าคุณเจอลูกค้า",
        heroSubtitle: "ขั้น Arrived เสร็จแล้ว จากนี้เปิด session view แล้วไปต่อขั้นถัดไปของงานได้เลย ต้าจัดทางไว้ให้แล้ว",
        status: "Met Client",
        actionTitle: "ไปต่อใน session",
        actionCopy: "จากตรงนี้เปิด session view ได้เลย เดี๋ยว flow ส่วนถัดไปจะต่อให้เอง",
        metClientBtn: "Open Session",
        openSessionBtn: "Open Session",
        successTitle: "พร้อมไปขั้นถัดไปแล้ว",
        successCopy: "ระบบบันทึกทั้งการมาถึงและการพบลูกค้าไว้เรียบร้อยแล้ว",
        shareLocationStatus: "การแชร์ตำแหน่งเสร็จสิ้นแล้ว",
        arrivedStatus: "ยืนยันการมาถึงไว้แล้ว",
        mapSubtext: "พบลูกค้าเรียบร้อยแล้ว",
        locationStatus: "เสร็จสิ้น",
        progress: "พบลูกค้าแล้ว",
        etaBadge: "พร้อม"
      },
      toasts: {
        travelStarted: "เริ่มเดินทางแล้ว ต้าตามให้ต่อ",
        locationShared: "เปิดแชร์ตำแหน่งแล้ว",
        arrivalRecorded: "บันทึกการมาถึงแล้ว",
        metClient: "ยืนยันว่าเจอลูกค้าแล้ว",
        updateSent: "ต้าแจ้งอัปเดตการเดินทางให้ฝั่ง emergency แล้ว",
        liveRouteActive: "live route เปิดอยู่แล้ว ตอนนี้ตาม route ได้ชัดขึ้น",
        requestFailed: "อัปเดตสถานะไม่สำเร็จ"
      }
    },
    en: {
      openTelegram: "Open Telegram",
      emergencyContact: "Contact Tar T / Emergency",
      currentSession: "Current Session",
      heroMiniBrand: "Tar T is watching your flow · MMD Privé",
      pillStatus: "Status",
      pillTime: "Start Time",
      pillEta: "ETA",
      pillTravelMode: "Travel Mode",
      priorityLabel: "Priority",
      districtLabel: "District",
      stageAssigned: "Assigned",
      stageTraveling: "Traveling",
      stageArrived: "Arrived",
      stageMet: "Met Client",
      detailsEyebrow: "Session Details",
      detailsTitle: "Your Session Brief",
      labelClient: "Client",
      labelDate: "Date",
      labelTime: "Time",
      labelLocation: "Location",
      labelMeetingPoint: "Meeting Point",
      labelDuration: "Duration",
      labelType: "Type",
      labelDress: "Dress",
      labelNotes: "Notes",
      miniSessionId: "Session ID",
      miniEta: "ETA",
      miniTravelMode: "Travel Mode",
      miniCompensation: "Compensation",
      travelEyebrow: "Travel Panel",
      travelTitle: "Tar T is tracking your route here",
      routeStartTitle: "Start Travel",
      routeStartCopy: "When you are ready, start travel and Tar T will keep the flow moving for you.",
      routeShareTitle: "Share Location",
      routeArrivedTitle: "Arrived",
      mapTitle: "Travel Summary",
      fromLabel: "From",
      toLabel: "To",
      locationStatusLabel: "Live Location",
      progressLabel: "Progress",
      actionEyebrow: "Your Next Action",
      rulesEyebrow: "System Rules",
      rulesTitle: "A quick note from Tar T",
      rule4Html: 'Use the latest session token in the query param <code>t</code>',
      assigned: {
        heroTitle: "You are ready to leave",
        heroSubtitle: "This session is assigned to you now. Once you are ready, start travel and Tar T will keep the flow smooth for you.",
        status: "Assigned",
        actionTitle: "Start travel when you are ready",
        actionCopy: "Tap Start Travel when you are set. This page will shift into the traveling stage right away.",
        startTravelBtn: "Start Travel",
        openSessionBtn: "Open Session",
        successTitle: "Tar T has opened your travel stage",
        successCopy: "You can continue in the session view and update your route if anything changes.",
        shareLocationStatus: "Live location is not active yet.",
        arrivedStatus: "Tap Arrived once you reach the meeting point.",
        mapSubtext: "Waiting for you to begin travel.",
        locationStatus: "Inactive",
        progress: "Not started",
        etaBadge: "ETA ",
        rule1: "This page covers Assigned → Traveling → Arrived",
        rule2: "During Traveling, the main actions are Share Location and Arrived",
        rule3: "Keep Telegram available in case Tar T or emergency contact needs to reach you fast"
      },
      traveling: {
        heroTitle: "You are on the way now",
        heroSubtitle: "If you can, keep location sharing on. It helps Tar T and the emergency side follow your route more clearly and calmly.",
        status: "Traveling",
        actionTitle: "Manage your travel here",
        actionCopy: "From here you can use Share Location, Send Update, or Arrived depending on the real situation.",
        shareLocationBtn: "Share Location",
        sendUpdateBtn: "Send Update",
        arrivedBtn: "Arrived",
        successTitle: "Tar T is following your route",
        successCopyInactive: "If location is still off, you can turn it on when ready, or tap Arrived once you reach the destination.",
        successCopyActive: "Live location is active now. Emergency contact can follow your route much more easily.",
        shareLocationStatusInactive: "Tap Share Location whenever you are ready to send live updates.",
        shareLocationStatusActive: "Live location is active now.",
        arrivedStatus: "Tap Arrived once you reach the meeting point.",
        mapSubtext: "You are traveling now. Update ETA if the route changes.",
        locationStatusInactive: "Pending",
        locationStatusActive: "Active",
        progress: "On the way",
        etaBadge: "ETA "
      },
      arrived: {
        heroTitle: "You have arrived",
        heroSubtitle: "Good. Stay at the meeting point first, then continue only after you have actually met the client.",
        status: "Arrived",
        actionTitle: "Your next step",
        actionCopy: "Once you are at the meeting point and have met the client, tap Met Client to move forward.",
        metClientBtn: "Met Client",
        openSessionBtn: "Open Session",
        successTitle: "Tar T has logged your arrival",
        successCopy: "All set. Stay at the meeting point, then continue when client contact is confirmed.",
        shareLocationStatus: "Location sharing is complete.",
        arrivedStatus: "Arrival has been recorded successfully.",
        mapSubtext: "You are now at the meeting point.",
        locationStatus: "Completed",
        progress: "Arrived",
        etaBadge: "On site"
      },
      met: {
        heroTitle: "Client contact confirmed",
        heroSubtitle: "The arrived stage is done. From here, open the session view and continue with the next part of the job. Tar T has the route ready.",
        status: "Met Client",
        actionTitle: "Continue in session",
        actionCopy: "Open the session view and I will leave the next operational step ready for you there.",
        metClientBtn: "Open Session",
        openSessionBtn: "Open Session",
        successTitle: "You are ready for the next stage",
        successCopy: "Arrival and client contact have both been recorded successfully.",
        shareLocationStatus: "Location sharing is complete.",
        arrivedStatus: "Arrival has already been confirmed.",
        mapSubtext: "Client contact is confirmed.",
        locationStatus: "Completed",
        progress: "Client met",
        etaBadge: "Ready"
      },
      toasts: {
        travelStarted: "Travel started. Tar T is tracking the next step.",
        locationShared: "Location sharing is active now.",
        arrivalRecorded: "Arrival recorded.",
        metClient: "Client contact confirmed.",
        updateSent: "Tar T sent your travel update to emergency contact.",
        liveRouteActive: "Live route is already active. Emergency contact can follow more clearly now.",
        requestFailed: "Unable to update session"
      }
    }
  };

  var state = {
    lang: external.lang || url.searchParams.get("lang") || CONFIG.defaultLang || "th",
    isBusy: false,
    job: {
      status: external.status || url.searchParams.get("status") || "confirmed",
      sessionId: external.sessionId || url.searchParams.get("session_id") || "sess_demo_001",
      clientName: external.clientName || url.searchParams.get("client") || "Alex",
      dateLabel: external.dateLabel || url.searchParams.get("date") || "Tonight",
      timeLabel: external.timeLabel || url.searchParams.get("time") || "21:00",
      location: external.location || url.searchParams.get("location") || "Sukhumvit 24",
      meetingPoint: external.meetingPoint || url.searchParams.get("meeting_point") || "Hotel lobby",
      durationLabel: external.durationLabel || url.searchParams.get("duration") || "2 hours",
      typeLabel: external.typeLabel || url.searchParams.get("type") || "Outcall",
      dressLabel: external.dressLabel || url.searchParams.get("dress") || "Black tailored look",
      notes: external.notes || url.searchParams.get("notes") || "Please arrive 10 minutes early and stay reachable.",
      etaLabel: external.etaLabel || url.searchParams.get("eta") || "12 min",
      travelMode: external.travelMode || url.searchParams.get("travel_mode") || "Taxi",
      compensationLabel: external.compensationLabel || url.searchParams.get("compensation") || "THB 8,000",
      district: external.district || url.searchParams.get("district") || "Watthana",
      priorityLabel: external.priorityLabel || url.searchParams.get("priority") || "High Priority",
      fromLabel: external.fromLabel || url.searchParams.get("from") || "Current location",
      telegramUrl: external.telegramUrl || CONFIG.telegramUrl,
      contactAdminUrl: external.contactAdminUrl || CONFIG.contactAdminUrl,
      sessionDeepLink: "",
      locationSharingActive: typeof external.locationSharingActive === "boolean"
        ? external.locationSharingActive
        : url.searchParams.get("location_sharing") === "1"
    }
  };

  function getCopy() {
    return i18n[state.lang] || i18n.th;
  }

  function buildSessionUrl() {
    var u = new URL(CONFIG.sessionUrl, window.location.origin);
    if (tParam) u.searchParams.set("t", tParam);
    u.searchParams.set("session_id", state.job.sessionId);
    u.searchParams.set("lang", state.lang);
    return u.toString();
  }

  function buildApiUrl(pathTemplate) {
    var path = pathTemplate.replace("{sessionId}", encodeURIComponent(state.job.sessionId));
    if (!CONFIG.apiBase) return path;
    return CONFIG.apiBase.replace(/\/$/, "") + path;
  }

  function showToast(message) {
    if (!els.toast) return;
    els.toast.textContent = message;
    els.toast.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () {
      els.toast.classList.remove("is-visible");
    }, 2600);
  }

  function setBusy(isBusy) {
    state.isBusy = isBusy;
    [els.startTravelBtn, els.shareLocationBtn, els.sendUpdateBtn, els.arrivedBtn, els.metClientBtn].forEach(function (btn) {
      if (btn) btn.disabled = !!isBusy;
    });
  }

  function setLangButtons() {
    if (els.langThBtn) els.langThBtn.classList.toggle("is-active", state.lang === "th");
    if (els.langEnBtn) els.langEnBtn.classList.toggle("is-active", state.lang === "en");
  }

  function setLinks() {
    state.job.sessionDeepLink = buildSessionUrl();
    [els.topTelegramLink, els.sidebarTelegramLink].forEach(function (el) {
      if (el) el.href = state.job.telegramUrl;
    });
    [els.topEmergencyLink, els.sidebarEmergencyLink].forEach(function (el) {
      if (el) el.href = state.job.contactAdminUrl;
    });
    if (els.openSessionBtnA) els.openSessionBtnA.href = state.job.sessionDeepLink;
    if (els.openSessionBtnB) els.openSessionBtnB.href = state.job.sessionDeepLink;
  }

  function setAssets() {
    if (CONFIG.logoUrl) {
      if (els.brandLogo) els.brandLogo.src = CONFIG.logoUrl;
      if (els.heroLogo) els.heroLogo.src = CONFIG.logoUrl;
    }
    if (CONFIG.heroImage && els.heroImage) {
      els.heroImage.src = CONFIG.heroImage;
    }
  }

  function resetStageClasses() {
    [els.stageAssigned, els.stageTraveling, els.stageArrived, els.stageMet].forEach(function (node) {
      if (!node) return;
      node.classList.remove("is-active");
      node.classList.remove("is-done");
    });
  }

  function setStageState() {
    resetStageClasses();
    if (state.job.status === "confirmed" && els.stageAssigned) els.stageAssigned.classList.add("is-active");
    if (state.job.status === "en_route") {
      if (els.stageAssigned) els.stageAssigned.classList.add("is-done");
      if (els.stageTraveling) els.stageTraveling.classList.add("is-active");
    }
    if (state.job.status === "arrived") {
      if (els.stageAssigned) els.stageAssigned.classList.add("is-done");
      if (els.stageTraveling) els.stageTraveling.classList.add("is-done");
      if (els.stageArrived) els.stageArrived.classList.add("is-active");
    }
    if (state.job.status === "met_customer") {
      if (els.stageAssigned) els.stageAssigned.classList.add("is-done");
      if (els.stageTraveling) els.stageTraveling.classList.add("is-done");
      if (els.stageArrived) els.stageArrived.classList.add("is-done");
      if (els.stageMet) els.stageMet.classList.add("is-active");
    }
  }

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function renderStaticText() {
    var c = getCopy();
    setText(els.topTelegramLink, c.openTelegram);
    setText(els.topEmergencyLink, c.emergencyContact);
    setText(els.sidebarTelegramLink, c.openTelegram);
    setText(els.sidebarEmergencyLink, c.emergencyContact);
    setText(els.heroEyebrow, c.currentSession);
    setText(els.heroMiniBrandText, c.heroMiniBrand);
    setText(els.pillStatusLabel, c.pillStatus);
    setText(els.pillTimeLabel, c.pillTime);
    setText(els.pillEtaLabel, c.pillEta);
    setText(els.pillTravelModeLabel, c.pillTravelMode);
    setText(els.priorityLabelText, c.priorityLabel);
    setText(els.districtLabelText, c.districtLabel);
    setText(els.stageAssignedText, c.stageAssigned);
    setText(els.stageTravelingText, c.stageTraveling);
    setText(els.stageArrivedText, c.stageArrived);
    setText(els.stageMetText, c.stageMet);
    setText(els.detailsEyebrow, c.detailsEyebrow);
    setText(els.detailsTitle, c.detailsTitle);
    setText(els.labelClient, c.labelClient);
    setText(els.labelDate, c.labelDate);
    setText(els.labelTime, c.labelTime);
    setText(els.labelLocation, c.labelLocation);
    setText(els.labelMeetingPoint, c.labelMeetingPoint);
    setText(els.labelDuration, c.labelDuration);
    setText(els.labelType, c.labelType);
    setText(els.labelDress, c.labelDress);
    setText(els.labelNotes, c.labelNotes);
    setText(els.miniSessionIdLabel, c.miniSessionId);
    setText(els.miniEtaLabel, c.miniEta);
    setText(els.miniTravelModeLabel, c.miniTravelMode);
    setText(els.miniCompensationLabel, c.miniCompensation);
    setText(els.travelEyebrow, c.travelEyebrow);
    setText(els.travelTitle, c.travelTitle);
    setText(els.routeStartTitle, c.routeStartTitle);
    setText(els.routeStartCopy, c.routeStartCopy);
    setText(els.routeShareTitle, c.routeShareTitle);
    setText(els.routeArrivedTitle, c.routeArrivedTitle);
    setText(els.mapTitle, c.mapTitle);
    setText(els.fromLabel, c.fromLabel);
    setText(els.toLabel, c.toLabel);
    setText(els.locationStatusLabel, c.locationStatusLabel);
    setText(els.progressLabel, c.progressLabel);
    setText(els.actionEyebrow, c.actionEyebrow);
    setText(els.rulesEyebrow, c.rulesEyebrow);
    setText(els.rulesTitle, c.rulesTitle);
  }

  function renderDataValues() {
    setText(els.heroTimeText, state.job.timeLabel);
    setText(els.heroEtaText, state.job.etaLabel);
    setText(els.heroTravelModeText, state.job.travelMode);
    setText(els.priorityText, state.job.priorityLabel);
    setText(els.districtText, state.job.district);
    setText(els.detailClient, state.job.clientName);
    setText(els.detailDate, state.job.dateLabel);
    setText(els.detailTime, state.job.timeLabel);
    setText(els.detailLocation, state.job.location);
    setText(els.detailMeetingPoint, state.job.meetingPoint);
    setText(els.detailDuration, state.job.durationLabel);
    setText(els.detailType, state.job.typeLabel);
    setText(els.detailDress, state.job.dressLabel);
    setText(els.detailNotes, state.job.notes);
    setText(els.detailSessionId, state.job.sessionId);
    setText(els.detailEta, state.job.etaLabel);
    setText(els.detailTravelMode, state.job.travelMode);
    setText(els.detailCompensation, state.job.compensationLabel);
    setText(els.fromText, state.job.fromLabel);
    setText(els.toText, state.job.location);
  }

  function renderTravelPanel() {
    var c = getCopy();
    if (els.shareLocationDot) els.shareLocationDot.className = "mmd-route-dot";
    if (els.arrivedDot) els.arrivedDot.className = "mmd-route-dot";

    if (state.job.status === "confirmed") {
      setText(els.shareLocationStatusText, c.assigned.shareLocationStatus);
      setText(els.arrivedStatusText, c.assigned.arrivedStatus);
      setText(els.mapSubtext, c.assigned.mapSubtext);
      setText(els.locationStatusText, c.assigned.locationStatus);
      setText(els.progressText, c.assigned.progress);
      setText(els.mapEtaBadge, c.assigned.etaBadge + state.job.etaLabel);
    }

    if (state.job.status === "en_route") {
      if (state.job.locationSharingActive) {
        if (els.shareLocationDot) els.shareLocationDot.classList.add("is-live");
        setText(els.shareLocationStatusText, c.traveling.shareLocationStatusActive);
        setText(els.locationStatusText, c.traveling.locationStatusActive);
      } else {
        if (els.shareLocationDot) els.shareLocationDot.classList.add("is-start");
        setText(els.shareLocationStatusText, c.traveling.shareLocationStatusInactive);
        setText(els.locationStatusText, c.traveling.locationStatusInactive);
      }
      setText(els.arrivedStatusText, c.traveling.arrivedStatus);
      setText(els.mapSubtext, c.traveling.mapSubtext);
      setText(els.progressText, c.traveling.progress);
      setText(els.mapEtaBadge, c.traveling.etaBadge + state.job.etaLabel);
    }

    if (state.job.status === "arrived") {
      if (els.shareLocationDot) els.shareLocationDot.classList.add("is-done");
      if (els.arrivedDot) els.arrivedDot.classList.add("is-done");
      setText(els.shareLocationStatusText, c.arrived.shareLocationStatus);
      setText(els.arrivedStatusText, c.arrived.arrivedStatus);
      setText(els.mapSubtext, c.arrived.mapSubtext);
      setText(els.locationStatusText, c.arrived.locationStatus);
      setText(els.progressText, c.arrived.progress);
      setText(els.mapEtaBadge, c.arrived.etaBadge);
    }

    if (state.job.status === "met_customer") {
      if (els.shareLocationDot) els.shareLocationDot.classList.add("is-done");
      if (els.arrivedDot) els.arrivedDot.classList.add("is-done");
      setText(els.shareLocationStatusText, c.met.shareLocationStatus);
      setText(els.arrivedStatusText, c.met.arrivedStatus);
      setText(els.mapSubtext, c.met.mapSubtext);
      setText(els.locationStatusText, c.met.locationStatus);
      setText(els.progressText, c.met.progress);
      setText(els.mapEtaBadge, c.met.etaBadge);
    }
  }

  function renderActionPanel() {
    var c = getCopy();
    if (els.assignedActions) els.assignedActions.classList.add("is-hidden");
    if (els.travelingActions) els.travelingActions.classList.add("is-hidden");
    if (els.arrivedActions) els.arrivedActions.classList.add("is-hidden");
    if (els.successBox) els.successBox.classList.add("is-hidden");

    if (state.job.status === "confirmed") {
      setText(els.heroTitle, c.assigned.heroTitle);
      setText(els.heroSubtitle, c.assigned.heroSubtitle);
      setText(els.heroStatusText, c.assigned.status);
      setText(els.statusBadge, c.assigned.status);
      if (els.statusBadge) els.statusBadge.className = "mmd-status-badge is-assigned";
      setText(els.actionTitle, c.assigned.actionTitle);
      setText(els.actionCopy, c.assigned.actionCopy);
      setText(els.startTravelBtn, c.assigned.startTravelBtn);
      setText(els.openSessionBtnA, c.assigned.openSessionBtn);
      setText(els.rule1, c.assigned.rule1);
      setText(els.rule2, c.assigned.rule2);
      setText(els.rule3, c.assigned.rule3);
      if (els.rule4) els.rule4.innerHTML = c.rule4Html;
      if (els.assignedActions) els.assignedActions.classList.remove("is-hidden");
    }

    if (state.job.status === "en_route") {
      setText(els.heroTitle, c.traveling.heroTitle);
      setText(els.heroSubtitle, c.traveling.heroSubtitle);
      setText(els.heroStatusText, c.traveling.status);
      setText(els.statusBadge, c.traveling.status);
      if (els.statusBadge) els.statusBadge.className = "mmd-status-badge is-traveling";
      setText(els.actionTitle, c.traveling.actionTitle);
      setText(els.actionCopy, c.traveling.actionCopy);
      setText(els.shareLocationBtn, c.traveling.shareLocationBtn);
      setText(els.sendUpdateBtn, c.traveling.sendUpdateBtn);
      setText(els.arrivedBtn, c.traveling.arrivedBtn);
      setText(els.rule1, c.assigned.rule1);
      setText(els.rule2, c.assigned.rule2);
      setText(els.rule3, c.assigned.rule3);
      if (els.rule4) els.rule4.innerHTML = c.rule4Html;
      if (els.travelingActions) els.travelingActions.classList.remove("is-hidden");
      if (els.successBox) els.successBox.classList.remove("is-hidden");
      setText(els.successTitle, c.traveling.successTitle);
      setText(els.successCopy, state.job.locationSharingActive ? c.traveling.successCopyActive : c.traveling.successCopyInactive);
    }

    if (state.job.status === "arrived") {
      setText(els.heroTitle, c.arrived.heroTitle);
      setText(els.heroSubtitle, c.arrived.heroSubtitle);
      setText(els.heroStatusText, c.arrived.status);
      setText(els.statusBadge, c.arrived.status);
      if (els.statusBadge) els.statusBadge.className = "mmd-status-badge is-arrived";
      setText(els.actionTitle, c.arrived.actionTitle);
      setText(els.actionCopy, c.arrived.actionCopy);
      setText(els.metClientBtn, c.arrived.metClientBtn);
      setText(els.openSessionBtnB, c.arrived.openSessionBtn);
      setText(els.rule1, c.assigned.rule1);
      setText(els.rule2, c.assigned.rule2);
      setText(els.rule3, c.assigned.rule3);
      if (els.rule4) els.rule4.innerHTML = c.rule4Html;
      if (els.arrivedActions) els.arrivedActions.classList.remove("is-hidden");
      if (els.successBox) els.successBox.classList.remove("is-hidden");
      setText(els.successTitle, c.arrived.successTitle);
      setText(els.successCopy, c.arrived.successCopy);
    }

    if (state.job.status === "met_customer") {
      setText(els.heroTitle, c.met.heroTitle);
      setText(els.heroSubtitle, c.met.heroSubtitle);
      setText(els.heroStatusText, c.met.status);
      setText(els.statusBadge, c.met.status);
      if (els.statusBadge) els.statusBadge.className = "mmd-status-badge is-arrived";
      setText(els.actionTitle, c.met.actionTitle);
      setText(els.actionCopy, c.met.actionCopy);
      setText(els.metClientBtn, c.met.metClientBtn);
      setText(els.openSessionBtnB, c.met.openSessionBtn);
      setText(els.rule1, c.assigned.rule1);
      setText(els.rule2, c.assigned.rule2);
      setText(els.rule3, c.assigned.rule3);
      if (els.rule4) els.rule4.innerHTML = c.rule4Html;
      if (els.arrivedActions) els.arrivedActions.classList.remove("is-hidden");
      if (els.successBox) els.successBox.classList.remove("is-hidden");
      setText(els.successTitle, c.met.successTitle);
      setText(els.successCopy, c.met.successCopy);
    }
  }

  function render() {
    setLangButtons();
    setAssets();
    setLinks();
    renderStaticText();
    renderDataValues();
    setStageState();
    renderTravelPanel();
    renderActionPanel();
  }

  async function sendJson(urlToSend, payload) {
    var res = await fetch(urlToSend, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    var raw = await res.text();
    var data = null;
    try {
      data = raw ? JSON.parse(raw) : null;
    } catch (err) {
      data = { raw: raw };
    }
    if (!res.ok) {
      throw new Error((data && (data.message || data.error)) || getCopy().toasts.requestFailed);
    }
    return data || {};
  }

  async function doTransition(pathTemplate, successMessage, nextStatus, extraUpdater) {
    if (state.isBusy) return;
    setBusy(true);
    try {
      if (tParam) {
        await sendJson(buildApiUrl(pathTemplate), { t: tParam });
      }
      if (typeof extraUpdater === "function") extraUpdater();
      state.job.status = nextStatus;
      render();
      showToast(successMessage);
    } catch (err) {
      showToast(err.message || getCopy().toasts.requestFailed);
    } finally {
      setBusy(false);
    }
  }

  function handleStartTravel() {
    if (state.job.status === "en_route") {
      window.location.href = state.job.sessionDeepLink;
      return;
    }
    doTransition(CONFIG.startTravelPathTemplate, getCopy().toasts.travelStarted, "en_route");
  }

  function handleShareLocation() {
    doTransition(CONFIG.shareLocationPathTemplate, getCopy().toasts.locationShared, "en_route", function () {
      state.job.locationSharingActive = true;
    });
  }

  function handleArrived() {
    doTransition(CONFIG.arrivedPathTemplate, getCopy().toasts.arrivalRecorded, "arrived");
  }

  function handleMetClient() {
    if (state.job.status === "met_customer") {
      window.location.href = state.job.sessionDeepLink;
      return;
    }
    doTransition(CONFIG.metClientPathTemplate, getCopy().toasts.metClient, "met_customer", function () {
      state.job.locationSharingActive = true;
    });
  }

  function handleSendUpdate() {
    var c = getCopy();
    showToast(state.job.locationSharingActive ? c.toasts.liveRouteActive : c.toasts.updateSent);
  }

  function setLanguage(lang) {
    state.lang = lang === "en" ? "en" : "th";
    render();
  }

  if (els.langThBtn) els.langThBtn.addEventListener("click", function () { setLanguage("th"); });
  if (els.langEnBtn) els.langEnBtn.addEventListener("click", function () { setLanguage("en"); });
  if (els.startTravelBtn) els.startTravelBtn.addEventListener("click", handleStartTravel);
  if (els.shareLocationBtn) els.shareLocationBtn.addEventListener("click", handleShareLocation);
  if (els.arrivedBtn) els.arrivedBtn.addEventListener("click", handleArrived);
  if (els.metClientBtn) els.metClientBtn.addEventListener("click", handleMetClient);
  if (els.sendUpdateBtn) els.sendUpdateBtn.addEventListener("click", handleSendUpdate);

  render();
})();
