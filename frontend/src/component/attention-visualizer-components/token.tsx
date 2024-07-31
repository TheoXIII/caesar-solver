import {Component} from 'react'

import './token.css'

interface IProps {
    index: number,
    text: string,
    score: number,
    parentShow: any,
    parentHide: any,
    setTargetToken: any,
}

interface IState {
    show: boolean,
}

export default class Token extends Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.click = this.click.bind(this);
        this.getColor = this.getColor.bind(this);
    }

    show() {
        this.props.parentShow(this.props.text, this.props.score)
    }

    hide() {
        this.props.parentHide();
    }

    click() {
        this.props.setTargetToken(this.props.index);
    }

    getColor() {
        if (this.props.score > 0)
            return 'positive'
        else if (this.props.score < 0)
            return 'negative'
        else
            return 'neutral'
    }

    render() {
        return (
            <span className={`token ${this.getColor()}`} onMouseEnter={this.show} onMouseLeave={this.hide} onClick={this.click}>&nbsp;{this.props.text} </span>
        );
    }
}