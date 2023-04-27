import { makeScene2D } from "@motion-canvas/2d/lib/scenes";
import {
  Circle,
  Img,
  Layout,
  Line,
  Node,
  Rect,
  Txt,
} from "@motion-canvas/2d/lib/components";
import { createRef, useLogger } from "@motion-canvas/core/lib/utils";
import seedrandom from "seedrandom";
import { ColorConstants } from "../CONSTANTS";
import { createSignal } from "@motion-canvas/core/lib/signals";
import { BinarySpaceTree } from "../actors/BinarySpaceTree";
import { Rectangle } from "../actors/Rectangle";
import { Coord2D } from "../actors/Coord2D";
import { ProceduralGenerationCellBundle } from "../actors/ProceduralGenerationCellBundle";
import { Origin, Vector2 } from "@motion-canvas/core/lib/types";
import imageLeaf from "../images/leafFill.svg";
import imageLeafMutated from "../images/leafFillMutated.svg";
import { all, waitFor } from "@motion-canvas/core/lib/flow";
import { getRandomIntInclusive, getRandomNumber } from "../Utils/utilities";
import "../global.css";
import { easeInCubic, easeOutCubic } from "@motion-canvas/core/lib/tweening";

const logger = useLogger();

export default makeScene2D(function* (view) {
  seedrandom("hello.", { global: true });
  const containerSize = 800;
  const maxRoomSize = createSignal(25);
  const minRoomSize = createSignal(6);
  const mutationChance = createSignal(0.1);
  const generatedTime = createSignal(0);
  const spaceSize = createSignal(50);
  var animationTime = 1;

  var t1 = performance.now();
  var temp = BinarySpaceTree.CreateRootNode(
    new Rectangle(new Coord2D(0, 0), spaceSize(), spaceSize()),
    new ProceduralGenerationCellBundle(
      minRoomSize(),
      maxRoomSize(),
      mutationChance()
    )
  );
  var t2 = performance.now();
  generatedTime(t2 - t1);

  const binarySpaceTree = createSignal(temp);
  // for (let index = 0; index < leafNodes.length; index++) {
  //   const element = leafNodes[index];
  //   const rect = createRef<Rect>();
  //   yield * view.add(<Rect width={element.NodeRectangle.Width} height={element.NodeRectangle.Height} x={element.NodeRectangle.StartingCoord2D.X} y={element.NodeRectangle.StartingCoord2D.Z} fill={getRandomColor()} />)
  //   yield * waitFor(0.1);
  // }

  var container = createRef<Rect>();
  var containerParent = createRef<Rect>();
  var level = createSignal(0);
  var multAmount = createSignal(containerSize / spaceSize());
  var refContainerTreeParent = createRef<Rect>();
  var refContainerTree = createRef<Rect>();

  var refMaxRoomSizeText = createRef<Txt>();
  var refMinRoomSizeText = createRef<Txt>();
  var refMutationChanceText = createRef<Txt>();
  var refGeneratedTimeText = createRef<Txt>();
  var multAmountTree = 90;

  var refRoot = createRef<Layout>();
  view.add(
    <Rect fill={ColorConstants.BACKGROUND} size={[1920, 1080]}>
      <Layout
        ref={refRoot}
        fontFamily={"Intellij Mono Regular"}
        layout={true}
        width={"100%"}
        height={"100%"}
        gap={10}
        direction={"row"}
      >
        <Rect
          padding={40}
          width={"50%"}
          height={"100%"}
          stroke={ColorConstants.CONTRAST}
          direction={"column"}
          gap={20}
          alignItems={"center"}
        >
          <Rect offset={[-1, -1]} ref={containerParent} size={["100%", "100%"]}>
            <Rect
              position={() => containerParent().getOriginDelta(Origin.TopLeft)}
              layout={false}
              ref={container}
              size={[containerSize, containerSize]}
              spawner={() => {
                var tempLevel = level();
                var spaceElements = new Array<BinarySpaceTree>();
                BinarySpaceTree.AllocateNodesOfUntilLevel(
                  binarySpaceTree(),
                  tempLevel,
                  spaceElements
                );
                return spaceElements.map((element) => {
                  if (!element.isLeaf) {
                    return (
                      <Rect
                        position={() =>
                          container()
                            .getOriginDelta(Origin.TopLeft)
                            .add([
                              element.NodeRectangle.StartingCoord2D.X *
                                multAmount(),
                              element.NodeRectangle.StartingCoord2D.Z *
                                multAmount(),
                            ])
                        }
                        size={[
                          element.NodeRectangle.Width * multAmount(),
                          element.NodeRectangle.Height * multAmount(),
                        ]}
                        opacity={element.level == tempLevel ? 0 : 1}
                        offset={[-1, -1]}
                        radius={10}
                        stroke={ColorConstants.CONTRAST}
                        lineWidth={10}
                        fill={ColorConstants.BACKGROUND}
                      >
                        <Txt fill={ColorConstants.HIGH_CONTRAST}>
                          {element.level.toString()}
                        </Txt>
                      </Rect>
                    );
                  } else {
                    return (
                      <Rect
                        position={() =>
                          container()
                            .getOriginDelta(Origin.TopLeft)
                            .add([
                              element.NodeRectangle.StartingCoord2D.X *
                                multAmount(),
                              element.NodeRectangle.StartingCoord2D.Z *
                                multAmount(),
                            ])
                        }
                        size={[
                          element.NodeRectangle.Width * multAmount(),
                          element.NodeRectangle.Height * multAmount(),
                        ]}
                        opacity={
                          element.isLeaf && element.level != tempLevel ? 1 : 0
                        }
                        offset={[-1, -1]}
                        radius={10}
                        stroke={ColorConstants.CONTRAST}
                        lineWidth={10}
                        fill={ColorConstants.SOFT}
                      >
                        <Img
                          size={() => {
                            var min = Math.min(
                              element.NodeRectangle.Width,
                              element.NodeRectangle.Height
                            );
                            return [
                              min * multAmount() * 0.7,
                              min * multAmount() * 0.7,
                            ];
                          }}
                          src={element.IsMutated ? imageLeafMutated : imageLeaf}
                        />
                      </Rect>
                    );
                  }
                });
              }}
            ></Rect>
          </Rect>
          <Rect
            width={"100%"}
            direction="column"
            height={"20%"}
            paddingLeft={50}
            paddingRight={50}
            fontSize={40}
          >
            <Layout
              ref={refMaxRoomSizeText}
              direction={"row"}
              opacity={0}
              justifyContent={"space-between"}
            >
              <Txt fill={ColorConstants.SOFT}>Max Room Size</Txt>
              <Txt
                fill={ColorConstants.SOFT}
                text={() => maxRoomSize().toString()}
              />
            </Layout>
            <Layout
              ref={refMinRoomSizeText}
              direction={"row"}
              opacity={0}
              justifyContent={"space-between"}
            >
              <Txt fill={ColorConstants.SOFT}>Min Room Size</Txt>
              <Txt
                fill={ColorConstants.SOFT}
                text={() => minRoomSize().toString()}
              />
            </Layout>
            <Layout
              ref={refMutationChanceText}
              direction={"row"}
              opacity={0}
              justifyContent={"space-between"}
            >
              <Txt fill={ColorConstants.SOFT}>Room Leaf Chance</Txt>
              <Txt
                fill={ColorConstants.SOFT}
                text={() => mutationChance().toFixed(2)}
              />
            </Layout>
            <Layout
              ref={refGeneratedTimeText}
              direction={"row"}
              opacity={0}
              justifyContent={"space-between"}
            >
              <Txt fill={ColorConstants.SOFT}>Generated Time</Txt>
              <Txt
                fill={ColorConstants.SOFT}
                text={() =>
                  generatedTime() < 0.05
                    ? "<0.1ms"
                    : generatedTime().toFixed(1).concat("ms")
                }
              />
            </Layout>
          </Rect>
        </Rect>
        <Rect
          padding={10}
          gap={10}
          width={"50%"}
          height={"100%"}
          stroke={ColorConstants.CONTRAST}
          direction={"column"}
        >
          <Rect
            layout={false}
            ref={refContainerTreeParent}
            width={900}
            height={"100%"}
            padding={40}
            alignItems={"center"}
          >
            <Rect
              ref={refContainerTree}
              layout={false}
              size={() => refContainerTreeParent().size()}
              position={() =>
                refContainerTreeParent().getOriginDelta(Origin.TopLeft)
              }
              gap={20}
              direction={"column"}
              offset={[-1, -1]}
              alignItems={"center"}
              spawner={() => {
                var tempLevel = level();
                var nodes = new Array<Node>();
                var bsp = binarySpaceTree();
                var height = 800 / BinarySpaceTree.GetLevel(bsp);
                addTreeNodes(
                  bsp,
                  nodes,
                  new Vector2(425, -430),
                  450,
                  100,
                  tempLevel,
                  height
                );
                // nodes.push(
                return nodes;
              }}
            ></Rect>
          </Rect>
        </Rect>
      </Layout>
    </Rect>
  );

  // var initPos = refRoot().position();
  // refRoot().position(initPos.addX(2000));
  // yield* refRoot().position(initPos, 2, easeOutCubic);

  // @ts-ignore
  yield* animate();

  animationTime = 0.3;
  for (let i = 0; i < 2; i++) {
    generateBinarySpace();
    // @ts-ignore
    yield* animate();
  }

  animationTime = 0.05;
  for (let i = 0; i < 2; i++) {
    generateBinarySpace();
    // @ts-ignore
    yield* animate();
  }

  yield* refRoot().opacity(0, 3);
  yield* waitFor(2);
  function addTreeNodes(
    node: BinarySpaceTree,
    nodes: Node[],
    parentPos: Vector2,
    width: number,
    inputSize: number,
    level: number,
    height: number
  ) {
    if (node.level > level) {
      return;
    }
    var pos = new Vector2(parentPos.x, parentPos.y);
    if (node.level > 0) pos = pos.addY(height);
    node.isRightChild ? (pos.x += width) : (pos.x -= width);

    var lineWidth = (8 / 100) * inputSize;
    var fSize = (50 / 100) * inputSize;
    nodes.push(
      node.level == level ? (
        !node.isLeaf ? (
          <Layout opacity={0}>
            <Circle
              size={inputSize}
              stroke={ColorConstants.SOFT}
              lineWidth={lineWidth}
              fill={ColorConstants.BACKGROUND}
              position={pos}
            >
              <Txt fill={ColorConstants.WHITE_LABEL} fontSize={fSize}>
                {node.level.toString()}
              </Txt>
            </Circle>
          </Layout>
        ) : (
          <Layout opacity={0}>
            <Circle
              size={inputSize}
              stroke={ColorConstants.SOFT}
              fill={node.IsMutated ? "7B7099" : "609966"}
              position={pos}
            />
          </Layout>
        )
      ) : !node.isLeaf ? (
        <Circle
          size={inputSize}
          stroke={ColorConstants.SOFT}
          lineWidth={lineWidth}
          fill={ColorConstants.BACKGROUND}
          position={pos}
        >
          <Txt fill={ColorConstants.WHITE_LABEL} fontSize={fSize}>
            {node.level.toString()}
          </Txt>
        </Circle>
      ) : (
        <Circle
          size={inputSize}
          stroke={ColorConstants.SOFT}
          fill={node.IsMutated ? "7B7099" : "609966"}
          position={pos}
        />
      )
    );

    if (node.level > 0) {
      nodes.push(
        node.level == level ? (
          <Layout zIndex={-1} opacity={0}>
            <Line
              lineWidth={lineWidth}
              stroke={ColorConstants.SOFT}
              points={[parentPos, pos]}
            />
          </Layout>
        ) : (
          <Line
            lineWidth={lineWidth}
            zIndex={-1}
            stroke={ColorConstants.SOFT}
            points={[parentPos, pos]}
          />
        )
      );
    }

    if (node.LeftChildNode) {
      addTreeNodes(
        node.LeftChildNode,
        nodes,
        pos,
        width / 2,
        Math.max(inputSize * 0.7, 5),
        level,
        height
      );
    }
    if (node.RightChildNode) {
      addTreeNodes(
        node.RightChildNode,
        nodes,
        pos,
        width / 2,
        Math.max(inputSize * 0.7, 5),
        level,
        height
      );
    }
  }
  function* animate() {
    var levelCount = BinarySpaceTree.GetLevel(binarySpaceTree());
    for (let i = 0; i <= levelCount; i++) {
      level(i);
      var spawnedRects = container().children();
      var spawnedCircles = refContainerTree().children();
      yield* all(
        ...spawnedRects.map(function* (child, index) {
          if (child.children()[0] instanceof Img) {
          }

          if (index == 0) {
            yield* all(
              child.opacity(1, animationTime),
              refMaxRoomSizeText().opacity(1, animationTime),
              refMinRoomSizeText().opacity(1, animationTime),
              refMutationChanceText().opacity(1, animationTime),
              refGeneratedTimeText().opacity(1, animationTime)
            );
          } else {
            yield* child.opacity(1, animationTime);
          }
        }),
        ...spawnedCircles.map(function* (child, index) {
          if (child instanceof Layout) {
            yield* child.opacity(1, animationTime);
          }
        })
      );
      yield* waitFor(animationTime * 2);
    }
    yield* waitFor(2);
  }

  function generateBinarySpace() {
    minRoomSize(getRandomIntInclusive(3, 25));
    maxRoomSize(getRandomIntInclusive(minRoomSize(), spaceSize()));
    mutationChance(getRandomNumber(0.4));

    var t1 = performance.now();
    var tempBSP = BinarySpaceTree.CreateRootNode(
      new Rectangle(new Coord2D(0, 0), spaceSize(), spaceSize()),
      new ProceduralGenerationCellBundle(
        minRoomSize(),
        maxRoomSize(),
        mutationChance()
      )
    );
    var t2 = performance.now();

    generatedTime(t2 - t1);

    binarySpaceTree(tempBSP);
  }
});
