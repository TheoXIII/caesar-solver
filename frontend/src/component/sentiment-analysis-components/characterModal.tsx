import ShowPolarity from './showPolarity'

import './character-modal.css'

interface IProps {
    text: string,
    score: number,
}

export default function CharacterModal(props: IProps) {
    return (
        <div className="character-modal">
            <p>{props.text}</p>
            <ShowPolarity polarity={props.score}/>
        </div>
    )
}