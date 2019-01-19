import React, { Component } from 'react';

import Logger from "../../../api/Logger";
import eventHandler, { Events } from '../../../api/EventHandler';
import soundcubeApi from '../../../api/Api';
import { resolveTime } from "../../../api/Utilities";

import { Drag } from "mdi-material-ui";

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
    dragHandle: {
        cursor: "pointer"
    }
});

// A handle for sorting songs in the queue
const QueueDragHandle = withStyles(styles)(SortableHandle(({ classes }) => (
    <Drag className={classes.dragHandle}/>
)));

// An individual table element - a song
const QueueItem = withStyles(styles)(SortableElement(({classes, value: {video_id, title, length, unique_id}}) => (
    <TableRow key={unique_id}>
        <TableCell classes={{root: classes.cellStyle}}>{title}</TableCell>
        <TableCell classes={{root: [classes.cellStyle, classes.noBreak].join(" ")}}>{resolveTime(length)}</TableCell>
        <TableCell classes={{root: classes.cellStyle}}>{video_id}</TableCell>
        <TableCell classes={{root: classes.cellStyle}}><QueueDragHandle/></TableCell>
    </TableRow>
)));

// A container for rendering the skeleton of the queue, which is a table
const QueueItemContainer = SortableContainer(({ items }) => {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Length</TableCell>
                        <TableCell>Video ID</TableCell>
                        <TableCell>Reorder</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((value, index) => {
                        return <QueueItem key={"queue-" + value.unique_id} index={index} value={value}/>
                    })}
                </TableBody>
            </Table>);
});

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
                    distance={10} />
            </div>
        );
    }
}

export default QueueList;