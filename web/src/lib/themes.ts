export type Theme = {
  id: string;
  name: string;
  tagline: string;
  /** Tema kartındaki renk şeritleri */
  preview: [string, string, string];
  /** Arka plan fotoğrafı (web/public/themes) */
  photo: string;
  vars: Record<string, string>;
};

const PAGE = (layers: string) => layers;

export const THEMES: Theme[] = [
  {
    id: "default",
    name: "Varsayılan",
    tagline: "Fildişi zemin, mavi–pembe–sarı geçişler",
    preview: ["#a9d2ff", "#ffb3d9", "#ffe49a"],
    photo: "/themes/default.jpg",
    vars: {
      "--theme-page": PAGE(
        `radial-gradient(62rem 42rem at 6% -12%, rgba(150,197,255,.55), transparent 62%),
         radial-gradient(52rem 36rem at 98% -4%, rgba(255,172,212,.5), transparent 62%),
         radial-gradient(48rem 32rem at 55% 112%, rgba(255,226,148,.5), transparent 66%),
         linear-gradient(180deg, #fdfbff 0%, #faf6ff 100%)`,
      ),
      "--photo-veil":
        "linear-gradient(180deg, rgba(253,251,255,.66), rgba(248,244,255,.72))",
      "--color-ink": "#fbf8fd",
      "--color-canvas": "#f7f2fb",
      "--color-panel": "#ffffff",
      "--color-rail": "#ffffff",
      "--color-line": "#e9e1f3",
      "--color-paper": "#ffffff",
      "--color-paper-2": "#fefcff",
      "--color-cardink": "#241f36",
      "--color-strong": "#241f36",
      "--color-muted": "#6f6885",
      "--color-accent": "#ff8fc4",
      "--color-danger": "#d94869",
      "--wash-0":
        "linear-gradient(180deg, rgba(156,200,255,.26), rgba(255,255,255,.74) 46%)",
      "--wash-1":
        "linear-gradient(180deg, rgba(255,179,217,.26), rgba(255,255,255,.74) 46%)",
      "--wash-2":
        "linear-gradient(180deg, rgba(255,224,138,.28), rgba(255,255,255,.74) 46%)",
      "--top-0": "linear-gradient(90deg, #7cb6ff, #b39dff)",
      "--top-1": "linear-gradient(90deg, #ff9ccb, #ffc08a)",
      "--top-2": "linear-gradient(90deg, #ffd969, #9fe8c6)",
      "--btn-grad":
        "linear-gradient(105deg, #a9d2ff 0%, #ffb3d9 52%, #ffe49a 100%)",
      "--btn-ink": "#241f36",
      "--brand-grad":
        "linear-gradient(100deg, #3f86c9 0%, #d1519a 55%, #b07b16 100%)",
      "--color-focus": "#6ea8ef",
    },
  },
  {
    id: "vaporwave",
    name: "Vaporwave",
    tagline: "Neon pembe, camgöbeği ve mor sis",
    preview: ["#ff71ce", "#b967ff", "#01cdfe"],
    photo: "/themes/vaporwave.jpg",
    vars: {
      "--theme-page": PAGE(
        `radial-gradient(55rem 38rem at 10% -10%, rgba(255,113,206,.55), transparent 60%),
         radial-gradient(50rem 34rem at 95% 5%, rgba(1,205,254,.4), transparent 60%),
         radial-gradient(45rem 30rem at 60% 110%, rgba(255,251,150,.22), transparent 65%),
         linear-gradient(165deg, #241447 0%, #3b1b63 55%, #1a1030 100%)`,
      ),
      "--photo-veil":
        "linear-gradient(180deg, rgba(20,12,38,.62), rgba(10,6,24,.8))",
      "--color-ink": "#1a1030",
      "--color-canvas": "#35205c",
      "--color-panel": "#2a1a4d",
      "--color-rail": "#2a1a4d",
      "--color-line": "#4b3677",
      "--color-paper": "#fdf7ff",
      "--color-paper-2": "#f4e9ff",
      "--color-cardink": "#2a1440",
      "--color-strong": "#ffffff",
      "--color-muted": "#c3b2e6",
      "--color-accent": "#ff6ad5",
      "--color-danger": "#ff7aa8",
      "--wash-0":
        "linear-gradient(180deg, rgba(255,113,206,.28), rgba(42,26,77,.82) 52%)",
      "--wash-1":
        "linear-gradient(180deg, rgba(1,205,254,.24), rgba(42,26,77,.82) 52%)",
      "--wash-2":
        "linear-gradient(180deg, rgba(255,251,150,.2), rgba(42,26,77,.82) 52%)",
      "--top-0": "linear-gradient(90deg, #ff71ce, #b967ff)",
      "--top-1": "linear-gradient(90deg, #01cdfe, #7a5cff)",
      "--top-2": "linear-gradient(90deg, #fffb96, #05ffa1)",
      "--btn-grad":
        "linear-gradient(105deg, #ff71ce 0%, #b967ff 48%, #01cdfe 100%)",
      "--btn-ink": "#1a1030",
      "--brand-grad":
        "linear-gradient(100deg, #ff71ce 0%, #b967ff 50%, #01cdfe 100%)",
      "--color-focus": "#01cdfe",
    },
  },
  {
    id: "cottagecore",
    name: "Cottagecore",
    tagline: "Adaçayı, krem ve kurutulmuş gül",
    preview: ["#bfe0c2", "#f5d7c8", "#f0e6b8"],
    photo: "/themes/cottagecore.jpg",
    vars: {
      "--theme-page": PAGE(
        `radial-gradient(58rem 40rem at 8% -10%, rgba(191,224,194,.55), transparent 62%),
         radial-gradient(50rem 34rem at 96% 0%, rgba(245,215,200,.5), transparent 60%),
         radial-gradient(46rem 30rem at 55% 110%, rgba(240,230,184,.45), transparent 66%),
         linear-gradient(180deg, #fbf7ec 0%, #f5f0e2 100%)`,
      ),
      "--photo-veil":
        "linear-gradient(180deg, rgba(251,247,236,.66), rgba(243,238,224,.72))",
      "--color-ink": "#f8f3e6",
      "--color-canvas": "#f4eeda",
      "--color-panel": "#fffdf5",
      "--color-rail": "#fffdf5",
      "--color-line": "#e3dcc6",
      "--color-paper": "#fffef8",
      "--color-paper-2": "#fbf7e9",
      "--color-cardink": "#33301f",
      "--color-strong": "#3a382b",
      "--color-muted": "#79765f",
      "--color-accent": "#d98b9a",
      "--color-danger": "#b85c5c",
      "--wash-0":
        "linear-gradient(180deg, rgba(168,201,164,.3), rgba(255,253,245,.76) 48%)",
      "--wash-1":
        "linear-gradient(180deg, rgba(232,182,182,.28), rgba(255,253,245,.76) 48%)",
      "--wash-2":
        "linear-gradient(180deg, rgba(232,215,154,.3), rgba(255,253,245,.76) 48%)",
      "--top-0": "linear-gradient(90deg, #a8c9a4, #d9e8c4)",
      "--top-1": "linear-gradient(90deg, #e8b6b6, #f6d5c0)",
      "--top-2": "linear-gradient(90deg, #e8d79a, #cfe3b8)",
      "--btn-grad":
        "linear-gradient(105deg, #bfe0c2 0%, #f5d7c8 52%, #f0e6b8 100%)",
      "--btn-ink": "#33301f",
      "--brand-grad":
        "linear-gradient(100deg, #4f7a52 0%, #b06a72 55%, #8a7a3a 100%)",
      "--color-focus": "#7ba87c",
    },
  },
  {
    id: "dark-academia",
    name: "Dark Academia",
    tagline: "Eskitilmiş kâğıt, deri ve pirinç",
    preview: ["#c9a86a", "#8a6d43", "#5b4426"],
    photo: "/themes/dark-academia.jpg",
    vars: {
      "--theme-page": PAGE(
        `radial-gradient(56rem 38rem at 8% -8%, rgba(196,166,116,.45), transparent 62%),
         radial-gradient(50rem 34rem at 95% 2%, rgba(122,104,72,.3), transparent 60%),
         radial-gradient(44rem 28rem at 60% 112%, rgba(212,186,138,.4), transparent 66%),
         linear-gradient(180deg, #f4ecdd 0%, #e9dfcc 100%)`,
      ),
      "--photo-veil":
        "linear-gradient(180deg, rgba(244,236,221,.6), rgba(230,219,199,.7))",
      "--color-ink": "#efe7d6",
      "--color-canvas": "#f1e8d6",
      "--color-panel": "#faf3e6",
      "--color-rail": "#faf3e6",
      "--color-line": "#ddd0b8",
      "--color-paper": "#fdf8ef",
      "--color-paper-2": "#f7efe0",
      "--color-cardink": "#2b241c",
      "--color-strong": "#2f2921",
      "--color-muted": "#7a6b57",
      "--color-accent": "#a8865a",
      "--color-danger": "#a8524a",
      "--wash-0":
        "linear-gradient(180deg, rgba(160,128,86,.2), rgba(250,243,230,.78) 48%)",
      "--wash-1":
        "linear-gradient(180deg, rgba(110,110,70,.18), rgba(250,243,230,.78) 48%)",
      "--wash-2":
        "linear-gradient(180deg, rgba(200,170,110,.22), rgba(250,243,230,.78) 48%)",
      "--top-0": "linear-gradient(90deg, #c2a878, #8f7448)",
      "--top-1": "linear-gradient(90deg, #a8a06a, #c9c39a)",
      "--top-2": "linear-gradient(90deg, #d8b878, #b08a50)",
      "--btn-grad":
        "linear-gradient(105deg, #d9c9a3 0%, #c9a86a 52%, #a98a55 100%)",
      "--btn-ink": "#2b241c",
      "--brand-grad":
        "linear-gradient(100deg, #5b4426 0%, #8a6a3a 55%, #3f3a26 100%)",
      "--color-focus": "#a8865a",
    },
  },
  {
    id: "y2k",
    name: "Y2K",
    tagline: "Krom, çiklet pembesi ve buz mavisi",
    preview: ["#c9d6ff", "#ffb3e6", "#a8f0ff"],
    photo: "/themes/y2k.jpg",
    vars: {
      "--theme-page": PAGE(
        `radial-gradient(58rem 40rem at 8% -10%, rgba(201,214,255,.6), transparent 60%),
         radial-gradient(50rem 34rem at 96% -2%, rgba(255,179,230,.45), transparent 60%),
         radial-gradient(46rem 30rem at 55% 112%, rgba(168,240,255,.45), transparent 66%),
         linear-gradient(180deg, #f8faff 0%, #e9edf8 100%)`,
      ),
      "--photo-veil":
        "linear-gradient(180deg, rgba(248,250,255,.66), rgba(231,236,248,.72))",
      "--color-ink": "#eef1f8",
      "--color-canvas": "#eef2fb",
      "--color-panel": "#ffffff",
      "--color-rail": "#ffffff",
      "--color-line": "#d9dfef",
      "--color-paper": "#ffffff",
      "--color-paper-2": "#f7faff",
      "--color-cardink": "#1c2130",
      "--color-strong": "#1c2130",
      "--color-muted": "#5f6678",
      "--color-accent": "#ff7ac2",
      "--color-danger": "#e05a7a",
      "--wash-0":
        "linear-gradient(180deg, rgba(255,179,230,.3), rgba(255,255,255,.92) 48%)",
      "--wash-1":
        "linear-gradient(180deg, rgba(168,240,255,.28), rgba(255,255,255,.92) 48%)",
      "--wash-2":
        "linear-gradient(180deg, rgba(201,214,255,.3), rgba(255,255,255,.92) 48%)",
      "--top-0": "linear-gradient(90deg, #c9b3ff, #ff9fe0)",
      "--top-1": "linear-gradient(90deg, #9fe8ff, #a8c4ff)",
      "--top-2": "linear-gradient(90deg, #d0d6e8, #f0f4ff)",
      "--btn-grad":
        "linear-gradient(105deg, #c9d6ff 0%, #ffb3e6 50%, #a8f0ff 100%)",
      "--btn-ink": "#1c2130",
      "--brand-grad":
        "linear-gradient(100deg, #5b7fd4 0%, #d64fa8 55%, #3aa6c9 100%)",
      "--color-focus": "#7aa6ff",
    },
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    tagline: "Neon sarı, camgöbeği ve magenta",
    preview: ["#00e5ff", "#ff2bd6", "#f5ff5c"],
    photo: "/themes/cyberpunk.jpg",
    vars: {
      "--theme-page": PAGE(
        `radial-gradient(55rem 36rem at 8% -10%, rgba(0,229,255,.22), transparent 60%),
         radial-gradient(50rem 34rem at 96% -2%, rgba(255,43,214,.22), transparent 60%),
         radial-gradient(44rem 28rem at 55% 112%, rgba(245,255,92,.14), transparent 66%),
         linear-gradient(180deg, #0b0e15 0%, #05070b 100%)`,
      ),
      "--photo-veil":
        "linear-gradient(180deg, rgba(8,10,16,.7), rgba(3,4,8,.8))",
      "--color-ink": "#080a0f",
      "--color-canvas": "#151a24",
      "--color-panel": "#10141c",
      "--color-rail": "#10141c",
      "--color-line": "#26303f",
      "--color-paper": "#0d1420",
      "--color-paper-2": "#121b29",
      "--color-cardink": "#dff2ff",
      "--color-strong": "#e9f6ff",
      "--color-muted": "#8ea3bb",
      "--color-accent": "#ff2bd6",
      "--color-danger": "#ff5d6c",
      "--wash-0":
        "linear-gradient(180deg, rgba(0,229,255,.16), rgba(16,20,28,.8) 52%)",
      "--wash-1":
        "linear-gradient(180deg, rgba(255,43,214,.16), rgba(16,20,28,.8) 52%)",
      "--wash-2":
        "linear-gradient(180deg, rgba(245,255,92,.12), rgba(16,20,28,.8) 52%)",
      "--top-0": "linear-gradient(90deg, #00e5ff, #00ffa3)",
      "--top-1": "linear-gradient(90deg, #ff2bd6, #ff7a3d)",
      "--top-2": "linear-gradient(90deg, #f5ff5c, #00e5ff)",
      "--btn-grad":
        "linear-gradient(105deg, #00e5ff 0%, #ff2bd6 55%, #f5ff5c 100%)",
      "--btn-ink": "#06121a",
      "--brand-grad":
        "linear-gradient(100deg, #00e5ff 0%, #ff2bd6 55%, #f5ff5c 100%)",
      "--color-focus": "#00e5ff",
    },
  },
  {
    id: "coquette",
    name: "Coquette",
    tagline: "Kurdele, dantel ve pudra pembesi",
    preview: ["#ffd6e3", "#f7c9d8", "#fff0e2"],
    photo: "/themes/coquette.jpg",
    vars: {
      "--theme-page": PAGE(
        `radial-gradient(58rem 40rem at 8% -10%, rgba(255,214,227,.7), transparent 60%),
         radial-gradient(50rem 34rem at 96% -2%, rgba(255,240,226,.7), transparent 60%),
         radial-gradient(46rem 30rem at 55% 112%, rgba(246,226,255,.55), transparent 66%),
         linear-gradient(180deg, #fffafc 0%, #fbeef3 100%)`,
      ),
      "--photo-veil":
        "linear-gradient(180deg, rgba(255,250,252,.66), rgba(250,236,242,.72))",
      "--color-ink": "#fdf3f6",
      "--color-canvas": "#fbeef3",
      "--color-panel": "#fffafc",
      "--color-rail": "#fffafc",
      "--color-line": "#f0dae2",
      "--color-paper": "#fffdfd",
      "--color-paper-2": "#fff6f9",
      "--color-cardink": "#33222a",
      "--color-strong": "#35222b",
      "--color-muted": "#8b6c79",
      "--color-accent": "#e87aa6",
      "--color-danger": "#c9536e",
      "--wash-0":
        "linear-gradient(180deg, rgba(255,194,216,.34), rgba(255,250,252,.76) 48%)",
      "--wash-1":
        "linear-gradient(180deg, rgba(255,224,201,.32), rgba(255,250,252,.76) 48%)",
      "--wash-2":
        "linear-gradient(180deg, rgba(255,214,227,.34), rgba(255,250,252,.76) 48%)",
      "--top-0": "linear-gradient(90deg, #ffc2d8, #ffd9e6)",
      "--top-1": "linear-gradient(90deg, #ffe0c9, #ffcfd9)",
      "--top-2": "linear-gradient(90deg, #ffd6e3, #f6e2ff)",
      "--btn-grad":
        "linear-gradient(105deg, #ffd6e3 0%, #f7c9d8 50%, #fff0e2 100%)",
      "--btn-ink": "#33222a",
      "--brand-grad":
        "linear-gradient(100deg, #c2547e 0%, #e08aa6 55%, #a86a4a 100%)",
      "--color-focus": "#e87aa6",
    },
  },
];

export const DEFAULT_THEME_ID = "default";
const STORAGE_KEY = "tahta:theme";

export function getTheme(id: string): Theme {
  return THEMES.find((theme) => theme.id === id) ?? THEMES[0]!;
}

export function applyTheme(id: string): Theme {
  const theme = getTheme(id);
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
  root.dataset.theme = theme.id;
  return theme;
}

export function readStoredTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME_ID;
  } catch {
    return DEFAULT_THEME_ID;
  }
}

export function storeTheme(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    /* özel mod vb. */
  }
}
