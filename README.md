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
