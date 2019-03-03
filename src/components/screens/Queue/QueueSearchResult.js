import React, {Component} from 'react';

// Material-UI
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import QueueSearchElementOverlay from './QueueSearchResultOverlay';

class QueueSearchResult extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overlayIsOpen: false
        }
    }

    /**
     * Processes a click and opens/closes the "Add to queue" overlay
     * @param e
     */
    handleElementClick = (e) => {
        // Always triggers if the overlay is not open
        // It only closes if the button is not the thing that was clicked
        if (e.target === this || e.target.classList.contains("overlay") || !this.state.overlayIsOpen) {
            this.setState({overlayIsOpen: !this.state.overlayIsOpen});
        }
    };

    closeSelf = () => {
        this.setState({overlayIsOpen: false})
    };

    render() {
        const {item} = this.props;

        return (
            <TableRow onClick={this.handleElementClick}>
                <TableCell><img src={item.thumbnails.default.url} alt={`${item.title}-thumbnail`}/></TableCell>
                <TableCell>{item.title}</TableCell>
                <QueueSearchElementOverlay itemInfo={item} isVisible={this.state.overlayIsOpen} closeSelf={this.closeSelf}/>
            </TableRow>
        );
    }
}

export default QueueSearchResult;