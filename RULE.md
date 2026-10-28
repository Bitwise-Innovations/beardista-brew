Follow RULE.md. Plan first in 5 bullets max and wait for my OK.

Files you may edit: src/features/landing/StayConnected.jsx and src/app/CustomerApp.jsx only.

Goal: In StayConnected.jsx, remove everything about Wi-Fi (QR image import, Wi-Fi name, password, show/copy buttons, the wifi prop). Replace it with a "Stay Connected" section of social media and coffee app links. In CustomerApp.jsx, remove wifiData from the import and render <StayConnected /> with no props.

Layout:
1. Desktop (md and up): all 5 icons in one row, evenly spaced, each icon inside a circle with high contrast (navy #19244E circle, white icon, orange #E58422 on hover).
2. Phone (below md): 2 groups stacked. Group 1: Facebook, Instagram, TikTok. Group 2: Coffee Guru, Where to Coffee. Use flex-col md:flex-row.
3. Each icon is a link (href="#" for now, target="_blank", rel="noopener noreferrer") with a small label under it and an aria-label.
4. Tap areas at least 44px.

Keep: the same section background, heading, card container (white, border, shadow, rounded corners, padding), colors and fonts.

Icons: only lucide-react (already installed, do not install anything). Facebook = Facebook, Instagram = Instagram, TikTok = Music2 (lucide has no TikTok icon), Coffee Guru = Coffee, Where to Coffee = MapPin. No custom CSS shapes or text badges.

Do not add ordering, carts or checkout.