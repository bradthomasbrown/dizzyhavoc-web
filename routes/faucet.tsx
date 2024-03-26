import { Form } from '../components/faucet/Form.tsx'

export default function Faucet() {

    return (
        <>
        
            {/*grow to keep footer at bottom, includes title and app form*/}
            <div class="grow h-screen flex flex-col w-full justify-center"> 

                {/* app form */}
                <Form/> 

            </div>
            
        </>
    )

}