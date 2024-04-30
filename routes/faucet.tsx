import { ActiveForm, AppContainer } from "islands/faucet/mod.ts";
import { Art, Body } from "components/common/mod.ts";


export default function Home() {
  return (
    <div class="text-[#2c2c2c] dark:text-[#EAEAEA] font-[Poppins]">
      <AppContainer>
        <Body.Container>
          <Body.Title text="Faucet" />
          <Body>
            <Art.Container>
              <Art
                src="/misc/dzhv-art-blue-yellow-busy.jpg"
                rotate="rotate-[45deg]"
              /> 
            </Art.Container>
            <ActiveForm />
          </Body>
        </Body.Container>
      </AppContainer>
    </div>
  );
}
