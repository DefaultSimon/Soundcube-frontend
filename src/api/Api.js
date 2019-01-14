import Cookies from 'js-cookie';
import axios from 'axios';

import Logger from './Logger';
const log = new Logger("Api");

class SoundcubeApi {
    // TODO make this dynamic
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

    async send_http_request(type_, route, data) {
        /*
        Fetches an url and returns an axios response (uses Promises)
         */
        return axios({
            method: type_,
            url: this.BASE_URL + route,
            data: data
        }).catch((error) => {
            // Handle some errors before the normal catches do

            // Set a special attribute to be used down the chain for detecting if the error was one of these two types
            if (typeof error.response === "undefined" && error.request["readyState"] === 4) {
                // Request was sent, but no response
                log.error(`Request was sent, but no response was received: ${error}`);

                error.requestFailed = true;
            }
            else if (typeof error.request === "undefined" && typeof error.response === "undefined") {
                // Something went wrong even before sending the request
                log.error(`Request couldn't even be sent: ${error}`);

                error.requestFailed = true;
            }

            // Rethrow
            throw error;
        });
    }

    // ACTUAL (non-internal) API functions

    // Blueprint: Ping
    ping = async () => {
        let response = await this.send_http_request(
            "GET",
            "/ping",
            null);

        log.debug("Got /ping response");
        return response
    };

    // Blueprint: Player
    player_quickQueue = async (url) => {
        let response = await this.send_http_request(
            "POST",
            "/music/player/quickQueue",
            { song: url });

        log.debug("Got /player/quickQueue response");
        return response
    };

    player_getCurrentSong = async () => {
        let response = await this.send_http_request(
            "GET",
            "/music/player/getCurrentSong",
            null);

        log.debug("Got /player/getCurrentSong response");
        return response
    };

    player_play = async () => {
        let response = await this.send_http_request(
            "POST",
            "/music/player/play",
            null);

        log.debug("Got /player/play response");
        return response
    };

    player_pause = async () => {
        let response = await this.send_http_request(
            "POST",
            "/music/player/pause",
            null);

        log.debug("Got /player/pause response");
        return response
    };

    player_resume = async () => {
        let response = await this.send_http_request(
            "POST",
            "/music/player/resume",
            null);

        log.debug("Got /player/resume response");
        return response
    };

    player_stop = async () => {
        let response = await this.send_http_request(
            "POST",
            "/music/player/stop",
            null);

        log.debug("Got /player/stop response");
        return response;
    };

    player_next = async () => {
        let response = await this.send_http_request(
            "POST",
            "/music/player/next",
            null);

        log.debug("Got /player/next response");
        return response
    };

    player_previous = async () => {
        let response = await this.send_http_request(
            "POST",
            "/music/player/previous",
            null);

        log.debug("Got /player/previous response");
        return response
    };

    player_time_get = async () => {
        let response = await this.send_http_request(
            "GET",
            "/music/player/audioTime",
            null);

        log.debug("Got /player/audioTime response");
        return response
    };

    player_time_set = async (time_seconds) => {
        let resposne = await this.send_http_request(
            "PATCH",
            "/music/player/audioTime",
            {
                "time": parseFloat(time_seconds)
            }
        )
    };

    // Blueprint: Queue
    queue_get = async () => {
        let response = await this.send_http_request(
            "GET",
            "/music/queue/get",
            null);


        log.debug("Got /queue/get response");
        return response
    };

    queue_add = async (songUrl, position, setPlaying = false) => {
        let response = await this.send_http_request(
            "POST",
            "/music/queue/add",
            { song: songUrl, position: position, set_playing: setPlaying });

        log.debug("Got /queue/add response");
        return response
    };
}

// Allows only one instance
const soundcubeApi = new SoundcubeApi();

export default soundcubeApi;