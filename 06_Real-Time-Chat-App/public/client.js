let socket;
try {
  socket = io();
} catch (e) {}

const chatField = document.getElementById("chat");
const sendBtn = document.getElementById("send");
const chatsEl = document.getElementById("chats");

const palette = [
  "#5865f2",
  "#57f287",
  "#eb459e",
  "#faa61a",
  "#ed4245",
  "#3ba55c",
  "#fee75c",
];

function nameColor(name) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return palette[Math.abs(h) % palette.length];
}

function timeNow() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function escapeHtml(t) {
  const d = document.createElement("div");
  d.textContent = t;
  return d.innerHTML;
}

function addMessage(text, name, own) {
  if (!text.trim()) return;
  const color = own ? "#5865f2" : nameColor(name);
  const div = document.createElement("div");
  div.className = "msg flex items-start gap-3";
  div.innerHTML = `
          <div class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 mt-0.5" style="background:${color}">${name[0].toUpperCase()}</div>
          <div>
            <div class="flex items-baseline gap-2 mb-0.5">
              <span class="text-sm font-semibold" style="color:${color}">${name}</span>
              <span class="text-xs text-muted">${timeNow()}</span>
            </div>
            <p class="text-sm text-gray-200 leading-relaxed break-words">${escapeHtml(text)}</p>
          </div>
        `;
  chatsEl.appendChild(div);
  chatsEl.scrollTop = chatsEl.scrollHeight;
}

function send() {
  const text = chatField.value.trim();
  if (!text) return;
  addMessage(text, "You", true);
  if (socket) socket.emit("userChat", text);
  chatField.value = "";
  chatField.focus();
}

if (socket) {
  socket.on("newChat", (msg) => addMessage(msg, "User", false));
}

sendBtn.addEventListener("click", send);
chatField.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    send();
  }
});
