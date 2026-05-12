import { io } from "socket.io-client";

let socket = io('https://chat-application-av19.onrender.com');

let user = localStorage.getItem('user')
if (!user) { document.location.href = 'index.html' }

// ── Gender detection ──
const femaleNames = [
  'girl','female','woman','lady','amma','akka','anni','mami','paati','aunty','auntie',
  'priya','divya','kavya','ananya','meena','meenakshi','lakshmi','laxmi','geetha','geeta',
  'seetha','sita','radha','parvathi','parvati','durga','devi','sowmya','soundarya',
  'sindhu','nithya','revathi','revathy','kalpana','kamala','saranya','saroja','savitha',
  'shanthi','shanti','shobha','shobana','sirisha','sridevi','sudha','suganya','sumathi',
  'sunitha','sunita','supriya','sushma','swathi','swathy','thenmozhi','usha','valli',
  'vanitha','vasantha','vasanthi','vidya','vijaya','vimala','vishali','yasodha','yazhini',
  'marieswari','maheswari','mahalakshmi','mahalaxmi','manonmani','manjula','malathi',
  'malarvizhi','malar','padmini','padma','pavithra','ponni','ponmalar','pooja','puja',
  'poongodi','poorani','poonkodi','priyadarshini','keerthi','keerthana','kirthana',
  'kirthiga','kousalya','ishwarya','iswarya','aishwarya','jayalakshmi','jayanthi',
  'janani','jaya','jothi','indhu','indu','indira','hema','hemalatha','gayathri','gayatri',
  'ganga','gomathi','grace','glory','fathima','fatima','deepa','deepika','deepthi',
  'chithra','chitra','chandrika','chandra','bhuvana','bhuvaneswari','bhoomika','barathi',
  'bharathi','anbu','amudha','ambika','alice','abirami','abarna','abinaya','anitha',
  'nithyashree','nithyasree','muthu','muthulakshmi','roja','rose','rani','rajeshwari',
  'rajeswari','rajkumari','prema','oviya','oviyaa','nivetha','nivedha',
  'nandini','nandhini','mythili','mythily','mounika','mounica','monisha','monica',
  'mohana','miruthula','mekala','meghna','megha','madhavi','madhuri','madhumitha',
  'likhitha','likhita','lavanya','latha','krithika','kavitha','kavita','kasthuri',
  'kasturi','karthika','kanimozhi','kanagadurga','kalai','kalamani','jyothi','jyothy',
  'jeevitha','jeevita','janaki','jananee','isai','ilavarasi','ilampirai','hemalata',
  'haritha','harini','haripriya','hamsa','gowri','gowry','girija','ghayathri','fazila',
  'eswari','eswarya','elavarasi','elaveni','durgadevi','divyabharathi','devika',
  'devapriya','choodamani','chitradevi','charulatha','charumathi','chamundeeswari',
  'bhuvaneswari','barathidevi','arthi','arthy','aruna','arunadevi','arunthathi',
  'arulmozhi','arulmathy','arockiarani','anusuya','anuradha','anupriya','anupama',
  'anithadevi','angelin','angela','amirtha','amirthavalli','amirtham','amirthambigai'
]

function getGender(name) {
  const lower = name.toLowerCase().trim()
  for (let n of femaleNames) {
    if (lower === n || lower.startsWith(n) || lower.includes(n)) return 'female'
  }
  return 'male'
}

