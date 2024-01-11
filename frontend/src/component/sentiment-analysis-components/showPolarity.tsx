import { Alert } from 'react-bootstrap'

function createPercentage(n: number) {
    return (n * 100).toFixed(1).toString() + '%'
}

export default function ShowPolarity(props: {polarity: number}) {
    if (props.polarity === 0)
        return <Alert variant="light">Neutral</Alert>
    else if (props.polarity > 0)
        return <Alert variant='success'>{createPercentage(props.polarity)} Positive</Alert>
    else
        return <Alert variant='danger'>{createPercentage(-props.polarity)} Negative</Alert>
}