import Cookies from 'js-cookie';
import axios from 'axios';

import Logger from './logger';

const log = new Logger("API");

class SoundcubeApi {
    BASE_URL = "http://localhost:5000";

    constructor() {

        // TODO tokens
        // Try loading an access token if it exists
        let token = Cookies.get("sc_token");
        if (typeof token === "undefined") {
            token = null
        }

        // TODO send the token as a header along with every request
        this.token = token;
    }

    send_http_request(type_, route, data, callback) {
        axios({
            method: type_,
            url: this.BASE_URL + route,
            data: data
        }).then(function (response) {
            // Show logs
            log.info(`Got response for route ${route}`);
            log.debug(`Data: ${JSON.stringify(response.data)}`);
            // Call callback
            callback(response)
        })
    }

    // ACTUAL (non-internal) API functions
    ping = () => {
        this.send_http_request(
            "GET",
            "/ping",
            null,
            function (resp) {
                log.info("Got /ping response")
            }
        )
    };

    player_quickQueue = (url) => {
        this.send_http_request(
            "POST",
            "/music/player/quickQueue",
            { song: url },
            function (resp) {
                log.info("Got /quickQueue response")
            })
    };

    player_play = () => {
        this.send_http_request(
            "POST",
            "/music/player/play",
            null,
            function (resp) {
                log.info("Got /play response")
            })
    };

    player_pause = () => {
        this.send_http_request(
            "POST",
            "/music/player/pause",
            null,
            function (resp) {
                log.info("Got /pause response")
            }
        )
    };
}

export default SoundcubeApi;