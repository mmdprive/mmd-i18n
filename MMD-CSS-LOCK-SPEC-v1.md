# MMD CSS Lock Spec v1

## Purpose
เอกสารนี้กำหนดขอบเขตการ “lock” สำหรับระบบ CSS ของ MMD เพื่อให้หน้า payment, membership, renewal, confirm และหน้าที่ต่อยอดในอนาคตมีความสม่ำเสมอ ดูพรีเมียม และไม่หลุดจาก brand direction ของ MMD Privé

แกนหลักของระบบนี้คือ  
**Black × Gold / Premium / Calm / Clean / Discreet / Controlled**

---

## 1) Hard Lock

รายการต่อไปนี้ถือเป็น **immutable design contract**  
ห้ามเปลี่ยนโดยไม่มีการอนุมัติใหม่

### 1.1 Brand Direction
- โทนหลักของระบบต้องเป็น **Black × Gold**
- mood ต้องเป็น luxury, premium, matte, calm, discreet
- หลีกเลี่ยงสีสดจัด, neon, candy tone, playful UI
- หลีกเลี่ยง visual language ที่ดู mass market หรือ cheap

### 1.2 Token Naming Contract
ชื่อ token หลักต้องคงที่ ห้ามเปลี่ยนชื่อเองกลางระบบ เช่น

```css
--mmd-txt
--mmd-muted
--mmd-line
--mmd-line-soft
--mmd-line-strong
--mmd-panel
--mmd-gold-1
--mmd-gold-2
--mmd-gold-3
--mmd-gold-line
--mmd-gold-line-strong
--mmd-gold-soft
--mmd-gold-text
--mmd-shadow
--mmd-shadow-soft
--mmd-shadow-gold
--mmd-r14
--mmd-r18
--mmd-r22
--mmd-r28
```

กติกา:
- เปลี่ยนค่าได้ใน soft-lock scope
- แต่ **ห้ามเปลี่ยนชื่อ token** ถ้ายังใช้เป็นระบบกลาง

### 1.3 Component Class Naming Contract
ชื่อ component class หลักต่อไปนี้ต้องถือเป็นแกนระบบ

```css
.mmd-system
.mmd-wrap
.mmd-wrap-sm
.mmd-card
.mmd-block
.mmd-panel
.mmd-summary
.mmd-select
.mmd-badge
.mmd-pill
.mmd-input
.mmd-textarea
.mmd-select-input
.mmd-btn
.mmd-status
.mmd-toast
.mmd-actions
```

กติกา:
- ห้าม rename แบบแตกสาขาเอง
- ถ้าจะสร้าง variant ให้ต่อ suffix/modifier แทน เช่น  
  `.mmd-btn--gold`, `.mmd-btn--ghost`

### 1.4 State Naming Contract
state ของ component ต้องใช้รูปแบบเดิมเท่านั้น

```css
.is-active
.good
.warn
.bad
```

status meaning:
- `.good` = success / confirmed / verified
- `.warn` = caution / pending / needs attention
- `.bad` = invalid / failed / rejected

ห้ามใช้ state ใหม่มั่ว ๆ เช่น `.selected-now`, `.red-state`, `.active2`

### 1.5 Core Radius / Spacing Scale
scale หลักของระบบถือเป็น hard lock

- radius หลัก:
  - `--mmd-r14`
  - `--mmd-r18`
  - `--mmd-r22`
  - `--mmd-r28`

- spacing หลัก:
  - 6 / 8 / 10 / 12 / 14 / 16 / 18 / 22 / 28 / 30 / 40 / 60

ห้ามเพิ่มเลขสุ่มเยอะเกินจำเป็น เช่น 13, 17, 21, 27 เต็มระบบจน scale แตก

### 1.6 Interaction Pattern
interaction หลักของ component selectable ต้องคงรูปแบบนี้
- default = dark matte
- hover = lift ขึ้นเล็กน้อย + depth เพิ่ม
- active = gold emphasis + stronger border/shadow
- focus-visible = gold accessibility ring

ห้ามเปลี่ยนให้เป็น
- bounce
- flashy glow
- overscaled hover
- cartoon transitions

### 1.7 Primary / Secondary Action Hierarchy
ลำดับปุ่มต้องคงที่
- gold button = primary CTA
- ghost / soft = secondary CTA

ห้ามสลับ hierarchy โดยไม่มีเหตุผลเชิง UX

---

## 2) Soft Lock

รายการต่อไปนี้เป็น default ที่ควรยึดไว้ แต่ปรับได้ถ้ามีเหตุผลตามหน้า

### 2.1 Exact Token Values
ค่า exact ของ token ต่อไปนี้ปรับได้ โดยไม่เปลี่ยนชื่อ
- alpha ของ line
- ความเข้มของ muted text
- shadow intensity
- panel opacity
- exact gold tint

