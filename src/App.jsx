import React, { useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Music, Gamepad2, Images, Home, Sparkles, Play, Pause, SkipForward, ChevronLeft, ChevronRight, PartyPopper } from "lucide-react";

// =============================
// SUPER-UNIQUE COLORFUL BIRTHDAY WEBSITE (UPDATED)
// - Vibrant gradients for every section and animated header
// - Section headings have glowing rainbow animation
// - After each game completes, a fun animated surprise card slides up with a photo + caption (placeholder)
// - No upload UI anywhere; media added via MEDIA and SURPRISES constants at top
// =============================

const MEDIA = {
  VIDEO_URL: "./videos/birthday_video.mp4", // add your birthday video URL here
  PHOTOS: [
    { src: '/memories/photo1.JPG', caption: 'What not to adore🫠🫠... Sooo prettyyy... Allii male bantu astee beatiful agi idiyaa puttaaa🥰' },
    { src: '/memories/photo2.jpg', caption: 'This is seriously a lucky charm for me... Idu hakond aaga indaa ellaa nijaa tumbaa valledu agtidee Tqqqq soooooo much puttaaaa🥰' },
    { src: '/memories/photo3.jpg', caption: 'Iduu 5th sem exam alli muridu hakidee😅😁' },
    { src: '/memories/photo4.jpg', caption: 'This is the fest ever best photo i took of u... U were looking choo cute kandaaaa... jawara ittu howduu but that cuteness is overloaded😍😍' }
  ],
  TRACKS: [
    { name: 'Tum se hi', url: '/songs/song1.mp3' },
    { name: 'Baanali badalago', url: '/songs/song2.mp3' },
    { name: 'Ee sanje yakaagide', url: '/songs/song3.mp3' },
    { name: 'Yeh ishq hai', url: '/songs/song4.mp3' },
    { name: 'Paravashanadenu', url: '/songs/song5.mp3' },
    { name: 'Ninna-Gungalli', url: '/songs/song6.mp3' },
    { name: 'Ninagende Visheshavaada', url: '/songs/song7.mp3' },
    { name: 'Nee-Nanna-Olavu', url: '/songs/song8.mp3' },
    { name: 'Munjaane-Manjalli', url: '/songs/song9.mp3' },
    { name: 'Mungaru-Maleyei', url: '/songs/song10.mp3' },
    { name: 'Minchagi-Neenu-Baralu', url: '/songs/song11.mp3' },
    { name: 'Jhol', url: '/songs/song12.mp3' }
  ]
};

// Surprise cards you will fill later. For now these are placeholders — the UI will show them when a game completes.
const SURPRISES = [
  { src: '/suprises/photo11.jpg', caption: 'YAYYY!! U completed the puzzle🥳🥳' },
  { src: '', caption: 'Surprise photo for Word Scramble will appear here! Add your image URL to SURPRISES.' },
  { src: '', caption: 'Surprise photo for 15-Puzzle will appear here! Add your image URL to SURPRISES.' },
];

// ---------- Styling helpers (tailwind classes & small CSS-in-JS for animations) ----------
const rainbowText = "bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-300 animate-rainbow";

// Add small global styles via a style tag injection — works when this component is included in a page
const PageStyles = () => (
  <style>{`
    @keyframes moveGradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    .header-gradient { background: linear-gradient(90deg, #ff7eb3, #7afcff, #ffd57e, #b78bff); background-size: 300% 300%; animation: moveGradient 8s ease infinite; }
    .glow { text-shadow: 0 0 12px rgba(255,255,255,0.06); }
    .animate-rainbow { background-size: 400% 400%; animation: moveGradient 6s linear infinite; }
    .surprise-card { transform-origin: bottom center; }
  `}</style>
);

// ---------- Utility ----------
const Section = ({ id, children, className = "" }) => (
  <section id={id} className={`min-h-screen w-full py-20 px-4 md:px-10 transition-colors duration-700 ${className}`}>
    {children}
  </section>
);

