import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
export default function MenuButton() {
  if (!IS_BROWSER) return <></>;
  const [category, setCategory] = useState<string>("");
  const handleCategoryChange = (category: string) => {
    history.pushState(
      "",
      document.title,
      window.location.pathname +
        window.location.search,
    );
    let newCategory = category;
    if (category === "/Home") {
      newCategory = "/";
    }
    category = newCategory;
    window.location.pathname = `${newCategory.toLocaleLowerCase()}`;
    setCategory('');
  };

  return (
    <>
      <div>
        <select
          disabled
          class="text-2xl text-[#3d3d3d] dark:text-[#ccb286] text-center w-[130px] shadow-lg font-[Poppins] rounded-lg hover:scale-[102%] border border-[#e9e9e9] dark:border-[#ffffff1f] cursor-pointer dark:bg-[#191919] bg-[#f1f1f1]"
          name="category"
          value={category}
          onChange={(event) => handleCategoryChange(event.currentTarget.value)}
        >
          <option class="category" value="" selected disabled hidden>
            {"Menu"}
          </option>
          <option>{"/Home"}</option>
          <option>{"/Bridge"}</option>
          <option>{"/Stats"}</option>
          <option>{"/About"}</option>
        </select>
      </div>
    </>
  );
}
