import { Form } from '../components/faucet/Form.tsx'
import { NavBar } from '../lib/internal.ts'

export default function Faucet() {

    return (
        <>
        <NavBar/>
        <div class="h-screen sm:mb-[230px] mb-[100px] flex flex-col">
        
            {/*grow to keep footer at bottom, includes title and app form*/}
            <div class="grow h-screen flex flex-col w-full justify-center"> 

                {/* app form */}
                <Form/> 

            </div>
            
        </div>
        </>
    )

}