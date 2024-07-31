import { Alert } from 'react-bootstrap'
import getColor from './getColor'

function createPercentage(n: number) {
    return (n * 100).toFixed(1).toString() + '%'
}

export default function ShowAttention(props: {attention: number | null}) {
    if (props.attention === null)
        return <Alert variant="light">Neutral</Alert>
    else
        return <Alert variant='success' style={{backgroundColor: getColor(props.attention)}}>{createPercentage(props.attention)}</Alert>
}