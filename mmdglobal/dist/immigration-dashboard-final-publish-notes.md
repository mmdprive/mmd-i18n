# Final Webflow Paste Package

ใช้ 2 ไฟล์นี้วางใน Webflow ได้ตรงๆ:

- Customer page: [customer-dashboard-webflow-final.html](/Users/Hiright_1/Desktop/MMDMaleModel/MMDPrive/mmd-i18n/mmdglobal/dist/customer-dashboard-webflow-final.html)
- Model page: [model-dashboard-webflow-final.html](/Users/Hiright_1/Desktop/MMDMaleModel/MMDPrive/mmd-i18n/mmdglobal/dist/model-dashboard-webflow-final.html)

## Customer page

- สร้างหรือเปิดหน้า `/member/dashboard`
- วางเนื้อหาทั้งไฟล์ `customer-dashboard-webflow-final.html` ลงใน embed/custom code block ของหน้า

## Model page

- สร้างหรือเปิดหน้า `/model/dashboard`
- วางเนื้อหาทั้งไฟล์ `model-dashboard-webflow-final.html` ลงใน embed/custom code block ของหน้า

## Requirements

- ทั้งสองหน้าต้องมี `?t=...` ใน URL
- ทั้งสองหน้าจะ resolve ผ่าน `https://www.mmdbkk.com/member/api/invite/resolve`

## Smoke test

- เปิด `customer_dashboard_url` จริง
- เปิด `model_dashboard_url` จริง
- ดูว่า status badge ขึ้นว่า `ตรวจ token สำเร็จและโหลด dashboard เรียบร้อยแล้ว`
