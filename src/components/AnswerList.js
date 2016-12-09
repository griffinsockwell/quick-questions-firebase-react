import React, { Component, PropTypes } from 'react';
import Spinner from 'react-spinkit';
import orderBy from 'lodash/orderBy';

import AnswerListItem from './AnswerListItem';

import { answersRef } from '../reference';

class AnswerList extends Component {
  static propTypes = {
    questionId: PropTypes.string,
  }

  state = {
    answers: [],
    loading: true,
  }

  componentDidMount() {
    answersRef
      .orderByChild('questionId')
      .equalTo(this.props.questionId)
      .on('value', (snap) => {
        const answers = [];
        snap.forEach((shot) => {
          answers.push({ ...shot.val(), key: shot.key });
        });
        this.setState({ answers, loading: false });
      });
  }

  componentWillUnmount() {
    answersRef
      .orderByChild('questionId')
      .equalTo(this.props.questionId)
      .off('value');
  }

  render() {
    const { loading } = this.state;
    const answers = orderBy(this.state.answers, ['timestamp'], ['desc']);

    let component;
    if (loading) {
      component = (
        <div className="AnswerList-empty">
          <Spinner spinnerName="three-bounce" />
        </div>
      );
    } else if (answers.length) {
      component = (
        <ul className="AnswerList">
          {answers.map(answer => (
            <AnswerListItem
              key={answer.key}
              answer={answer}
            />
          ))}
        </ul>
      );
    } else {
      component = (
        <div className="AnswerList-empty">
          NO ONE HAS ANSWERED THE QUESTION
        </div>
      );
    }

    return component;
  }
}

export default AnswerList;
