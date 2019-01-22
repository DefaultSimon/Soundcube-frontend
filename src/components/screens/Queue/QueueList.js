import React, { Component } from 'react';

import Logger from "../../../api/Logger";
import eventHandler, { Events } from '../../../api/EventHandler';
import soundcubeApi from '../../../api/Api';
import { resolveTime } from "../../../api/Utilities";

import { Drag, CloseCircle } from "mdi-material-ui";

import { SortableContainer, SortableElement, arrayMove, SortableHandle } from 'react-sortable-hoc';

import { withStyles } from "@material-ui/core";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const log = new Logger("QueueList");

// Custom styling
const styles = theme => ({
    noBreak: {
        whiteSpace: "nowrap"
    },
    cellStyle: {
        padding: "4px 15px 4px 20px"
    },
    iconCellStyle: {
        padding: "5px"
    },

    dragHandle: {
        cursor: "pointer"
    },
    removeButton: {
        cursor: "pointer"
    }
});

// A handle for sorting songs in the queue
const QueueDragHandle = withStyles(styles)(SortableHandle(({ classes }) => (
    <Drag className={classes.dragHandle}/>
)));

// An individual table element - a song
const QueueItem = withStyles(styles)(SortableElement(({classes, indexNum, value: {video_id, title, length, unique_id}, removeItemCallback}) => (
    <TableRow key={unique_id}>
        <TableCell classes={{root: classes.cellStyle}}>{title}</TableCell>
        <TableCell classes={{root: [classes.cellStyle, classes.noBreak].join(" ")}}>
            {resolveTime(length)}
        </TableCell>
        <TableCell classes={{root: classes.cellStyle}}>{video_id}</TableCell>
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
const QueueItemContainer = withStyles(styles)(SortableContainer(({ classes, items, removeItemCallback }) => {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell classes={{root: classes.cellStyle}}>Title</TableCell>
                        <TableCell classes={{root: classes.cellStyle}}>Length</TableCell>
                        <TableCell classes={{root: classes.cellStyle}}>Video ID</TableCell>
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
            </Table>);
}));

class QueueList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: []
        };

        this.api = soundcubeApi;

        eventHandler.subscribeToEvent(Events.updateQueue, this.refreshQueue);
        eventHandler.subscribeToEvent(Events.updateQueueWithData, this.setQueue);
    }

    setQueue = (queue) => {
        log.info("Queue updated");
        this.setState({
            queue: queue
        })
    };

    refreshQueue = () => {
        this.api.queue_get()
            .then((response) => {
                if (response.status === 200) {
                    this.setQueue(response.data.queue)
                }
                else {
                    log.warn(`Tried to get queue, got status code: ${response.status}`)
                }
            })
    };

    removeItemFromQueue = (position) => {
        console.log(position);

        this.api.queue_remove(position)
            .then((response) => {
                if (response.status === 200) {
                    // Removed, update queue
                    this.setQueue(response.data.new_queue)
                }
                else if (response.status === 441) {
                    // No such song
                    log.warn("Encountered invalid queue index while removing?!")
                }
            })
            .catch(err => {
                if (err.requestFailed) {
                    return;
                }
            });
    };

    componentDidMount() {
        this.refreshQueue();
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        log.info(`Sort end: ${oldIndex}, ${newIndex}`);

        // Update queue on screen, then send move request
        this.setState({queue: arrayMove(this.state.queue, oldIndex, newIndex)});
        this.api.queue_move(oldIndex, newIndex)
            .then((response) => {
                if (response.status === 200) {
                    log.debug(`New queue state: ${JSON.stringify(response.data.new_queue)}`);

                    // Update queue with new data that was received
                    this.setQueue(response.data.new_queue)
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