import app from "./lib/app";
import http from 'http';
import https from 'http';
import * as route from './lib/route';

const PORT = process.env.PORT || 3000;

// create server
const server = new (process.env.NODE_ENV ? https.Server : http.Server)(app);


server.listen(PORT, () => {
    console.log(`Environement : ${process.env.NODE_ENV || 'local'}`);
    console.log('Express server listening on port ' + PORT);
})

export default {
    route
};