function getAvatar(name) {
  const seed = encodeURIComponent(name)
  return getGender(name) === 'female'
    ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=ffd5dc,ffdfbf,c0aede`
    : `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ── Set own profile ──
document.querySelector('.userName').innerText = user
let avatarEl = document.querySelector('.user img')
avatarEl.src = getAvatar(user)
avatarEl.alt = user

let element  = document.querySelector('.chat-element')
let button   = document.querySelector('#send')
let message  = document.querySelector('#message')
let logout   = document.querySelector('#logout')
let emojiBtn = document.querySelector('#emojiBtn')
let emojiPicker = document.querySelector('#emojiPicker')
let emojiGrid   = document.querySelector('#emojiGrid')

// ── Emoji data by category ──
const emojiCategories = {
  smileys:    ['😀','😁','😂','🤣','😃','😄','😅','😆','😊','😋','😎','😍','🥰','😘','😗','😙','😚','🙂','🤗','🤩','🥳','😏','😒','😞','😔','😟','😕','🙁','☹️','😣','😖','😫','😩','🥺','😢','😭','😤','😠','😡','🤯','😳','🥵','🥶','😱','😨','😰','😥','😓','🤔','🤭','🤫','🤥','😶','😐','😑','😬','🙄','😯','😦','😧','😮','😲','🥱','😴','🤤','😪','😵','🤐','🥴','🤢','🤮','🤧','😷','🤒','🤕'],
  gestures:   ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','🖕','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','✍️','💅','🤳','💪','🦾','🦿','🦵','🦶','👂','🦻','👃','🫀','🫁','🧠','🦷','🦴','👀','👁️','👅','👄'],
  hearts:     ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','💋','😍','🥰','😘'],
  animals:    ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🙈','🙉','🙊','🐔','🐧','🐦','🐤','🦆','🦅','🦉','🦇','🐺','🐗','🐴','🦄','🐝','🐛','🦋','🐌','🐞','🐜','🦟','🦗','🦂','🐢','🐍','🦎','🦖','🦕','🐙','🦑','🦐','🦞','🦀','🐡','🐠','🐟','🐬','🐳','🐋','🦈','🐊','🐅','🐆','🦓','🦍','🦧','🦣','🐘','🦛','🦏','🐪','🐫','🦒','🦘','🦬','🐃','🐂','🐄','🐎','🐖','🐏','🐑','🦙','🐐','🦌','🐕','🐩','🦮','🐈','🐓','🦃','🦤','🦚','🦜','🦢','🦩','🕊️','🐇','🦝','🦨','🦡','🦫','🦦','🦥','🐁','🐀','🐿️','🦔'],
  food:       ['🍎','🍐','🍊','🍋','🍌','🍉','🍇','🍓','🫐','🍈','🍒','🍑','🥭','🍍','🥥','🥝','🍅','🍆','🥑','🥦','🥬','🥒','🌶️','🫑','🧄','🧅','🥔','🍠','🥐','🥯','🍞','🥖','🥨','🧀','🥚','🍳','🧈','🥞','🧇','🥓','🥩','🍗','🍖','🦴','🌭','🍔','🍟','🍕','🫓','🥪','🥙','🧆','🌮','🌯','🫔','🥗','🥘','🫕','🥫','🍝','🍜','🍲','🍛','🍣','🍱','🥟','🦪','🍤','🍙','🍚','🍘','🍥','🥮','🍢','🧁','🍰','🎂','🍮','🍭','🍬','🍫','🍿','🍩','🍪','🌰','🥜','🍯','🧃','🥤','🧋','☕','🍵','🫖','🍺','🍻','🥂','🍷','🥃','🍸','🍹','🧉','🍾'],
  activities: ['⚽','🏀','🏈','⚾','🥎','🎾','🏐','🏉','🥏','🎱','🪀','🏓','🏸','🏒','🥍','🏑','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','🤺','🏇','⛹️','🤾','🏌️','🧘','🛹','🛼','🛷','⛸️','🥅','⛳','🎣','🤿','🎽','🎯','🪃','🏹','🎣','🤿','🥊','🥋','🎽','🛹','🛷','🥌','🎿','⛷️','🏂','🪂','🏋️','🤼','🤸','🎠','🎡','🎢','🎭','🎨','🎬','🎤','🎧','🎼','🎹','🥁','🪘','🎷','🎺','🎸','🪕','🎻','🎲','♟️','🎯','🎳','🎮','🕹️'],
  travel:     ['🚗','🚕','🚙','🚌','🚎','🏎️','🚓','🚑','🚒','🚐','🛻','🚚','🚛','🚜','🏍️','🛵','🛺','🚲','🛴','🛹','🛼','🚏','🛣️','🛤️','⛽','🚦','🚥','🚧','⚓','🛟','⛵','🚤','🛥️','🛳️','⛴️','🚢','✈️','🛩️','🛫','🛬','🪂','💺','🚁','🚟','🚠','🚡','🛰️','🚀','🛸','🌍','🌎','🌏','🌐','🗺️','🧭','🏔️','⛰️','🌋','🗻','🏕️','🏖️','🏜️','🏝️','🏞️','🏟️','🏛️','🏗️','🧱','🪨','🪵','🛖','🏘️','🏚️','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏨','🏩','🏪','🏫','🏬','🏭','🏯','🏰','💒','🗼','🗽','⛪','🕌','🛕','🕍','⛩️'],
  objects:    ['💡','🔦','🕯️','🪔','🧱','💰','💴','💵','💶','💷','💸','💳','🪙','💹','📈','📉','📊','📋','📌','📍','📎','🖇️','📏','📐','✂️','🗃️','🗄️','🗑️','🔒','🔓','🔏','🔐','🔑','🗝️','🔨','🪓','⛏️','⚒️','🛠️','🗡️','⚔️','🛡️','🔧','🔩','⚙️','🗜️','⚖️','🦯','🔗','⛓️','🪝','🧲','🪜','🧪','🧫','🧬','🔬','🔭','📡','💉','🩸','💊','🩹','🩺','🚪','🛏️','🛋️','🪑','🚽','🪠','🚿','🛁','🧴','🧷','🧹','🧺','🧻','🪣','🧼','🫧','🧽','🧯','🛒','🚬','⚰️','🪦','⚱️','🗿','🪬','🧿','💈'],
  symbols:    ['🔥','💫','⭐','🌟','✨','⚡','🌈','☀️','🌤️','⛅','🌥️','☁️','🌦️','🌧️','⛈️','🌩️','🌨️','❄️','☃️','⛄','🌬️','💨','🌪️','🌫️','🌊','💧','💦','☔','☂️','🌀','🌁','🌂','🎑','🎆','🎇','🧨','✨','🎉','🎊','🎈','🎁','🎀','🎗️','🎟️','🎫','🏆','🥇','🥈','🥉','🏅','🎖️','🏵️','🎪','🤹','🎭','🩰','🎨','🎬','🎤','🎧','🎼','🎵','🎶','🎙️','📻','🎚️','🎛️','📺','📷','📸','📹','🎥','📽️','🎞️','📞','☎️','📟','📠','📺','📻','🧭','⏱️','⏲️','⏰','🕰️','⌛','⏳','📡','🔋','🔌','💻','🖥️','🖨️','⌨️','🖱️','🖲️','💾','💿','📀','🧮']
}

let currentCategory = 'smileys'

function renderEmojis(cat) {
  emojiGrid.innerHTML = ''
  emojiCategories[cat].forEach(emoji => {
    const btn = document.createElement('button')
    btn.className = 'emoji-item'
    btn.textContent = emoji
    btn.addEventListener('click', () => {
      message.value += emoji
      message.focus()
    })
    emojiGrid.appendChild(btn)
  })
}

// Emoji tab switching
document.querySelectorAll('.emoji-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.emoji-tab').forEach(t => t.classList.remove('active'))
    tab.classList.add('active')
    currentCategory = tab.dataset.cat
    renderEmojis(currentCategory)
  })
})

