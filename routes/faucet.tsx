import { Form } from "../components/faucet/Form.tsx";

export default function Faucet() {
  return (
    <>
      {/*grow to keep footer at bottom, includes title and app form*/}
      <div class="flex w-full grow flex-col items-center">
        <div className="min-w-[360px] flex-col sm:min-w-[500px] bg-blur2 shadow-xl rounded-xl flex min-h-[25rem] my-auto">
          <div class="lg:text-[1.8rem] unselectable text-[1.5rem] font-[Poppins] font-medium dark:text-[#d2d2d2] text-[#282828] pl-2">
            testnet faucet
          </div>

          <Form />
        </div>
      </div>
    </>
  );
}
