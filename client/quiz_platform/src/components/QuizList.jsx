import Nav from './Nav'
import '../styles/QuizList.css';
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import CreateMcqSingle from './CreateMcqSingle';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import BorderColorOutlinedIcon from '@mui/icons-material/BorderColorOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Modal from '@mui/joy/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Button } from '@mui/material';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { CircularProgress, LinearProgress } from '@mui/joy';

// code for ios style switch button as active toggle button
const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) =>
({
  width: 38,
  height: 22,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#65ceb5' : '#65ceb5',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 18,
    height: 18,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#b7b7b7' : '#b7b7b7',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

// Table component displaying the quiz data
export const QuizList = (props) => {
  //  flag to toggle between modal and non-modal mode
  // const isModal = Object.keys(props).length !== 0;
  const isModal = props.modal === '1';

  // flag to open/close delete confirmation modal
  const [openDlt, setOpenDlt] = useState(false);
  // flag to open/close question type selection modal
  const [openCreate, setOpenCreate] = useState(false);
  // flag to open/close edit quiz modal
  const [openEdt, setOpenEdt] = useState(false);
  // flag to show message if there are 0 active quizzes 
  const [showList, setShowList] = useState(false);

  // store the list of quizzes
  const [quizzes, setQuizzes] = useState([]);
  // flag for loading data
  const [loading, setLoading] = useState(true);
  // store the quiz index to delete
  const [dltId, setDltId] = useState();
  // store the quiz index to edit
  const [editId, setEditId] = useState();
  // store the user data
  const [user, setUser] = useState(() => {
    let userObj = jwtDecode(localStorage.getItem("token"));
    userObj.firstLetter = userObj.name.charAt(0);
    return (userObj);
  });
  // store the usernames
  const [userNames, setUserNames] = useState({});

  // [Page 1-> Home | Page 2-> Quiz List] it is used in the navbar for highlighting the links
  const page = 2;
  // store the number of In-active quizzes
  let noOfNotActive = 0;
  // store the number of quizzes
  let noOfQuizzes = 0;


  // Fetch data function
  const fetchQuizzes = async () => {
    setLoading(true);
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


  useEffect(() => {
    const fetchUserNames = async () => {
      const userIds = quizzes.map(quiz => quiz.createdBy);
      const uniqueUserIds = [...new Set(userIds)];
      const userNames = {};

      // Fetch user names for each unique userId
      for (const userId of uniqueUserIds) {
        const user = await getUser(userId);
        userNames[userId] = user.name;
      }

      setUserNames(userNames);
    };

    fetchUserNames();
  }, [quizzes]);

  // func to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'PPp'); // Example format: "May 23, 2024, 11:53:18 AM"
  };

  const deleteQuiz = async () => {
    const requestOptions = {
      method: "DELETE",
      redirect: "follow"
    };

    try {
      const response = await fetch(`https://localhost:7085/api/Quiz/${dltId}`, requestOptions);

      if (response.status === 404) {
        toast.error('Quiz not found');
        return;
      }
      if (response.status === 400) {
        toast.error('Bad request');
        return;
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      toast.success(result.message);
    } catch (error) {
      toast.error(error.message);
    }

    fetchQuizzes();
  }



  // function to handle open/close of delete confirmation modal
  const handleOpenDlt = () => setOpenDlt(true);
  const handleCloseDlt = () => setOpenDlt(false);

  // function to handle open/close of edit modal
  const handleOpenEdt = () => setOpenEdt(true);
  const handleCloseEdt = (event, reason) => {
    if (((reason) === "backdropClick") || ((reason) === "escapeKeyDown"))
      return;
    setOpenEdt(false);
    fetchQuizzes();
  }

  // function to handle open/close of question type selection modal
  const handleOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  // setting noOfQuizzes and noOfNotActive and ShowList to true/false on 1st render
  noOfQuizzes = quizzes.length;

  useEffect(() => {
    quizzes.forEach((quiz) => {
      if (!quiz.active)
        noOfNotActive++;
    })
    if (isModal) {
      if (noOfNotActive === noOfQuizzes) {
        setShowList(false);
      }
      else {
        setShowList(true);
      }
    }
    else {
      setShowList(true);
    }
    // eslint-disable-next-line
  }, [quizzes]);

  const toggleStatus = (quizId, status) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    const requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow"
    };

    fetch(`https://localhost:7085/api/Quiz/active/${quizId}?status=${status}`, requestOptions)
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 400) {
          toast.error("Bad request");
        }
        if (response.status === 200) {
          toast.success(result.message);
          fetchQuizzes();
        }
        else
          toast.error(result.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });
  }

  const getUser = async (userId) => {
    let user;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };

    await fetch(`https://localhost:7085/api/User/${userId}`, requestOptions)
      .then(async (response) => {
        const result = await response.json();
        if (response.status === 400) {
          toast.error("Bad request");
        }
        if (response.status === 200) {
          user = result;
        }
        else
          toast.error(result.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error);
      });

    return user;
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

  return (
    <div className='quizzes-page'>

      <Nav active={isModal ? '0' : page} user={user} />

      <div className={isModal ? "hide" : "quiz-top-container"}>
        <div className='quiz-top'>
          <div className='quiz-head'>
            My Quizzes
          </div>
          <div className='create-quiz-link' onClick={handleOpenCreate}>
            Create New Quiz
          </div>
        </div>
      </div>

      <div className={isModal ? "table-container-modal" : "table-container"}>
        {/* If no of quizzes is 0 then display  " No quizzes to show , Please create one first "*/}
        {/* Else if showList is true then display the list of quizzes else display " No quizzes are ACTIVE to Play " */}
        {
          noOfQuizzes === 0 ?
            <div className='empty-quizzes'>
              No quizzes to show , Please create one first
            </div>
            :
            !showList ?
              <div className='empty-quizzes'>
                No quizzes are ACTIVE to Play
              </div>
              :
              <TableContainer component={Paper} className="table-modal" >
                <Table>

                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontFamily: "BrandonGrotesque-Bold", fontSize: '25px' }}>Quiz&nbsp;No.</TableCell>
                      <TableCell align="left" >Title</TableCell>
                      <TableCell align="left" className={isModal ? "hide" : ""} >Status</TableCell>
                      <TableCell align="left" >Created&nbsp;on</TableCell>
                      <TableCell align="left" >Created&nbsp;by</TableCell>
                      <TableCell align="left" >{user.role === "Student" ? "Play" : "Actions"}</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {quizzes.map((quiz, index) => {
                      return (
                        <TableRow
                          key={index}
                          className={quiz.active ? "" : isModal ? "hide" : "inactive"}
                        >

                          <TableCell align="left" >{index + 1}</TableCell>
                          <TableCell align="left" >{quiz.title}</TableCell>
                          <TableCell align="left" sx={{ display: "flex", alignItems: "center", fontFamily: "BrandonGrotesque-Bold", fontSize: '20px' }} className={isModal ? "hide" : "status-container"}>
                            <span className='status' >{quiz.active ? "Active" : "Inactive"}</span>
                            <span>
                              {
                                <IOSSwitch
                                  sx={{ m: 1 }}
                                  checked={quiz.active}
                                  onChange={async (e) => {
                                    toggleStatus(quiz.quizId, !quiz.active);
                                  }}
                                />
                              }
                            </span>
                          </TableCell>
                          <TableCell align="left" >{formatDate(quiz.creationTime)}</TableCell>
                          <TableCell align="left" >{userNames[quiz.createdBy] || 
                            <LinearProgress
                              color="primary"
                              size="sm"
                              value={30}
                            />}</TableCell>
                          <TableCell align="left" >
                            {/* Play icon btn */}
                            <Link to="/play" state={{ id: quiz.quizId }}>
                              <button title='Play' className={!quiz.active ? "fade" : "actions"} disabled={!quiz.active}>
                                <PlayCircleOutlineIcon sx={{ color: "green" }} />
                              </button>
                            </Link>

                            {/* Edit icon btn to open edit modal */}
                            <button title='Edit' className={isModal ? "hide" : "actions"} id='editBtn' onClick={() => {
                              handleOpenEdt();
                              setEditId(quiz.quizId);
                            }}>
                              <BorderColorOutlinedIcon sx={{ color: "green" }} />
                            </button>

                            {/* Delete icon btn to open delete confirmation modal */}
                            <button title='Delete' className={isModal ? "hide" : "actions"} onClick={() => {
                              handleOpenDlt();
                              setDltId(quiz.quizId);
                            }}>
                              <DeleteOutlinedIcon sx={{ color: "crimson" }} />
                            </button>

                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
        }
      </div>

      {/* Modal for question type selection */}
      <Modal
        open={openCreate}
        onClose={handleCloseCreate}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className='modalH'>
          <div id='modalH-title'>
            <span>Select Question Type</span>
            <button onClick={handleCloseCreate}><CloseIcon /></button>
          </div>
          <div id='modalH-description'>
            <Link to='/mcq-single'>
              <button className='types' value='1'>
                <span>MCQ</span> (Single Correct)
              </button>
            </Link>
            <button className='types' value='2'>
              <span>MCQ</span> (Multi Correct)
            </button>
            <button className='types' value='3'>
              <span>Short Answer</span> (with two words)
            </button>
            <button className='types' value='4'>
              <span>Description</span> (with 2 or 4 sentences)
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal for Editing the quiz */}
      <Modal
        open={openEdt}
        onClose={(event, reason) => handleCloseEdt(event, reason)}
        aria-labelledby="modal-title-edt"
        aria-describedby="modal-description-edt"
      >
        <div>
          <CreateMcqSingle editId={editId} handleCloseEdt={handleCloseEdt} modal='1' />
        </div>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal
        open={openDlt}
        onClose={handleCloseDlt}
        aria-labelledby="modal-title-dlt"
        aria-describedby="modal-description-dlt"
      >
        <div className='modal-dlt'>
          <div id='modal-title-dlt'>
            <div className='modal-head-dlt'>
              Are you sure you want to Delete
            </div>
            <button onClick={handleCloseDlt} className='close-btn'><CloseIcon /></button>
          </div>
          <div id='modal-description-dlt'>
            <div>
              Deleting this quiz will result in loosing the quiz permanently and is not recoverable
            </div>
            <div>
              <Button
                sx={{
                  backgroundColor: "crimson",
                  float: "right",
                  marginLeft: "20px",
                  marginTop: "20px",
                  fontFamily: "BrandonGrotesque-Bold"
                }}
                onClick={handleCloseDlt}
                color='error'
                size='large'
                variant='contained'>
                No
              </Button>
              <Button
                sx={{
                  backgroundColor: "crimson",
                  float: "right",
                  marginTop: "20px",
                  fontFamily: "BrandonGrotesque-Bold"
                }}
                onClick={() => {
                  deleteQuiz();
                  setDltId(null);
                  handleCloseDlt();
                }}
                color='error'
                size='large'
                variant='contained'>
                Yes
              </Button>
            </div>
          </div>
        </div>
      </Modal>

    </div>
  )
}


export default QuizList