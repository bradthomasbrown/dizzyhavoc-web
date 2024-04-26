import { ActiveForm, AppContainer, LegalsPopup } from "islands/bridge/mod.ts";
import { Art, Body } from "components/common/mod.ts";

export default function Home() {
  return (
    <>
      <LegalsPopup />
      <AppContainer>
        <Body.Container>
          <Body.Title text="γ-vertigo" />
          <Body>
            <Art.Container>
              <Art
                src="/misc/dzhv-art-chevron.jpg"
                translate="translate-x-8 translate-y-[-24px]"
                rotate="rotate-[45deg]"
              />
            </Art.Container>
            <ActiveForm />
          </Body>
        </Body.Container>
      </AppContainer>
    </>
  );
}
