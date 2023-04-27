import { Coord2D } from "./Coord2D";
import { ProceduralGenerationCellBundle } from "./ProceduralGenerationCellBundle";
import { Rectangle } from "./Rectangle";
import * as Utils from "../Utils/utilities";

export class BinarySpaceTree {
  public static VERTICAL_CUT_INDEX = 0;
  public static HORIZONTAL_CUT_INDEX = 1;
  public Key: number;
  private _nodeRectangle: Rectangle;
  private _leftChildNode: BinarySpaceTree;
  private _rightChildNode: BinarySpaceTree;
  private _parentNode: BinarySpaceTree;
  private _isLeaf: boolean = true;
  private _verticalCut: boolean;
  private _isRightChild: boolean;
  private _level: number;
  private _cellBundle: ProceduralGenerationCellBundle;
  public IsMutated: boolean = false;

  get isRightChild(): boolean {
    return this._isRightChild;
  }

  get level(): number {
    return this._level;
  }

  public get VerticalCut(): boolean {
    return this._verticalCut;
  }

  public set VerticalCut(value: boolean) {
    this._verticalCut = value;
  }

  public get RightChildNode(): BinarySpaceTree {
    return this._rightChildNode;
  }

  public set RightChildNode(value: BinarySpaceTree) {
    this._rightChildNode = value;
    if (this._rightChildNode != null) {
      this._isLeaf = false;
    }
  }

  public get LeftChildNode(): BinarySpaceTree {
    return this._leftChildNode;
  }

  public set LeftChildNode(value: BinarySpaceTree) {
    this._leftChildNode = value;
    if (this._rightChildNode != null) {
      this._isLeaf = false;
    }
  }

  public get ParentNode(): BinarySpaceTree {
    return this._parentNode;
  }

  public set ParentNode(value: BinarySpaceTree) {
    this._parentNode = value;
    if (this._parentNode != null) {
      this._level = this._parentNode._level + 1;
    } else {
      this._level = 0;
    }
  }

  get NodeRectangle() {
    return this._nodeRectangle;
  }

  set NodeRectangle(value: Rectangle) {
    this._nodeRectangle = value;
  }

  get isLeaf(): boolean {
    return this._isLeaf;
  }

  // constructor(nodeRectangle: Rectangle, cellBundle: ProceduralGenerationCellBundle) {
  //     this.NodeRectangle = nodeRectangle;
  //     this._cellBundle = cellBundle;
  //     this.ParentNode = null;
  //     this.Key = 1;
  //     this.divide();
  // }
  // constructor(nodeRectangle: Rectangle, parentNode: BinarySpaceTree,cellBundle: ProceduralGenerationCellBundle) {
  //     this.NodeRectangle = nodeRectangle;
  //     this._cellBundle = cellBundle;
  //     this.ParentNode = null;
  //     this.Key = 1;
  //     this.divide();
  // }
  // constructor(nodeRectangle: Rectangle, cellBundle: ProceduralGenerationCellBundle) {
  //     this.NodeRectangle = nodeRectangle;
  //     this._cellBundle = cellBundle;
  //     this.ParentNode = null;
  //     this.Key = 1;
  //     this.divide();
  // }

  public static AllocateLeafNodes(
    node: BinarySpaceTree,
    leafNodes: BinarySpaceTree[]
  ): boolean {
    if (!node) {
      // console.error("node is null")
      return false;
    }

    if (node.Key != 1) {
      // console.error("this is not the root node")
      return false;
    }

    if (node._isLeaf) {
      leafNodes.push(node);
      return true;
    }
    BinarySpaceTree.AllocateLeafNodesHelper(node.LeftChildNode, leafNodes);
    BinarySpaceTree.AllocateLeafNodesHelper(node.RightChildNode, leafNodes);
    return true;
  }

  // in-oder traversal
  public static AllocateNodesOfLevel(
    node: BinarySpaceTree,
    level: number,
    nodes: BinarySpaceTree[]
  ): boolean {
    if (!node) {
      // console.error("node is null")
      return false;
    }

    if (node.Key != 1) {
      // console.error("this is not the root node")
      return false;
    }

    BinarySpaceTree.AllocateNodesOfLevelHelper(
      node.LeftChildNode,
      level,
      nodes
    );
    if (node._level == level) {
      nodes.push(node);
    }
    BinarySpaceTree.AllocateNodesOfLevelHelper(
      node.RightChildNode,
      level,
      nodes
    );
    return true;
  }

