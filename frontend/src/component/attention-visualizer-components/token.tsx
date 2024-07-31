import {Component} from 'react'
import getColor from './getColor';

import './token.css'

interface IProps {
    index: number,
    text: string,
    score: number | null,
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

    render() {
        return (
            <span className={`token`} style={{backgroundColor: getColor(this.props.score)}} onMouseEnter={this.show} onMouseLeave={this.hide} onClick={this.click}>&nbsp;{this.props.text} </span>
        );
    }
}