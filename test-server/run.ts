import { NoreaApp } from "../lib/NoreaApp";
import apiRoutes from "./api-routes";

/**
 * Create a new NoreaJs App
 */
const app = new NoreaApp(apiRoutes, {
    forceHttps: false,
    beforeStart: (app) => { },
    afterStart: (app, server, port) => {
        console.log('App started'),
        console.log('Your app is running on port', port)
    }
})

/**
 * Start your app
 */
app.start(3000)