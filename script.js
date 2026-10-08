/* ============================================================
   YAHAN SE SAB KUCH CHANGE HO SAKTA HAI (email, phone, links)
   ============================================================ */
const CONFIG = {
  name: "Muhammad Hisham",
  short: "MH",
  father: "Ikram Ullah Khan",
  location: "Hangu, Khyber Pakhtunkhwa",
  roles: ["Full Stack Developer", "React + Node.js Builder", "MongoDB Atlas Developer"],

  email: "xhomjo@gmail.com",      // <-- email yahan badlo
  phone: "03375610579",           // <-- call number
  whatsapp: "03375610579",        // <-- WhatsApp number

  github: "https://github.com/xhomjo-code", // <-- naya GitHub link yahan
  linkedin: "",                   // khali ho to button chhup jayega
  cv: "",                         // jaise "cv.pdf" (file folder ma rakho)
  photo: "photo.jpg",             // apni photo isi folder ma photo.jpg naam se rakho

  // Contact form ke liye (emailjs.com se free keys). Khali ho to mail app khulegi.
  emailjs: { publicKey: "", serviceId: "", templateId: "" },

  skills: {
    Frontend: ["HTML", "CSS", "Tailwind CSS", "JavaScript", "React"],
    Backend: ["Node.js", "Express.js", "REST APIs", "Authentication"],
    Database: ["MongoDB", "Mongoose", "MongoDB Atlas"],
    Workflow: ["Vibe coding", "Deployment"]
  },

  projects: [
    {
      title: "School Portal",
      text: "Login portal for principal, teachers and students: marks, attendance, online meetings and issue reports with pictures. Node.js, Express and MongoDB Atlas with hashed passwords.",
      tags: ["Node.js", "Express", "MongoDB Atlas", "JavaScript"],
      live: "", code: ""           // deploy ke baad links yahan daalo
    },
    {
      title: "This Portfolio",
      text: "Responsive, animated personal site with a typing effect, smooth scroll reveals and a working contact form.",
      tags: ["HTML", "CSS", "JavaScript"],
      live: "", code: ""
    }
  ]
};
/* ============================================================ */

const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const intl = (n) => n.replace(/\D/g, "").replace(/^0/, "92");

// text + links
$$("[data-t]").forEach((e) => (e.textContent = CONFIG[e.dataset.t] ?? ""));
const links = {
  github: CONFIG.github, linkedin: CONFIG.linkedin, cv: CONFIG.cv,
  wa: CONFIG.whatsapp && "https://wa.me/" + intl(CONFIG.whatsapp),
  mail: CONFIG.email && "mailto:" + CONFIG.email,
  tel: CONFIG.phone && "tel:+" + intl(CONFIG.phone)
};
$$("[data-link]").forEach((a) => {
  const u = links[a.dataset.link];
  u ? (a.href = u) : (a.hidden = true);
});
document.title = CONFIG.name + " | Full Stack Developer";
$("#yr").textContent = new Date().getFullYear();

// hero name
$("#title").innerHTML = CONFIG.name.split(" ").map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join("");

// photo (initials agar photo na mile)
const img = $("#photo");
img.src = CONFIG.photo;
img.onerror = () => {
  img.hidden = true;
  $("#init").hidden = false;
  $("#init").textContent = CONFIG.short;
};

// typing effect
(() => {
  const el = $("#type");
  let r = 0, c = 0, del = false;
  (function tick() {
    const word = CONFIG.roles[r];
    el.textContent = word.slice(0, del ? --c : ++c);
    let wait = del ? 40 : 90;
    if (!del && c === word.length) { del = true; wait = 1400; }
    else if (del && c === 0) { del = false; r = (r + 1) % CONFIG.roles.length; wait = 350; }
    setTimeout(tick, wait);
  })();
})();

// skills, marquee, projects
const all = Object.values(CONFIG.skills).flat();
$("#track").innerHTML = [...all, ...all].map((s) => `<span>${s}</span>`).join("");
$("#skillGrid").innerHTML = Object.entries(CONFIG.skills).map(([g, list]) =>
  `<div class="card rv"><h3>${g}</h3><div class="chips">${list.map((s) => `<span>${s}</span>`).join("")}</div></div>`).join("");
$("#projectGrid").innerHTML = CONFIG.projects.map((p) =>
  `<article class="card rv"><h3>${p.title}</h3><p>${p.text}</p>
   <div class="chips">${p.tags.map((t) => `<span>${t}</span>`).join("")}</div>
   <div class="links">${p.live ? `<a href="${p.live}" target="_blank" rel="noopener">Live demo</a>` : ""}${p.code ? `<a href="${p.code}" target="_blank" rel="noopener">Source code</a>` : ""}</div></article>`).join("");

// scroll reveal
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".rv").forEach((e) => io.observe(e));

// progress bar + cursor glow
addEventListener("scroll", () => {
  const h = document.documentElement;
  $("#bar").style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + "%";
}, { passive: true });
addEventListener("pointermove", (e) => {
  $("#glow").style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
});

// mobile menu
const burger = $("#burger"), menu = $("#menu");
const toggle = (open) => {
  menu.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
};
burger.onclick = () => toggle(!menu.classList.contains("open"));
menu.onclick = (e) => e.target.tagName === "A" && toggle(false);

// contact form
$("#form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = new FormData(e.target), msg = $("#msg"), k = CONFIG.emailjs;
  const d = { name: f.get("name"), email: f.get("email"), message: f.get("message") };
  if (!k.publicKey || !k.serviceId || !k.templateId) {
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("Message from " + d.name)}&body=${encodeURIComponent(d.message + "\n\n" + d.name + " (" + d.email + ")")}`;
    return;
  }
  msg.textContent = "Sending...";
  try {
    const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: k.serviceId, template_id: k.templateId, user_id: k.publicKey,
        template_params: { from_name: d.name, reply_to: d.email, message: d.message }
      })
    });
    if (!r.ok) throw 0;
    msg.textContent = "Message sent. I'll reply soon.";
    e.target.reset();
  } catch {
    msg.textContent = "Message not sent. Email me at " + CONFIG.email;
  }
});
