const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOREGE_KEY = "F8_PLAYER";

const heading = $("header h2");
const cd_thumb = $(".CD-thumb");
const audio = $("#audio");
const cd = $(".CD");
const btnPlay = $(".btn-toggle-play");
const play_El = $(".play");
const progressContainer = $("#progressContainer");
const progressBar = $("#progressBar");
const btnNext = $(".btn-next");
const btnPrev = $(".btn-prev");
const btnRepeat = $(".btn-repeat");
const btnRadom = $(".btn-radom");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRadom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STOREGE_KEY)) || {},
  songs: [
    {
      name: "Shape of You",
      singer: "Ed Sheeran",
      path: "./assets/musics/Ed Sheeran - Shape of You (Official Music Video).mp3",
      image: "https://i.ytimg.com/vi/JGwWNGJdvx8/mqdefault.jpg",
      // image: "./assets/img/img-luu-diep-phi.jpg",
    },
    {
      name: "id 072019 | 3107 ft 267",
      singer: "W / n",
      path: "./assets/musics/Wn-id072019_3107ft267.mp3",
      image: "https://i.ytimg.com/vi/leJb3VhQCrg/mqdefault.jpg",
    },
    {
      name: "Ba kể con nghe",
      singer: "Bập Bênh Team",
      path: "./assets/musics/ba-ke-con-nghe.mp3",
      image: "https://i.ytimg.com/vi/5mYA4WswGdw/mqdefault.jpg",
    },
    {
      name: "See You Again",
      singer: "Wiz Khalifa",
      path: "./assets/musics/Wiz Khalifa - See You Again ft. Charlie Puth [Official Video] Furious 7 Soundtrack.mp3",
      image: "https://i.ytimg.com/vi/RgKAFK5djSk/mqdefault.jpg",
    },
    {
      name: "The Nights",
      singer: "Avicii",
      path: "./assets/musics/Avicii - The Nights (Throwback Thursday Cover by Citycreed).mp3",
      image: "https://i.ytimg.com/vi/XMEQO6kpYPA/mqdefault.jpg",
    },
    {
      name: "I'll be there",
      singer: "Gabriela Bee",
      path: "./assets/musics/I'll be there - Gabriela Bee cover (Lyrics).mp3",
      image: "https://i.ytimg.com/vi/c1LD2lQylPI/mqdefault.jpg",
    },
    {
      name: "Until You",
      singer: "Shayne Ward",
      path: "./assets/musics/Shayne Ward - Until You (Audio).mp3",
      image: "https://i.ytimg.com/vi/YfDqONbzYPc/mqdefault.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STOREGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
            <div class="song ${
              this.currentIndex === index ? "active" : ""
            }" data-index="${index}">
              <div class="song-left">
                  <spam class="index-song data-song-${index}">${
        index + 1
      }</spam>
                  <div class="thumb" 
                      style="background-image: url('${song.image}');">
                  </div>
                  <div class="body">
                      <h3 class="title">${song.name}</h3>
                      <p class="author">${song.singer}</p>
                  </div>
                </div>
                  <div class="option">
                      <i class="fa-solid fa-ellipsis"></i>
                  </div>
            </div>
            `;
    });
    playlist.innerHTML = html.join("\n");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: () => {
        return this.songs[this.currentIndex];
      },
    });
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cd_thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  handelEvent: function () {
    const cdWidth = cd.offsetWidth;

    const cd_thumbAnimate = cd_thumb.animate(
      [{ transform: "rotate(360deg)" }],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );

    cd_thumbAnimate.pause();

    document.onscroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop;

      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };

    function audioPlay() {
      app.isPlaying = true;
      audio.play();
      play_El.classList.add("playing");
      cd_thumbAnimate.play();
    }

    function audioPause() {
      app.isPlaying = false;
      audio.pause();
      play_El.classList.remove("playing");
    }
    btnPlay.onclick = function () {
      if (app.isPlaying) {
        audioPause();
        cd_thumbAnimate.pause();
      } else {
        audioPlay();
        cd_thumbAnimate.play();
      }
    };

    audio.ontimeupdate = function () {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      const progress = (currentTime / duration) * 100;
      progressBar.style.width = `${progress}%`;
    };
    progressContainer.onclick = function (e) {
      const containerWidth = progressContainer.clientWidth;
      const clickPosition =
        e.clientX - progressContainer.getBoundingClientRect().left;
      const newProgress = (clickPosition / containerWidth) * 100;
      const newTime = (newProgress / 100) * audio.duration;
      audio.currentTime = newTime;
    };
    btnNext.onclick = function () {
      if (app.isRadom) {
        app.playradomSong();
      } else {
        app.nextSong();
      }
      audioPlay();
      app.render();
      app.scrollToActiveSong();
    };
    btnPrev.onclick = function () {
      if (app.isRadom) {
        app.playradomSong();
      } else {
        app.prevSong();
      }
      audioPlay();
      app.render();
      app.scrollToActiveSong();
    };

    btnRadom.onclick = function () {
      app.isRadom = !app.isRadom;
      app.setConfig("isRadom", app.isRadom);
      btnRadom.classList.toggle("active-rd", app.isRadom);
    };

    btnRepeat.onclick = function () {
      app.isRepeat = !app.isRepeat;
      app.setConfig("isRepeat", app.isRepeat);
      btnRepeat.classList.toggle("active-rp", app.isRepeat);
    };

    audio.onended = function () {
      if (app.isRepeat) {
        audio.play();
      } else {
        btnNext.click();
      }
    };

    playlist.onclick = function (e) {
      const songNotActive = e.target.closest(".song:not(.active)");
      const optionEl = e.target.closest(".option");
      if (songNotActive || optionEl) {
        if (songNotActive) {
          app.currentIndex = Number(songNotActive.dataset.index);
          app.loadCurrentSong();
          app.render();
          audioPlay();
        }
        if (optionEl) {
        }
      }
    };
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex <= 0) {
      this.currentIndex = this.songs.length;
    }
    this.loadCurrentSong();
  },
  playradomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 300);
  },
  loadConfig: function () {
    console.log(this.config);
    this.isRadom = this.config.isRadom;
    this.isRepeat = this.config.isRepeat;
    btnRadom.classList.toggle("active-rd", this.isRadom);
    btnRepeat.classList.toggle("active-rp", this.isRepeat);
  },
  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handelEvent();
    this.loadCurrentSong();
    this.render();
  },
};

app.start();
