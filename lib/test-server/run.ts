import { setupPrimary } from "@socket.io/cluster-adapter";
import cluster from "cluster";
import EcosystemMap from "../modules/pool/EcosystemMap";

/**
 * ecosystem map
 */
const ecosystemMap = new EcosystemMap<"web" | "socket">({
  web: {
    clusterSettings: {
      exec: "./dist/test-server/webWorker.js",
      args: ["--use", "https"],
    },
  },
  socket: {
    clusterSettings: {
      exec: "./dist/test-server/socketWorker.js",
      args: ["--use", "http"],
    },
  },
});

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  setupPrimary();

  // // web config

  // // add web worker
  // ecosystemMap.addWebWorker(cluster.fork());
  // ecosystemMap.addWebWorker(cluster.fork());

  // add socket server config
  ecosystemMap.addManyWorkers(10, "socket");

  /**
   * Watch worker exit
   */
  ecosystemMap.watchExit();
} else {
  // hey
}
