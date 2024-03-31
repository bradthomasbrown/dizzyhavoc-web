export function WhichTitle(props: { title: string }) {
  return (
    <div
      class={`
      text-center
      pt-4
    `}
    >
      {props.title.slice(0, 1).toUpperCase()
        .concat(
          props.title.slice(1),
        )}
    </div>
  );
}
