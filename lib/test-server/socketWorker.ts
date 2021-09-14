import { SocketIOServer } from "@noreajs/realtime";
import { createAdapter } from "@socket.io/cluster-adapter";
import { EcosytemEventEmitter, Logger, NoreaBootstrap } from "..";
import apiRoutes from "./api-routes";

/**
 * Socket.io server initialization
 *
 */
const socketIoServer = new SocketIOServer().namespace({
  // name: "/socket.io",
  // middlewares: [
  //   async (socket, fn) => {
  //     console.log("Here is a global socket middleware!");

  //     fn();
  //   },
  // ],
  onConnect: (io, namespace, socket) => {
    Logger.log(`namespace ${namespace.name}: Socket ${socket.id} connected`);
    socket.join("olympus");
  },
  onDisconnect: (io, namespace, socket, reason: any) => {
    socket.leave("olympus");
    Logger.log(
      `namespace ${namespace.name}: Socket ${socket.id} disconnected`,
      reason
    );
  },
});

/**
 * Create a new NoreaJs App
 */
const bootstrap = new NoreaBootstrap(apiRoutes, {
  appName: "Socket Server instance",
});

bootstrap.afterStart((app, server) => {
  // initialize socket io on the server
  socketIoServer.attach(server, {
    cors: {
      origin: ["https://amritb.github.io"],
      credentials: false,
    },
  } as any);

  socketIoServer.getServer().adapter(createAdapter());

  setInterval(() => {
    try {
      socketIoServer.getServer().to("olympus").emit("hello", process.pid);
    } catch (error) {
      console.log("socketIoServer.getServer()", error);
    }
  }, 5000);

  EcosytemEventEmitter.free();
});

/**
 * Start your app
 */
bootstrap.start();
