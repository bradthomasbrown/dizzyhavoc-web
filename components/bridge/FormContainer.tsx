import { Form } from "./Form.tsx";
import { FormTitle } from "./FormTitle.tsx";

/**
 * The container for the form and its title
 */
export function FormContainer() {
  return (
    <div className={`
      min-w-[360px]
      flex-col
      sm:min-w-[500px]
      bg-blur2
      shadow-xl
      rounded-xl
      flex
      min-h-[25rem]
      my-auto`
    }>
      <FormTitle/>
      <Form/>
    </div>
  );
}
