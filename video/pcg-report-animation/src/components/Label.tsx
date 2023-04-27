import {Rect, Txt, TxtProps} from "@motion-canvas/2d/lib/components";

export interface LabelProps extends TxtProps {
}

export class Label extends Txt {

    public constructor(props?: LabelProps) {
        super({...props});

        this.add(
            <Rect radius={10} padding={5}>
                {this.children}
            </Rect>
        )

    }

}