import { ActiveForm, AppContainer, LegalsPopup } from "islands/bridge/mod.ts";
import {
  Art,
  ArtContainer,
  Body,
  BodyContainer,
  BodyTitle,
} from "components/common/mod.ts";

export default function Home() {
  return (
    <>
      <LegalsPopup />
      <AppContainer>
        <BodyContainer>
          <BodyTitle text="β-vertigo" />
          <Body>
            <ArtContainer>
              <Art
                src="/misc/dzhv-art-chevron.jpg"
                translate="translate-x-8 translate-y-[-24px]"
                rotate="rotate-[45deg]"
              />
            </ArtContainer>
            <ActiveForm />
          </Body>
        </BodyContainer>
      </AppContainer>
    </>
  );
}