// Toggle emoji picker
emojiBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  const isOpen = emojiPicker.classList.toggle('open')
  if (isOpen) renderEmojis(currentCategory)
})

// Close emoji picker when clicking outside
document.addEventListener('click', (e) => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
    emojiPicker.classList.remove('open')
  }
})

// ── Member tracking ──
const onlineMembers = new Set()
onlineMembers.add(user)

function updateMemberCount() {
  const count = onlineMembers.size
  const label = `👥 ${count} member${count !== 1 ? 's' : ''} online`
  document.querySelectorAll('.member-count').forEach(el => el.textContent = label)
}

function renderMembersList() {
  const listEl = document.querySelector('.members-list')
  listEl.innerHTML = ''
  onlineMembers.forEach(name => {
    const item = document.createElement('div')
    item.className = 'member-item'
    const img = document.createElement('img')
    img.src = getAvatar(name)
    img.alt = name
    img.className = 'member-avatar'
    const nameEl = document.createElement('span')
    nameEl.textContent = name + (name === user ? ' (You)' : '')
    if (name === user) {
      item.style.background = '#ede7ff'
      nameEl.style.color = '#6c3fd4'
      nameEl.style.fontWeight = '700'
    }
    item.appendChild(img)
    item.appendChild(nameEl)
    listEl.appendChild(item)
  })
  updateMemberCount()
}

