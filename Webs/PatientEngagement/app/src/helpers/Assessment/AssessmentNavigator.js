/* istanbul ignore file */
import type {Float} from 'react-native/Libraries/Types/CodegenTypes';

export class AssessmentNavigator {
  detailsObj = null;
  questionsToAsk = [];
  currentQuestion: null;
  firstQuestion = null;
  selectedQuestion = null;
  currentIndex = -1;
  allProcessedQuestions = [];

  childrenToRemove = [];

  constructor(surveyDetailsObj, index) {
    this.currentIndex = index;
    console.log('Assessment Details', surveyDetailsObj.questions);
    this.detailsObj = surveyDetailsObj;
    const {Questions: allQuestions} = surveyDetailsObj.questions;

    surveyDetailsObj.questions.map((q, questionIndex) => {
      let aQuestion = q;
      aQuestion.parentAnswer = q.parentAnswer.trim();

      aQuestion.options.map(anOption => {
        anOption.text = anOption.text.trim();
      });

      aQuestion.isChild = !(
        q.parentQuestionId === null || q.parentQuestionId === 0
      );
      aQuestion.hasChildren = false;
      if (!aQuestion.isChild) {
        this.questionsToAsk.push(aQuestion);
      }
      let children = surveyDetailsObj.questions.filter(item => {
        return aQuestion.id === item.parentQuestionId;
      });
      aQuestion.hasChildren = children.length > 0;
      aQuestion.rowId = questionIndex;
      this.allProcessedQuestions.push(aQuestion);
    });
    // Check if this question (Parent) is Answered.
    // Create questionsToAsk properly according to answered questions (Parent-Child)
    for (let i = 0; i < this.questionsToAsk.length; i++) {
      let question = this.questionsToAsk[i];
      let {SavedAnswers: answers} = question;
      if (question.hasChildren && question.length > 0) {
        let childrenToAdd = this.allProcessedQuestions.filter(child => {
          return (
            question.id === child.parentQuestionId &&
            question.includes(child.parentAnswer)
          );
        });
        if (childrenToAdd.length > 0) {
          let indexToInsertAt = 0;
          for (let j = 0; j < childrenToAdd.length; j++) {
            indexToInsertAt = i + j + 1;
            let childQuestion = childrenToAdd[j];
            childQuestion.parentQuestion = question;
            this.questionsToAsk.splice(indexToInsertAt, 0, childQuestion);
          }
        }
      }
    }
  }

  // Returns Start Question
  start(): Object {
    if (this.questionsToAsk.length > 0) {
      this.firstQuestion = this.questionsToAsk[0];
      this.currentQuestion = this.firstQuestion;
      this.currentIndex = 0;
    }
    return this.currentQuestion;
  }
  // Returns Current Question
  currentQuestion(index): Object {
    if (this.questionsToAsk.length > 0) {
      this.selectedQuestion = this.questionsToAsk[index];
      this.currentQuestion = this.selectedQuestion;
      this.currentIndex = index;
    }
    return this.currentQuestion;
  }
  // Returns Current Index
  currentQuestionIndex(index): Object {
    return this.currentIndex;
  }
  canGoPrevious(): Boolean {
    return this.currentIndex > 0;
  }

  isLastQuestion(): Boolean {
    return this.currentIndex === this.questionsToAsk.length - 1;
  }

  canGoNext(): Boolean {
    let flag = true;
    let answers = this.currentQuestion.savedAnswers ?? [];
    if (this.currentQuestion.isRequired === true && answers.length === 0) {
      flag = false;
    } else if (
      this.currentQuestion.isRequired === true &&
      answers.length === 1 &&
      answers[0] === ''
    ) {
      flag = false;
    }

    return flag;
  }

