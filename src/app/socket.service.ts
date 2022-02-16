import {Injectable} from '@angular/core';
import {SocketUtil} from "./snapshot/socket-util";
import {SocketRequest} from "./SocketRequest"

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socketUtil: SocketUtil) {
  }

  addConnectSuccessTipListener(messageHandle: (response: any) => void) {
    this.socketUtil.registryHandle("ConnectSuccess", messageHandle)
  }

  addSavedCountListener(messageHandle: (response: any) => void) {
    this.socketUtil.registryHandle("ImageSavedCount", messageHandle)
  }

  addImageSavePathListener(messageHandle: (response: any) => void) {
    this.socketUtil.registryHandle("ImageSavePath", messageHandle)
  }

  sendImageBase64(base64: string) {
    let request: SocketRequest = {
      data: base64,
      uid: localStorage['uid'],
      type: "ImageBase64"
    }
    this.socketUtil.sendContent(JSON.stringify(request))
  }

  clearSavedPhoto() {
    let request: SocketRequest = {
      data: null,
      type: "ImageClear",
      uid: localStorage['uid']
    }
    this.socketUtil.sendContent(JSON.stringify(request))
  }
}
