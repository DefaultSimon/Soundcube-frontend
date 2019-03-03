import React, {Component} from 'react';

import Logger from '../../../core/Logger';
import eventHandler, {Events} from "../../../core/EventHandler";

// YouTube search library
import youtubeSearch from 'youtube-search';

// Material-UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import QueueSearchElement from './QueueSearchResult';

const log = new Logger("QueueSearchChooser");

class QueueSearchChooser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchItems: []
        };

        this.youtubeOpts = {
            key: null,
            maxResults: 5,
            type: "video"
        };
        this.searchTimeout = null;

        eventHandler.subscribeToEvent(Events.youtubeApiKeyFetched, (key) => {
            if (key === null) {
                log.warn("API key is not present!")
            } else {
                log.debug("Got API key.")
            }

            this.youtubeOpts["key"] = key;
        }, "queue_search_gotkey");
        eventHandler.subscribeToEvent(Events.searchTextUpdated, this.handleSearchChange, "queue_search_handlechange");
    }

    /**
     * Waits until the user stops typing (idle for 450ms) and fetches a search result from YouTube
     * @param {string} value - what to search for
     */
    handleSearchChange = (value) => {
        clearTimeout(this.searchTimeout);

        if (value === "") {
            log.debug("Input is empty, clearing immediately");
            this.setState({searchItems: []})
        } else {

            this.searchTimeout = setTimeout(() => {
                log.debug("Searching...");
                this.searchYoutube(value);

            }, 400)
        }
    };

    /**
     * Searches YouTube and updates the table with results
     * @param {string} searchParameter - what to search for
     */
    searchYoutube = (searchParameter) => {
        if (!searchParameter) {
            this.setState({searchItems: []});
            return;
        }

        youtubeSearch(searchParameter, this.youtubeOpts)
            .then(data => {
                //log.debug(`Fetched search results, got: ${JSON.stringify(data.results.map(item => (item.title)))}`);
                log.debug("Fetched YouTube search results");
                this.setState({searchItems: data.results});
                console.log(data);
            })
            .catch(err => {
                log.warn(`Something went wrong while fetching YouTube videos... ${err}`);
            })
    };

    render() {
        const hasElements = this.state.searchItems.length !== 0;

        if (hasElements) {
            return (
                <div className="tablecontainer">
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Thumbnail</TableCell>
                                <TableCell>Title</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.searchItems.map(item => (
                                    <QueueSearchElement
                                        key={item.id}
                                        item={item}/>
                                    ))
                            }
                        </TableBody>
                    </Table>
                </div>
            );
        }
        else {
            return <br/>;
        }
    }
}

export default QueueSearchChooser;