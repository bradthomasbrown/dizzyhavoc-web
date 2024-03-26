import { Form } from '../components/faucet/Form.tsx'

export default function Faucet() {

    return (
        <>
        <div class="h-screen w-full sm:mb-[230px] mb-[100px] flex">
            {/*grow to keep footer at bottom, includes title and app form*/}
            <div class="flex w-full h-screen flex-col items-center mb-[5rem]">
          <div className="min-w-[360px] sm:min-w-[500px] bg-blur2 shadow-xl rounded-xl flex min-h-[25rem] my-auto">
              <Form/>
          </div>
      </div>
        </div>
        </>
    )

}