import React, { Component, PropTypes } from 'react';
import { authRef, answersRef, questionsRef, timeRef } from '../reference';

class AnswerForm extends Component {
  static propTypes = {
    questionId: PropTypes.string,
  }

  state = {
    error: '',
    success: false,
    text: '',
    user: null,
  }

  componentDidMount() {
    authRef.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  setText = (evt) => {
    this.setState({ text: evt.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { questionId } = this.props;
    const { text } = this.state;

    // Check if the user has input text
    if (text.trim()) {
      const { currentUser } = authRef;

      const newAnswer = {
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        questionId,
        text,
        timestamp: timeRef,
        uid: currentUser.uid,
      };

      // Add the answer to firebase
      // then increment answers on the question by 1
      answersRef
        .push(newAnswer)
        .then(() => {
          questionsRef
            .child(`${questionId}/answers`)
            .transaction((answers) => {
              let answerCount = answers;
              answerCount += 1;
              return answerCount;
            });
        })
        .then(() => {
          this.setState({ success: true, error: '', text: '' });
        }, (error) => {
          this.setState({ error });
        });
    }
  }

  render() {
    const { error, success, text, user } = this.state;

    let component;
    if (success) {
      component = (
        <div className="AnswerForm-info">
          <p>YOU HAVE POSTED AN ANSWER TO THE QUESTION!</p>
        </div>
      );
    } else if (user) {
      component = (
        <div className="AnswerForm">
          <form onSubmit={this.handleSubmit}>

            {error ? <div className="error">{error}</div> : ''}

            <textarea
              placeholder="Answer the question here..."
              onChange={this.setText}
              value={text}
            />
            <input
              type="submit"
              value="Post Answer"
            />
          </form>
        </div>
      );
    } else {
      component = (
        <div className="AnswerForm-info">
          <p>YOU MUST BE SIGNED IN TO ANSWER THE QUESTION</p>
        </div>
      );
    }

    return component;
  }
}

export default AnswerForm;
