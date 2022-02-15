import {Component, OnInit} from '@angular/core';
import {SocketService} from "../socket.service";

@Component({
  selector: 'app-snapshot',
  templateUrl: './snapshot.component.html',
  styleUrls: ['./snapshot.component.css']
})
export class SnapshotComponent implements OnInit {

  constructor(private socketService: SocketService) {
  }

  photoCount!: number;

  savedCount!: number

  photoSrc!: string
  mediaStream!: MediaStream;
  srcVideo!: HTMLVideoElement;
  timer!: number

  //决定图片的分辨率与性能
  videoWidth: number = 1280
  videoHeight: number = 700
  photoWidth: number = this.videoWidth
  photoHeight: number = this.videoHeight
  quality: number = 1.0
  eachSecTackPhoto = 24

  ngOnInit(): void {
    this.photoCount = 0
    this.savedCount = 0
    this.photoSrc = ''
    this.srcVideo = <HTMLVideoElement>document.getElementById("src-video");
    this.socketService.addSavedCountListener((response: any) => {
      this.savedCount = response.data
    })
    this.socketService.addConnectSuccessTipListener((response: any) => {
      alert(response.data)
    })
  }

  openMedia() {
    this.srcVideo.style.display = 'block';
    let constraints = {
      audio: false, //音频轨道
      video: {width: this.videoWidth, height: this.videoHeight}  //视频轨道
    }
    let mediaPromise = navigator.mediaDevices.getUserMedia(constraints);
    mediaPromise.then(
      (stream: MediaStream) => {
        /* refrence 这个stream stream */
        this.mediaStream = stream;
        this.srcVideo.srcObject = stream;
        this.srcVideo.play();
      }
    ).catch((err) => {
      /* 处理error */
      alert(err);
    });
  }

  takePhoto(): string {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas');
    //获取 `canvas`元素，根据`srcVideo`中的数据进行图片绘制 `ctx.drawImage()`；
    let ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
    ctx.drawImage(this.srcVideo, 0, 0, this.videoWidth, this.videoHeight);
    //将 `canvas`绘制的图片信息，展示在 `img`标签中；
    //closeMedia();
    return this.photoSrc = canvas.toDataURL("image/jpeg", this.quality);
  }

  infiniteTakePhoto() {
    this.timer = window.setInterval(() => {
      let dataURL = this.takePhoto()
      ++this.photoCount;
      //TODO 或许可以用RTCDataChannel实现

      // let arrayBuffer = Base64toArrayBuffer(dataURL.replace("data:image/png;base64,", ''));
      console.log("发送：" + dataURL)

      this.socketService.sendImageBase64(dataURL)
    }, 1000 / this.eachSecTackPhoto); //每秒抓帧
  }

  stopInfiniteTakePhoto() {
    clearInterval(this.timer);
  }

  clearTakePhotoCount() {
    this.stopInfiniteTakePhoto()
    this.photoCount = 0
  }

  clearSavedPhoto() {
    this.socketService.clearSavedPhoto()
    this.savedCount = 0
  }

  closeMedia() {
    this.mediaStream.getTracks().forEach(track => {
      track.stop();
    });
    this.srcVideo.style.display = 'none';
  }

}
