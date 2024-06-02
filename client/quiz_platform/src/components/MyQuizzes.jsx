import React, { useEffect, useState } from 'react'
import Nav from './Nav'
import '../styles/MyQuizzes.css'
import { toast } from 'react-toastify';
import { CircularProgress, DialogActions, DialogTitle, Modal, ModalDialog, Tooltip } from '@mui/joy';
import { formatDate, parseISO } from 'date-fns';
import { CheckBox, Close } from '@mui/icons-material';

function MyQuizzes({ user }) {

    const [results, setResults] = useState([]);
    const [quizzes, setQuizzes] = useState({});
    const [openResultDetails, setOpenResultDetails] = useState(false);
    const [loading, setLoading] = useState(true);

    const [result, setResult] = useState({});
    const [quiz, setQuiz] = useState({});

    // useEffect to fetch data on component mount
    useEffect(() => {
        getResults();
    }, []);


    const handleCloseResultDetails = (event, reason) => {
        if (((reason) === "backdropClick") || ((reason) === "escapeKeyDown"))
            return;
        setOpenResultDetails(false);
    }

    const openResultDetailsModal = (resultId) => {
        setOpenResultDetails(true);
        getResult(resultId);
        setQuiz(quizzes[resultId]);
    }

    const getResults = async () => {
        if (!user) {
            return;
        }
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        const requestOptions = {
            headers: myHeaders,
            method: 'GET',
            redirect: 'follow'
        };

        try {
            const response = await fetch(`https://localhost:7085/api/PlayQuiz/playedQuizzes/${user.userId}`, requestOptions);
            const result = await response.json();
            if (response.status === 404) {
                // toast.info("No quizzes to show. Please participate in one first");
                setResults([]);
                setLoading(false);
            }
            else {
                setResults(result);
                getQuizzes(result);
            }
        } catch (error) {
            toast.error(`${error.message}`);
        }
    };

    const getResult = async (resultId) => {
        setLoading(true);
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        const requestOptions = {
            headers: myHeaders,
            method: 'GET',
            redirect: 'follow'
        };

        try {
            const response = await fetch(`https://localhost:7085/api/PlayQuiz/playedQuizResult/${resultId}`, requestOptions);
            if (response.status === 404) {
                toast.info("Result not found");
            }
            const result = await response.json();
            setResult(result);
            setLoading(false);
        } catch (error) {
            toast.error(`${error.message}`);
        }
    };

    const getQuiz = async (quizId) => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        const requestOptions = {
            headers: myHeaders,
            method: 'GET',
            redirect: 'follow'
        };

        try {
            const response = await fetch(`https://localhost:7085/api/Quiz/${quizId}`, requestOptions);
            if (response.status === 404) {
                toast.info("Quiz not found");
            }
            if (response.status === 200) {
                const result = await response.json();
                return result;
            }
            else {
                console.log("Get quiz failed")
            }
        } catch (error) {
            toast.error(`${error.message}`);
        }
    }

    const getQuizzes = async (results) => {
        results.forEach(async result => {
            let quiz = await getQuiz(result.quizId);
            setQuizzes(prev => ({ ...prev, [result.resultId]: quiz }));
        });
        setLoading(false);
    }

    function secondsToHms(d) {
        if (d === 0)
            return 0;
        d = Number(d);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        var hDisplay = h > 0 ? h + ' Hours : ' : '';
        var mDisplay = m > 0 ? m + ' Mins : ' : '';
        var sDisplay = s > 0 ? s + ' Secs ' : '';

        if (hDisplay && !mDisplay && !sDisplay) return hDisplay.slice(0, -1);  // Remove trailing ':'
        if (!hDisplay && mDisplay && !sDisplay) return mDisplay.slice(0, -1);  // Remove trailing ':'

        return hDisplay + mDisplay + sDisplay;
    }

    const isChoosed = (questionId, optionId) => {
        return result.answers.some((answer) => {
            return answer.questionId === questionId && answer.optionId === optionId;
        });
    }

    if (loading) {
        return (
            <div className="screen">
                <CircularProgress
                    color="primary"
                    size="lg"
                    value={30}
                />
            </div>
        );
    }

    if (results.length === 0) {
        return (<>
            <Nav active={3} user={user} />
            <div className='no-results-found'>
                <div className='no-results-found-heading'>
                    No past quizzes are found
                </div>
                <div className='no-results-found-sub-heading'>
                    Please participate in one first
                </div>
            </div>
        </>);
    }

    return (<>
        <Nav active={3} user={user} />
        <div className='past-quizzes-container'>
            <div className="inner-container">
                <h1 className='past-quizzes-heading'>My Past Quizzes</h1>
                <div>
                    <ol className='result-list'>
                        {results.map((result) => {
                            return (
                                <li key={result.resultId} className='result'
                                    onClick={
                                        () => openResultDetailsModal(result.resultId)
                                    }>
                                    <h2 className='quiz-title'>
                                        {quizzes[result.resultId]?.title}
                                    </h2>
                                    <table className='details-table'>
                                        <tbody>
                                            <tr className='result-details-top'>
                                                <td>
                                                    Total Questions: {quizzes[result.resultId]?.questions.length}
                                                </td>
                                                <td>
                                                    Attempted Questions: {result.noOfAttemptedQuestions}
                                                </td>
                                                <td>
                                                    Correct Answers: {result.noOfCorrectAnswers}
                                                </td>
                                                <td>
                                                    Wrong Answers: {result.noOfWrongAnswers}
                                                </td>
                                            </tr>
                                            <tr className='result-details-bottom'>
                                                <td>
                                                    Marks: {result.obtainedMarks} out of {result.totalMarks}
                                                </td>
                                                <td>
                                                    Percentage: {((result.obtainedMarks / result.totalMarks) * 100).toFixed(2)} %
                                                </td>
                                                <td>
                                                    Time Taken: {secondsToHms(result.timeTakenInSecs)}
                                                </td>
                                                <td>
                                                    Participated on: {formatDate(parseISO(result.startTime), "MMMM d, yyyy, h:mm a")}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>

                                </li>
                            )
                        })}
                    </ol>
                </div>
            </div>
        </div>
        {/* View result modal */}
        <Modal open={openResultDetails}
            onClose={(event, reason) => {
                handleCloseResultDetails(event, reason);
            }}
        >
            <ModalDialog
                sx={{ width: '50%', overflowY: 'auto' }}
            >
                <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <span onClick={handleCloseResultDetails}>
                        <Close sx={{ cursor: 'pointer' }} />
                    </span>
                    <DialogTitle sx={{ fontSize: '30px' }}>
                        {quiz.title}
                    </DialogTitle>
                </DialogActions>
                <ol>
                    {quiz.questions?.map((question) => {
                        return (
                            <li key={question.questionId} className='question-answer'>
                                <div className="question">
                                    <div>
                                        {question.title}
                                    </div>
                                    <div className='marks'>
                                        {question.marks}
                                    </div>
                                </div>
                                <div className='options'>
                                    {question.options.map((option) => {
                                        return (
                                            <Tooltip key={option.optionId}
                                                title={isChoosed(question.questionId, option.optionId) ? 'Your answer' : ''}
                                                sx={isChoosed(question.questionId, option.optionId) ? option.isCorrect ? { backgroundColor: 'green' } : { backgroundColor: 'crimson' } : {}}
                                                className={isChoosed(question.questionId, option.optionId) ? 'selected-option result-option' : 'result-option'}>
                                                <Tooltip
                                                    placement='top'
                                                    size='sm'
                                                    title={option.isCorrect ? 'Correct answer' : ''}
                                                    >
                                                    <div style={isChoosed(question.questionId, option.optionId) ? option.isCorrect ? { backgroundColor: '#A9FFA9' } : { backgroundColor: '#FA9393' } : {}}>
                                                        {option.title}
                                                        {option.isCorrect ? <CheckBox sx={{ color: 'green', fontSize: '20px' }} /> : <></>}
                                                    </div>
                                                </Tooltip>
                                            </Tooltip>
                                        );
                                    })}
                                </div>
                            </li>
                        );
                    })}

                </ol>
            </ModalDialog>
        </Modal>
    </>)
}

export default MyQuizzes