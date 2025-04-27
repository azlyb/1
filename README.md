# 📇 iCloud Contacts Manager (Local Version)

A simple web app to create, manage, and organize your iCloud-style contacts — right from your browser!  
Everything works **locally** with your own **local server** (no internet needed).

---

## 🚀 Features

- Create new contacts with full details
- Automatically capitalize names and addresses
- Malaysian phone number formatting (+60)
- Birthday formatting (DD/MM/YYYY)
- Dark Mode toggle 🌙
- Manage contacts (basic load, select all, delete placeholder, export placeholder)
- Upload VCF files (future bonus upgrade!)

---

## 📁 Project Structure
index.html      # Main webpage (Create + Manage Contacts)
styles.css      # Styling (light mode + dark mode)
script.js       # Full functionality (create, save, manage)
server.js       # Simple local JSON server (contacts storage)
db.json         # Contact database (auto created)
README.md       # Project guide (this file!)
---

## 🛠️ How to Run (Local Setup)

1. **Install Node.js** if you don't have it: [Download Node.js](https://nodejs.org/)

2. **Create project folder** and add:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `server.js`

3. **Initialize project** inside folder:
   ```bash
   npm init -y
