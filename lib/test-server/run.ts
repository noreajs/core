import { setupPrimary } from "@socket.io/cluster-adapter";
import cluster from "cluster";
import EcosystemMap from "../interfaces/EcosystemMap";

/**
 * ecosystem map
 */
const ecosystemMap = new EcosystemMap();

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  setupPrimary();

  // // web config
  // cluster.setupPrimary({
  //   exec: "./dist/test-server/webWorker.js",
  //   args: ["--use", "https"],
  // });

  // // add web worker
  // ecosystemMap.addWebWorker(cluster.fork());
  // ecosystemMap.addWebWorker(cluster.fork());

  // socket server config
  cluster.setupPrimary({
    exec: "./dist/test-server/socketWorker.js",
    args: ["--use", "http"],
  });

  // add socket server config
  ecosystemMap.addSocketWorker(cluster.fork());
  ecosystemMap.addSocketWorker(cluster.fork());
  ecosystemMap.addSocketWorker(cluster.fork());
  ecosystemMap.addSocketWorker(cluster.fork());
  ecosystemMap.addSocketWorker(cluster.fork());

  /**
   * Watch worker exit
   */
  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    const workerType = ecosystemMap.getWorkerType(worker.id);

    switch (workerType) {
      case "socket":
        // socket server config
        cluster.setupPrimary({
          exec: "./dist/test-server/socketWorker.js",
          args: ["--use", "http"],
        });

        // add socket server config
        ecosystemMap.addSocketWorker(cluster.fork());
        break;

      case "web":
        // web config
        cluster.setupPrimary({
          exec: "./dist/test-server/webWorker.js",
          args: ["--use", "https"],
        });

        // add web worker
        ecosystemMap.addWebWorker(cluster.fork());
        break;
    }
  });
} else {
  // hey
}
