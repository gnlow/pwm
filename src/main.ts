import { $ } from "./el.ts"

const button = $.button({
    children: [
        "hi"
    ]
})

const path = document.querySelector("path")!

button.addEventListener("click", () => {
    const audioContext = new AudioContext()

    const mainGainNode = audioContext.createGain()

    mainGainNode.connect(audioContext.destination)
    mainGainNode.gain.value = 0.05

    const analyser = audioContext.createAnalyser()
    analyser.connect(mainGainNode)
    analyser.fftSize = 2048
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const f = () => {
        analyser.getByteTimeDomainData(dataArray)

        let result = ""
        dataArray.forEach((v, i) => {
            result += `L${i / dataArray.length * 500 -10} ${v / 256 * 100 + 50}`
        })
        path.setAttribute("d", "M -10 100" + result)

        requestAnimationFrame(f)
    }
    f()

    const osc = audioContext.createOscillator()
    osc.connect(analyser)
    
    osc.type = "square"
    osc.frequency.value = 128
    osc.start()
})

document.body.append(
    button
)