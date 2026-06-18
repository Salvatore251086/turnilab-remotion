import { Composition } from "remotion";
import { TurniLabVideo } from "./compositions/TurniLabVideo";

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="TurniLabVideo"
        component={TurniLabVideo}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
