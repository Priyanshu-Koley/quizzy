import '../styles/PlayQuiz.css';
import { Button, Modal } from '@mui/joy';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import good from '../images/quiz_finish.gif';
import bad from '../images/quiz_finish_sad.gif';
import { toast } from 'react-toastify';
import { LinearProgress } from '@mui/joy';
import { Checkbox, FormControlLabel } from '@mui/material';
import { AccessTime, ArrowBackIosNewOutlined, ArrowForwardIosOutlined, CheckCircleOutlineOutlined, Close } from '@mui/icons-material';


const PlayQuiz = (props) => {

    // to navigate among the routes
    const navigate = useNavigate();
    // to get data from url
    const location = useLocation();

    // flag for starting the quiz
    const [quizStarted, setQuizStarted] = useState(false);
    // flag for finishing the quiz
    const [quizFinished, setQuizFinished] = useState(false);
    // store question number
    const [queNo, setQueNo] = useState(0);
    // store the user's answers
    const [userAnswers, setUserAnswers] = useState({});
    // store the user's marks obtained
    const [marks, setMarks] = useState(0);
    // store loading state
    const [loading, setLoading] = useState(true);
    // store quiz
    const [quiz, setQuiz] = useState({});
    // store total marks
    const [totalMarks, setTotalMarks] = useState(0);
    // store total no. of questions
    const [noOfQuestions, setNoOfQuestions] = useState(0);
    // store user's acceped state of terms
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    // quiz timer
    const [timer, setTimer] = useState(0);

    // flag to open/close submit confirmation modal
    const [openSubmit, setOpenSubmit] = useState(false);

    // function to handle open/close of delete confirmation modal
    const handleOpenSubmit = () => setOpenSubmit(true);
    const handleCloseSubmit = () => setOpenSubmit(false);

    // Redirect to home page if no quiz id is passed
    // Else call getQuiz func
    useEffect(() => {
        const props = location.state;
        // Check if there is no referrer (accessed directly via URL)
        if (!props) {
            navigate('/'); // Redirect to home 
        }
        else {
            getQuiz(props.id);
        }
    }, [])



    // function to get quiz
    const getQuiz = async (quizId) => {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        await fetch(`https://localhost:7085/api/Quiz/${quizId}`, requestOptions)
            .then(async (response) => {
                const result = await response.json();
                if (response.status === 400) {
                    toast.error("Bad request");
                }
                if (response.status === 200) {
                    setQuiz(result);
                    calculateQuestionDetails(result);
                }
                else
                    toast.error(result.message);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                toast.error(error);
            });
    }
    // function to calculate the total marks
    const calculateQuestionDetails = (quiz) => {
        setLoading(true);
        let totalMarks = 0;
        let noOfQuestions = quiz.questions.length;
        quiz.questions.forEach((question) => {
            totalMarks += question.marks;
        });
        setTotalMarks(totalMarks);
        setNoOfQuestions(noOfQuestions);
        setLoading(false);
    }

    // function to start the quiz
    const startQuiz = () => {
        setQuizStarted(true);
        setTimer(quiz.totalTimeInSeconds);
        const interval = setInterval(() => {
            setTimer(prevTimer => {
                if (prevTimer > 0) {
                    return prevTimer - 1;
                } else {
                    clearInterval(interval);
                    submitQuiz();
                }
            });
        }, 1000);
    }

    // function to navigate to previous question
    const prev = (indexQue) => {
        // const query = `option${indexQue}`;
        // let val;
        // const chosenOption = document.querySelector(`input[name=${query}]:checked`);
        // if (chosenOption) {
        //     val = Number(chosenOption.value);
        //     let ans = answers;
        //     ans[indexQue] = val;
        //     setAnswers(ans);
        // }
        setQueNo(queNo - 1);
    }

    // function to navigate to next question or finish
    const next = (questionId) => {
        const query = `option__${questionId}`;
        const chosenOption = document.querySelector(`input[name=${query}]:checked`);
        if (chosenOption) {
            // let val, ansTemp;
            // val = Number(chosenOption.value);
            // ansTemp = answers;
            // ansTemp[indexQue] = val;
            // setAnswers(ansTemp);
            // Submit quiz
            // if it was the last question then finish the quiz & calculate the score
            if (queNo === quiz.questions.length - 1) {
                handleOpenSubmit();
            }
            else
                setQueNo(queNo + 1);
        }
        else {
            // participant need to select an answer before proceeding else error will be shown
            const helper = document.getElementById("helper-ans-" + questionId);
            helper.style.display = "block";
            setTimeout(() => {
                helper.style.display = "none";
            }, 3000);
        }
    }

    const handleAnswerChange = (questionId, optionId, isCorrect) => {
        // let temp_userAnswers = userAnswers;
        // let temp_marks = marks;
        if (userAnswers[questionId]) {
            if (userAnswers[questionId].isCorrect === true) {
                setMarks(prev => prev - quiz.questions.find(q => q.questionId === questionId).marks);
                // temp_marks -= quiz.questions.find(q => q.questionId === questionId).marks;
            }
        }
        setUserAnswers(prev => ({ ...prev, [questionId]: { optionId: optionId, isCorrect: isCorrect } }));
        // temp_userAnswers = { ...temp_userAnswers, [questionId]: { optionId: optionId, isCorrect: isCorrect } };
        if (isCorrect) {
            setMarks(prev => prev + quiz.questions.find(q => q.questionId === questionId).marks);
            // temp_marks += quiz.questions.find(q => q.questionId === questionId).marks;
        }
        // console.log(temp_userAnswers);
        // console.log(temp_marks);
    };

    const submitQuiz = () => {
        // console.log(answer);
        // let score = [];
        // for (let i = 0; i < correctAnswers.length; i++) {
        //     if (answer[i] === correctAnswers[i]) {
        //         score.push(1);
        //     }
        //     else {
        //         score.push(0);

        //     }
        // }
        // setScore(score);
        // let total = score.reduce(function (x, y) {
        //     return x + y;
        // }, 0);
        // setTotal(total);

        const result = {
            userId: props.user.userId,
            quizId: quiz.quizId,
            answers: userAnswers,
            marks: marks,
            // timeTaken: (endTime - startTime) / 1000,
        };
        console.log(result);
        toast("Quiz Submitted")
        setQuizStarted(false);
        setQuizFinished(true);
        setQueNo(queNo + 1);
    }

    // function to generate different finish message for different performance
    const finishMessage = () => {
        // toast.success("Quiz submitted successfully");
        let percentage = ((marks / totalMarks) * 100);
        if (percentage > 90) {
            return "Outstanding Performance !!"
        }
        else if (percentage > 75) {
            return "Excellent Performance !!"
        }
        else if (percentage > 60) {
            return `Good Performance ${props.user.name}`
        }
        else if (percentage > 45) {
            return `Average Performance ${props.user.name}`
        }
        else if (percentage > 35) {
            return `Bad Performance ${props.user.name}`
        }
        else {
            return `Better luck next time ${props.user.name}, You need Practice`
        }

    }

    // function to replay the quiz , set total,score,percentage,answer,question no and quizStarted to initial state
    // const tryAgain = () => {
    //     setTotal(0);
    //     setScore([]);
    //     setPercentage(0);
    //     let ans = [];
    //     quiz.questions.forEach(() => {
    //         ans.push(-1);
    //     })
    //     setAnswers(ans);
    //     setQueNo(0);
    // }

    // back to home

    const goToHome = () => {
        navigate("/");
    }

    const roundToTwoDecimalsPlaces = (num) => {
        return Math.round((num + Number.EPSILON) * 100) / 100
    }

    function secondsToHms(d) {
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + ':' : '';
        var mDisplay = m > 0 ? m + ':' : '';
        var sDisplay = s > 0 ? s : '';

        if (hDisplay && !mDisplay && !sDisplay) return hDisplay.slice(0, -1);  // Remove trailing ':'
        if (!hDisplay && mDisplay && !sDisplay) return mDisplay.slice(0, -1);  // Remove trailing ':'

        return hDisplay + mDisplay + sDisplay;
    }

    // Component to render the questions and options
    const RenderQuestions = () => {
        return (
            <div className={queNo === quiz.questions.length ? "score-card" : 'play-container'}>
                <div
                    className={quizStarted === true && queNo !== quiz.questions.length ? "play_title_started" : "hide"}>
                    {quiz.title}
                </div>

                {quiz.questions.map((question, indexQue) => {
                    return (
                        // quiz question
                        <div className={indexQue !== queNo ? "hide" : ''} id={`question${indexQue}`} key={question.questionId}>
                            <div className='play_que_top'>
                                <div className="play_que_marks">
                                    Marks: {question.marks}
                                </div>
                                <div className={timer < (quiz.totalTimeInSeconds / 3) ? "timer timer-danger" : timer < (quiz.totalTimeInSeconds / 2) ? "timer timer-warn" : "timer"}>
                                    {/* <AccessTime />{timer > 3600 ? timer / 3600 + " hrs" : timer / 60 + "mins"} */}
                                    <AccessTime />{secondsToHms(timer)}
                                </div>
                                <div className='play_que_no'>
                                    Q: {indexQue + 1}/{quiz.questions.length}
                                </div>
                            </div>
                            <div className='play-question'>
                                {question.title}
                            </div>
                            <div className='play-options'>
                                {question.options.map((option, index) => {
                                    const uniqueId = `option__${question.questionId}__${option.optionId}`;
                                    return (
                                        // quiz options
                                        <label htmlFor={uniqueId} className="radio-card" key={uniqueId}>
                                            <input
                                                type="radio"
                                                name={`option__${question.questionId}`}
                                                id={uniqueId}
                                                value={option.optionId}
                                                defaultChecked={userAnswers[question.questionId]?.optionId === option.optionId}
                                                onChange={() => { handleAnswerChange(question.questionId, option.optionId, option.isCorrect) }}
                                            />
                                            <div className="card-content-wrapper" key={uniqueId}>
                                                <span className='check-icon'></span>
                                                <div className="play-option card-content">
                                                    {option.title}
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
                                            size='lg'
                                            onClick={() => {
                                                prev(indexQue)
                                            }}
                                            variant='soft'>
                                            <ArrowBackIosNewOutlined />
                                            Previous
                                        </Button>
                                    </div>
                                }
                                {/*helper text for answering the current question before proceeding*/}
                                <div className='helper-ans helper' id={"helper-ans-" + question.questionId}>
                                    Answer this question to proceed
                                </div>
                                {/*Next button*/}
                                <div>
                                    <Button
                                        sx={{
                                            width: '100px',
                                            fontFamily: "BrandonGrotesque-Bold"
                                        }}
                                        size='lg'
                                        onClick={() => {
                                            next(question.questionId)
                                        }}
                                        color={indexQue === quiz.questions.length - 1 ? "success" : "primary"}
                                        variant='soft'>
                                        {indexQue === quiz.questions.length - 1 ? "Submit" : "Next"}
                                        {indexQue === quiz.questions.length - 1 ? <CheckCircleOutlineOutlined /> : <ArrowForwardIosOutlined />}
                                    </Button>
                                </div>
                            </div>

                        </div>
                    )
                })}

                {/* rendering the Message page/Congratulations on playing the quizzes */}
                <div className={quizFinished ? "" : "hide"}>
                    <div className='wish-img-container'>
                        <img src={((marks / totalMarks) * 100) > 45 ? good : bad} alt="Wish" className='wish-img' />
                    </div>
                    <h1>{finishMessage()}</h1>
                    <h2 className={((marks / totalMarks) * 100) > 75 ? "congrats" : "hide"}>{`Congratulations ${props.user.name}`}</h2>

                    <div className='score'>
                        Marks: {marks} out of {totalMarks}
                    </div>
                    <div className='percent'>
                        Your Percentage is {((marks / totalMarks) * 100).toFixed(2)}%
                    </div>
                    <div className='score'>
                        Total number of Questions: {quiz.questions.length}
                    </div>
                    <div className='score'>
                        Marks: {marks} out of {totalMarks}
                    </div>
                    <div className='score'>
                        Marks: {marks} out of {totalMarks}
                    </div>
                    <div className='score'>
                        Marks: {marks} out of {totalMarks}
                    </div>

                    <div className='play_nav_btns'>

                        {/* <div>
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
                        </div> */}

                        {/* Home button */}
                        <div>
                            <Button
                                sx={{
                                    fontFamily: "BrandonGrotesque-Bold"
                                }}
                                size='lg'
                                onClick={() => {
                                    goToHome()
                                }}
                                color='success'
                                variant='solid'>
                                Home
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }//end of RenderQuestions function

    if (loading) {
        return (
            <LinearProgress
                color="primary"
                size="lg"
                value={30}
            />);
    }

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
                            <div className='quiz-guidelines-heading'>Quiz guidelines</div>
                            <div className='back-btn-div'>
                                <button onClick={goToHome} className='back-btn'>
                                    <span className='back-btn-img'>&lt;</span>Back
                                </button>
                            </div>

                            <div className='play-title'>
                                Title : {quiz.title}
                            </div>

                            <div className='play-desc'>
                                Description: {quiz.description}
                            </div>

                            <div className='play-quiz-info'>
                                <span>
                                    Total time: {(quiz.totalTimeInSeconds / 60) > 60 ? secondsToHms(quiz.totalTimeInSeconds) + " Hours" : (quiz.totalTimeInSeconds > 60 ? secondsToHms(quiz.totalTimeInSeconds) + " Mins" : quiz.totalTimeInSeconds + " Secs")}
                                </span>
                                <span>
                                    Full marks: {totalMarks}
                                </span>
                                <span>
                                    Number of questions: {noOfQuestions}
                                </span>
                            </div>
                            <div className='play-quiz-instructions'>
                                <h1 className='instruction-heading'>Instructions</h1>
                                <ul>
                                    <li>Arrange for stable Internet connectivity.</li>
                                    <li>Giving examination on Laptop or Desktop is highly recommended.</li>
                                    <li>Make sure mobile/laptop is fully charged. Power bank for mobile or UPS/Inverter for laptop/desktop should be arranged for uninterrupted power supply.</li>
                                    <li>Students should have sufficient data in Fair Usage Policy (FUP) / Internet plan with sufficient data pack of internet service provider.</li>
                                    <li>Close all browsers/tabs before starting the online quiz.</li>
                                    <li>Once the exam starts, do not switch to any other window/tab. On doing so, your attempt may be considered as malpractice and your attempt may get terminated.</li>
                                    <li>Do Not Pickup/Receive the Call during the exam if you are giving the exam on mobile. This also will be treated as changing the window.</li>
                                    <li>To avoid unwanted pop-ups, use of Ad Blocker is recommended.</li>
                                    <li>It is recommended to use web browser such as Mozilla and Chrome browsers etc. on a desktop/laptop/tab/smart phone.</li>
                                    <li className='important'>Do not use the back button of keyboard or close button/icon to go back to previous page or to close the screen.</li>
                                </ul>
                            </div>

                            <div className='terms'>
                                <input type="checkbox" name="terms" id="terms" onChange={() => setAcceptedTerms(!acceptedTerms)}/>
                                <label htmlFor="terms">
                                    I agree to the above mentioned points. My attempt will not be considered if I got involved in any malpractices*
                                </label>
                            </div>

                            <div className='btn-container'>
                                <Button
                                    sx={{
                                        fontFamily: "BrandonGrotesque-Bold",
                                        marginTop: '10px'
                                    }}
                                    type='submit'
                                    size='lg'
                                    onClick={startQuiz}
                                    variant='solid'
                                    color='success'
                                    disabled={!acceptedTerms}
                                >
                                    Start Quiz
                                </Button>
                            </div>

                        </div>
                }
            </div>

            {/* Modal for delete confirmation */}
            <Modal
                open={openSubmit}
                onClose={handleCloseSubmit}
                aria-labelledby="modal-title-dlt"
                aria-describedby="modal-description-dlt"
            >
                <div className='modal-dlt'>
                    <div id='modal-title-dlt'>
                        <div className='modal-head-dlt'>
                            Are you sure you want to Submit
                        </div>
                        <button onClick={handleCloseSubmit} className='close-btn'><Close /></button>
                    </div>
                    <div id='modal-description-dlt'>
                        <div>
                            Submitting this quiz will result in permanent submission. Please cheack all questions before submitting
                        </div>
                        <div>
                            <Button
                                sx={{
                                    float: "right",
                                    marginLeft: "20px",
                                    marginTop: "20px",
                                    fontFamily: "BrandonGrotesque-Bold"
                                }}
                                onClick={handleCloseSubmit}
                                color='warning'
                                size='lg'
                                variant='solid'>
                                No
                            </Button>
                            <Button
                                sx={{
                                    float: "right",
                                    marginTop: "20px",
                                    fontFamily: "BrandonGrotesque-Bold"
                                }}
                                onClick={() => {
                                    submitQuiz();
                                    handleCloseSubmit();
                                }}
                                color='warning'
                                size='lg'
                                variant='solid'>
                                Yes
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

        </>);
}

export default PlayQuiz;