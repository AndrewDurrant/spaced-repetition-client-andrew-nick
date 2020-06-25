import React, { Component } from "react";
import LearningContext from "../../contexts/LearningContext";
import LanguageApiService from "../../services/language-api-service";
import Question from "../../components/Question/Question";
import Answer from "../../components/Answer/Answer";
import TokenService from "../../services/token-service";

class LearningRoute extends Component {
  static contextType = LearningContext;
  

  componentDidMount() {
    this.context.reset()

    LanguageApiService.getHead()
      .then(head => {
        this.context.setTotalScore(head.totalScore)
        this.context.setWordCorrectCount(head.wordCorrectCount)
        this.context.setWordIncorrectCount(head.wordIncorrectCount)
        this.context.setNextWord(head.nextWord)
      })
      .catch(error => {
        if (error.error === 'Unauthorized request') {
          TokenService.clearAuthToken()
          this.props.history.push('/login')
        }
        this.context.setError(error)
      })
  }

  renderForm=()=>{
    return <>
      <form> 
      <h2>Translate the word: {this.context.head.nextWord}</h2>
      <label className="basic-label">
        Answer:{" "}
        <input
          className="basic-input"
          type="text"
          name="guessInput"
          id="learn-guess-input"
        />
      </label>
      <input className="submit-btn" type="submit" value="Submit" />
      </form>
    </>
  }

  // onSubmit(e) {
  //   e.preventDefault();
  //   const value = e.target.guessInput.value;
  //   e.target.guessInput.value = "";
  //   LanguageApiService.postGuess(value)
  //     .then(res => {
  //       this.context.setResults({
  //         answer: res.answer,
  //         isCorrect: res.isCorrect,
  //         nextWord: res.nextWord,
  //         totalScore: res.totalScore,
  //         wordCorrectCount: res.wordCorrectCount,
  //         wordIncorrectCount: res.wordIncorrectCount,
  //       });
  //     })
  //     .catch(err => console.log(err));
  // }

  render() {
    const { error, language } = this.context;
    const showQuestion = this.context.isCorrect === null;
    return (
      <>
        <h1>Learning Page</h1>
        <section>
          <p>Total score: {language.total_score}</p>
          {showQuestion && !error && (
            <Question onSubmit={this.onSubmit} />
          )}
          {!showQuestion && !error && (
            <Answer />
          )}
        </section>
      </>
    );
  }
}

export default LearningRoute;
