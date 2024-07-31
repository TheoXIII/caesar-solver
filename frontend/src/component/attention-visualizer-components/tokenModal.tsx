import ShowAttention from './showAttention'

import './token-modal.css'

interface IProps {
    text: string,
    score: number | null,
}

export default function TokenModal(props: IProps) {
    return (
        <div className="token-modal">
            <p>{props.text}</p>
            <ShowAttention attention={props.score}/>
        </div>
    )
}