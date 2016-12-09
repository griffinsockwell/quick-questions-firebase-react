import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import QuestionForm from './QuestionForm';
import { authRef } from '../reference';

class NewQuestion extends Component {
  componentDidMount() {
    authRef.onAuthStateChanged((user) => {
      if (!user) {
        browserHistory.push('/');
      }
    });
  }

  render() {
    return (
      <div className="NewQuestion">
        <QuestionForm />
      </div>
    );
  }
}

export default NewQuestion;
