import {Component} from 'react'

import './character.css'

interface IProps {
    character: string,
    assessment: [string[], number] | null,
    key: number,
    parentShow: any,
    parentHide: any,
}

interface IState {
    show: boolean,
}

export default class Character extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.getColor = this.getColor.bind(this);
    }

    show() {
        if (this.props.assessment) {
            const text = this.props.assessment[0].join(" ")
            const score = this.props.assessment[1]
            this.props.parentShow(text, score)
        }
    }

    hide() {
        this.props.parentHide();
    }

    getColor() {
        if (this.props.assessment) {
            if (this.props.assessment[1] > 0)
                return 'positive'
            else if (this.props.assessment[1] < 0)
                return 'negative'
            else
                return 'neutral'
        }
        return 'none'
    }

    render() {
        return (
            <span className={this.getColor()} onMouseEnter={this.show} onMouseLeave={this.hide}>{this.props.character}</span>
        );
    }
}