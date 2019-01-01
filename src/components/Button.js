import React, { Component } from 'react';


class Button extends Component {
    render() {
        const { text, onClickCallback } = this.props;

        return (
            <button onClick={onClickCallback}>{text}</button>
        )
    }
}

export default Button;