const FancyHeading = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-10 text-center">
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="inline-flex items-center gap-3 rounded-2xl px-5 py-2 bg-white/5 ring-1 ring-white/10 backdrop-blur">
      <Icon className="h-5 w-5" />
      <span className="tracking-widest uppercase text-xs">{subtitle}</span>
    </motion.div>
    <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className={`mt-4 text-4xl md:text-5xl font-extrabold glow ${rainbowText}`}>
      {title}
    </motion.h2>
  </div>
);

// ---------- Header/Nav ----------
const Nav = () => {
  const links = [
    { href: "#home", label: "Home", icon: Home },
    { href: "#memories", label: "Memories", icon: Images },
    { href: "#games", label: "Games", icon: Gamepad2 },
    { href: "#music", label: "Songs", icon: Music },
    { href: "#letter", label: "Letter", icon: Heart },
  ];
  return (
    <header className="fixed inset-x-6 top-4 z-50">
      <div className="flex items-center justify-between p-1 rounded-2xl header-gradient/90 shadow-2xl">
        <div className="px-4 py-2 rounded-xl bg-black/20 backdrop-blur flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center">🎉</div>
          <div className="text-white font-bold">Birthday Site</div>
        </div>
        <nav className="hidden md:flex items-center gap-3 bg-black/10 p-2 rounded-xl backdrop-blur">
          {links.map(({ href, label }, i) => (
            <a key={i} href={href} className="px-3 py-2 rounded-md text-sm font-medium text-white/90 hover:bg-white/10 transition">{label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
};

// ---------- Landing with Balloons Canvas (unchanged visuals but transitions into colorful theme) ----------
const BalloonLanding = () => {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const colors = ["#ff6b6b","#ffd93d","#6bcBef","#b28dff","#4ade80","#f472b6","#f97316","#22d3ee"];
    const rand = (a, b) => Math.random() * (b - a) + a;
    const makeBalloon = () => ({ x: rand(0, w), y: rand(h * 0.9, h * 1.4), r: rand(14, 32), vy: rand(-0.8, -0.3), sway: rand(0.5, 2.2), swayPhase: rand(0, Math.PI * 2), color: colors[(Math.random() * colors.length) | 0], stringLen: rand(40, 90) });
    let balloons = new Array(130).fill(0).map(makeBalloon);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      balloons.forEach((b, i) => {
        const x = b.x + Math.sin(b.swayPhase + performance.now() / 1000 * b.sway) * 10;
        const y = b.y;
        ctx.strokeStyle = "rgba(255,255,255,0.4)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x, y + b.r); ctx.lineTo(x, y + b.r + b.stringLen); ctx.stroke();
        const grd = ctx.createRadialGradient(x - b.r / 3, y - b.r / 3, 2, x, y, b.r);
        grd.addColorStop(0, "#ffffff"); grd.addColorStop(0.16, b.color); grd.addColorStop(1, b.color);
        ctx.fillStyle = grd; ctx.beginPath(); ctx.ellipse(x, y, b.r * 0.85, b.r, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = b.color; ctx.beginPath(); ctx.moveTo(x - 3, y + b.r); ctx.lineTo(x + 3, y + b.r); ctx.lineTo(x, y + b.r + 6); ctx.closePath(); ctx.fill();
        b.y += b.vy; if (b.y + b.r < -20) balloons[i] = makeBalloon();
      });
      rafRef.current = requestAnimationFrame(draw);
    };

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    draw();
    return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white" id="home">
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-black tracking-tight">
        Happy Birthday{" "}<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-yellow-300 drop-shadow-lg">Kirana!!!</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mt-4 max-w-2xl text-sm md:text-base text-white/80">Balloons, confetti, and a festival of color — scroll for surprises.</motion.p>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 flex gap-3">
          <a href="#memories" className="rounded-2xl bg-white/10 px-4 py-2">Explore Memories</a>
          <a href="#music" className="rounded-2xl bg-white/10 px-4 py-2">Play Songs</a>
        </motion.div>
      </div>
    </div>
  );
};

// ---------- Memories (colorful backgrounds) ----------
const Memories = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !containerRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((ent) => {
        if (ent.isIntersecting) {
          // ensure muted so autoplay via IntersectionObserver won't be blocked
          try {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(()=>{});
            }
          } catch (e) {}
        } else {
          try { videoRef.current.pause(); } catch (e) {}
        }
      });
    }, { threshold: 0.5 });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <Section id="memories" className="bg-gradient-to-b from-pink-600 via-purple-700 to-indigo-900 text-white">
      <FancyHeading icon={Images} title="Memories, in Living Color" subtitle="birthday video • photos • long stories" />
      <div className="mx-auto max-w-6xl space-y-12">
        <div ref={containerRef} className="w-full rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-2xl">
          {MEDIA.VIDEO_URL ? (
            // added muted attribute so browsers allow autoplay when observer triggers play
            <video ref={videoRef} src={MEDIA.VIDEO_URL} controls className="w-full h-auto max-h-[620px] object-cover" playsInline preload="metadata" muted />
          ) : (
            <div className="w-full h-[420px] grid place-items-center text-white/60 bg-white/5">Add your VIDEO_URL in the MEDIA constant at the top of this file.</div>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {MEDIA.PHOTOS.length === 0 ? (
            <div className="p-8 bg-white/10 rounded-2xl text-white/80">No photos — add them in MEDIA.PHOTOS.</div>
          ) : (
            MEDIA.PHOTOS.map((p, i) => (
              <div key={i} className="bg-white/5 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
                <div className="w-full h-72 md:h-96 overflow-hidden">
                  <img src={p.src} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6 bg-gradient-to-r from-white/5 to-transparent">
                  <h3 className="text-xl font-bold">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{p.caption}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Section>
  );
};

// ---------- Games Section with Surprise Card support ----------
function useShuffledTiles() {
  const goal = [...Array(15).keys()].map((n) => n + 1).concat(0);
  const shuffle = () => {
    let arr = [...goal];
    const moves = [[1,0],[-1,0],[0,1],[0,-1]];
    let zr = 3, zc = 3;
    for (let i = 0; i < 300; i++) {
      const [dr, dc] = moves[(Math.random()*4)|0];
      const nr = zr + dr, nc = zc + dc;
      if (nr>=0 && nr<4 && nc>=0 && nc<4) {
        const zi = zr*4+zc, ni = nr*4+nc;
        [arr[zi], arr[ni]] = [arr[ni], arr[zi]];
        zr = nr; zc = nc;
      }
    }
    return arr;
  };
  return { goal, shuffle };
}

const FifteenPuzzle = ({ onComplete }) => {
  const { goal, shuffle } = useShuffledTiles();
  const [tiles, setTiles] = useState(shuffle());
  const [moves, setMoves] = useState(0);
  const solvedRef = useRef(false);

  const move = (i) => {
    const z = tiles.indexOf(0);
    const zr = (z / 4) | 0, zc = z % 4;
    const r = (i / 4) | 0, c = i % 4;
    if ((Math.abs(zr - r) + Math.abs(zc - c)) === 1) {
      const t = [...tiles];
      [t[z], t[i]] = [t[i], t[z]];
      setTiles(t);
      setMoves((m) => m + 1);
    }
  };

  const isSolved = useMemo(() => tiles.every((v, i) => v === goal[i]), [tiles]);

  useEffect(() => {
    if (isSolved && !solvedRef.current) {
      solvedRef.current = true;
      onComplete && onComplete(2); // index 2 -> 15-Puzzle surprise
    }
  }, [isSolved, onComplete]);

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold">15 Puzzle</h4>
        <div className="text-sm">Moves: {moves} {isSolved && '• Solved! 🎉'}</div>
      </div>
      <div className="grid grid-cols-4 gap-2 max-w-sm">
        {tiles.map((n, i) => (
          <button key={i} onClick={() => move(i)} disabled={n===0} className={`h-16 md:h-20 rounded-2xl text-xl font-bold ${n===0 ? 'bg-transparent' : 'bg-white/20 hover:bg-white/25 active:scale-95 transition'} backdrop-blur`}>{n!==0 && n}</button>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={() => { setTiles(shuffle()); setMoves(0); solvedRef.current = false; }} className="rounded-xl bg-white/10 px-4 py-2">Shuffle</button>
      </div>
    </div>
  );
};

const MemoryMatch = ({ onComplete }) => {
  const icons = ["🍰","🎈","🎁","✨","💖","🎵","🍫","🌈"]; // 8 pairs
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState({});
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const deck = [...icons, ...icons].map((v) => ({ v, id: Math.random() })).sort(() => Math.random() - 0.5);
    setCards(deck); setFlipped([]); setMatched({}); setMoves(0);
  }, []);

  useEffect(() => {
    if (cards.length > 0 && Object.keys(matched).length === cards.length) {
      onComplete && onComplete(0); // index 0 -> Memory Match surprise
    }
  }, [matched, cards, onComplete]);

  const onFlip = (id, idx) => {
    if (flipped.length === 2 || flipped.some((f) => f.idx === idx) || matched[idx]) return;
    const next = [...flipped, { id, idx }];
    setFlipped(next);
    if (next.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (cards[a.idx].v === cards[b.idx].v) {
        setMatched((m) => ({ ...m, [a.idx]: true, [b.idx]: true }));
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 700);
      }
    }
  };

  const reset = () => {
    const deck = [...icons, ...icons].map((v) => ({ v, id: Math.random() })).sort(() => Math.random() - 0.5);
    setCards(deck); setFlipped([]); setMatched({}); setMoves(0);
  };

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold">Memory Match</h4>
        <div className="text-sm">Moves: {moves}</div>
      </div>
      <div className="grid grid-cols-4 gap-2 max-w-sm">
        {cards.map((c, i) => {
          const show = flipped.some((f) => f.idx === i) || matched[i];
          return (
            <button key={c.id} onClick={() => onFlip(c.id, i)} className={`h-16 md:h-20 rounded-2xl font-bold text-2xl grid place-items-center transition ${show ? 'bg-white/25' : 'bg-white/10 hover:bg-white/20'}`}>
              {show ? c.v : "🎀"}
            </button>
          );
        })}
      </div>
      <div className="mt-4"><button onClick={reset} className="rounded-xl bg-white/10 px-4 py-2">Restart</button></div>
    </div>
  );
};

const WordScramble = ({ onComplete }) => {
  const list = ["kirana"];
  const [word, setWord] = useState("");
  const [scrambled, setScrambled] = useState("");
  const [guess, setGuess] = useState("");
  const [result, setResult] = useState(null);

  useEffect(() => { newGame(); }, []);

  const scramble = (w) => w.split("").sort(() => Math.random()-0.5).join("");
  const newGame = () => { const w = list[(Math.random()*list.length)|0]; setWord(w); setScrambled(scramble(w)); setGuess(""); setResult(null); };
  const submit = () => { if (guess.trim().toLowerCase() === word) { setResult(true); onComplete && onComplete(1); } else setResult(false); };

  return (
    <div className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow-xl max-w-md">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold">Word Scramble</h4>
        <button onClick={newGame} className="text-sm rounded-xl bg-white/10 px-3 py-1">New</button>
      </div>
      {/* make scrambled word readable on light card */}
      <div className="text-2xl font-bold mb-3 text-black">{scrambled}</div>
      {/* make input readable */}
      <input value={guess} onChange={(e)=>setGuess(e.target.value)} placeholder="Type your guess" className="w-full mb-3 px-3 py-2 rounded-lg bg-white text-black" />
      <div className="flex gap-2"><button onClick={submit} className="rounded-xl bg-white/10 px-4 py-2">Submit</button></div>
      {result === true && <div className="mt-3 text-green-300">Correct! 🎉</div>}
      {result === false && <div className="mt-3 text-rose-300">Try again.</div>}
    </div>
  );
};
const SurpriseModal = ({ open, onClose, surprise }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      
      {/* Clicking backdrop closes the modal */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal content */}
      <div className="relative z-10 max-w-md w-full p-6 bg-gradient-to-br from-indigo-600 via-pink-500 to-yellow-400 rounded-3xl shadow-2xl">
        <div className="bg-black/80 rounded-2xl p-6 text-white flex flex-col items-center gap-4">
          <div className="w-40 h-40 bg-white/10 rounded-xl overflow-hidden grid place-items-center">
            {surprise?.src ? (
              <img
                src={surprise.src}
                alt="surprise"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-4xl">🎁</div>
            )}
          </div>

          <h3 className="text-xl font-bold">Surprise!</h3>
          <p className="text-sm leading-relaxed whitespace-pre-wrap text-center">
            {surprise?.caption || 'Your surprise caption will appear here.'}
          </p>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 px-4 py-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// ---------- Games Wrapper (handles showing surprise on completion) ----------
const Games = ({ onShowSurprise }) => (
  <Section id="games" className="bg-gradient-to-b from-green-400 via-teal-500 to-cyan-700 text-white">
    <FancyHeading icon={Gamepad2} title="Playful Breaks" subtitle="memory • word • puzzle" />
    <div className="mx-auto max-w-6xl grid md:grid-cols-3 gap-6">
      <MemoryMatch onComplete={(i)=>onShowSurprise(i)} />
      <WordScramble onComplete={(i)=>onShowSurprise(i)} />
      <FifteenPuzzle onComplete={(i)=>onShowSurprise(i)} />
    </div>
  </Section>
);

// ---------- Music Player (no add instructions) ----------
const MusicPlayer = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const audioRef = useRef(null);

  const handleTrackSelect = (index) => {
    setCurrentTrackIndex(index);
    audioRef.current?.load();
    audioRef.current?.play();
  };

  return (
    <Section
      id="music"
      className="bg-gradient-to-b from-purple-300 via-purple-100 to-pink-200 text-gray-800"
    >
      <FancyHeading icon={Music} title="Her Favorite Songs" subtitle="listen and enjoy" />

      <div className="mx-auto max-w-4xl p-6 rounded-2xl shadow-xl bg-white/10 space-y-6">

        {/* Song Selection Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {MEDIA.TRACKS.map((track, index) => (
            <button
              key={index}
              onClick={() => handleTrackSelect(index)}
              className="px-4 py-2 bg-indigo-300 rounded hover:bg-indigo-400"
            >
              {track.name}
            </button>
          ))}
        </div>

        {/* Audio Player */}
        <audio
          ref={audioRef}
          controls
          className="w-full rounded-lg"
        >
          <source src={MEDIA.TRACKS[currentTrackIndex].url} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>

        {/* Now Playing Info */}
        <p className="text-lg font-semibold text-center">
          Now Playing: {MEDIA.TRACKS[currentTrackIndex].name}
        </p>

        {/* Manual Controls */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => audioRef.current?.pause()}
            className="px-4 py-2 bg-indigo-300 rounded hover:bg-indigo-400"
          >
            Pause
          </button>

          <button
            onClick={() => audioRef.current?.play()}
            className="px-4 py-2 bg-indigo-300 rounded hover:bg-indigo-400"
          >
            Play
          </button>

          <button
            onClick={() =>
              setCurrentTrackIndex((prev) => (prev + 1) % MEDIA.TRACKS.length)
            }
            className="px-4 py-2 bg-indigo-300 rounded hover:bg-indigo-400"
          >
            Next
          </button>
        </div>
      </div>
    </Section>
  );
};



const initialLetter = `
Dear Kirana/Bestiee/Puttaaaaa/Kandaaaa/Nan maguuuuu,

Wishing you the happiest of birthdays! 🎉
May your days be filled with love, laughter, and endless joy.🥰
You are a bright star in everyone's life, and I hope your year ahead shines even brighter.😍
Wishing you a birthday as unique and extraordinary as you are!
May all your dreams come true this year-starting with a perfect birthday☺️
Hope your special day is as incredible as you are!!!😁
May your birthday be as bright and wonderful as your spirit!🫠🤭


Sakuu jasti english aythuu anthaa baykobedaa puttaaaa.... All i want to say is happiestt birthday my kandaaa.... Alwaysss i mean alwaysss bee happyy puttaaaa that is all i wish for ik ik nanu kushi agi irbeku anthaa manasu alli ankotirtya anthaa but i always say alwayss puttaaa u happyy= me happyyy.... 
Actuallyy en gottaa kandaaa the way that the website turned out to be im really reallyy happyyy iduna aamele i can keep updating our memories, our songs, games even this letter i can rewrite how muchever times i want too.... 
Kandaaa heloke tumbaaa ide kanoo elli inda start madli antha nee gotagtillaaa... keluuu hoglii 
first of allll once again very very happy birthday kanoo kandaaa.... inmele celebrate maadola mane alli adu idu ano hange illaa nanu idinii in mele always nin birthday celebration idde iruteee adur alli no doubt en aadru agli idu antuu pakkaaaa....
Kandaa keluu this is not the final website aythaa nange actuallyy time manage maadoke aglila i thought some 3 weeks saku anthaa but tumbaa kelsa ittuuu... but anyways when i update it heltinii aaram agi kutkond oodkooo puttaaaa.... 
Soooo yesss puttaaaa enthaa gottaaa..... actuallyy enuu illaaa.... 😂😂 

The most beautiful... the most eligant... prettyy women duu birthdayy... kushi agi iruu kandaaa aste heloduu... 

Andd yesss puttaaa you are working reallyyy hard... okayy naaa.... adur meelee yavattuu doubt padbedaa... i truly trust that nindu istu hard work gee seriously ondu valle job sikke sigutee.... 
nangee enthaa gottaa birthday dina nuu ade golu heloke istaa illaaa.... nange ivattuu ninuu enu tension ildalee enjoy maadoduu important puttaaa...
Bere ondu istu helodu idee sadyakee tumbaa late aagidee website naa update maadi vattide heltini puttaaa....
im sorryyyy.....


Once againn happiestttt birthdayy nannn prettyy maguuuuu....🥰🥰🥰
`;

const LoveLetter = () => {
  return (
    <Section id="letter" className="bg-gradient-to-b from-indigo-700 via-fuchsia-700 to-pink-600 text-white">
      <FancyHeading icon={Heart} title="A Letter From My Heart" subtitle="pour your heart out" />
      <div className="mx-auto max-w-4xl">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-10 whitespace-pre-wrap text-lg leading-8">
          {initialLetter.trim()}
        </div>
      </div>
    </Section>
  );
};



// ---------- Footer ----------
const Footer = () => (
  <footer className="bg-black text-white/70 text-center py-10">Made with 💖, color, and endless joy.</footer>
);

// ---------- Main App (manages surprise modal) ----------
export default function BirthdayWebsite() {
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [currentSurprise, setCurrentSurprise] = useState(SURPRISES[0]);

  const showSurprise = (index) => {
    setCurrentSurprise(SURPRISES[index] || SURPRISES[0]);
    setSurpriseOpen(true);
  };

  return (
    <div className="min-h-screen font-sans text-white [--tw-ring-color:theme(colors.white/0.1)]">
      <PageStyles />
      <Nav />
      <BalloonLanding />
      <Memories />
      <Games onShowSurprise={showSurprise} />
      <MusicPlayer />
      <LoveLetter />
      <Footer />
      <SurpriseModal open={surpriseOpen} onClose={() => setSurpriseOpen(false)} surprise={currentSurprise} />
    </div>
  );
}
