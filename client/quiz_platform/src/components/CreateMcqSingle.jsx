import '../styles/CreateMcqSingle.css';
import Nav from './Nav'
import congratulations from '../images/congratulations.gif'
import sad from '../images/sad.gif'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, CircularProgress } from '@mui/joy';
import Modal from '@mui/joy/Modal';
import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';


function CreateMcqSingle(propsData) {

    // variable to store questions
    const [inputFields, setInputFields] = useState([{
        question: '',
        options: [''],
        answer: '',
        answerIndex: null,
        marks: 1
    }]);

    // variable to store the quiz
    const [quizzes, setQuizzes] = useState([]);
    // variable to store the quiz
    const [quiz, setQuiz] = useState({});
    // variable to store the title of the quiz
    const [title, setTitle] = useState('');
    // variable to store the description of the quiz
    const [desc, setDesc] = useState('');
    // variable to store the totalTimeInSeconds of the quiz
    const [totalTimeInSeconds, setTotalTimeInSeconds] = useState(10);
    // flag for all the quiz constraints
    const [flag, setFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    // flag to open quiz saved modal
    const [open, setOpen] = useState(false);
    // flag to open quiz save failure modal
    const [openSad, setOpenSad] = useState(false);

    // check whether it ia mobile or not
    // if it is a mobile then don't open in modal
    const isMobile = window.innerWidth < 500;
    // checking is there any props passed or not , if passed then this component will be used to update a quiz, 
    // else it will be used to create a quiz
    const isModal = propsData.modal === '1';
    // store the user data
    const [user] = useState(() => {
        let userObj = jwtDecode(localStorage.getItem("token"));
        userObj.firstLetter = userObj.name.charAt(0);
        return (userObj);
    });


    // Fetch data function
    const fetchQuizzes = async () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        try {
            const response = await fetch('https://localhost:7085/api/Quiz', requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setQuizzes(result);
            // setLoading(false);
        } catch (error) {
            toast.error(`${error.message}`);
            // setLoading(false);
        }
    };
    // Fetch data function
    const fetchQuiz = async () => {
        setLoading(true);

        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        try {
            const response = await fetch(`https://localhost:7085/api/Quiz/${propsData.editId}`, requestOptions);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setQuiz(result);
            setTitle(result.title);
            setDesc(result.description);
            setTotalTimeInSeconds(result.totalTimeInSeconds);
            let questions = result.questions.map(question => {
                const answerIndex = question.options.findIndex(option => option.isCorrect);
                return {
                    question: question.title,
                    options: question.options.map(option => option.title),
                    answer: answerIndex !== -1 ? question.options[answerIndex].title : '',
                    answerIndex: answerIndex !== -1 ? answerIndex : null,
                    marks: question.marks
                };
            })
            setInputFields(questions);
            setLoading(false);
        } catch (error) {
            toast.error(`${error.message}`);
            setLoading(false);
        }
    };

    // useEffect to fetch data on component mount
    useEffect(() => {
        fetchQuizzes();
    }, []);

    // if there is any props then set the title, description and the inputFields i.e. 
    // the questions from api to useState
    useEffect(() => {
        if (isModal) {
            // fetching quiz from the api
            fetchQuiz();
        }
        // eslint-disable-next-line
    }, [])

    // onChange of the inputFields check whether there are at-least 2 options and one answer 
    useEffect(() => {
        inputFields.forEach((data, index) => {
            let helper = document.getElementById(`helperOpt${index}`);
            const { options, answerIndex } = data;
            if (options.length < 2) {
                setFlag(false);
                helper.style.display = 'block';
            }
            else if (answerIndex === null) {
                setFlag(false);
                helper.style.display = 'block';
            }
            else {
                setFlag(true);
                helper.style.display = 'none';
            }
        })
    }, [inputFields])


    // flag to open/close quiz creation success modal
    const handleOpen = () => setOpen(true);
    const handleClose = (event, reason) => {
        if (((reason) === "backdropClick") || ((reason) === "escapeKeyDown"))
            return;
        setOpen(false);
    }

    // flag to open/close quiz creation failure modal
    const handleOpenSad = () => setOpenSad(true);
    const handleCloseSad = (event, reason) => {
        if (((reason) === "backdropClick") || ((reason) === "escapeKeyDown"))
            return;
        setOpenSad(false);
    }

    // function to set the title from the input to the useState
    const handleChangeTitle = async event => {
        const TITLE = event.target.value;
        setTitle(TITLE);
        const tempTitle = TITLE.replace(/\s+/g, '');
        const titleRegex = /^.{10,30}$/;
        const helper = document.getElementById('titleHelper')

        // check the title is between 10 and 30 letters or not
        if (titleRegex.test(tempTitle)) {
            setFlag(true);
            helper.style.display = 'none';
        }
        else {
            setFlag(false);
            helper.style.display = 'block';
        }
    }

    // function the add a new question field
    const addInputField = () => {
        let newQuestion = inputFields;
        newQuestion = [...newQuestion, { question: '', options: [''], answer: '', answerIndex: null, marks: 1 }];
        setInputFields(newQuestion)
    }

    // function the delete a question field
    const removeInputFields = index => {
        const rows = [...inputFields];
        rows.splice(index, 1);
        setInputFields(rows);
    }

    // function to set the question from the input to the useState
    const handleChange = (index, event) => {

        const queRegex = /^.{10,200}$/;
        const helper = document.getElementById(`helper${index}`)
        const QUE = event.target.value;
        const list = [...inputFields];
        list[index].question = QUE;
        setInputFields(list);
        const tempQue = QUE.replace(/\s+/g, '');
        // check the question is between 10 and 200 letters or not
        if (!(queRegex.test(tempQue))) {
            setFlag(false);
            helper.style.display = 'block';
        }
        else {
            setFlag(true);
            helper.style.display = 'none';

        }
    }
    // add a new option field
    const addOptionField = index => {
        const data = inputFields.slice();
        const oldOptions = data[index].options;
        data[index].options = [...oldOptions, ''];
        setInputFields(data);
    }

    // remove an option field
    const removeOptionFields = (indexQue, indexOpt) => {
        let list = [...inputFields];
        if (indexOpt === list[indexQue].answerIndex) {
            list[indexQue].answerIndex = null;
        }
        else if (indexOpt < list[indexQue].answerIndex) {
            list[indexQue].answerIndex -= 1;
        }
        list[indexQue].options.splice(indexOpt, 1);
        setInputFields(list);
    }

    // function to set options from input to useState
    const handleChangeOpt = (index, indexOpt, event) => {
        const OPT = event.target.value;
        const list = [...inputFields];
        list[index].options[indexOpt] = OPT;
        setInputFields(list);
    }
    // function to set marks from input to useState
    const handleChangeMarks = (index, event) => {
        const marks = event.target.value;
        const list = [...inputFields];
        list[index].marks = marks;
        setInputFields(list);
    }

    // function to set the answer of the question
    const setCorrect = (index, indexOpt) => {
        const data = inputFields.slice();
        data[index].answer = data[index].options[indexOpt];
        data[index].answerIndex = indexOpt;
        setInputFields(data);
    }

    // Transform data as per api
    const transformQuizDataCreate = (title, description, totalTimeInSeconds, questions) => {
        return {
            title: title,
            description: description,
            totalTimeInSeconds: totalTimeInSeconds,
            createdBy: user.userId,
            questions: questions.map((question, index) => ({
                title: question.question,
                marks: question.marks,
                questionNo: index + 1,
                options: question.options.map((option, index) => ({
                    title: option,
                    optionNo: index + 1,
                    isCorrect: index === question.answerIndex
                }))
            }))
        };
    };

    // Transform data as per api
    const transformQuizDataUpdate = (title, description, totalTimeInSeconds, questions) => {
        return {
            quizId: quiz.quizId,
            title: title,
            description: description,
            totalTimeInSeconds: totalTimeInSeconds,
            createdBy: user.userId,
            creationTime: quiz.creationTime,
            active: true,
            questions: questions.map((question, index) => ({
                title: question.question,
                marks: question.marks,
                questionNo: index + 1,
                options: question.options.map((option, index) => ({
                    title: option,
                    optionNo: index + 1,
                    isCorrect: index === question.answerIndex
                }))
            }))
        };
    };

    // create the quiz in db by api call
    const createQuiz = (quiz) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        
        const raw = JSON.stringify(quiz);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://localhost:7085/api/Quiz", requestOptions)
            .then(async (response) => {
                const result = await response.json();
                if (response.status === 400) {
                    toast.error("Bad request");
                }
                if (response.status === 201) {
                    sendQuizAddedEmail(quiz.title);
                    toast.success(result.message);
                    handleOpen();
                }
                else
                    toast.error(result.message);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
                handleOpenSad();
            });
    }

    // update the quiz in db by api call
    const updateQuiz = (quiz) => {

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        const raw = JSON.stringify(quiz);

        const requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(`https://localhost:7085/api/Quiz/${quiz.quizId}`, requestOptions)
            .then(async (response) => {
                const result = await response.json();
                if (response.status === 400) {
                    toast.error("Bad request");
                }
                if (response.status === 200) {
                    toast.success(result.message);
                    handleOpen();
                }
                else
                    toast.error(result.message);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
                handleOpenSad();
            });
    }


    // function for all the quiz validations
    const onSave = e => {

        e.preventDefault();
        let tempFlag1 = true;
        let tempFlag2 = true;
        let tempFlag3 = true;
        const TITLE = title.trim().replace(/\s+/g, " ");
        // check if there exists same title
        // it will return true only if quiz is being updated and the same title exists for the same quiz
        quizzes.forEach((data, index) => {
            const tempTitle = data.title.trim().replace(/\s+/g, " ");
            if (tempTitle === TITLE && data.quizId !== quiz.quizId) {
                tempFlag3 = false;
                // tempFlag1 = isModal && index === propsData.editId;
            }
        })
        // show helper text if there exists quiz of same title
        if (tempFlag3 === false) {
            setFlag(false);
            document.getElementById("sameTitleError").style.display = "block";
        }
        else {
            document.getElementById("sameTitleError").style.display = "none";

        }

        if (totalTimeInSeconds < 10) {
            setFlag(false);
            tempFlag1 = false;
            document.getElementById("timeHelper").style.display = "block";
        }
        else {
            setFlag(true);
            tempFlag1 = true;
            document.getElementById("timeHelper").style.display = "none";

        }

        // check whether the options are empty then show error
        inputFields.forEach((que, indexQ) => {
            let helper = document.getElementById(`helperOpt${indexQ}`);
            que.options.forEach((opt, indexOpt) => {
                tempFlag2 = opt.replace(/\s+/g, "").length > 0;
                setFlag(tempFlag2);
                if (!tempFlag2)
                    helper.style.display = "block";
            }
            )
        });

        // create or update the quiz as per the input and show success or failure message
        if (flag && tempFlag1 && tempFlag2 && tempFlag3) {
            if (isModal) {
                const apiData = transformQuizDataUpdate(title, desc, totalTimeInSeconds, inputFields);
                updateQuiz(apiData);
            }
            else {
                const apiData = transformQuizDataCreate(title, desc, totalTimeInSeconds, inputFields);
                createQuiz(apiData);
            }
        }
        else {
            handleOpenSad();
        }


    }

    const sendQuizAddedEmail = (quizName) =>{
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
        
        const raw = JSON.stringify({
            "quizName": quizName,
            "createdBy": user.name
        });

        console.log(raw);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://localhost:7085/api/Email/QuizAdded", requestOptions)
            .then(async (response) => {
                const result = await response.json();
                if (response.status === 400) {
                    toast.error("Bad request");
                }
                if (response.status === 200) {
                    toast.success("Notification sent to all students");
                }
                else
                    toast.error(result.message);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
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


    // ----------------------------------        Render function           ---------------------------------------------------
    return (<>
        {/*if there are any props then render it as a modal*/}
        <div className='create-new-quiz' id={isModal ? (!isMobile ? "modal-edt" : "mobile-modal-edt") : ""}>
            {/* if there are any props then don't render the navbar */}
            <Nav active={isModal ? "0" : ""} user={user} />
            <form onSubmit={e => onSave(e)}>
                {/* dynamically show the heading  */}
                <div className='heading-div'>
                    <div className='heading-container'>
                        <h2 className='heading' id={isModal ? "modal-title-edt" : ""}>
                            {isModal ? "Edit Quiz" : "Create New Quiz"}
                        </h2>
                    </div>
                </div>

                <div>
                    <div className='outer-top'>
                        <div className='top'>
                            {/* Title input */}
                            <div>
                                <label htmlFor="title" className='input-label'>Title</label>
                                <input
                                    required
                                    value={title}
                                    onChange={e => handleChangeTitle(e)}
                                    className='title'
                                    type="text"
                                    name="title"
                                    id="title"
                                    spellCheck="false"
                                    placeholder='Add Title' />
                            </div>
                            <span className='titleHelper helper' id='titleHelper'>
                                Title length should be minimum 10 and maximum 30
                            </span>
                            {/* Description input */}
                            <label htmlFor="description" className='input-label'>Description</label>
                            <textarea
                                required
                                onChange={e => {
                                    setDesc(e.target.value)
                                }}
                                value={desc}
                                className='desc'
                                name="description"
                                id="description"
                                spellCheck="false"
                                placeholder='Add Description' />
                            {/* Time input */}
                            <div>
                                <label htmlFor="time" className='input-label'>Total time: </label>
                                <input
                                    required
                                    value={totalTimeInSeconds}
                                    onChange={e => setTotalTimeInSeconds(e.target.value)}
                                    className='time'
                                    type="number"
                                    name="time"
                                    id="time"
                                    placeholder='Add Time in seconds' />
                                <span>Secs.</span>
                            </div>
                            <span className='timeHelper helper' id='timeHelper'>
                                Total time should be minimum 10 secs
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className="container">
                            {
                                inputFields.map((data, index) => {
                                    const { question, options, marks } = data;
                                    return <div className="question-container" key={index}>
                                        <div className='question-top-bar'>
                                            <span className='qno'>Question {index + 1}</span>
                                            <span>
                                                <label htmlFor="marks">Marks: </label>
                                                <input
                                                    required
                                                    value={marks}
                                                    onChange={event => handleChangeMarks(index, event)}
                                                    type="number"
                                                    name="marks"
                                                    id="marks"
                                                    placeholder='Marks'
                                                    className='marks-input' />
                                            </span>
                                        </div>
                                        {/* Question input */}
                                        <div className="question">
                                            <input
                                                required
                                                type="text"
                                                onChange={event => handleChange(index, event)}
                                                value={question}
                                                name="question"
                                                className="question-input"
                                                spellCheck="false"
                                                placeholder="New Question" />
                                        </div>
                                        <span id={`helper${index}`} className='helper'>
                                            Question length should be minimum 10 & maximum 200
                                        </span>
                                        {/* Options container */}
                                        <div className='option-container'>
                                            {
                                                options.map((ans, indexOpt) => {
                                                    return <div className='option' key={indexOpt}>
                                                        {/* Option upper part */}
                                                        <div className='up'>
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    onChange={event => handleChangeOpt(index, indexOpt, event)}
                                                                    name="options"
                                                                    className="option-input"
                                                                    spellCheck="false"
                                                                    placeholder={`Option ${indexOpt + 1}`}
                                                                    value={ans} />
                                                            </div>
                                                            {/* Delete button to delete a option */}
                                                            <div>
                                                                {
                                                                    options.length > 1 ?
                                                                        <DeleteForeverOutlinedIcon
                                                                            sx={{
                                                                                cursor: 'pointer',
                                                                                color: 'darkRed'
                                                                            }}
                                                                            onClick={() => removeOptionFields(index, indexOpt)} />
                                                                        : ''
                                                                }
                                                            </div>
                                                        </div>
                                                        {/* Option lower part */}
                                                        <div className='down'
                                                            onClick={() => setCorrect(index, indexOpt)}>
                                                            {
                                                                // Set answer button
                                                                <Button
                                                                    variant='text'
                                                                    sx={{
                                                                        color: 'grey',
                                                                        textTransform: 'none',
                                                                        fontWeight: 600
                                                                    }}
                                                                    startDecorator={inputFields[index].answerIndex === indexOpt ?
                                                                        <CheckBoxIcon /> : ""}
                                                                    className={inputFields[index].answerIndex === indexOpt ? "c-green" : ""}>
                                                                    Correct Answer
                                                                </Button>
                                                            }
                                                        </div>
                                                    </div>
                                                })
                                            }
                                            {/* Button to add new option */}
                                            <div className="add-opt" onClick={() => addOptionField(index)}>
                                                <div className='up'>
                                                    <div className="new-option-input">
                                                        New Answer
                                                    </div>
                                                </div>
                                                <div className='down'></div>
                                            </div>

                                        </div>

                                        {/* Lower part of the question container */}
                                        <div className="dlt-qs">
                                            <div className='helperOpt helper' id={`helperOpt${index}`}>
                                                There should be at-least two options and one should be correct
                                            </div>
                                            {/* Delete Question button */}
                                            <div className='dlt-qs-btn'>
                                                {
                                                    inputFields.length !== 1 ?
                                                        <DeleteOutlinedIcon
                                                            sx={{
                                                                color: 'darkRed',
                                                                cursor: 'pointer',
                                                                justifySelf: 'flex-end'
                                                            }}
                                                            onClick={() => removeInputFields(index)} />
                                                        : ''
                                                }
                                            </div>
                                        </div>

                                    </div>// end of return function
                                })//end of inputFields.map function
                            }

                            {/* Add new question button */}
                            <div className="add-qs">
                                <Button
                                    sx={{
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderColor: 'primary.main',
                                        margin: '30px 0px 20px 0px'
                                    }}
                                    startDecorator={<LibraryAddOutlinedIcon />}
                                    variant='solid'
                                    size='lg'
                                    className=""
                                    onClick={addInputField}>
                                    Add Question
                                </Button>
                            </div>

                            <div className={isMobile && isModal ? 'save-mobile' : isModal ? 'save-mobile' : 'save'}>
                                <div className='sameTitleError helper' id='sameTitleError'>
                                    Same title exists ! Please change the title
                                </div>

                                {/* Cancel button */}
                                {isModal ? <Button
                                    sx={{
                                        width: '100px',
                                        margin: '30px',
                                        marginRight: '80px',
                                        fontFamily: "BrandonGrotesque-Bold"
                                    }}
                                    onClick={propsData.handleCloseEdt}
                                    color='danger'
                                    size='lg'
                                    variant='solid'>
                                    Cancel
                                </Button>
                                :
                                <></>
                                }
                                
                                {/* Save question button */}
                                <Button
                                    sx={{
                                        width: '100px',
                                        margin: '30px',
                                        marginRight: '80px',
                                        fontFamily: "BrandonGrotesque-Bold"
                                    }}
                                    type='submit'
                                    color='success'
                                    size='lg'
                                    variant='solid'>
                                    Save
                                </Button>
                            </div>

                            {/* Quiz save success */}
                            <Modal
                                open={open}
                                onClose={(event, reason) => {
                                    handleClose(event, reason);
                                }}
                                aria-labelledby="modal-title"
                                aria-describedby="modal-description"
                            >
                                <div className='modal'>
                                    <div id='modal-title'>
                                        <div className='modal-head'>
                                            <img src={congratulations}
                                                alt="" className='congoImg' />
                                            <span className='modal-msg'>
                                                {isModal ? "Quiz Edited Successfully" : "Quiz Created Successfully"}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                handleClose();
                                                if (isModal)
                                                    propsData.handleCloseEdt();
                                            }}
                                            className='close-btn'>
                                            <CloseIcon />
                                        </button>
                                    </div>
                                    <div id='modal-description'>
                                        <Link to='/quizzes'>
                                            {!isModal ?
                                                <button className='my-quizzes'>
                                                    My Quizzes
                                                </button> :
                                                <></>}
                                        </Link>
                                    </div>
                                </div>
                            </Modal>

                            {/* Quiz save failure */}
                            <Modal
                                open={openSad}
                                onClose={(event, reason) => { handleCloseSad(event, reason) }}
                                aria-labelledby="modal-title"
                                aria-describedby="modal-description"
                            >
                                <div className='modal'>
                                    <div id='modal-title'>
                                        <div className='modal-head'>
                                            <img src={sad}
                                                alt="" className='congoImg' />
                                            <span className='modal-msg'>
                                                Please fill up according to the instructions !
                                            </span>
                                        </div>
                                        <button onClick={(event, reason) => { handleCloseSad(event, reason) }} className='close-btn'><CloseIcon /></button>
                                    </div>
                                    <div id='modal-description' className={isModal ? "hide" : ""}>
                                        <Link to='/quizzes'>
                                            <button className='my-quizzes' onClick={(event, reason) => {
                                                handleCloseSad(event, reason)
                                            }}>
                                                My Quizzes
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </Modal>

                        </div>
                    </div>

                </div>
            </form>
        </div>
    </>
    )
    // end of return
}


export default CreateMcqSingle