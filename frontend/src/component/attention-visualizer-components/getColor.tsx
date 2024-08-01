export default function getColor(score: number | null) {
    if (score === null) {
        return `#E9ECEF`
    }
    const green = score * 255
    const red = 255 - green
    return `rgb(${red}, ${green}, 150)`
}