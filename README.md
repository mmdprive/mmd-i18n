# MMD CSS System

ระบบ CSS ของ MMD ถูกออกแบบให้เป็น **scoped design system** เพื่อให้หน้า payment / membership / renewal / confirm ใช้ชุด style เดียวกันได้ โดยไม่ทำให้ CSS ลามไปกระทบหน้าอื่นของเว็บ

Brand direction หลักของระบบนี้คือ:

- Black × Gold
- Premium
- Calm
- Discreet
- Matte Luxury

---

## Why this exists

ก่อนหน้านี้มีปัญหา CSS ลามทั้งเว็บจาก selector ที่กว้างเกินไป เช่น heading, text, rich text, และ page-specific heading rules ที่ไม่ได้ถูก scope อย่างชัดเจน

ระบบนี้จึงเปลี่ยนมาใช้แนวทาง **safe layer**:

- token อยู่ global ได้
- component ต้องถูก scope ใต้ `.mmd-system`
- page-specific CSS ต้องอยู่ชั้นหลังสุด

---

## Required wrapper

ทุกหน้าที่ต้องการใช้ระบบ MMD ต้องครอบด้วย wrapper นี้เสมอ:

```html
<div class="mmd-system">
  ...
</div>
```

ถ้าไม่มี wrapper นี้ ระบบ MMD จะไม่ถือว่าถูกเปิดใช้งานในหน้านั้น

---

## CSS load order

ให้เรียกไฟล์ตามลำดับนี้เสมอ:

```html
<link rel="stylesheet" href="/assets/css/mmd-system.css">
<link rel="stylesheet" href="/assets/css/mmd-membership.css">
<link rel="stylesheet" href="/assets/css/mmd-payment.css">
```

หลังจากนั้นค่อยเรียก page-specific CSS เช่น:

```html
<link rel="stylesheet" href="/assets/css/mmd-pay-membership.css">
<link rel="stylesheet" href="/assets/css/mmd-pay-renewal.css">
<link rel="stylesheet" href="/assets/css/mmd-confirm.css">
```

กติกาสำคัญ:
- `mmd-system.css` ต้องมาก่อนเสมอ
- `mmd-membership.css` และ `mmd-payment.css` เป็น layer กลาง
- page-specific CSS ต้องมาทีหลัง

---

## File roles

### `/assets/css/mmd-system.css`
สถานะ: **HARD LOCK**

ใช้เก็บ:
- token names
- core components
- buttons
- forms
- status / toast states
- layout helpers
- scoped rule ใต้ `.mmd-system`

### `/assets/css/mmd-membership.css`
สถานะ: **SOFT LOCK**

ใช้เก็บ:
- membership-specific layout
- package card layer
- membership summary
- hero/content layer ของ membership

### `/assets/css/mmd-payment.css`
สถานะ: **SOFT LOCK**

ใช้เก็บ:
- payment method layer
- qr box
- upload box
- payment instructions
- confirm/status layer

### page-specific CSS
สถานะ: **FLEX**

ตัวอย่าง:
- `/assets/css/mmd-pay-membership.css`
- `/assets/css/mmd-pay-renewal.css`
- `/assets/css/mmd-confirm.css`

ใช้เก็บเฉพาะ style ที่เป็นของหน้านั้นจริง ๆ  
ไม่ควรแบก token กลางซ้ำ

---

## Important rules

### 1. All MMD components must be scoped

ถูก:
```css
.mmd-system .mmd-card { ... }
.mmd-system .mmd-block { ... }
.mmd-system .mmd-btn { ... }
```

ผิด:
```css
.mmd-card { ... }
.mmd-block { ... }
.mmd-btn { ... }
```

---

### 2. Do not use broad global selectors for MMD UI

ห้ามใช้ selector กว้างแบบนี้ใน global:

```css
h1, h2, h3, p, li, a { ... }
.w-richtext ...
#mmd-* h2 ...
```

ถ้าจำเป็นต้องใช้ ให้ scope ใต้ `.mmd-system` เท่านั้น

---

### 3. Do not rename core tokens or components casually

ห้ามเปลี่ยนชื่อ token และ component หลักโดยไม่ re-approve เช่น:

- `--mmd-txt`
- `--mmd-muted`
- `--mmd-line`
- `--mmd-gold-*`
- `.mmd-card`
- `.mmd-block`
- `.mmd-select`
- `.mmd-btn`
- `.mmd-summary`
- `.mmd-status`
- `.mmd-toast`

---

## Lock levels

### HARD LOCK
- `.mmd-system` wrapper requirement
- CSS load order
- scoped-only rule
- token naming
- component naming
- state naming
- brand direction
- primary / secondary action hierarchy

### SOFT LOCK
- exact token values
- typography scale
- container widths
- summary layout tuning
- membership/payment visual tuning

### FLEX
- page-specific layout
- campaign visuals
- hero treatment
- decorative gradients
- animation details

---

## Example usage

```html
<link rel="stylesheet" href="/assets/css/mmd-system.css">
<link rel="stylesheet" href="/assets/css/mmd-membership.css">
<link rel="stylesheet" href="/assets/css/mmd-payment.css">
<link rel="stylesheet" href="/assets/css/mmd-pay-renewal.css">

<div class="mmd-system">
  <section class="mmd-section">
    <div class="mmd-wrap">
      <div class="mmd-card">
        <div class="mmd-block">
          <div class="mmd-block__head">
            <h2 class="mmd-h2">Renewal</h2>
            <div class="mmd-muted">Safe scoped system</div>
          </div>

          <button class="mmd-select is-active">
            <div class="mmd-select__title">Premium Renewal</div>
            <div class="mmd-select__price">THB 4,990</div>
            <div class="mmd-select__desc">Priority benefits and elevated access.</div>
          </button>
        </div>
      </div>
    </div>
  </section>
</div>
```

---

## Source of truth

ดูรายละเอียดกติกาทั้งหมดได้ที่:

```text
/MMD-CSS-LOCK-SPEC-v2.md
```

---

## Final rule

**Lock the system, not every pixel.**

ระบบกลางต้องนิ่ง  
หน้าเฉพาะยังปรับได้  
แต่ทุกอย่างต้องยังดูเป็น MMD และต้องไม่พังหน้าอื่นของเว็บ
