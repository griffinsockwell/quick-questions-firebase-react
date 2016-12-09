import React, { PropTypes } from 'react';
import Navbar from './Navbar';

const App = ({ children }) => (
  <div className="App">
    <Navbar />
    <div className="App-body">
      {children}
    </div>
  </div>
);

App.propTypes = {
  children: PropTypes.element,
};

export default App;
