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

export default makeScene2D(function* (view) {
  view.fontFamily("Intellij Mono Regular");

  var txtPCG = createRef<Txt>();
  var txtBSP = createRef<Txt>();
  var refRoot = createRef<Layout>();
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
        <Rect fill={"red"}>
          <Txt
            layout={false}
            ref={txtPCG}
            y={0}
            opacity={0}
            fill={ColorConstants.SOFT}
          >
            Procedural Content Generation
          </Txt>
        </Rect>
        <Txt
          y={50}
          layout={false}
          ref={txtBSP}
          fontSize={100}
          opacity={0}
          fill={ColorConstants.SOFT}
        >
          Binary Space Partition
        </Txt>
      </Layout>
    </Rect>
  );

  yield* all(
    txtPCG().opacity(1, 1),
    txtPCG().position(txtPCG().position().addY(-100), 1, easeOutCubic)
  );

  yield* waitFor(0.5);

  yield* all(
    txtBSP().opacity(1, 0.5),
    txtBSP().fontSize(120, 1, easeInOutCirc)
  );

  yield* waitFor(2);
  yield* refRoot().position(refRoot().position().addX(-2000), 1, easeInCubic);
});
