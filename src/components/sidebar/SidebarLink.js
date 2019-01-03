import React, { Component } from 'react';
import ReactSVG from 'react-svg';

class SidebarLink extends Component {
    render() {
        const { onClick } = this.props;

        return (
            <div className="link" onClick={onClick}>
                {this.props.icon && <ReactSVG svgClassName="link--icon" src={this.props.icon} wrapper="span"/>}
                <span className="link--text">{this.props.text}</span>
            </div>
        );
    }
}

export default SidebarLink;