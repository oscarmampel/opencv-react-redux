export default class CaptureCamera {
    constructor(videoInput: HTMLVideoElement, captureFrontalCamera: boolean) {
        this.videoInput = videoInput;
        this.captureFrontalCamera = captureFrontalCamera;
        this.stream = undefined;
    }

    captureFrontalCamera: boolean;
    videoInput: HTMLVideoElement;
    stream: MediaStream;

    public get isRecording(): boolean {
        return this.stream != undefined;
    }

    public async start(): Promise<void> {
        if (this.isRecording) return;
        this.stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: {
                    exact: this.captureFrontalCamera ? 'user' : 'environment',
                },
            },
        });
        this.videoInput.srcObject = this.stream;
    }

    public getFrame(canvas: HTMLCanvasElement): HTMLCanvasElement {
        this.checkValidSize(canvas);
        const context = canvas.getContext('2d');
        context.drawImage(this.videoInput, canvas.width, canvas.height);
        return canvas;
    }

    checkValidSize(canvas: HTMLCanvasElement): void {
        if (
            canvas.width != this.videoInput.width ||
            canvas.height != this.videoInput.height
        ) {
            throw new Error('Canvas must have the same size as the video');
        }
    }

    public stop(): void {
        if (this.isRecording) {
            this.videoInput.pause();
            for (const track of this.stream.getTracks()) {
                track.stop();
            }
            this.stream = undefined;
        }
    }
}
