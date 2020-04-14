import { NoreaApp } from "./lib/NoreaApp";
import apiRoutes from "./lib/api-routes";

/**
 * Create a new NoreaJs App
 */
const app = new NoreaApp(apiRoutes, {
    forceHttps: false,
    beforeStart: (app) => { },
    afterStart: (app, server) => {
        console.log('App started')
    }
})

/**
 * Start your app
 */
app.start(3000)