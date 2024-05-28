// defining reducer to perform CUD operations according to the actions on the store 
const reducer = (state=[],action)=>
{
    switch(action.type)
    {
        // case for adding new quiz
        case "ADD_Q":
            return [...state,action.payload]
        // case for toggling the status of the quizzes
        case "TGL_STAT":
            let newState = [...state];
            newState[action.payload.index] = {...newState[action.payload.index],status:action.payload.status};
            return newState;
        // case for deleting an existing quiz
        case "DLT_Q":
            let new_state_dlt = [...state];
            new_state_dlt.splice(action.payload,1);
            return new_state_dlt;
        // case for editing/updating an existing quiz
        case "EDIT_Q":
            let new_state_edit = [...state];
            new_state_edit.splice(action.editId,1,action.payload);
            return new_state_edit;
        // case if action type doesn't match then return the old state
        default :
            return state
    }
}
// exporting the reducer
export default reducer;