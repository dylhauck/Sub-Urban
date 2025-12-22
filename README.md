# SUB•URBAN — Future-Ready Womenswear (Frontend)

SUB•URBAN is a modern, fashion-focused e-commerce frontend built with vanilla HTML, CSS, and JavaScript.  
The site emphasizes clean UI, responsive layouts, and lightweight client-side functionality without a framework.

Live demo: https://dylhauck.github.io/Sub-Urban/

---

## ✨ Features

### Navigation & UI
- Responsive header with dropdown menus (Sets, My Account)
- Active page highlighting in the nav
- Mobile drawer navigation
- Accessible menu controls (keyboard + ARIA)

### Authentication (Client-side)
- Login / Create Account UI
- Firebase authentication integration
- Dynamic “My Account” menu state
- Auto login state detection

### Product Pages
- Reusable product card layout
- Category pages:
  - New Arrivals
  - Tops
  - Bottoms
  - Sets
- Consistent grid layout across pages
- Wishlist buttons on all products

### Wishlist
- Add / remove items
- LocalStorage persistence
- Wishlist page
- Works across all product grids

### Contact Page
- Clean, centered form layout
- Styled textarea and inputs
- Backend submission via Formspree
- Success message on submit
- Button disabled after submission to prevent duplicates

### Design
- Glassmorphism-inspired sections
- Gradient brand accents
- Light/dark friendly contrast fixes
- Consistent button styling site-wide

---

## 🧱 Tech Stack

- **HTML5**
- **CSS3**
  - Flexbox & Grid
  - Custom properties (CSS variables)
- **Vanilla JavaScript**
- **Firebase Auth**
- **Formspree** (contact form backend)
- **GitHub Pages** (hosting)

No frameworks. No build step.

---

## 📂 Project Structure

/

├── index.html

├── new-arrivals.html

├── tops.html

├── bottoms.html

├── pant-sets.html

├── skirt-sets.html

├── short-sets.html

├── product.html

├── wishlist.html

├── account.html

├── orders.html

├── login.html

├── contact.html

├── terms.html

│

├── style.css

├── script.js

├── auth.js

├── wishlist.js

│

├── images/

└── README.md

---

## ⚙️ JavaScript Overview

### `script.js`
- Header dropdown wiring
- Drawer menu logic
- Active nav highlighting
- Contact form submit handling
- Global debug helpers (`window._SUBURBAN_NAV__`)

### `auth.js`
- Firebase initialization
- Login / logout handling
- Account menu state switching

### `wishlist.js`
- Wishlist add/remove
- LocalStorage syncing
- Wishlist page rendering

---

## 📬 Contact Form Setup

The contact form submits to Formspree:

```html
<form action="https://formspree.io/f/mqayezez" method="POST">
