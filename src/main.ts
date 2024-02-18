import { $ } from "./el.ts"

const button = $.button({
    children: [
        "hi"
    ]
})

button.addEventListener("click", () => {
    const audioContext = new AudioContext()

    const mainGainNode = audioContext.createGain()

    mainGainNode.connect(audioContext.destination)
    mainGainNode.gain.value = 0.2

    const osc = audioContext.createOscillator()
    osc.connect(mainGainNode)
    
    osc.type = "sine"
    osc.frequency.value = 440
    osc.start()
})

document.body.append(
    button
)