const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let token = localStorage.getItem("blogToken");
let currentUser = JSON.parse(localStorage.getItem("blogUser") || "null");
let authMode = "login";

const api = async (url, options = {}) => {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed.");
  return data;
};

function toast(message) {
  const el = $("#toast");
  el.textContent = message;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2600);
}

function setAuthState() {
  const logged = Boolean(token && currentUser);
  $("#loginBtn").classList.toggle("hidden", logged);
  $("#logoutBtn").classList.toggle("hidden", !logged);
  $("#dashboardLink").classList.toggle("hidden", !logged);
  $(".dashboard-section").classList.toggle("hidden", !logged);
  if (logged) {
    $("#accountName").textContent = currentUser.name;
    loadMyPosts();
  }
}

function openModal(id) { $(`#${id}`).classList.remove("hidden"); }
function closeModal(id) { $(`#${id}`).classList.add("hidden"); }

$$("[data-close]").forEach(btn => btn.addEventListener("click", () => closeModal(btn.dataset.close)));

function showAuth(mode = "login") {
  authMode = mode;
  $("#loginTab").classList.toggle("active", mode === "login");
  $("#registerTab").classList.toggle("active", mode === "register");
  $("#nameField").classList.toggle("hidden", mode !== "register");
  $("#authTitle").textContent = mode === "login" ? "Enter the story." : "Create your space.";
  $("#authSubtitle").textContent = mode === "login" ? "Sign in to manage your posts." : "Create an account and start publishing.";
  $("#authSubmit").textContent = mode === "login" ? "Login →" : "Create account →";
  $("#authMessage").textContent = "";
  openModal("authModal");
}
$("#loginBtn").onclick = () => showAuth("login");
$("#heroLogin").onclick = () => showAuth("register");
$("#loginTab").onclick = () => showAuth("login");
$("#registerTab").onclick = () => showAuth("register");

$("#logoutBtn").onclick = () => {
  token = null; currentUser = null;
  localStorage.removeItem("blogToken");
  localStorage.removeItem("blogUser");
  setAuthState();
  toast("You have been logged out.");
  location.hash = "#home";
};

$("#authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    name: $("#nameInput").value.trim(),
    email: $("#emailInput").value.trim(),
    password: $("#passwordInput").value
  };
  try {
    const data = await api(`/api/auth/${authMode === "login" ? "login" : "register"}`, {
      method: "POST", body: JSON.stringify(payload)
    });
    token = data.token;
    currentUser = data.user;
    localStorage.setItem("blogToken", token);
    localStorage.setItem("blogUser", JSON.stringify(currentUser));
    closeModal("authModal");
    setAuthState();
    toast(authMode === "login" ? "Welcome back." : "Account created.");
  } catch (err) {
    $("#authMessage").textContent = err.message;
  }
});

async function loadPosts(search = "") {
  try {
    const posts = await api(`/api/posts${search ? `?search=${encodeURIComponent(search)}` : ""}`);
    const grid = $("#postsGrid");
    $("#emptyState").classList.toggle("hidden", posts.length !== 0);
    grid.innerHTML = posts.map((p, i) => `
      <article class="post-card">
        <div>
          <div class="post-number">${String(i + 1).padStart(2, "0")}</div>
          <h3>${escapeHtml(p.title)}</h3>
          <p class="post-excerpt">${escapeHtml(p.content.slice(0, 150))}${p.content.length > 150 ? "…" : ""}</p>
        </div>
        <div class="card-bottom">
          <span>${escapeHtml(p.author?.name || "Author")} · ${formatDate(p.createdAt)}</span>
          <button class="read-btn" onclick="readPost('${p._id}')">Read ↗</button>
        </div>
      </article>
    `).join("");
  } catch {
    $("#postsGrid").innerHTML = `<div class="empty-state">Unable to load stories right now.</div>`;
  }
}

window.readPost = async (id) => {
  try {
    const p = await api(`/api/posts/${id}`);
    $("#readerMeta").textContent = `${p.author?.name || "AUTHOR"} • ${formatDate(p.createdAt)}`;
    $("#readerTitle").textContent = p.title;
    $("#readerContent").textContent = p.content;
    openModal("postModal");
  } catch (err) { toast(err.message); }
};

