import { makeScene2D } from "@motion-canvas/2d";
import { Grid, Img, Rect, Txt } from "@motion-canvas/2d/lib/components";
import { Layout } from "@motion-canvas/2d/lib/components/Layout";
import { ColorConstants } from "../CONSTANTS";
import {
  createRef,
  makeRef,
  range,
  useLogger,
} from "@motion-canvas/core/lib/utils";
import { waitFor } from "@motion-canvas/core/lib/flow";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { Origin, Vector2 } from "@motion-canvas/core/lib/types";
import { BinarySpaceTree } from "../actors/BinarySpaceTree";
import imageLeafMutated from "../images/leafFillMutated.svg";
import imageLeaf from "../images/leafFill.svg";
import { Rectangle } from "../actors/Rectangle";
import { getRandomIntInclusive, getRandomNumber } from "../Utils/utilities";
import { ProceduralGenerationCellBundle } from "../actors/ProceduralGenerationCellBundle";
import { Coord2D } from "../actors/Coord2D";

const logger = useLogger();
export default makeScene2D(function* (view) {
  var refsLayout: Rect[] = [];
  var refContainerBig = createRef<Rect>();
  var dimensions = createSignal(new Vector2(1, 1));

  var refContainers: Rect[][] = [];
  var refContainerParents: Rect[][] = [];
  view.add(
    <Rect
      layout
      gap={50}
      fill={ColorConstants.BACKGROUND}
      size={[1920, 1080]}
      padding={50}
    >
      <Rect
        ref={refContainerBig}
        alignItems={"center"}
        size={["100%", "100%"]}
        gap={10}
        opacity={0}
        grow={1}
        direction={"column"}
      >
        <Layout
          layout={false}
          spawner={() => {
            var widthContainer = refContainerBig().width();
            var heightContainer = refContainerBig().height();
            var origin = refContainerBig().getOriginDelta(Origin.TopLeft);

            var xSize = widthContainer / dimensions().x;
            var ySize = heightContainer / dimensions().y;

            var minSize = Math.min(xSize, ySize);
            var minSize1 = minSize - 20;

            var xCount = Math.floor(widthContainer / minSize);
            var yCount = Math.floor(heightContainer / minSize);
            return range(yCount).map((yIndex) => {
              return (
                <Layout direction={"row"} alignItems={"center"}>
                  {...range(xCount).map((xIndex) => {
                    return (
                      <Rect
                        layout
                        size={minSize}
                        offset={[-1, -1]}
                        position={origin
                          .addX(xIndex * minSize)
                          .addY(yIndex * minSize)}
                        padding={10}
                      >
                        <Rect
                          size={[minSize1, minSize1]}
                          layout={false}
                          spawner={() => {
                            var minRoomSize = getRandomIntInclusive(3, 25);
                            var maxRoomSize = getRandomIntInclusive(
                              minRoomSize + 1,
                              50
                            );
                            var mutation = getRandomNumber(1);
                            var binarySpaceTree =
                              BinarySpaceTree.CreateRootNode(
                                new Rectangle(new Coord2D(0, 0), 50, 50),
                                new ProceduralGenerationCellBundle(
                                  minRoomSize,
                                  maxRoomSize,
                                  mutation
                                )
                              );
                            var tempLevel =
                              BinarySpaceTree.GetLevel(binarySpaceTree);
                            var spaceElements = new Array<BinarySpaceTree>();
                            BinarySpaceTree.AllocateNodesOfUntilLevel(
                              binarySpaceTree,
                              tempLevel,
                              spaceElements
                            );

                            return spaceElements.map((spaceElement) => {
                              var posSmall = new Vector2(
                                -minSize1 / 2,
                                -minSize1 / 2
                              );
                              var multAmount = minSize1 / 50;

                              let nodeSize = new Vector2(
                                spaceElement.NodeRectangle.Width * multAmount,
                                spaceElement.NodeRectangle.Height * multAmount
                              );

                              var minNodeSize = Math.min(
                                nodeSize.x,
                                nodeSize.y
                              );
                              if (spaceElement.isLeaf) {
                                return (
                                  <Rect
                                    layout={false}
                                    offset={[-1, -1]}
                                    radius={(10 / 800) * minSize1}
                                    stroke={ColorConstants.CONTRAST}
                                    lineWidth={(10 / 800) * minSize1}
                                    fill={ColorConstants.SOFT}
                                    position={posSmall
                                      .addX(
                                        spaceElement.NodeRectangle
                                          .StartingCoord2D.X * multAmount
                                      )
                                      .addY(
                                        spaceElement.NodeRectangle
                                          .StartingCoord2D.Z * multAmount
                                      )}
                                    size={nodeSize}
                                  >
                                    <Img
                                      size={minNodeSize * 0.7}
                                      src={
                                        spaceElement.IsMutated
                                          ? imageLeafMutated
                                          : imageLeaf
                                      }
                                    ></Img>
                                  </Rect>
                                );
                              } else {
                                return (
                                  <Rect
                                    layout={false}
                                    offset={[-1, -1]}
                                    radius={(10 / 800) * minSize1}
                                    stroke={ColorConstants.CONTRAST}
                                    lineWidth={(10 / 800) * minSize1}
                                    position={posSmall
                                      .addX(
                                        spaceElement.NodeRectangle
                                          .StartingCoord2D.X * multAmount
                                      )
                                      .addY(
                                        spaceElement.NodeRectangle
                                          .StartingCoord2D.Z * multAmount
                                      )}
                                    size={nodeSize}
                                  ></Rect>
                                );
                              }
                            });
                          }}
                        ></Rect>
                      </Rect>
                    );
                  })}
                </Layout>
              );
            });
          }}
        ></Layout>
      </Rect>
    </Rect>
  );

  yield* refContainerBig().opacity(1, 2);
  for (let i = 1; i < 9; i++) {
    dimensions(new Vector2(i + 1, 1));
    yield* waitFor(1);
  }
  yield* refContainerBig().opacity(0, 2);
});
