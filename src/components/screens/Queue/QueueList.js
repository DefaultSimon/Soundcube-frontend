import React, {Component} from 'react';

import Logger from "../../../core/Logger";
import eventHandler, {Events} from '../../../core/EventHandler';
import api from '../../../core/Api';
import {resolveTime} from "../../../core/Utilities";

import {arrayMove, SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

// Material-UI
import {withStyles} from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
// Material icons
import {CloseCircle, Drag} from "mdi-material-ui";

const log = new Logger("QueueList");

// Custom styling
const styles = theme => ({
    noBreak: {
        whiteSpace: "nowrap"
    },
    cellStyle: {
        padding: "4px 15px 4px 10px"
    },
    iconCellStyle: {
        padding: "5px"
    },

    dragHandle: {
        cursor: "pointer"
    },
    removeButton: {
        cursor: "pointer"
    },
    thumbnail: {
        height: "auto",
        width: "100%",
        maxWidth: "100px",
        maxHeight: "100px"
    }
});

// A handle for sorting songs in the queue
const QueueDragHandle = withStyles(styles)(SortableHandle(({ classes }) => (
    <Drag className={classes.dragHandle}/>
)));

// An individual table element - a song
const QueueItem = withStyles(styles)(SortableElement(({classes, indexNum, value: {thumbnail, title, length, unique_id}, removeItemCallback}) => (
    <TableRow key={unique_id}>
        <TableCell classes={{root: classes.cellStyle}}><img className={classes.thumbnail} src={thumbnail} alt={`${title}-thumbnail`}/></TableCell>
        <TableCell classes={{root: classes.cellStyle}}>{title}</TableCell>
        <TableCell classes={{root: [classes.cellStyle, classes.noBreak].join(" ")}}>
            {resolveTime(length)}
        </TableCell>
        <TableCell classes={{root: classes.iconCellStyle}}>
            <QueueDragHandle />
        </TableCell>
        <TableCell classes={{root: classes.iconCellStyle}}>
            <CloseCircle
                className={classes.removeButton}
                onClick={() => removeItemCallback(indexNum)} />
            </TableCell>
    </TableRow>
)));

// A container for rendering the skeleton of the queue, which is a table
const QueueItemContainer = withStyles(styles)(SortableContainer(({ classes, items, removeItemCallback }) => (
    <Table>
        <TableHead>
            <TableRow>
                <TableCell classes={{root: classes.cellStyle}}>Thumbnail</TableCell>
                <TableCell classes={{root: classes.cellStyle}}>Title</TableCell>
                <TableCell classes={{root: classes.cellStyle}}>Length</TableCell>
                <TableCell classes={{root: classes.iconCellStyle}}/>
                <TableCell classes={{root: classes.iconCellStyle}}/>
            </TableRow>
        </TableHead>
        <TableBody>
            {items.map((value, index) => {
                return <QueueItem
                    key={"queue-" + value.unique_id}
                    index={index}
                    indexNum={index}
                    value={value}
                    removeItemCallback={removeItemCallback}/>
            })}
        </TableBody>
    </Table>
)));

class QueueList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: []
        };

        eventHandler.subscribeToEvent(Events.updateQueue, this.refreshQueue, "queue_list_refresh");
        eventHandler.subscribeToEvent(Events.updateQueueWithData, this.setQueue, "queue_list_set");
    }

    componentDidMount() {
        this.refreshQueue();
    }

    /**
     * Re-renders the component with the new queue
     * @param {array} queue
     */
    setQueue = (queue) => {
        log.info("Queue updated");
        this.setState({
            queue: queue
        });

        eventHandler.emitEvent(Events.queueUpdated, queue)
    };

    /**
     * Fetches the current queue from the server and updates the component
     */
    refreshQueue = () => {
        api.queue_get()
            .then((response) => {
                if (response.status === 200) {
                    this.setQueue(response.data.queue);
                } else {
                    log.warn(`Tried to get queue, got status code: ${response.status}`)
                }
            })
            .catch(() => {
                eventHandler.emitEvent(Events.queueUpdated)
            })
    };

    /**
     * Removes an item from the queue, both sending data to the server and updating the component
     * @param {int} position - index of the item to remove
     */
    removeItemFromQueue = (position) => {
        api.queue_remove(position)
            .then((response) => {
                if (response.status === 200) {
                    // Removed, update queue
                    this.setQueue(response.data["new_queue"])
                } else if (response.status === 441) {
                    // No such song
                    log.warn("Encountered invalid queue index while removing?!")
                }
            })
            .catch(err => {});
    };

    /**
     * Called when the user stops sorting elements in the queue
     * @param {int} oldIndex - old position
     * @param {int} newIndex - new position
     */
    onSortEnd = ({oldIndex, newIndex}) => {
        log.debug(`User stopped sorting: ${oldIndex} to ${newIndex}`);

        // Update queue on screen, then send move request
        this.setState({queue: arrayMove(this.state.queue, oldIndex, newIndex)});
        api.queue_move(oldIndex, newIndex)
            .then((response) => {
                if (response.status === 200) {
                    log.debug(`New queue state: ${JSON.stringify(response.data["new_queue"])}`);

                    // Update queue with new data that was received
                    this.setQueue(response.data["new_queue"])
                }
            })
            .finally(() => {
                eventHandler.emitEvent(Events.updateCurrentSong);
            })
    };

    render() {
        return (
            <div>
                <QueueItemContainer
                    useDragHandle={true}
                    lockAxis="y"
                    onSortEnd={this.onSortEnd}
                    items={this.state.queue}
                    transitionDuration={250}
                    distance={10}
                    removeItemCallback={this.removeItemFromQueue}/>
            </div>
        );
    }
}

export default QueueList;