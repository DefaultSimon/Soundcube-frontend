import Cookies from 'js-cookie';
import axios from 'axios';

import Logger from './Logger';

const log = new Logger("Api");

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

    async send_http_request(type_, route, data) {
        /*
        Fetches an url and returns an axios response (uses Promises)
         */
        return await axios({
            method: type_,
            url: this.BASE_URL + route,
            data: data
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

    // Blueprint: Queue
    queue_get = async () => {
        let response = await this.send_http_request(
            "GET",
            "/music/queue/get",
            null);


        log.debug("Got /queue/get response");
        return response
    };

    queue_add = async (url, position) => {
        let response = await this.send_http_request(
            "POST",
            "/music/queue/add",
            { url: url, position: position });

        log.debug("Got /queue/add response");
        return response
    };
}

// Allows only one instance
const soundcubeApi = new SoundcubeApi();

export default soundcubeApi;