import React, { Component } from 'react';

import { withStyles } from "@material-ui/core";
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import QueueSearchElementOverlay from './QueueSearchResultOverlay';

const styles = theme => ({
    tableItem: {
        cursor: "pointer",
    },
    tableRow: {
        position: "relative"
    }
});

class QueueSearchResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overlayIsOpen: false
        }
    }

    handleElementClick = (e) => {
        // Always triggers if the overlay is not open
        // It only closes if the button is not the thing that was clicked
        if (e.target === this || e.target.classList.contains("overlay") || !this.state.overlayIsOpen) {
            this.setState({overlayIsOpen: !this.state.overlayIsOpen});
        }
    };

    render() {
        const { classes, item } = this.props;

        return (
            <TableRow className={classes.tableRow} onClick={this.handleElementClick}>
                <TableCell className={classes.tableItem}>{item.title}</TableCell>
                <QueueSearchElementOverlay itemInfo={item} isVisible={this.state.overlayIsOpen}/>
            </TableRow>
        );
    }
}

export default withStyles(styles)(QueueSearchResult);