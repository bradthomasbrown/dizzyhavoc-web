import { type Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: [
    "{routes,islands,components}/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "mono": ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities }) => {
      matchUtilities({
        "loading": (value) => {
          if (value.length == 7) value = value + "ff";
          return {
            border: `solid 1px ${value.slice(0, -2)}20`,
            background:
              `linear-gradient(45deg, rgba(0,0,0,0) 40%, ${value} 50%, rgba(0,0,0,0) 60%) no-repeat`,
            backgroundSize: "50px 50px",
            animation: "loading 2s ease infinite",
            transition: "border 0s linear",
          };
        },
        "unload": () => {
          return {
            border: `solid 1px #00000000`,
            transition: "border 0.33s linear",
          };
        },
      });
    }),
  ],
} satisfies Config;
