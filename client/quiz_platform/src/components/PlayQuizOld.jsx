import '../styles/PlayQuiz.css';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import good from '../images/quiz_finish.gif';
import bad from '../images/quiz_finish_sad.gif';

const PlayQuizOld = () => {

    // to navigate among the routes
    const navigate = useNavigate();
    // to get data from url
    const location = useLocation();

    // store name of the participant
    const [name, setName] = useState('');
    // flag for starting the quiz
    const [quizStarted, setQuizStarted] = useState(false);
    // flag for finishing the quiz
    const [quizFinished, setQuizFinished] = useState(false);
    // store question number
    const [queNo, setQueNo] = useState(0);
    // store the participant's answer
    const [answers, setAnswers] = useState([]);
    // store the correct answers
    const [correctAnswers, setCorrectAnswers] = useState([]);
    // store the array of checked answers of participant in [0,1] format , 0 for wrong and 1 for right
    // eslint-disable-next-line
    const [score, setScore] = useState([]);
    // store total score of participant
    const [total, setTotal] = useState(0);
    // store percentage score of participant
    const [percentage, setPercentage] = useState(0);
    // store loading state
    const [loading, setLoading] = useState(true);
    // store id of the quiz
    const [id, setId] = useState(() => {
        const props = location.state;
        if (props) {
            setLoading(false);
            return props.id;
        }

    });


    useEffect(() => {
        const props = location.state;
        // Check if there is no referrer (accessed directly via URL)
        if (!props) {
            navigate('/'); // Redirect to home or another route
        }
    }, [id])


    // use the redux store to set the quiz data from store
    const quizzes = useSelector(state => state.quizzes);
    const quiz = quizzes[id];

    // set the correct answers with the correct answers from the store
    // and set the answers array with -1 on first render
    useEffect(() => {

        if (location.state) {
            let correct_ans = [];
            let ans = [];
            quiz.que.forEach((que) => {
                correct_ans.push(que.answerIndex);
                ans.push(-1);
            })
            setCorrectAnswers(correct_ans);
            setAnswers(ans);
        }

        // eslint-disable-next-line
    }, [])

    if (!location.state) {
        return null;
    }

    // function to show error if name length is less than 5 and greater than 50
    const changeHandlerName = (event) => {
        const name_length = event.target.value.length;
        setName(event.target.value);
        if (name_length >= 5 && name_length <= 50) {
            document.getElementById('helper-name').style.display = "none";
        }
        else {
            document.getElementById('helper-name').style.display = "block";
        }
    }

    // function to start the quiz
    const startQuiz = () => {
        if (name.length >= 5 && name.length <= 50) {
            setQuizStarted(true);
        }
    }

    // function to navigate to previous question
    const prev = (indexQue) => {
        const query = `option${indexQue}`;
        let val;
        const chosenOption = document.querySelector(`input[name=${query}]:checked`);
        if (chosenOption) {
            val = Number(chosenOption.value);
            let ans = answers;
            ans[indexQue] = val;
            setAnswers(ans);
        }
        setQueNo(queNo - 1);
    }

    // function to navigate to next question or finish
    const next = (indexQue) => {
        const query = `option${indexQue}`;
        const chosenOption = document.querySelector(`input[name=${query}]:checked`);
        if (chosenOption) {
            let val, ansTemp;
            val = Number(chosenOption.value);
            ansTemp = answers;
            ansTemp[indexQue] = val;
            setAnswers(ansTemp);
            // if it was the last question then finish the quiz & calculate the score
            if (indexQue === quiz.que.length - 1) {
                let score = [];
                for (let i = 0; i < correctAnswers.length; i++) {
                    if (ansTemp[i] === correctAnswers[i]) {
                        score.push(1);
                    }
                    else {
                        score.push(0);

                    }

                }
                setScore(score);
                let total = score.reduce(function (x, y) {
                    return x + y;
                }, 0);
                setTotal(total);
                setQuizStarted(false);
                setQuizFinished(true);
            }
            setQueNo(queNo + 1);
        }
        else {
            // participant need to select an answer before proceeding else error will be shown
            const helper = document.getElementById("helper-ans-" + indexQue);
            helper.style.display = "block";
            setTimeout(() => {
                helper.style.display = "none";
            }, 3000);
        }


    }

    // function to generate different finish message for different performance
    const finishMessage = () => {
        let percent = (total / correctAnswers.length) * 100;
        setPercentage(percent);
        if (percentage > 90) {
            return "Outstanding Performance !!"
        }
        else if (percentage > 75) {
            return "Excellent Performance !!"
        }
        else if (percentage > 60) {
            return `Good Performance ${name}`
        }
        else if (percentage > 45) {
            return `Average Performance ${name}`
        }
        else if (percentage > 35) {
            return `Bad Performance ${name}`
        }
        else {
            return `Better luck next time ${name}, You need Practice`
        }

    }

    // function to replay the quiz , set total,score,percentage,answer,question no and quizStarted to initial state
    const tryAgain = () => {
        setTotal(0);
        setScore([]);
        setPercentage(0);
        let ans = [];
        quiz.que.forEach(() => {
            ans.push(-1);
        })
        setAnswers(ans);
        setQueNo(0);
    }

    // back to home
    const goToHome = () => {
        navigate("/");
    }

    // function to render the questions and options
    const RenderQuestions = () => {
        return (
            <div className={queNo === correctAnswers.length ? "score-card" : 'play-container'}>
                <div
                    className={quizStarted === true && queNo !== correctAnswers.length ? "play_title_started" : "hide"}>
                    {quizzes[id].title}
                </div>
                {quiz.que.map((questionObj, indexQue) => {
                    return (
                        // quiz question
                        <div className={indexQue !== queNo ? "hide" : ''} id={`question${indexQue}`} key={indexQue}>
                            <div className='play_que_no'>
                                Question {indexQue + 1}/{correctAnswers.length}
                            </div>
                            <div className='play-question'>
                                {questionObj.question}
                            </div>
                            <div className='play-options'>
                                {questionObj.options.map((option, index) => {
                                    const uniqueId = `option${indexQue}_${index}`;
                                    return (
                                        // quiz options
                                        <label htmlFor={uniqueId} className="radio-card" key={uniqueId}>
                                            <input
                                                type="radio"
                                                name={`option${indexQue}`}
                                                id={uniqueId}
                                                value={index}
                                                defaultChecked={answers[indexQue] === index}
                                            />
                                            <div className="card-content-wrapper" key={uniqueId}>
                                                <span className='check-icon'></span>
                                                <div className="play-option card-content">
                                                    {option}
                                                </div>
                                            </div>
                                        </label>
                                    )
                                })}
                            </div>

                            {/*PREV & NEXT button*/}
                            <div className='play_nav_btns'>
                                {indexQue === 0 ? <div></div> :
                                    // previous button
                                    <div>
                                        <Button
                                            sx={{
                                                width: '100px',
                                                fontFamily: "BrandonGrotesque-Bold"
                                            }}
                                            size='large'
                                            onClick={() => {
                                                prev(indexQue)
                                            }}
                                            variant='contained'>
                                            Previous
                                        </Button>
                                    </div>
                                }
                                {/*helper text for answering the current question before proceeding*/}
                                <div className='helper-ans helper' id={"helper-ans-" + indexQue}>
                                    Answer this question to proceed
                                </div>
                                {/*Next button*/}
                                <div>
                                    <Button
                                        sx={{
                                            width: '100px',
                                            fontFamily: "BrandonGrotesque-Bold"
                                        }}
                                        size='large'
                                        onClick={() => {
                                            next(indexQue)
                                        }}
                                        variant='contained'>
                                        {indexQue === quiz.que.length - 1 ? "Finish" : "Next"}
                                    </Button>
                                </div>
                            </div>

                        </div>
                    )
                })}

                {/* rendering the Message page/Congratulations on playing the quizzes */}
                <div className={queNo === correctAnswers.length ? "" : "hide"}>
                    <div className='wish-img-container'>
                        <img src={percentage > 45 ? good : bad} alt="Wish" className='wish-img' />
                    </div>
                    <h1>{finishMessage()}</h1>
                    <h2 className={percentage > 75 ? "congrats" : "hide"}>{`Congratulations ${name}`}</h2>

                    <div className='score'>
                        You get {total} correct out of {correctAnswers.length}
                    </div>
                    <div className='percent'>
                        Your Percentage is {percentage.toFixed(2)}%
                    </div>

                    <div className='play_nav_btns'>

                        <div>
                            <Button
                                sx={{
                                    width: '135px',
                                    fontFamily: "BrandonGrotesque-Bold",
                                    backgroundColor: 'green'
                                }}
                                size='large'
                                onClick={() => {
                                    tryAgain()
                                }}
                                variant='contained'>
                                {percentage > 35 ? "Play again" : "Try Again"}
                            </Button>
                        </div>

                        <div>
                            <Button
                                sx={{
                                    width: '135px',
                                    fontFamily: "BrandonGrotesque-Bold",
                                    backgroundColor: 'green'
                                }}
                                size='large'
                                onClick={() => {
                                    goToHome()
                                }}
                                variant='contained'>
                                Home
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }//end of RenderQuestions function


    return (
        <>
            <div className='play-body'>
                {
                    // render questions when quiz is started and show message after completion of quiz
                    quizStarted === true || quizFinished === true ?
                        <RenderQuestions />
                        :
                        //rendering the home page for playing the quizzes & taking participant's name
                        <div className='play-container'>
                            <div className='back-btn-div'>
                                <button onClick={goToHome} className='back-btn'>
                                    <span className='back-btn-img'>&lt;</span>Back
                                </button>
                            </div>

                            <div className='play-title'>
                                {quizzes[id].title}
                            </div>

                            <div className='play-desc'>
                                {quizzes[id].desc}
                            </div>

                            <div className='play-name-input'>
                                <label htmlFor="name">
                                    Enter your name
                                </label>
                                <br />
                                <input
                                    type="text"
                                    id='name'
                                    spellCheck='false'
                                    onChange={(e) => changeHandlerName(e)}
                                />
                                <br />
                                <small id='helper-name' className='helper'>Name should be between 5 to 50 letters</small>
                            </div>

                            <div>
                                <Button
                                    sx={{
                                        width: '140px',
                                        fontFamily: "BrandonGrotesque-Bold",
                                        marginTop: '10px'
                                    }}
                                    type='submit'
                                    size='large'
                                    onClick={startQuiz}
                                    variant='contained'
                                >
                                    Start Quiz
                                </Button>
                            </div>

                        </div>
                }
            </div>
        </>);
}

export default PlayQuizOld;