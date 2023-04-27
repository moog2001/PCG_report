import { makeScene2D } from "@motion-canvas/2d";
import { Rect } from "@motion-canvas/2d/lib/components/Rect";
import { ColorConstants } from "../CONSTANTS";
import { all, waitFor } from "@motion-canvas/core/lib/flow";
import { Txt } from "@motion-canvas/2d/lib/components/Txt";
import { Layout } from "@motion-canvas/2d/lib/components/Layout";
import "../global.css";
import { createRef } from "@motion-canvas/core/lib/utils";
import {
  easeInBack,
  easeInBounce,
  easeInCubic,
  easeInElastic,
  easeInExpo,
  easeInOutCirc,
  easeOutCubic,
} from "@motion-canvas/core/lib/tweening";
import { createSignal } from "@motion-canvas/core/lib/signals";

export default makeScene2D(function* (view) {
  view.fontFamily("Intellij Mono Regular");

  var txtPCG = createRef<Txt>();
  var txtThank = createRef<Txt>();
  var refRoot = createRef<Layout>();
  var refText = createRef<Layout>();
  var text = createSignal("");
  view.add(
    <Rect fill={ColorConstants.BACKGROUND} size={[1920, 1080]}>
      <Layout
        ref={refRoot}
        layout
        direction={"column"}
        alignItems={"center"}
        fontFamily={"Intellij Mono Regular"}
        fontSize={50}
        gap={70}
      >
        <Layout ref={refText}>
          <Txt
            fontSize={50}
            opacity={1}
            fill={ColorConstants.SOFT}
            width={1600}
            height={500}
            textAlign={"start"}
            textWrap={true}
            text={() => text()}
          ></Txt>
        </Layout>
        <Txt
          layout={false}
          ref={txtThank}
          fontSize={100}
          opacity={0}
          fill={ColorConstants.SOFT}
        >
          Thank you.
        </Txt>
      </Layout>
    </Rect>
  );

  var initPos = txtThank().position();
  txtThank().position(initPos.addX(2000));

  yield* waitFor(1);
  //
  // var fullText =
  //   "BSP ( Binary Space Partition ) algorithm is widely used in computer graphics as it allows for efficient geometric query of point in a space which then further allows for faster raycasting, frustrum culling and collision detection. It is also used to generate representational model of environment for dungeon-crawler type of games because of its disparate binary tree data structure.";
  //
  // var time = 0.05;
  // var minTime = 0.005;
  //
  // for (let i = 0; i < fullText.length; i++) {
  //   var newText = text().concat(fullText.charAt(i));
  //   yield* text(newText, Math.max(time, minTime));
  //   time *= 0.95;
  // }
  //
  // yield* waitFor(5);
  //
  // yield* refText().opacity(0, 2);

  yield* all(
    txtThank().position(initPos, 2, easeOutCubic),
    txtThank().opacity(1, 2.5, easeOutCubic)
  );
  yield* waitFor(0.1);
  yield* all(
    txtThank().position(initPos.addX(-2000), 2, easeInCubic),
    txtThank().opacity(0, 1.5, easeInCubic)
  );

  yield* waitFor(3);
  // yield* waitFor(5);
});
