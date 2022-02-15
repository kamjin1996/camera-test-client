import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";

@Injectable({providedIn: 'root'})
export class SocketUtil {

  private socket!: WebSocket;

  private wsURL = `${environment.wsHost}` + `${environment.uid}`

  private handleMap: Map<string, Function> = new Map()

  /**
   *
   * @param request
   */
  sendContent(request: string) {
    this.socket.send(request)
  }

  constructor() {
    console.log("WebSocket Connected...");
    this.socket = new WebSocket(this.wsURL); //打开事件

    if (typeof (WebSocket) == "undefined") {
      console.log("您的浏览器不支持WebSocket");
    } else {
      console.log("您的浏览器支持WebSocket");
      //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接

      this.socket.onopen = () => {
        console.log("Socket 已打开");
      };

      //关闭事件
      this.socket.onclose = () => {
        console.log("Socket已关闭");
      };

      //发生了错误事件
      this.socket.onerror = () => {
        alert("Socket发生了错误");
        //此时可以尝试刷新页面
      }
    }
  }

  /**
   * registryHandle
   *
   * @param messageName
   * @param messageHandle
   */
  registryHandle(messageName: string, messageHandle: (response: any) => void) {
    this.handleMap.set(messageName, messageHandle)
    this.socket.onmessage = (msg: any) => {
      console.log("接受到服务器信息: " + msg.data);
      let jsonData = JSON.parse(msg.data)
      let handle = <Function>this.handleMap.get(jsonData.type)
      return handle(jsonData)
    };

  }
}

