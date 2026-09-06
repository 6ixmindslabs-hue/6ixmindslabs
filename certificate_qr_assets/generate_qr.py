import qrcode
from PIL import Image, ImageDraw, ImageFont
import os

url = "https://docs.google.com/forms/d/e/1FAIpQLSeuviPPHwuqFD-VNLtSFAXrda4uJUUE5UOALHMpSfF6UkwaJg/viewform"

# 1. Generate QR Code with high error correction (ErrorCorrection.H allows center logo)
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=16,
    border=3
)
qr.add_data(url)
qr.make(fit=True)

# Generate image with 6ixminds purple fill color (#6D28D9 / rgb(109, 40, 217))
# Foreground: Deep vibrant brand purple, Background: White
qr_img = qr.make_image(fill_color="#6D28D9", back_color="white").convert("RGBA")

base_dir = os.path.dirname(os.path.abspath(__file__))

# 2. Add 6ixminds logo to center
logo_path = os.path.join(base_dir, "logo2.png")
if not os.path.exists(logo_path):
    logo_path = os.path.join(base_dir, "..", "6ixmindslabs", "frontend", "public", "logo2.png")

if os.path.exists(logo_path):
    logo = Image.open(logo_path).convert("RGBA")
    
    # Calculate logo size (roughly 22% of QR size)
    qr_w, qr_h = qr_img.size
    logo_size = int(qr_w * 0.22)
    logo = logo.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    
    # Create white circular badge background for logo to ensure scan reliability
    badge_size = logo_size + 16
    badge = Image.new("RGBA", (badge_size, badge_size), (0, 0, 0, 0))
    badge_draw = ImageDraw.Draw(badge)
    badge_draw.ellipse([(0, 0), (badge_size - 1, badge_size - 1)], fill=(255, 255, 255, 255), outline=(109, 40, 217, 255), width=3)
    
    # Paste logo in center of badge
    badge.paste(logo, (8, 8), logo)
    
    # Paste badge in center of QR
    pos = ((qr_w - badge_size) // 2, (qr_h - badge_size) // 2)
    qr_img.paste(badge, pos, badge)

# Save standalone QR code
standalone_path = os.path.join(base_dir, "6ixminds_certificate_qrcode.png")
qr_img.save(standalone_path)
print(f"Saved standalone QR code to: {standalone_path} ({qr_img.size})")

# 3. Create a high-quality branded poster / flyer (1200 x 1600)
flyer_w, flyer_h = 1200, 1600
flyer = Image.new("RGBA", (flyer_w, flyer_h), (255, 255, 255, 255))
draw = ImageDraw.Draw(flyer)

# Top aesthetic gradient header bar
for y in range(240):
    ratio = y / 240
    r = int(109 * (1 - ratio) + 124 * ratio)
    g = int(40 * (1 - ratio) + 58 * ratio)
    b = int(217 * (1 - ratio) + 237 * ratio)
    draw.line([(0, y), (flyer_w, y)], fill=(r, g, b, 255))

# Try loading fonts
try:
    font_bold_lg = ImageFont.truetype("arialbd.ttf", 52)
    font_bold_md = ImageFont.truetype("arialbd.ttf", 38)
    font_bold_sm = ImageFont.truetype("arialbd.ttf", 28)
    font_regular = ImageFont.truetype("arial.ttf", 26)
    font_sub = ImageFont.truetype("arial.ttf", 22)
except:
    font_bold_lg = font_bold_md = font_bold_sm = font_regular = font_sub = ImageFont.load_default()

# Header text
header_title = "6IXMINDS LABS"
header_sub = "INTERNSHIP CERTIFICATE PORTAL"
draw.text((flyer_w // 2, 75), header_title, fill=(255, 255, 255), font=font_bold_lg, anchor="mm")
draw.text((flyer_w // 2, 145), header_sub, fill=(233, 213, 255), font=font_bold_sm, anchor="mm")

# College Name Banner Box
box_y = 290
draw.rounded_rectangle([(100, box_y), (flyer_w - 100, box_y + 110)], radius=20, fill=(245, 243, 255), outline=(221, 214, 254), width=2)
draw.text((flyer_w // 2, box_y + 35), "M.P.Nachimuthu M.Jaganathan Engineering College", fill=(76, 29, 149), font=font_bold_sm, anchor="mm")
draw.text((flyer_w // 2, box_y + 75), "ECE • EEE • MECH | 2nd & 3rd Year", fill=(109, 40, 217), font=font_sub, anchor="mm")

# Action Callout
draw.text((flyer_w // 2, 460), "Scan QR Code to Register", fill=(17, 24, 39), font=font_bold_md, anchor="mm")
draw.text((flyer_w // 2, 510), "Fill out the form to receive your verified internship certificate", fill=(107, 114, 128), font=font_regular, anchor="mm")

# Paste QR code in card
qr_resized = qr_img.resize((680, 680), Image.Resampling.LANCZOS)
qr_box_y = 560
# White shadow/border container for QR
draw.rounded_rectangle([(flyer_w // 2 - 370, qr_box_y - 20), (flyer_w // 2 + 370, qr_box_y + 700)], radius=30, fill=(255, 255, 255), outline=(233, 213, 255), width=3)
flyer.paste(qr_resized, (flyer_w // 2 - 340, qr_box_y), qr_resized)

# Domains Covered Badges
badges_y = 1320
draw.text((flyer_w // 2, badges_y), "DOMAINS: Embedded IoT  |  PCB Design", fill=(109, 40, 217), font=font_bold_sm, anchor="mm")
draw.text((flyer_w // 2, badges_y + 45), "Duration: 1 Week Internship Program", fill=(75, 85, 99), font=font_regular, anchor="mm")

# Footer bar
draw.rectangle([(0, flyer_h - 70), (flyer_w, flyer_h)], fill=(17, 24, 39, 255))
draw.text((flyer_w // 2, flyer_h - 35), "Powered by 6ixminds Labs • Official Verification Portal", fill=(156, 163, 175), font=font_sub, anchor="mm")

flyer_path = os.path.join(base_dir, "6ixminds_certificate_registration_flyer.png")
flyer.convert("RGB").save(flyer_path, quality=95)
print(f"Saved branded registration flyer to: {flyer_path} ({flyer.size})")