  public static AllocateNodesOfUntilLevel(
    node: BinarySpaceTree,
    level: number,
    nodes: BinarySpaceTree[]
  ) {
    if (!node) {
      // console.error("node is null")
      return false;
    }

    if (node.Key != 1) {
      // console.error("this is not the root node")
      return false;
    }

    if (node._level <= level) {
      nodes.push(node);
    }
    BinarySpaceTree.AllocateNodesOfUntilLevelHelper(
      node.LeftChildNode,
      level,
      nodes
    );
    BinarySpaceTree.AllocateNodesOfUntilLevelHelper(
      node.RightChildNode,
      level,
      nodes
    );
    return true;
  }

  private static AllocateNodesOfUntilLevelHelper(
    node: BinarySpaceTree,
    level: number,
    nodes: BinarySpaceTree[]
  ) {
    if (!node) {
      // console.error("node is null")
      return;
    }

    if (node._level <= level) {
      nodes.push(node);
    }
    BinarySpaceTree.AllocateNodesOfUntilLevelHelper(
      node.LeftChildNode,
      level,
      nodes
    );
    BinarySpaceTree.AllocateNodesOfUntilLevelHelper(
      node.RightChildNode,
      level,
      nodes
    );
    return;
  }

  public static CreateRootNode(
    nodeRectangle: Rectangle,
    cellBundle: ProceduralGenerationCellBundle
  ): BinarySpaceTree {
    const node = new BinarySpaceTree();
    node.NodeRectangle = nodeRectangle;
    node._cellBundle = cellBundle;
    node.ParentNode = null;
    node.Key = 1;
    node.divide();
    return node;
  }

  public static CreateNode(
    nodeRectangle: Rectangle,
    parentNode: BinarySpaceTree,
    cellBundle: ProceduralGenerationCellBundle,
    key: number,
    isRightChild: boolean
  ): BinarySpaceTree {
    const node = new BinarySpaceTree();
    node.NodeRectangle = nodeRectangle;
    node._cellBundle = cellBundle;
    node.ParentNode = parentNode;
    node.Key = key;
    node.divide();
    node._isRightChild = isRightChild;
    return node;
  }

  private static AllocateLeafNodesHelper(
    node: BinarySpaceTree,
    leafNodes: BinarySpaceTree[]
  ) {
    if (!node) {
      // console.error("node is null")
    }

    if (node._isLeaf) {
      leafNodes.push(node);
      return true;
    }
    BinarySpaceTree.AllocateLeafNodesHelper(node.LeftChildNode, leafNodes);
    BinarySpaceTree.AllocateLeafNodesHelper(node.RightChildNode, leafNodes);
    return true;
  }

  private static AllocateNodesOfLevelHelper(
    node: BinarySpaceTree,
    level: number,
    nodes: BinarySpaceTree[]
  ) {
    if (!node) {
      // console.error("node is null")
      return;
    }

    BinarySpaceTree.AllocateNodesOfLevelHelper(
      node.LeftChildNode,
      level,
      nodes
    );
    if (node._level == level) {
      nodes.push(node);
    }
    BinarySpaceTree.AllocateNodesOfLevelHelper(
      node.RightChildNode,
      level,
      nodes
    );
    return;
  }

  private divide(): void {
    if (this.canMutateToBeLeaf()) {
      this.IsMutated = true;
      return;
    }
    var direction: Number = this.getDirectionToCut();
    if (direction == -1) {
      return;
    }

    if (direction == BinarySpaceTree.VERTICAL_CUT_INDEX) {
      this.divideVertically();
    } else {
      this.divideHorizontally();
    }
  }

  private canMutateToBeLeaf(): boolean {
    if (this.Key == 1) {
      return false;
    }

    if (
      this.NodeRectangle.Width <= this._cellBundle.MaxRoomSize &&
      this.NodeRectangle.Height <= this._cellBundle.MaxRoomSize
    ) {
      if (Utils.getChance(this._cellBundle.LeafNodeChance)) {
        return true;
      }
    }
    return false;
  }

