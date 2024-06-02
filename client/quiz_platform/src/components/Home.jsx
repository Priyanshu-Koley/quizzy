import '../styles/Home.css';
import React, { useEffect } from 'react';
import Nav from './Nav';
import PlayList from './PlayList';
import create from '../images/create.png';
import quizzes from '../images/quizzes.png';
import play from '../images/play.jpg';
import createUserImg from '../images/createUser.png';
import Modal from '@mui/joy/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Button, DialogContent, DialogTitle, FormControl, FormLabel, Input, ModalDialog, Option, Select, selectClasses, Stack } from '@mui/joy';
import { toast } from 'react-toastify';
import { KeyboardArrowDown } from '@mui/icons-material';

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

    const [openCreateUser, setOpenCreateUser] = useState(false);

    const [roles, setRoles] = useState([]);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [roleId, setRoleId] = useState('');

    useEffect(() => {
        getRoles();
    }, [])

    // function to get roles
    const getRoles = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        await fetch(`https://localhost:7085/api/Role`, requestOptions)
            .then(async (response) => {
                const result = await response.json();
                if (response.status === 400) {
                    toast.error("Bad request");
                }
                if (response.status === 200) {
                    setRoles(result);
                }
                else
                    toast.error(result.message);
            })
            .catch((error) => {
                toast.error(error);
            });
    }

    const createUser = () => {

        const EmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if(name.trim().length >= 8)
        {
            if (EmailRegex.test(email) && email.trim() !== '') {
                if (PasswordRegex.test(password) && password.trim() !== '') {
                    const myHeaders = new Headers();
                    myHeaders.append("Content-Type", "application/json");
                    myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);
    
                    const user = {
                        "name": name,
                        "email": email,
                        "password": password,
                        "roleId": roleId
                    }
                    const raw = JSON.stringify(user);
    
                    const requestOptions = {
                        method: "POST",
                        headers: myHeaders,
                        body: raw,
                        redirect: "follow"
                    };
    
                    fetch("https://localhost:7085/api/Account/register", requestOptions)
                        .then(async (response) => {
                            const result = await response.json();
                            if (response.status === 400) {
                                toast.error("Bad request");
                            }
                            else if (response.status === 401) {
                                toast.error("Unauthorized");
                            }
                            else if (response.status === 201) {
                                toast.success(result.message);
                                setOpenCreateUser(false);
                                inviteUser();
                            }
                            else
                                toast.error(result.message);
                        })
                        .catch((error) => {
                            console.log(error);
                            toast.error(error);
                        });
                }
                else
                {
                    toast.info("Enter a valid password");
                }
            }
            else {
                toast.info("Enter a valid email address");
            }
        }
        else {
            toast.info("Enter a valid name of minimum 8 characters");
        }

    }

    const inviteUser = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${localStorage.getItem("token")}`);

        const emailData = {
            "name": name,
            "toEmail": email,
            "password": password
        }
        const raw = JSON.stringify(emailData);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://localhost:7085/api/Email/InviteUser", requestOptions)
            .then(async (response) => {
                const result = await response.json();
                if (response.status === 400) {
                    toast.error("Bad request");
                }
                else if (response.status === 401) {
                    toast.error("Unauthorized");
                }
                else if (response.status === 200) {
                    toast.success(result.message);
                }
                else
                    toast.error(result.message);
            })
            .catch((error) => {
                console.log(error);
                toast.error(error);
            });

    }

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

                {/* displaying a card to open created quiz list */}
                {user.role === "Admin" || user.role === "Teacher" ?
                    // eslint-disable-next-line
                    <Link to='/quizzes'>
                        <div className='my-quizzesH'>
                            <div className='b-image-container'>
                                <img src={quizzes} alt="" className='b-image-quiz' />
                            </div>

                            <div className='c-text'>
                                All Quizzes
                            </div>
                        </div>
                    </Link>
                    :
                    <></>
                }


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


                {/* displaying a card to open create user modal*/}
                {user.role === "Admin" ?
                    // eslint-disable-next-line
                    <a href="#">
                        <div className='create-user' onClick={() => setOpenCreateUser(true)}>
                            <div className='b-image-container'>
                                <img src={createUserImg} alt="" className='b-image-create-user' />
                            </div>

                            <div className='c-text'>
                                Register User
                            </div>
                        </div>
                    </a>
                    :
                    <></>
                }

                {/* displaying a card to open created quiz list */}
                {user.role === "Student" ?
                    // eslint-disable-next-line
                    <Link to='/my-quizzes'>
                        <div className='my-quizzesH'>
                            <div className='b-image-container'>
                                <img src={quizzes} alt="" className='b-image-quiz' />
                            </div>

                            <div className='c-text'>
                                My Quizzes
                            </div>
                        </div>
                    </Link>
                    :
                    <></>
                }


                {/* Modals */}

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
                {/* Playable quizzes modal */}
                <PlayList open={openPlay} handleClose={handleClosePlay} />
                {/* Create user modal */}
                <Modal open={openCreateUser} onClose={() => setOpenCreateUser(false)}>
                    <ModalDialog>
                        <DialogTitle>Register new user</DialogTitle>
                        <DialogContent>Fill in the information of the user.</DialogContent>
                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                createUser();
                            }}
                        >
                            <Stack spacing={2}>
                                <FormControl>
                                    <FormLabel>Name</FormLabel>
                                    <Input autoFocus required onChange={(event) => { setName(event.target.value) }} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Email</FormLabel>
                                    <Input required onChange={(event) => { setEmail(event.target.value) }} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Password</FormLabel>
                                    <Input required onChange={(event) => { setPassword(event.target.value) }} />
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Role</FormLabel>
                                    <Select
                                        required
                                        placeholder="Select a role…"
                                        indicator={<KeyboardArrowDown />}
                                        onChange={(event, newValue) => { setRoleId(newValue) }}
                                        sx={{
                                            [`& .${selectClasses.indicator}`]: {
                                                transition: '0.2s',
                                                [`&.${selectClasses.expanded}`]: {
                                                    transform: 'rotate(-180deg)',
                                                },
                                            },
                                        }}
                                    >
                                        {roles.map((role) => {
                                            return (
                                                <Option key={role.roleId} value={role.roleId} >{role.roleName}</Option>
                                            );
                                        })
                                        }
                                    </Select>
                                </FormControl>
                                <Button type="submit">Register</Button>
                            </Stack>
                        </form>
                    </ModalDialog>
                </Modal>

            </div>

        </div >
    );
}

export default Home;