import React from 'react';
import '../styles/Nav.css';
import PlayList from './PlayList';
import logo from '../images/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Avatar, Divider, ListItemIcon } from '@mui/material';
import { Logout, Settings } from '@mui/icons-material';
import { deepOrange } from '@mui/material/colors';
import WarningRoundedIcon from '@mui/icons-material/WarningRounded';
import ModalDialog from '@mui/joy/ModalDialog';
import { Button, DialogActions, DialogContent, DialogTitle, Dropdown, IconButton, Menu, MenuButton, MenuItem, Modal, Tooltip } from '@mui/joy';
import { toast } from 'react-toastify';

const Nav = ({ active, user }) => {

    // flag for playlist modal
    const [openPlay, setOpenPlay] = useState(false);
    const [openLogout, setOpenLogout] = useState(false);
    const handleOpenPlay = () => setOpenPlay(true);
    const handleClosePlay = () => setOpenPlay(false);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        toast.info("Logged out!");
    }


    return (
        // if active = 0 then navbar will be hided
        <div className={active === '0' ? "hide" : "nav"}>
            <div>
                <Link to='/'><img className='logo' src={logo} alt="logo" /></Link>
            </div>
            <div className='menu'>
                {/* Home button */}
                <Link to='/' className='home-link'>
                    <div className={active === 1 ? "home active" : "home"}>Home</div>
                </Link>
                {/* My quizzes button */}
                <Link to='/quizzes' className='quizzes-link'>
                    <div className={active === 2 ? "quizzes active" : "quizzes"}>My Quizzes</div>
                </Link>
                {/* Playable quizzes list modal open button */}
                <div className='play-link' onClick={handleOpenPlay}>
                    <div>Play Quizzes</div>
                </div>
                {/* Profile button */}

                {/* Menu */}
                <Dropdown>
                    <Tooltip title="Account settings">
                        <MenuButton
                            sx={{ p: 0, m: 0 }}
                            slots={{ root: IconButton }}
                        >
                            <Avatar sx={{ width: 42, height: 42, bgcolor: deepOrange[500] }}>{user.firstLetter}</Avatar>
                        </MenuButton>
                    </Tooltip>
                    <Menu>
                        <MenuItem>
                            <Avatar sx={{ bgcolor: deepOrange[500], mr: 2 }}>{user.firstLetter}</Avatar> <span>{user.name}  <br/> {user.role} </span></MenuItem>
                        <MenuItem>
                            <ListItemIcon>
                                <Settings fontSize="small" />
                            </ListItemIcon>
                            My account
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={()=>setOpenLogout(true)}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Dropdown>

            </div>
            {/* Playable quizzes list modals */}
            <PlayList open={openPlay} handleClose={handleClosePlay} />
            {/* logout confirmation modal */}
            <Modal open={openLogout} onClose={() => setOpenLogout(false)} >
                <ModalDialog variant="soft" role="alertdialog" size="lg" sx={{fontSize:25}}>
                    <DialogTitle>
                        <WarningRoundedIcon />
                        Logout Confirmation
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        Are you sure you want to logout?
                    </DialogContent>
                    <DialogActions>
                        <Button variant="solid" color="danger"  onClick={() => logout()}>
                            Logout
                        </Button>
                        <Button variant="plain" color="neutral" onClick={() => setOpenLogout(false)}>
                            Cancel
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </div>
    );
}

export default Nav;