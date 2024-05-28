import React from 'react';
import { Modal } from '@mui/joy';
import CloseIcon from '@mui/icons-material/Close';
import QuizList from './QuizList';

const PlayList=({open,handleClose})=>
{
  return (
    // Modal for playable quizzes
    <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modalPlay-title"
            aria-describedby="modalPlay-description"
        >
        <div className='modalPlay'>
            <div id='modalPlay-title'>
              <span>
                Playable Quizzes
              </span> 
              <button onClick={handleClose}>
                <CloseIcon/>
              </button>
            </div>
            <div id='modalPlay-description'>
                {/* rendering quiz list in modal mode i.e. modal="1"  */}
                <QuizList modal='1'/>
            </div>
        </div>
    </Modal>
  )
}

export default PlayList