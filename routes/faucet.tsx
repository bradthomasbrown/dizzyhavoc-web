import { Form } from '../components/faucet/Form.tsx'

export default function Faucet() {

    return (
        <>
            {/*grow to keep footer at bottom, includes title and app form*/}
            <div class="grow h-screen flex flex-col items-center justify-center"> 

                {/* app title */}
                <div class="lg:text-[1.8rem] unselectable text-[1.5rem] font-[Poppins] font-medium dark:text-[#d2d2d2] text-[#282828]">
                    testnet faucet
                </div>

                {/* app form */}
                <Form/>

            </div>
            
        </>
    )

}