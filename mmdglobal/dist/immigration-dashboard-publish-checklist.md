# Immigration Dashboard Publish Checklist

Use these files:

- Customer page embed: [customer-dashboard-webflow-snippet.html](/Users/Hiright_1/Desktop/MMDMaleModel/MMDPrive/mmd-i18n/mmdglobal/dist/customer-dashboard-webflow-snippet.html)
- Model page embed: [model-dashboard-webflow-snippet.html](/Users/Hiright_1/Desktop/MMDMaleModel/MMDPrive/mmd-i18n/mmdglobal/dist/model-dashboard-webflow-snippet.html)
- Shared footer JS: [mmd-immigration-dashboard.js](/Users/Hiright_1/Desktop/MMDMaleModel/MMDPrive/mmd-i18n/mmdglobal/dist/mmd-immigration-dashboard.js)

## 1. Create the pages

- Create `/dashboard/customer`
- Create `/dashboard/model`

## 2. Paste the right embed block

- On `/dashboard/customer`, paste the full contents of `customer-dashboard-webflow-snippet.html`
- On `/dashboard/model`, paste the full contents of `model-dashboard-webflow-snippet.html`

## 3. Add the shared JS

- Paste the full contents of `mmd-immigration-dashboard.js` into the page footer custom code on both pages
- Do not rename the root id; it must stay `mmd-immigration-dashboard`

## 4. Keep the resolve endpoint

- `data-resolve-endpoint` should stay `https://www.mmdbkk.com/member/api/invite/resolve`
- The dashboard expects `?t=...` in the URL

## 5. Test customer

- Open a generated `customer_dashboard_url`
- Confirm the page shows:
  - `Customer Dashboard`
  - `Immigration ID`
  - customer identity fields
  - model bundle
  - action buttons if routes are present

## 6. Test model

- Open a generated `model_dashboard_url`
- Confirm the page shows:
  - `Model Dashboard`
  - binding / compliance fields
  - customer context
  - console / rules buttons if routes are present

## 7. Failure states to check

- Missing `t` should show `Missing token in URL.`
- Expired token should show an error from `/member/api/invite/resolve`
- Wrong page role vs token role should still render, but the mismatch will be visible in the card data

## 8. Dependency note

- These dashboards only render what the invite resolve route returns right now
- If you want richer cards later, extend the resolve payload first, then map the new fields in `mmd-immigration-dashboard.js`