// ── Socket events ──
socket.on('current_members', (data) => {
  data.members.forEach(name => onlineMembers.add(name))
  renderMembersList()
  if (data.members.length > 0) {
    addSystemMessage(`Already in chat: ${data.members.join(', ')}`)
  } else {
    addSystemMessage('You are the first one here! Waiting for others...')
  }
})

socket.on('receive_user', (data) => {
  if (onlineMembers.has(data.user)) return
  onlineMembers.add(data.user)
  renderMembersList()
  addNotification(`${data.user} joined the chat`, 'join')
  addSystemMessage(`${data.user} joined`)
})

socket.on('userLogout', (data) => {
  onlineMembers.delete(data.user)
  renderMembersList()
  addNotification(`${data.user} left the chat`, 'leave')
  addSystemMessage(`${data.user} left`)
})

function addNotification(text, type) {
  const status = document.querySelector('.user-status')
  const p = document.createElement('p')
  p.className = `user-information ${type}`
  p.innerText = text
  status.appendChild(p)
  status.scrollTop = status.scrollHeight
}

function addSystemMessage(text) {
  const div = document.createElement('div')
  div.className = 'system-msg'
  div.innerText = text
  element.appendChild(div)
  element.scrollTop = element.scrollHeight
}

// ── Send message ──
button.addEventListener('click', sendMessage)
message.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage()
})

function sendMessage() {
  const text = message.value.trim()
  if (!text) return
  element.appendChild(createChatItem(text))
  socket.emit('send_message', { user, message: text })
  message.value = ''
  message.focus()
  element.scrollTop = element.scrollHeight
  emojiPicker.classList.remove('open')
}

socket.on('receive_message', (data) => {
  element.appendChild(oppositeChatItem(data))
  element.scrollTop = element.scrollHeight
})

// ── Bubble builders ──
function createChatItem(msg) {
  const wrap = document.createElement('div')
  wrap.className = 'you-wrapper'
  const bubble = document.createElement('div')
  bubble.className = 'you'
  const msgEl = document.createElement('div')
  msgEl.className = 'message'
  msgEl.innerText = msg
  const time = document.createElement('span')
  time.className = 'msg-time'
  time.innerText = getTime()
  bubble.appendChild(msgEl)
  bubble.appendChild(time)
  wrap.appendChild(bubble)
  return wrap
}

function oppositeChatItem(data) {
  const wrapper = document.createElement('div')
  wrapper.className = 'other-wrapper'
  const img = document.createElement('img')
  img.src = getAvatar(data.user)
  img.alt = data.user
  img.className = 'msg-avatar'
  const bubble = document.createElement('div')
  bubble.className = 'another-user'
  const userNameEl = document.createElement('div')
  userNameEl.className = 'user-name'
  userNameEl.innerText = data.user
  const msgEl = document.createElement('div')
  msgEl.className = 'message'
  msgEl.innerText = data.message
  const time = document.createElement('span')
  time.className = 'msg-time'
  time.innerText = getTime()
  bubble.appendChild(userNameEl)
  bubble.appendChild(msgEl)
  bubble.appendChild(time)
  wrapper.appendChild(img)
  wrapper.appendChild(bubble)
  return wrapper
}

// ── Logout ──
logout.addEventListener('click', () => {
  socket.emit('logout', { user })
  localStorage.removeItem('user')
  document.location.href = 'index.html'
})

socket.emit('login', { user })
renderMembersList()
