# Chattr — Real-Time Chat App

A real-time chat application built with Node.js, Express, and Socket.IO.
Two or more people can open it in different browser tabs/windows and chat live.
All messages are stored only in memory — closing the browser clears everything.

---

## 📁 Project Structure

```
chattr/
├── server.js          ← Node.js + Express + Socket.IO backend
├── package.json       ← Dependencies
└── public/
    ├── index.html     ← Login page (enter your name)
    ├── chat.html      ← Chat page
    ├── main.js        ← Socket.IO client logic
    └── index.css      ← All styles
```

---

## 🚀 How to Run

### 1. Install dependencies
```bash
npm install
```

### 2. Start the server
```bash
npm start
```

### 3. Open in browser
```
http://localhost:3000
```

### 4. Test with two browsers
- Open `http://localhost:3000` in **Browser 1**, enter your name → chat
- Open `http://localhost:3000` in **Browser 2**, enter another name → chat
- Both browsers will see each other's messages in real time!

---

## ⚙️ How It Works

```
Browser 1                    Server (port 3000)           Browser 2
   |                               |                           |
   |-- login event (name) -------> |                           |
   |                               |-- receive_user ---------> |
   |                               |                           |
   |-- send_message -------------> |                           |
   |                               |-- receive_message ------> |
   |                               |                           |
   |<-- receive_message -----------|-- send_message -----------|
```

- Messages are broadcast to all connected users except the sender
- When you close the browser, all messages are gone (no database)

---

## 🛠️ Technologies Used

- **Node.js** — JavaScript runtime
- **Express** — Web server
- **Socket.IO** — Real-time WebSocket communication
- **HTML5 / CSS3** — Frontend UI
- **Vanilla JavaScript** — Client-side logic
- **Google Fonts** — Josefin Sans font

---

## ✅ Bugs Fixed from Original

| Bug | Fix Applied |
|-----|------------|
| `socket.io.client` typo in importmap | Fixed to `socket.io-client` |
| Server on port 3001, client on 3000 | Both now use port 3000 |
| Socket.IO missing from server | Added `require('socket.io')` correctly |
| Hardcoded username `'muthu'` | Now reads from `localStorage` |
| `class="user name"` space bug | Fixed to `class="userName"` |
| Hardcoded Windows file path in server | Fixed to use `path.join(__dirname, ...)` |
| `getName()` function scope bug | Replaced with proper event listener |
| No Enter key support | Added `keypress` listener for Enter |
| Input not cleared after sending | Added `message.value = ''` after send |
| No redirect if not logged in | Added check + redirect in `main.js` |
