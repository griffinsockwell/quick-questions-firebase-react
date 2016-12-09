import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import { authRef, questionsRef, answersRef } from '../reference';

class QuestionRemove extends Component {
  static propTypes = {
    question: PropTypes.object,
  }

  state = { user: null }

  componentDidMount() {
    authRef.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  handleRemove = () => {
    const { question } = this.props;

    // Remove the question
    // then find all the answers for the question
    // then remove all the answers
    // then push the browser home
    questionsRef
      .child(question.key)
      .remove()
      .then(() => answersRef.orderByChild('questionId').equalTo(question.key).once('value'))
      .then((snap) => {
        snap.forEach((shot) => {
          answersRef.child(shot.key).remove();
        });
      })
      .then(() => {
        browserHistory.push('/');
      });
  }

  render() {
    const { user } = this.state;
    const { question } = this.props;

    const uid = user !== null ? user.uid : null;

    let component;
    if (uid === question.uid) {
      component = (
        <div className="QuestionRemove">
          <button onClick={this.handleRemove}>Remove Question</button>
        </div>
      );
    } else {
      component = <div />;
    }

    return component;
  }
}

export default QuestionRemove;
