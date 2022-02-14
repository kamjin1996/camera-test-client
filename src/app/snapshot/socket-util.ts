import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class SocketUtil {

  private socket!: WebSocket;

  private wsURL = "ws://localhost:8081/websocket/20"

  private handleMap = new Map()

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

      //获得消息事件
      // this.socket.onmessage = (msg: any) => {
      //   alert("接受到服务器信息: " + msg.data);
      //   console.log(msg.data);
      //   //发现消息进入    开始处理前端触发逻辑
      // };

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
    //发现消息进入    开始处理前端触发逻辑

    this.handleMap.set(messageName, messageHandle)

    this.socket.onmessage = (msg: any) => {
      console.log("接受到服务器信息: " + msg.data);
      let jsonData = JSON.parse(msg.data)
      let handle = this.handleMap.get(jsonData.type)
      return handle(jsonData)
    };

  }
}

