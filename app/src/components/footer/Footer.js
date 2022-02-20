import React, {Component} from 'react';
import './footer.scss';

class Footer extends Component {
  render() {
    return(
      <div className="text-center p-3 footer">
        © 2022 Copyright: 
        <a className="text-white" href="https://alejandroestarlich.es/"> Alejandro</a>
      </div>
    );
  }
}

export default Footer;