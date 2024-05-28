import '../styles/Home.css';
import React from 'react';
import Nav from './Nav';
import PlayList from './PlayList';
import create from '../images/create.png';
import quizzes from '../images/quizzes.png';
import play from '../images/play.jpg';
import Modal from '@mui/joy/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// page variable to store the page no [1=>Home, 2=>Quiz List]
const page = 1;

const Home = ({ user }) => {

    // flag for question type selection modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // flag for playable quizzes modal
    const [openPlay, setOpenPlay] = useState(false);
    const handleOpenPlay = () => setOpenPlay(true);
    const handleClosePlay = () => setOpenPlay(false);

    return (
        <div >
            <Nav active={page} user={user} />
            <div className='body'>
                {/* displaying create new quiz card */}
                {user.role === "Admin" || user.role === "Teacher" ?
                // eslint-disable-next-line
                    <a href="#">
                        <div className='create' onClick={handleOpen}>
                            <div className='b-image-container'>
                                <img src={create} alt="" className='b-image-create' />
                            </div>

                            <div className='c-text'>
                                Create New Quiz
                            </div>
                        </div>
                    </a>
                    :
                    <></>
                }

                {/* Question type selection modal */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modalH-title"
                    aria-describedby="modalH-description"
                >
                    <div className='modalH'>
                        <div id='modalH-title'>
                            <span>Select Question Type</span>
                            <button onClick={handleClose}>
                                <CloseIcon />
                            </button>
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


                {/* displaying a card to open created quiz list */}
                <Link to='/quizzes'>
                    <div className='my-quizzesH'>
                        <div className='b-image-container'>
                            <img src={quizzes} alt="" className='b-image-quiz' />
                        </div>

                        <div className='c-text'>
                            My Quizzes
                        </div>
                    </div>
                </Link>

                {/* displaying a card to open playable quizzes modal*/}
                {/* eslint-disable-next-line */}
                <a href="#">
                    <div className='play' onClick={handleOpenPlay}>
                        <div className='b-image-container'>
                            <img src={play} alt="" className='b-image-play' />
                        </div>

                        <div className='c-text'>
                            Play Quiz
                        </div>
                    </div>
                </a>
                {/* Playable quizzes modal */}
                <PlayList open={openPlay} handleClose={handleClosePlay} />

            </div>

        </div>
    );
}

export default Home;