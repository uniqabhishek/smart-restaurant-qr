# 🍽️ RestoFlow ONE • Smart QR Restaurant Dine-In & Kitchen Ecosystem

> *"Your waiter can't be at every table at once. But your website can."*  
> Inspired by the viral Instagram Reel by [@shahfahid.dev](https://www.instagram.com/reel/DfgdpeWIHv9/)

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-f97316?style=for-the-badge&logo=github)](https://uniqabhishek.github.io/smart-restaurant-qr/)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🔐 Multi-Role Authentication & 3 Dedicated Interfaces

RestoFlow ONE features dedicated interfaces and an authentication system (Login & Sign Up) supporting three roles:

| Role | Interface Highlights | 1-Click Demo Account |
| :--- | :--- | :--- |
| **👑 Restaurant Owner** | Full Executive Command Center, live revenue ticker, table occupancy analytics, interactive floor radar, supervisor kitchen monitor, menu item price editor & stock toggle, table QR card studio. | **`owner@resto.com`** / `owner123` |
| **👨‍🍳 Kitchen Chef** | Focused, high-efficiency Kitchen Display System (KDS) Kanban board (`NEW`, `COOKING`, `READY`, `SERVED`), preparation countdown timers, dish allergen warnings, special requests, and native procedural audio bells. | **`chef@resto.com`** / `chef123` |
| **📱 Customer** | Seamless mobile table dining (`Table 1–8`), digital menu with allergen filters and spice level gauges, live order progress stepper, complimentary Wi-Fi password copy, waiter call button, bill splitting, multi-gateway payments, and loyalty rewards points. | **`customer@resto.com`** / `cust123` |

---

## 🌟 The 6-Step Workflow Demonstrated in the Reel

| Step | Feature | Description |
| :--- | :--- | :--- |
| **Step 1/6** | **Table QR Display** | Each table has an acrylic tent card (e.g. *Scan for menu • TABLE 4*). Guests scan with any camera to instantly connect without apps or logins. |
| **Step 2/6** | **Complete Digital Menu** | Rich dish photography, live pricing, allergen warning pills (*Dairy, Nuts, Gluten*), 4-level segmented spice gauges, portion size selectors (*Small, Medium, Large*), and custom notes. |
| **Step 3/6** | **Live Kitchen Display (KDS)** | *"1 tablet • zero shouting"*. Real-time Kanban pipeline (`NEW` ➔ `COOKING` ➔ `READY` ➔ `SERVED`) with active countdown timers, allergy badges, and chime bells. |
| **Step 4/6** | **While They Wait** | Live 4-stage stepper order tracker (`Received ➔ Cooking ➔ Ready ➔ Served`), complimentary Guest Wi-Fi card with 1-tap password copy, and "Today's Special" upselling banner. |
| **Step 5/6** | **Staff Live Floor Map** | Architectural 2D dining room layout (Tables T1 to T8). When a guest taps **Call Waiter**, an animated pulsing orange radar ring and chime alert staff immediately. |
| **Step 6/6** | **Bill Split, Tip & Pay + 1-Tap Review** | Line-by-line itemized tab, 2/3/4-way bill splitting calculator, quick tip selector (5%, 10%, 15%, 20%), multi-gateway payment (Apple Pay, Google Pay, Card, Bank/UPI, Cash), followed by a 1-tap 5-star review modal with celebratory confetti! |

---

## 🚀 Key Modules & Architecture

### 📱 1. Guest Dine-In Mobile Experience
- **Zero-Download Web App**: Opens directly via `?table=4` (or any table 1–8).
- **Interactive Dish Customizer**:
  - Live portion size selection with dynamic price offsets.
  - Heat level selector (Mild to Extra Hot).
  - Special kitchen notes (e.g., *"Less oil, extra ginger"*).
- **1-Tap Waiter Call**: Guests choose from *"Call Waiter"*, *"Refill Water"*, *"Extra Cutlery"*, *"Clean Table"*, or *"Request Bill"*.
- **Bill Splitting Engine**: Instant calculation of per-person amounts for group dining.
- **5-Star Review Widget**: 1-tap feedback tags with confetti celebration.

### 👨‍🍳 2. Kitchen Display System (KDS)
- **Kanban Ticket Columns**:
  - **NEW ORDERS**: Flashing alerts with incoming tickets.
  - **COOKING IN WOK**: Active preparation tickets with elapsed color-coded timers (Green `< 8m`, Amber `8-15m`, Red `> 15m`).
  - **READY FOR RUNNER**: Plated dishes waiting for service.
  - **SERVED**: Historical delivery log.
- **Acoustic Feedback**: Synthesized kitchen bell chimes powered by the Web Audio API.

### 🗺️ 3. Staff Live Floor Map
- **2D Visual Layout**: Tables T1 through T8 with different layouts (Booths, Square 4-seaters, Round Family 6-seaters, VIP 8-seater).
- **Radar Wave Pulsing**: Expanding concentric radar waves pulse around any table calling for service.
- **Table Inspector**: Tap any table to inspect guest occupancy, bill subtotal, items ordered, or acknowledge waiter calls.

### 📊 4. Manager KPI Dashboard
- **Real-Time KPIs**: Live Active Orders, Table Occupancy Rate, Today's Sales Counter, and Customer Satisfaction rating.
- **Hourly Guest Flow Chart**: Bar graph showcasing lunch and dinner rush patterns.
- **Top Dishes Leaderboard**: Demand and revenue rankings for menu items.

### 🖨️ 5. Table QR Code Station
- Live generated scannable QR codes for all 8 tables.
- Table tent card preview with 1-click **Download High-Res QR Card (.PNG)** and **Print Table Tent Card**.

---

## ⚡ 100% Client-Side Real-Time Reactivity

RestoFlow uses a dual synchronization layer:
1. **`BroadcastChannel('resto_channel')`**: Instant cross-tab communication. Open the Guest View in one tab/phone and the Kitchen KDS in another tab; placing an order in the guest tab updates the KDS in real time!
2. **`localStorage` State Persistence**: Orders, table occupancies, and review histories persist across page refreshes.
3. **Web Audio API**: Native procedural sound effects (kitchen order chime, waiter attention ping, payment success) without external mp3 downloads.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Generation**: [qrcode](https://www.npmjs.com/package/qrcode)
- **Visual FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Engine**: Native Browser Web Audio API

---

## 💻 Local Development

```bash
# Clone the repository
git clone https://github.com/uniqabhishek/smart-restaurant-qr.git

# Navigate into project directory
cd smart-restaurant-qr

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🌐 Live Deployment on GitHub Pages

The application is deployed live on GitHub Pages:  
👉 **[https://uniqabhishek.github.io/smart-restaurant-qr/](https://uniqabhishek.github.io/smart-restaurant-qr/)**

---

## 📄 License

This project is licensed under the MIT License.
