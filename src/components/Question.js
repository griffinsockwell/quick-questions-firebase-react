import React, { Component, PropTypes } from 'react';
import Spinner from 'react-spinkit';
import moment from 'moment';
import AnswerForm from './AnswerForm';
import AnswerList from './AnswerList';
import QuestionRemove from './QuestionRemove';
import { questionsRef } from '../reference';

class Question extends Component {
  static propTypes = {
    params: PropTypes.object,
  }

  state = {
    question: {},
    loading: true,
  }

  componentDidMount() {
    const { params } = this.props;
    questionsRef
      .child(params.questionId)
      .once('value', (snap) => {
        const question = { ...snap.val(), key: snap.key };
        this.setState({ question, loading: false });
      });
  }

  render() {
    const { loading, question } = this.state;
    const { questionId } = this.props.params;

    let component;
    if (loading) {
      component = (
        <div className="Question-empty">
          <Spinner spinnerName="three-bounce" />
        </div>
      );
    } else if (question.text) {
      component = (
        <div className="Question">

          <div className="Question-container">
            <img src={question.photoURL} alt={question.displayName} />
            <span>{question.displayName} asked {moment(question.timestamp).fromNow()}</span>
            <p>{question.text}</p>

            <QuestionRemove question={question} />

          </div>

          <AnswerForm questionId={questionId} />

          <AnswerList questionId={questionId} />

        </div>
      );
    } else {
      component = (
        <div className="Question-empty">
          NO QUESTION FOUND
        </div>
      );
    }

    return component;
  }
}

export default Question;
