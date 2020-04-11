import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Routes from "./api-routes";

class App {

    public app: express.Application;
    public routePrv: Routes = new Routes();

    constructor() {
        this.app = express();
        this.config();

        // Set api routes
        this.routePrv.routes(this.app);

        // set middleware
        this.routePrv.middlewares(this.app);
    }

    private config(): void {
        // init cors
        this.app.use(cors());
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

}

export default new App().app;