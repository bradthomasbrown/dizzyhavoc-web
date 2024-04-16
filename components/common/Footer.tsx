export default function Footer() {
  return (
    <footer
      draggable={false}
      id="footer"
      class="mt-8 sm:max-h-[230px] sm:min-h-[230px] min-h-[100px] max-h-[100px] bg-[#ededed] dark:bg-[#101010] border dark:border-1 border-1 dark:border-t-[#ededed18] dark:border-b-transparent border-b-transparent dark:border-s-transparent border-s-transparent dark:border-e-transparent border-e-transparent border-t-[#19191918] w-full flex flex-row gap-4 justify-center"
    >
      <div class="flex flex-col gap-4 justify-center">
        <div class="flex items-center gap-8">
          <a
            draggable={false}
            target="_blank"
            href="https://t.me/dizzyhavoc_portal"
          >
            <img
              draggable={false}
              src="/socials/telegram.png"
              class="select-none sm:size-8 size-6 hover:scale-[110%] dark:invert invert-0"
              title="telegram"
              alt="telegram"
            />
          </a>
          <a
            draggable={false}
            target="_blank"
            class="pt-1"
            href="https://discord.gg/stcbzS4KNq"
          >
            <img
              draggable={false}
              src="/socials/discord.png"
              class="select-none sm:w-8 sm:h-6 w-6 h-4 hover:scale-[110%] dark:invert invert-0"
              title="discord"
              alt="discord"
            />
          </a>
          <a
            draggable={false}
            target="_blank"
            class="pt-[2px]"
            href="https://x.com/dzhv_io"
          >
            <img
              draggable={false}
              src="/socials/x.png"
              class="select-none sm:size-7 size-5 hover:scale-[110%] dark:invert invert-0"
              title="x"
              alt="x"
            />
          </a>
          <a
            draggable={false}
            target="_blank"
            href="https://github.com/bradbrown-llc/dizzyhavoc"
          >
            <img
              draggable={false}
              src="/socials/git.png"
              class="select-none sm:size-8 size-6 hover:scale-[110%] dark:invert invert-0"
              title="github"
              alt="github"
            />
          </a>
          <a
            draggable={false}
            target="_blank"
            class="pt-[1px]"
            href="https://dizzyhavoc.gitbook.io/dizzyhavoc"
          >
            <img
              draggable={false}
              src="/socials/GitBook.png"
              class="select-none sm:size-8 size-6 hover:scale-[110%] dark:invert invert-0"
              title="gitbook"
              alt="whitepaper"
            />
          </a>
          <a
            draggable={false}
            target="_blank"
            class="pt-[1px]"
            href="https://www.coingecko.com/en/coins/dizzyhavoc"
          >
            <img
              draggable={false}
              src="/socials/cg.png"
              class="select-none sm:size-8 size-6 hover:scale-[110%] dark:invert invert-0"
              title="coingecko"
              alt="coingecko"
            />
          </a>
        </div>
        <span class="select-none flex dark:text-[#d2d2d2] justify-center text-[13px] sm:text-[17px] mt-0 sm:mt-4">
          Brad Brown LLC © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
}
