import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { authRef, questionsRef, timeRef } from '../reference';

class QuestionForm extends Component {
  state = {
    error: '',
    text: '',
  }

  setText = (evt) => {
    this.setState({ text: evt.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { text } = this.state;

    // Check if the user has input text
    if (text.trim()) {
      const { currentUser } = authRef;

      const newQuestion = {
        answers: 0,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        text,
        timestamp: timeRef,
        uid: currentUser.uid,
      };

      const questionKey = questionsRef.push().key;

      // Add the question to firebase
      // then push the browser to the question
      questionsRef
        .child(questionKey)
        .set(newQuestion)
        .then(() => {
          browserHistory.push(`/question/${questionKey}`);
        }, (error) => {
          this.setState({ error });
        });
    }
  }

  render() {
    const { error, text } = this.state;

    return (
      <form
        className="QuestionForm"
        onSubmit={this.handleSubmit}
      >

        {error ? <div className="error">{error}</div> : ''}

        <textarea
          placeholder="Ask question here..."
          onChange={this.setText}
          value={text}
        />
        <input
          type="submit"
          value="Post Question"
        />
      </form>
    );
  }
}

export default QuestionForm;
