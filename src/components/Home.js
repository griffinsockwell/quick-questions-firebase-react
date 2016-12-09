import React, { Component } from 'react';
import Spinner from 'react-spinkit';
import orderBy from 'lodash/orderBy';
import QuestionList from './QuestionList';
import { questionsRef } from '../reference';

class Home extends Component {
  state = {
    loading: true,
    questions: [],
  }

  componentDidMount() {
    questionsRef.on('value', (snap) => {
      const questions = [];
      snap.forEach((shot) => {
        questions.push({ ...shot.val(), key: shot.key });
      });
      this.setState({ questions, loading: false });
    });
  }

  componentWillUnmount() {
    questionsRef.off();
  }

  render() {
    const { loading } = this.state;
    const questions = orderBy(this.state.questions, ['timestamp'], ['desc']);

    let component;
    if (loading) {
      component = (
        <div className="Home">
          <Spinner spinnerName="three-bounce" />
        </div>
      );
    } else if (questions.length) {
      component = (
        <QuestionList questions={questions} />
      );
    } else {
      component = (
        <div className="Home">
          NO ONE HAS ASKED ANY QUESTIONS
        </div>
      );
    }

    return component;
  }
}

export default Home;
