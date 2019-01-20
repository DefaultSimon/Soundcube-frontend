import React, { Component } from 'react';

import Logger from '../../../api/Logger';
import eventHandler, {Events} from "../../../api/EventHandler";

import youtubeSearch from 'youtube-search';

import { withStyles } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import QueueSearchElement from './QueueSearchResult';

const log = new Logger("QueueSearchChooser");

const styles = theme => ({
    table: {
        position: "absolute",
        padding: "6px",
        border: `1px solid ${theme.palette.primary.main}`,
        background: theme.palette.background.paper
    },

    tableHeadRow: {
        height: "35px"
    },
    tableHeadCell: {
        padding: "2px 15px 2px 15px"
    }
});

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
            }
            else {
                log.debug("Got API key.")
            }

            this.youtubeOpts["key"] = key;
        });
        eventHandler.subscribeToEvent(Events.searchTextUpdated, this.handleSearchChange);
    }

    handleSearchChange = (value) => {
        clearTimeout(this.searchTimeout);

        this.searchTimeout = setTimeout(() => {
            log.debug("Searching...");
            this.searchYoutube(value);

        }, 450)
    };

    searchYoutube = (searchParameter) => {
        if (!searchParameter) {
            this.setState({searchItems: []});
            return;
        }

        youtubeSearch(searchParameter, this.youtubeOpts)
            .then(data => {
                console.log(data.results.map(item => (item.title)));

                this.setState({searchItems: data.results})
            })
            .catch(err => {
                log.warn("Something went wrong while fetching YouTube videos...");
                console.log(err);
            })
    };

    render() {
        const { classes } = this.props;
        const hasElements = this.state.searchItems.length !== 0;

        if (hasElements) {
            return (
                <div className="tablecontainer">
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow className={classes.tableHeadRow}>
                                <TableCell className={classes.tableHeadCell}>Title</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                this.state.searchItems.map(item =>
                                    (<QueueSearchElement
                                        key={item.id}
                                        item={item}/>))
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

export default withStyles(styles)(QueueSearchChooser);