import app from "./lib/app";
import * as http from 'http';
import * as https from 'http';
import group from './lib/routes/group';
import NoreaRouter from './lib/routes/NoreaRouter';

const PORT = process.env.PORT || 3000;

// create server
const server = new (process.env.NODE_ENV ? https.Server : http.Server)(app);


server.listen(PORT, () => {
    console.log(`Environement : ${process.env.NODE_ENV || 'local'}`);
    console.log('Express server listening on port ' + PORT);
})

module.exports = {
    route: {
        group,
        NoreaRouter
    }
}