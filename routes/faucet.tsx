import { Connector } from '../islands/common/Connector.tsx'
import { Form } from '../components/faucet/Form.tsx'

export default function Faucet() {

    return (
        <>

            {/* header navbar-ish container */}
            <div class="justify-end w-full flex p-2"> 
                <Connector/>
            </div>

            {/*grow to keep footer at bottom, includes title and app form*/}
            <div class="grow flex flex-col justify-center mt-4 mb-8"> 

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