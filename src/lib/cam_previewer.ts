import CaptureCamera from './capture';

declare const cv;

export default class CamPreviewer extends CaptureCamera {
    constructor(
        videoInput: HTMLVideoElement,
        captureFrontalCamera: boolean,
        outputCanvas: HTMLCanvasElement,
    ) {
        super(videoInput, captureFrontalCamera);
        this.outputCanvas = outputCanvas;
        this.middlewares = [];
        this.baseFrame = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
        this.editedFrame = new cv.Mat(videoInput.height, videoInput.width, cv.CV_8UC4);
    }

    outputCanvas: HTMLCanvasElement;
    middlewares: ImageMidleware[];
    baseFrame;
    editedFrame;

    public renderFrame(): void {
        const cap = new cv.VideoCapture(this.videoInput);
        cap.read(this.baseFrame);
        for (const middleware of this.middlewares) {
            middleware(this.baseFrame, this.editedFrame);
            [this.baseFrame, this.editedFrame] = [this.editedFrame, this.baseFrame];
        }
    }
}

type ImageMidleware = (baseMat, modifiedMat) => void;