  private getDirectionToCut(): Number {
    if (
      this.NodeRectangle.Width >= this._cellBundle.MinRoomSize * 2 &&
      this.NodeRectangle.Height >= this._cellBundle.MinRoomSize * 2
    ) {
      return Utils.getRandomInt(2);
    }
    if (this.NodeRectangle.Width >= this._cellBundle.MinRoomSize * 2) {
      return BinarySpaceTree.VERTICAL_CUT_INDEX;
    }
    if (this.NodeRectangle.Height >= this._cellBundle.MinRoomSize * 2) {
      return BinarySpaceTree.HORIZONTAL_CUT_INDEX;
    }
    return -1;
  }

  private divideHorizontally(): void {
    this._verticalCut = false;
    var cutAmountOnZ = Utils.getRandomIntInclusive(
      this._cellBundle.MinRoomSize,
      this.NodeRectangle.Height - this._cellBundle.MinRoomSize
    );

    var leftChildStartingCoords = new Coord2D(
      this.NodeRectangle.StartingCoord2D.X,
      this.NodeRectangle.StartingCoord2D.Z
    );
    var leftChildRectangle = new Rectangle(
      leftChildStartingCoords,
      this.NodeRectangle.Width,
      cutAmountOnZ
    );
    this.LeftChildNode = BinarySpaceTree.CreateNode(
      leftChildRectangle,
      this,
      this._cellBundle,
      this.Key * 2,
      false
    );

    var rightChildStartingCoords = new Coord2D(
      this.NodeRectangle.StartingCoord2D.X,
      this.NodeRectangle.StartingCoord2D.Z + cutAmountOnZ
    );
    var rightChildRectangle = new Rectangle(
      rightChildStartingCoords,
      this.NodeRectangle.Width,
      this.NodeRectangle.Height - cutAmountOnZ
    );
    this.RightChildNode = BinarySpaceTree.CreateNode(
      rightChildRectangle,
      this,
      this._cellBundle,
      this.Key * 2 + 1,
      true
    );
  }

  private divideVertically(): void {
    this._verticalCut = true;
    var cutAmountOnX = Utils.getRandomIntInclusive(
      this._cellBundle.MinRoomSize,
      this.NodeRectangle.Width - this._cellBundle.MinRoomSize
    );

    var leftChildStartingCoords = new Coord2D(
      this.NodeRectangle.StartingCoord2D.X,
      this.NodeRectangle.StartingCoord2D.Z
    );
    var leftChildRectangle = new Rectangle(
      leftChildStartingCoords,
      cutAmountOnX,
      this.NodeRectangle.Height
    );
    this.LeftChildNode = BinarySpaceTree.CreateNode(
      leftChildRectangle,
      this,
      this._cellBundle,
      this.Key * 2,
      false
    );

    var rightChildStartingCoords = new Coord2D(
      this.NodeRectangle.StartingCoord2D.X + cutAmountOnX,
      this.NodeRectangle.StartingCoord2D.Z
    );
    var rightChildRectangle = new Rectangle(
      rightChildStartingCoords,
      this.NodeRectangle.Width - cutAmountOnX,
      this.NodeRectangle.Height
    );
    this.RightChildNode = BinarySpaceTree.CreateNode(
      rightChildRectangle,
      this,
      this._cellBundle,
      this.Key * 2 + 1,
      true
    );
  }

  public static GetLevel(node: BinarySpaceTree): number {
    if (!node) {
      // console.error("node is null")
      return -1;
    }
    if (node.Key != 1) {
      // console.error("this is not the root node")
      return -1;
    }

    var leafNodes: Array<BinarySpaceTree> = new Array<BinarySpaceTree>();
    BinarySpaceTree.AllocateLeafNodes(node, leafNodes);

    var maxLevel = node._level;
    leafNodes.forEach((leafNode) => {
      if (leafNode._level > maxLevel) {
        maxLevel = leafNode._level;
      }
    });
    return maxLevel;
  }
}
