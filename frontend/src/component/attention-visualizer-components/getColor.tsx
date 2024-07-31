export default function getColor(score: number | null) {
    if (score === null) {
        return `#E9ECEF`
    }
    const red = 255 - Math.min(255, score * 200)
    const green = 255 - red
    return `rgb(${red}, ${green}, 120)`
}