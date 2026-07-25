/* =========================================================
   EDIT ONLY THIS ARRAY TO CUSTOMIZE ALL 5 PAGES
   ---------------------------------------------------------
   girlImage:
     Use a transparent PNG whenever possible.
     Example: "images/girl1.png"

   cover:
     Example: "covers/cover1.jpg"

   audio:
     Example: "songs/song1.mp3"

   gradient:
     Change all 3 colors for each page.

   accent:
     Controls buttons, notes, dots and decorative hearts.
========================================================= */

const pages = [
  {
    title: "",
    audio: "songs/ManameNeeyae.mp3",
    girlImage: "images/pink.png",
    gradient: ["#FCE4EC", "#F8BBD0", "#F48FB1"],
    accent: "#EC407A",
    textColor: "#7A4B00",
    softTextColor: "#9B6D2E"
  },
  {
    title: "Vaama vaama",
    audio: "songs/vaama-vaama.mp3",
    cover: "",
    girlImage: "images/yelloe1.png",
    gradient: ["#FFFBE6", "#FFF3C4", "#FFE3B3"],
    accent: "#F5A623",
    textColor: "#6B4600",
    softTextColor: "#8A6A33"
  },
  {
    title: "Dandelions (Violin)",
    audio: "songs/Dandelions.mp3",
    cover: "",
    girlImage: "images/Blu.png",
    gradient: ["#EAF4FF", "#D9EBFF", "#B9D8FF"],
    accent: "#5C8DFF",
    textColor: "#28456F",
    softTextColor: "#55729A"
  },
  {
    title: "Oh Oh",
    audio: "songs/Thangamagan - Oh Oh.mp3",
    cover: "",
    girlImage: "images/Violet.png",
    gradient: ["#F1E9FF", "#E4D4FF", "#CFB8F7"],
    accent: "#9B6DE3",
    textColor: "#563781",
    softTextColor: "#775F96"
  },
  {
    title: "Hayyoda",
    audio: "songs/Jawan_ Hayyoda.mp3",
    cover: "",
    girlImage: "images/pxyvz.png",
    gradient: ["#E9FFF1", "#d95b5b", "#d5cdcd"],
    accent: "#f9a3a3",
    textColor: "#911111",
    softTextColor: "#fd5d5d"
  }
];

const audio = document.getElementById("audio");
const pageLayout = document.getElementById("pageLayout");
const pageBackground = document.getElementById("pageBackground");

const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const coverImage = document.getElementById("coverImage");
const girlImage = document.getElementById("girlImage");
const portraitPlaceholder = document.getElementById("portraitPlaceholder");

const vinyl = document.getElementById("vinyl");
const tonearm = document.getElementById("tonearm");

const playPause = document.getElementById("playPause");
const playIcon = document.getElementById("playIcon");

const previousTrack = document.getElementById("previousTrack");
const nextTrack = document.getElementById("nextTrack");
const previousPage = document.getElementById("previousPage");
const nextPage = document.getElementById("nextPage");

const progressTrack = document.getElementById("progressTrack");
const progressFill = document.getElementById("progressFill");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const pageDots = document.getElementById("pageDots");

let currentPage = 0;
let isPlaying = false;

function makeDots() {
  pageDots.innerHTML = "";

  pages.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = "page-dot";
    dot.setAttribute("aria-label", `Open page ${index + 1}`);

    dot.addEventListener("click", () => {
      changePage(index);
    });

    pageDots.appendChild(dot);
  });
}

function loadPage(index) {
  const page = pages[index];

  songTitle.textContent = page.title;
  songArtist.textContent = page.artist;

  audio.src = page.audio || "";
  coverImage.src = page.cover || "";
  girlImage.src = page.girlImage || "";

  portraitPlaceholder.style.display = page.girlImage ? "none" : "flex";

  pageBackground.style.background = `
    radial-gradient(circle at 12% 20%, rgba(255,255,255,.92), transparent 28%),
    radial-gradient(circle at 90% 25%, rgba(255,255,255,.28), transparent 28%),
    linear-gradient(135deg, ${page.gradient[0]}, ${page.gradient[1]}, ${page.gradient[2]})
  `;

  document.documentElement.style.setProperty("--accent", page.accent);
  document.documentElement.style.setProperty("--text-main", page.textColor);
  document.documentElement.style.setProperty("--text-soft", page.softTextColor);

  progressFill.style.width = "0%";
  currentTime.textContent = "0:00";
  duration.textContent = "0:00";

  document.querySelectorAll(".page-dot").forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === index);
  });
}

function changePage(newIndex, shouldPlay = false) {
  pageLayout.classList.add("is-changing");
  pauseSong();

  setTimeout(() => {
    currentPage = (newIndex + pages.length) % pages.length;
    loadPage(currentPage);
    pageLayout.classList.remove("is-changing");

    if (shouldPlay) {
      playSong();
    }
  }, 280);
}

function nextPageItem() {
  changePage(currentPage + 1, isPlaying);
}

function previousPageItem() {
  changePage(currentPage - 1, isPlaying);
}

function playSong() {
  if (!audio.src) return;

  audio.play()
    .then(() => {
      isPlaying = true;
      playIcon.textContent = "❚❚";
      vinyl.classList.add("playing");
      tonearm.classList.add("playing");
    })
    .catch(() => {
      isPlaying = false;
      playIcon.textContent = "▶";
    });
}

function pauseSong() {
  audio.pause();
  isPlaying = false;
  playIcon.textContent = "▶";
  vinyl.classList.remove("playing");
  tonearm.classList.remove("playing");
}

function togglePlayback() {
  isPlaying ? pauseSong() : playSong();
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

playPause.addEventListener("click", togglePlayback);
vinyl.addEventListener("click", togglePlayback);

previousTrack.addEventListener("click", previousPageItem);
nextTrack.addEventListener("click", nextPageItem);
previousPage.addEventListener("click", previousPageItem);
nextPage.addEventListener("click", nextPageItem);

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  const percentage = audio.duration
    ? (audio.currentTime / audio.duration) * 100
    : 0;

  progressFill.style.width = `${percentage}%`;
  currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  changePage(currentPage + 1, true);
});

progressTrack.addEventListener("click", (event) => {
  if (!audio.duration) return;

  const box = progressTrack.getBoundingClientRect();
  const percentage = (event.clientX - box.left) / box.width;
  audio.currentTime = percentage * audio.duration;
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    togglePlayback();
  }

  if (event.key === "ArrowRight") {
    nextPageItem();
  }

  if (event.key === "ArrowLeft") {
    previousPageItem();
  }
});

makeDots();
loadPage(currentPage);
