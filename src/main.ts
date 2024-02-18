import { $ } from "./el.ts"

const button = $.button({
    children: [
        "hi"
    ]
})

const svg = document.querySelector("svg")!
const path = document.querySelector("path")!

button.addEventListener("click", () => {
    const audioContext = new AudioContext()

    const mainGainNode = audioContext.createGain()

    mainGainNode.connect(audioContext.destination)
    mainGainNode.gain.value = 0.05

    const analyser = audioContext.createAnalyser()
    analyser.connect(mainGainNode)
    analyser.fftSize = 1024
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)

    const timePerFrame = audioContext.sampleRate / analyser.fftSize

    const osc = audioContext.createOscillator()
    osc.connect(analyser)
    
    osc.type = "sine"
    osc.frequency.value = 1000/12
    osc.start()

    const f = (time: number) => () => {
        analyser.getByteTimeDomainData(dataArray)
        
        const dt = Date.now() - time
        console.log(dt)
        osc.frequency.value = 2000/(dt || 1)

        let result = ""
        dataArray.forEach((v, i) => {
            result += `
                L
                ${(i + dt / timePerFrame) / dataArray.length * svg.clientWidth}
                ${v / 256 * 100 + 50}
            `
        })
        path.setAttribute("d", "M -10 100" + result)

        requestAnimationFrame(f(Date.now()))
    }
    requestAnimationFrame(f(Date.now()))
})

document.body.append(
    button
)