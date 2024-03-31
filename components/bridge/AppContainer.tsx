import { FormContainer } from "./FormContainer.tsx";

/**
 * The container for everything between the navbar and the footer
 */
export function AppContainer() {
  return (
    <div class="flex w-full grow flex-col items-center">
      <FormContainer/>
    </div>
  );
}
