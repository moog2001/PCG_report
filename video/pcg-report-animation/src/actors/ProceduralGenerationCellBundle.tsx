export class ProceduralGenerationCellBundle {
    public MinRoomSize: number;
    public MaxRoomSize: number;
    public LeafNodeChance: number; 

    constructor(minRoomSize: number, maxRoomSize: number, leafNodeChance: number) {
        this.MinRoomSize = minRoomSize;
        this.MaxRoomSize = maxRoomSize;
        this.LeafNodeChance = leafNodeChance; 
    }
}