async function loadMyPosts() {
  if (!currentUser) return;
  try {
    const posts = await api("/api/posts");
    const mine = posts.filter(p => p.author?._id === currentUser.id || p.author?.id === currentUser.id);
    $("#postCount").textContent = mine.length;
    $("#myPosts").innerHTML = mine.length ? mine.map(p => `
      <div class="manage-item">
        <div><h3>${escapeHtml(p.title)}</h3><small>${formatDate(p.updatedAt)}</small></div>
        <div class="manage-actions">
          <button onclick="editPost('${p._id}')">Edit</button>
          <button class="danger" onclick="deletePost('${p._id}')">Delete</button>
        </div>
      </div>
    `).join("") : `<div class="empty-state">You have not published anything yet.</div>`;
  } catch (err) { toast(err.message); }
}

$("#searchInput").addEventListener("input", (e) => loadPosts(e.target.value.trim()));
$("#newPostBtn").onclick = () => openEditor();

function openEditor(post = null) {
  $("#postId").value = post?._id || "";
  $("#postTitle").value = post?.title || "";
  $("#postContent").value = post?.content || "";
  $("#editorEyebrow").textContent = post ? "EDIT STORY" : "NEW STORY";
  $("#editorTitle").textContent = post ? "Refine your story." : "Create something worth reading.";
  $("#postMessage").textContent = "";
  openModal("editorModal");
}

window.editPost = async (id) => {
  try { openEditor(await api(`/api/posts/${id}`)); }
  catch (err) { toast(err.message); }
};

window.deletePost = async (id) => {
  if (!confirm("Delete this post permanently?")) return;
  try {
    await api(`/api/posts/${id}`, { method: "DELETE" });
    toast("Post deleted.");
    await loadPosts($("#searchInput").value.trim());
    await loadMyPosts();
  } catch (err) { toast(err.message); }
};

$("#postForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!token) return showAuth("login");

  const id = $("#postId").value;
  const payload = {
    title: $("#postTitle").value.trim(),
    content: $("#postContent").value.trim()
  };

  try {
    await api(id ? `/api/posts/${id}` : "/api/posts", {
      method: id ? "PUT" : "POST",
      body: JSON.stringify(payload)
    });
    closeModal("editorModal");
    toast(id ? "Post updated." : "Story published.");
    await loadPosts($("#searchInput").value.trim());
    await loadMyPosts();
  } catch (err) {
    $("#postMessage").textContent = err.message;
  }
});

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, { month:"short", day:"numeric", year:"numeric" });
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

// Lightweight 3D star/particle field
const canvas = $("#spaceCanvas");
const ctx = canvas.getContext("2d");
let stars = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  stars = Array.from({ length: Math.min(150, Math.floor(innerWidth / 7)) }, () => ({
    x: Math.random() * innerWidth - innerWidth/2,
    y: Math.random() * innerHeight - innerHeight/2,
    z: Math.random() * innerWidth,
    speed: .15 + Math.random() * .55
  }));
}
addEventListener("resize", resizeCanvas);
addEventListener("pointermove", e => {
  mouse.x = (e.clientX / innerWidth - .5) * 30;
  mouse.y = (e.clientY / innerHeight - .5) * 20;
});
function animateStars() {
  ctx.clearRect(0,0,innerWidth,innerHeight);
  const cx = innerWidth/2 + mouse.x;
  const cy = innerHeight/2 + mouse.y;
  stars.forEach(s => {
    s.z -= s.speed * 4;
    if (s.z < 1) {
      s.z = innerWidth;
      s.x = Math.random() * innerWidth - innerWidth/2;
      s.y = Math.random() * innerHeight - innerHeight/2;
    }
    const scale = 220 / s.z;
    const x = cx + s.x * scale;
    const y = cy + s.y * scale;
    if (x < 0 || x > innerWidth || y < 0 || y > innerHeight) return;
    const size = Math.max(.4, 2.2 * scale);
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI*2);
    ctx.fillStyle = `rgba(150,230,255,${Math.min(.7, scale)})`;
    ctx.fill();
  });
  requestAnimationFrame(animateStars);
}
resizeCanvas();
animateStars();

setAuthState();
loadPosts();
