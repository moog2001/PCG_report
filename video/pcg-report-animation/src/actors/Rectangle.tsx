import { Coord2D } from "./Coord2D";

export class Rectangle {
    public StartingCoord2D: Coord2D;
    public Width: number;
    public Height: number;

    constructor(startingCoord2D: Coord2D, width: number, height: number) {
        this.StartingCoord2D = startingCoord2D;
        this.Width = width;
        this.Height = height;
    }
}