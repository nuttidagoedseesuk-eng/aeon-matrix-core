#!/bin/bash

echo "WARNING: This will reset local changes"
read -p "continue? (y/n): " ans

if [ "$ans" = "y" ]; then
  git checkout main
  git reset --hard origin/main
  git clean -fd
  git pull origin main
fi## Ops Commands
#!/bin/bash

# =========================================================================
# AEON MATRIX CORE ENGINE - GitOps Safety Reset Script
# Protocol v1.0.0 (Cognitive Supervision Compliance)
# =========================================================================

echo "🔄 [Kaihēn Loop] เริ่มกระบวนการตรวจสอบและ Reset คลังข้อมูลระบบอย่างปลอดภัย..."

# 🔒 ล้างการเปลี่ยนแปลงที่ยังไม่ได้ Commit ใน Workspace ปัจจุบัน (ป้องกันไฟล์ขยะตกค้าง)
git reset --hard HEAD

# 🧹 กำจัดไฟล์หรือโฟลเดอร์ที่ไม่ได้อยู่ในระบบควบคุมของ Git (Untracked Files) ออกไปอย่างหมดจด
git clean -fd

echo "✅ [Kaihēn Loop] เคลียร์โครงสร้างคลังข้อมูลพร้อมทำงานร่วมกับ Guardian AI เรียบร้อยแล้ว!"
reset-safe.sh
bash scripts/git/reset-safe.sh