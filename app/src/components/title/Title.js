import React, {Component} from "react";

class Title extends Component {
  render() {
    return (
      <div className="title w-100">
        <h1>{this.props.title}</h1>
        <hr className="w-75 m-auto mb-3" />
      </div>
    );
  }

  
}
export default Title;