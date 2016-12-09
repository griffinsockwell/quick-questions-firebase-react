import React, { Component, PropTypes } from 'react';
import { authRef, answersRef, questionsRef } from '../reference';

class AnswerRemove extends Component {
  static propTypes = {
    answer: PropTypes.object,
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
    const { answer } = this.props;

    // Remove the answer
    // then decrement answers on the question by 1
    answersRef
      .child(answer.key)
      .remove()
      .then(() => {
        questionsRef
          .child(`${answer.questionId}/answers`)
          .transaction((answers) => {
            let answerCount = answers;
            answerCount -= 1;
            return answerCount;
          });
      });
  }

  render() {
    const { user } = this.state;
    const { answer } = this.props;

    const uid = user !== null ? user.uid : null;

    let component;
    if (uid === answer.uid) {
      component = (
        <div className="AnswerRemove">
          <button onClick={this.handleRemove}>Remove Answer</button>
        </div>
      );
    } else {
      component = <div />;
    }

    return component;
  }
}

export default AnswerRemove;
