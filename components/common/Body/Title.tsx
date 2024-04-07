export function Title(props: { text: string }) {
  return (
    <div
      class={`
        pl-2
        unselectable
        text-[1.5rem] lg:text-[1.8rem]
        font-medium
      `}
    >
      {props.text}
    </div>
  );
}
