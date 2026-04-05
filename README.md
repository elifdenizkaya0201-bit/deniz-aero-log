DenizAeroLog is a modern personal web project (inspired by "strawpage") inspired by the **Frutiger Aero** aesthetic (late 2000s). It combines a glossy, nostalgic user interface with an interactive physics-based background game and a secure, real-time messaging system.

## Live Demo
Check out the live site on Netlify (https://deniz-aero-log.netlify.app)

---

## Key Features

### 1. Frame-Rate Independent Interactive Game
The background features a dynamic game built using **HTML5 Canvas**. 
- **Challenge:** Initial builds ran too fast on high-refresh-rate displays (120Hz/144Hz).
- **Solution:** Implemented a **Delta Time** calculation system to ensure consistent game physics and movement speed across all hardware configurations (from 60Hz to 144Hz+).

### 2. Secure Guestbook (Backend-as-a-Service)
A real-time "Drop a Note" section allows visitors to leave anonymous messages.
- **Technology:** Integrated with **Supabase (PostgreSQL)**.
- **Security:** Hardened via **Row Level Security (RLS)** policies.
  - **INSERT:** Public users can only create new entries (anonymous).
  - **SELECT:** Restricted to display only entries that have been reviewed and answered by the admin (`answer IS NOT NULL`).
  - **DELETE/UPDATE:** Completely restricted at the database level to prevent unauthorized data manipulation.

### 3. Frutiger Aero UI/UX
- Implemented **Glassmorphism** and glossy textures using advanced CSS3.
- Fully **Responsive Design** using dynamic units (`dvh`, `rem`, `flexbox`) to ensure a seamless experience on both mobile and desktop devices.

---

## Technical Stack

- **Frontend:** Vanilla JavaScript, HTML5 Canvas, CSS3
- **Backend:** Supabase (Auth, Database, RLS)
- **Deployment:** Netlify (Continuous Deployment via GitHub)

---

## Project Structure

```text
├── assets/             # Images, Icons, and Media
├── css/                # Style sheets (Aero aesthetic & Layout)
├── js/                 # Logic
│   ├── game.js         # Canvas engine & Physics (Delta Time)
│   └── supabase.js     # Database connection & Message handling
├── index.html          # Main Landing Page
└── ask.html            # Guestbook / Interactive Message Page
