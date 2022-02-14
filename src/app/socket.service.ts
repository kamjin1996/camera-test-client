import {Injectable} from '@angular/core';
import {SocketUtil} from "./snapshot/socket-util";
import {SocketRequest} from "./SocketRequest"

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socketUtil: SocketUtil) {
  }

  sendImageBase64(base64: string) {
    let request: SocketRequest = {
      data: base64,
      uid: 20,
      type: "imageBase64"
    }
    this.socketUtil.sendContent(JSON.stringify(request))
  }

  addConnectSuccessTipListener(messagehandle: (response: any) => void){
    this.socketUtil.registryHandle("connectSuccess", messagehandle)
  }

  addSavedCountListener(messagehandle: (response: any) => void) {
    this.socketUtil.registryHandle("imageSavedCount", messagehandle)
  }

  clearSavedPhoto() {
    let request: SocketRequest = {
      data: null,
      type: "imageClear",
      uid: 20 //hard code
    }
    this.socketUtil.sendContent(JSON.stringify(request))
  }
}