### 2.2 Typography Scale
ปรับขนาดจริงได้ในบางหน้า เช่น
- h1
- h2
- h3
- summary number
- hero headline

แต่ต้องยังคง mood premium และ hierarchy ชัด

### 2.3 Layout Width
ปรับได้:
- `--mmd-container`
- `--mmd-container-sm`
- grid 2/3 columns
- block spacing ต่อหน้า

### 2.4 Summary Card Layout
summary card อาจปรับได้ตาม use case เช่น
- membership summary
- renewal summary
- payment confirmation summary

แต่ห้ามหลุด concept ของ:
- elevated premium panel
- calm typography
- muted metadata
- strong total row

### 2.5 Hero Composition
ปรับได้ตามหน้า:
- image crop
- image position
- overlay intensity
- headline arrangement

แต่ยังต้องอยู่ในโทน black-gold premium

---

## 3) Flexible Layer

สิ่งต่อไปนี้เปิดให้เปลี่ยนได้ตาม campaign / page / narrative

- hero background image
- decorative gradients
- marketing copy blocks
- campaign-specific promo sections
- seasonal art direction
- animation details
- custom page-only decorative elements

กติกา:
- ห้ามทำให้ชนกับ hard lock
- ห้ามทำให้ premium tone พัง
- ห้ามทำให้ component กลางเสีย consistency

---

## 4) File Layering Rule

โครงสร้างที่แนะนำ:

### `mmd-system.css`
สถานะ: **Hard Lock**
ใช้เก็บ
- token names
- core components
- buttons
- form styles
- selectable card states
- status/toast states
- base layout helpers

### `mmd-membership.css`
สถานะ: **Soft Lock**
ใช้เก็บ
- membership-specific layout
- package grid tuning
- summary variants
- membership page sections

### `mmd-payment.css`
สถานะ: **Soft Lock**
ใช้เก็บ
- payment UI layer
- qr box
- slip upload
- payment notes
- payment instructions
- confirm/status page layer

### page-specific css
สถานะ: **Flexible**
เช่น
- `mmd-pay-renewal.css`
- `mmd-pay-membership.css`
- `mmd-confirm.css`

ใช้เก็บเฉพาะ page treatment ไม่ควรแบก token กลางซ้ำ

---

## 5) Change Rules

### ต้องขออนุมัติก่อนเปลี่ยน
- token names
- component class names
- state names
- brand direction
- primary/secondary button hierarchy
- radius scale หลัก
- naming convention ของระบบ

### เปลี่ยนได้โดยไม่ต้อง re-approve ทั้งระบบ
- shadow softness
- spacing tuning บาง section
- container width บางหน้า
- hero image crop
- summary layout details
- text size tuning เฉพาะหน้า

### ถ้าจะเพิ่ม component ใหม่
ต้องทำตามกติกานี้
- prefix `mmd-`
- ตั้งชื่อสื่อความหมายตรง
- มี role ชัดเจน
- ไม่ซ้ำ component เดิมโดยไม่จำเป็น
- ถ้าเป็น variant ให้ใช้ modifier เช่น `--gold`, `--ghost`, `--compact`

---

## 6) Naming Convention

### Components
```css
.mmd-card
.mmd-summary
.mmd-status
.mmd-upload
```

### Elements
```css
.mmd-summary__head
.mmd-summary__row
.mmd-summary__title
```

### Modifiers
```css
.mmd-btn--gold
.mmd-btn--ghost
```

### States
```css
.is-active
.good
.warn
.bad
```

---

## 7) Quality Standard

ทุกหน้าในระบบ payment / membership ต้องผ่านเกณฑ์นี้

- อ่านง่ายบนพื้นดำ
- contrast ดี
- gold ใช้อย่างมีวินัย ไม่เยอะเกิน
- primary CTA เด่นชัด
- summary / price / status เห็นชัด
- form ใช้งานง่าย
- mobile ยังดู premium
- ไม่มี visual noise ที่ทำให้รู้สึก cheap

---

## 8) Final Rule

**Lock the system, not every pixel.**

ความหมายคือ
- ระบบกลางต้องนิ่ง
- หน้าเฉพาะยังต้องมีพื้นที่ให้ art direction
- แต่ทุกอย่างต้องยังดูเป็น MMD ในสายตาแรก

---

## Status

- `mmd-system.css` = HARD LOCK
- `mmd-membership.css` = SOFT LOCK
- `mmd-payment.css` = SOFT LOCK
- page-specific CSS = FLEX

## Approver

- Per

## Brand Direction

- MMD Privé Black × Gold
- Premium / Discreet / Calm / Matte Luxury
