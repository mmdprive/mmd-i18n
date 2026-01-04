async function startPayment(method){
  const payload = window.MMD_PAYLOAD; // มาจาก Admin JSON (หัวข้อ 2)
  const depositPct = getSelectedDepositPct(); // 30 หรือ 100
  const amountDue = calcAmountDue(payload, depositPct); // net * pct

  // 1) Create/Log intent at Worker (best practice)
  const r = await fetch(`${payload.worker_base}/pay-intent`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({
      order_id: payload.order_id,
      service: payload.service,
      method,
      deposit_pct: depositPct,
      amount: amountDue,
      currency: payload.currency || "THB",
      customer: payload.customer,
      meta: payload.meta || {}
    })
  });
  const data = await r.json(); // {ok,event_id,expected_amount,promo...}
  const eventId = data.event_id || payload.order_id;

  // 2) Open payment channel
  if(method === "promptpay"){
    const pp = payload.promptpay_id.replace(/^https?:\/\//,"");
    window.open(`https://${pp}/${Math.round(amountDue)}`, "_blank", "noopener");
  } else if(method === "paypal"){
    window.open(payload.paypal_url, "_blank", "noopener");
  } else if(method === "bank"){
    openBankModal(payload.bank); // แสดง KTB details (ไม่ต้องออกนอกหน้า)
  }

  // 3) Auto redirect to confirmation (immediate or short delay)
  const u = new URL(payload.confirm_url || "/confirm/payment-confirmation", location.origin);
  u.searchParams.set("event_id", eventId);
  u.searchParams.set("order_id", payload.order_id);
  u.searchParams.set("service", payload.service);
  u.searchParams.set("amount", String(Math.round(amountDue)));
  u.searchParams.set("currency", payload.currency || "THB");
  u.searchParams.set("payment_method", method);
  u.searchParams.set("deposit_pct", String(depositPct));
  u.searchParams.set("locale", payload.locale || "th");

  // แนะนำ: 900–1500ms ให้ user เห็นว่ากดแล้ว
  setTimeout(()=> location.href = u.toString(), 1200);
}
