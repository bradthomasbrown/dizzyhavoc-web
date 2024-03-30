export function WhichTitle(props: { title: string }) {
  return (
    <div
      class={`
      font-[Poppins]
      text-center
      pt-4
      text-[#2c2c2c]
      dark:text-[#EAEAEA]
    `}
    >
      {props.title.slice(0, 1).toUpperCase()
        .concat(
          props.title.slice(1),
        )}
    </div>
  );
}
