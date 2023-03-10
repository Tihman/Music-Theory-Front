/* AUDIOSTREAM
*  API for audio playback and analysis.
*/

class AudioStream {
    constructor() {
        this.files = [];
        this.play = this.play.bind(this);
        this.getStreamData = this.getStreamData.bind(this)
    }
    async loadModule() {
        const { actx } = this;
        try {
            await actx.audioWorklet.addModule(`${process.env.PUBLIC_URL}/worklet/bypass-processor.js`);
            this.bypassNode = new AudioWorkletNode(actx, 'bypass-processor');
            console.log(`loaded module `);
            return true;
        } catch (e) {
            console.log(`Failed to load module`);
            return false;
        }
    }
    async checkContext() {
        if (!this.actx) {
            try {
                console.log('New context instantiated')
                this.actx = new (window.AudioContext || window.webkitAudioContext)();
                await this.loadModule();
            } catch (e) {
                console.log(`Sorry, but your browser doesn't support the Web Audio API!`, e);
            }
        }
    }
    fromFile(file) {
        this.checkContext();
        const { actx } = this;
        try {
            this.analyser = actx.createAnalyser();
            this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            this.source = actx.createMediaElementSource(file.el);
            const { analyser, source, dataArray } = this;
            analyser.fftSize = 2048;
            analyser.minDecibels = -100;
            analyser.maxDecibels = -15;
            analyser.connect(actx.destination);
            source.connect(this.analyser);
            this.files.push({ file, analyser, source, dataArray })
        } catch (e) {
            console.log('Failed to make stream: ', e);
        }
    }
    play(index) {
        this.actx.resume();
        this.files[index].file.el.play();
        this.getStreamData(index);
    }
    stop(index) {
        this.files[index].file.el.pause();
        this.files[index].file.el.currentTime = 0;
    }
    getStreamData(index) {
            this.files[index].analyser.getByteFrequencyData(this.files[index].dataArray)
            return this.files[index].dataArray;
    }
}

export { AudioStream }