  // Saves the answer and returns the next question.
  saveAnswer(questionId, parentQuestionId, answers: []): Object {
    // Save Answer to QuestionsToAsk Object
    // Insert Children in the questionsToAsk array if there's any w.r.t select answer.
    let temp = this.questionsToAsk.filter(item => {
      return (
        item.id === questionId && item.parentQuestionId === parentQuestionId
      );
    });
    let questionObj = temp[0];
    questionObj.savedAnswers = answers;
    this.currentQuestion = questionObj;
    if (this.currentQuestion.hasChildren) {
      // Compare answer with parent answer and append children in QuestionsToAsk
      // Fetching all children having parentId of current quesiton and parent answer matching with answers param
      let childrenToAdd = this.allProcessedQuestions.filter(i => {
        return (
          this.currentQuestion.id === i.parentQuestionId &&
          answers.includes(i.parentAnswer)
        );
      });

      // These child items are already added in questionsToAsk array, now when the answer has updated
      // We must delete and re-insert

      // UpdatedArray with children of currentQuestion
      if (this.currentQuestion.hasChildren) {
        let childrenToRemove = this.getAllChildNodesToRemove(
          this.currentQuestion,
        );
        console.log('ChildrenToRemove :', childrenToRemove);

        if (childrenToRemove.length > 0) {
          let tempArray = [];
          this.questionsToAsk.map(i => {
            let found = childrenToRemove.find(item => {
              return i.rowId === item.rowId;
            });
            if (!found) {
              tempArray.push(i);
            }
          });
          this.questionsToAsk = tempArray;
        }
      }

      if (childrenToAdd.length > 0) {
        let indexToInsertAt = 0;
        for (var index = 0; index < childrenToAdd.length; index++) {
          indexToInsertAt = this.currentIndex + index + 1;
          let childQuestion = childrenToAdd[index];
          childQuestion.parentQuestion = this.currentQuestion;
          this.questionsToAsk.splice(indexToInsertAt, 0, childQuestion);
        }
      }
    }
  }

  moveToNextQuestion(): Object {
    let nextQuestion = null;
    if (this.questionsToAsk[this.currentIndex + 1]) {
      nextQuestion = this.questionsToAsk[this.currentIndex + 1];
      this.currentIndex = this.currentIndex + 1;
      this.currentQuestion = nextQuestion;
    }
    return nextQuestion;
  }

  moveToPreviousQuestion(): Object {
    if (this.currentIndex > 0) {
      let previous = this.questionsToAsk[this.currentIndex - 1];
      this.currentIndex = this.currentIndex - 1;
      this.currentQuestion = previous;
    }
    return this.currentQuestion;
  }

  currentProgress(): Float {
    let allRequired = this.questionsToAsk.filter(item => {
      if (item.isRequired) {
        return true;
      }
    });
    let allAnswered = this.questionsToAsk.filter(item => {
      if (item.isRequired) {
        let answers = item.savedAnswers ?? [];
        return answers.length > 0;
      }
    });
    let progress = allAnswered.length / allRequired.length;
    console.log('Progress:', progress);
    console.log('Questions To Ask:', this.questionsToAsk.length);
    console.log('All Required:', allRequired.length);
    console.log('All Answered:', allAnswered.length);
    return progress;
  }

  filledSurveyToSave(): Object {
    let obj = JSON.parse(JSON.stringify(this.detailsObj));
    obj.questions = this.questionsToAsk;
    return obj;
  }
  setCurrentIndex(index) {
    this.currentIndex = index;
  }

  getAllChildNodesToRemove(parent): [Object] {
    let allChildNodes = [];
    this.getChildren([parent], allChildNodes);
    return allChildNodes;
  }

  getChildren(parents: [Object], childrenList: [Object]) {
    var tempChildren = childrenList;
    var tempParents = [];

    parents.forEach(item => {
      // Find All Children of item
      this.questionsToAsk.map(aQuestion => {
        if (item.id === aQuestion.parentQuestionId) {
          tempChildren.push(aQuestion);
          if (aQuestion.hasChildren) {
            tempParents.push(aQuestion);
          }
        }
      });
    });

    if (tempParents.length > 0) {
      this.getChildren(tempParents, tempChildren);
    } else {
      return tempChildren;
    }
  }
}
