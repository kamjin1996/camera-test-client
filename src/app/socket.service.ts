import {Injectable} from '@angular/core';
import {SocketUtil} from "./snapshot/socket-util";
import {SocketRequest} from "./SocketRequest"
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socketUtil: SocketUtil) {
  }

  sendImageBase64(base64: string) {
    let request: SocketRequest = {
      data: base64,
      uid: `${environment.uid}`,
      type: "ImageBase64"
    }
    this.socketUtil.sendContent(JSON.stringify(request))
  }

  addConnectSuccessTipListener(messageHandle: (response: any) => void) {
    this.socketUtil.registryHandle("ConnectSuccess", messageHandle)
  }

  addSavedCountListener(messageHandle: (response: any) => void) {
    this.socketUtil.registryHandle("ImageSavedCount", messageHandle)
  }

  clearSavedPhoto() {
    let request: SocketRequest = {
      data: null,
      type: "ImageClear",
      uid: `${environment.uid}`
    }
    this.socketUtil.sendContent(JSON.stringify(request))
  }
}
