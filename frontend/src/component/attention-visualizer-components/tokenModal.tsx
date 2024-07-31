import ShowPolarity from '../sentiment-analysis-components/showPolarity'

import './token-modal.css'

interface IProps {
    text: string,
    score: number,
}

export default function TokenModal(props: IProps) {
    return (
        <div className="token-modal">
            <p>{props.text}</p>
            <ShowPolarity polarity={props.score}/>
        </div>
    )
}