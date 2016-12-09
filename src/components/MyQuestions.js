import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import Spinner from 'react-spinkit';
import orderBy from 'lodash/orderBy';
import QuestionList from './QuestionList';
import { authRef, questionsRef } from '../reference';

class MyQuestions extends Component {
  state = {
    loading: true,
    questions: [],
    user: null,
  }

  componentDidMount() {
    authRef.onAuthStateChanged((user) => {
      if (!user) {
        browserHistory.push('/');
      } else {
        this.setState({ user });

        questionsRef
          .orderByChild('uid')
          .equalTo(user.uid)
          .on('value', (snap) => {
            const questions = [];
            snap.forEach((shot) => {
              questions.push({ ...shot.val(), key: shot.key });
            });
            this.setState({ questions, loading: false });
          });
      }
    });
  }

  componentWillUnmount() {
    questionsRef
      .orderByChild('uid')
      .equalTo(this.state.user.uid)
      .off();
  }

  render() {
    const { loading } = this.state;
    const questions = orderBy(this.state.questions, ['timestamp'], ['desc']);

    let component;
    if (loading) {
      component = (
        <div className="MyQuestions">
          <Spinner spinnerName="three-bounce" />
        </div>
      );
    } else if (questions.length) {
      component = (
        <QuestionList questions={questions} />
      );
    } else {
      component = (
        <div className="MyQuestions">
          YOU HAVE NOT ASKED ANY QUESTIONS
        </div>
      );
    }

    return component;
  }
}

export default MyQuestions;
