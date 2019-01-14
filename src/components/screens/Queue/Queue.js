import React, { Component } from 'react';

import Logger from "../../../api/Logger";
import eventHandler, { Events } from '../../../api/EventHandler';
import soundcubeApi from '../../../api/Api';

import { resolveTime } from "../../../api/Utilities";

// Material-UI
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const log = new Logger("Queue");

class Queue extends Component {
    constructor(props) {
        super(props);

        this.state = {
            queue: []
        };

        eventHandler.subscribeToEvent(Events.updateQueue, this.updateQueue);
        eventHandler.subscribeToEvent(Events.updateQueueWithData, this.setQueue);
    }

    setQueue = (queue) => {
        log.info("Queue updated");
        this.setState({
            queue: queue
        })
    };

    updateQueue = () => {
        soundcubeApi.queue_get()
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
        this.updateQueue();
    }

    render() {
        return (
            <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Length</TableCell>
                            <TableCell>Video ID</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            this.state.queue.map(song => {
                                const {video_id, title, length} = song;

                                return (
                                    <TableRow key={video_id}>
                                        <TableCell>{title}</TableCell>
                                        <TableCell>{resolveTime(length)}</TableCell>
                                        <TableCell>{video_id}</TableCell>
                                    </TableRow>
                                );
                            })
                        }
                    </TableBody>
                </Table>
            </div>
        );
    }
}

export default Queue;