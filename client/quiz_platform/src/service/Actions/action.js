const getDate = ()=>
{
    // creating a date object
    const date = new Date();
    // month array
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let hour = date.getHours();
    let ampm = "AM";
    let minutes = date.getMinutes();
    if (minutes < 10)
    {
        minutes = '0' + minutes;
    }
    if (hour > 12)
    {
        hour -= 12;
        ampm = "PM";
    }
    // creating the timestamp by adding its contents[date,month,hour,minute & AM/PM]
    return date.getDate() + ' ' + months[date.getMonth()] + ", " + hour + ":" + minutes + " " + ampm;
}
// action to add a new question in the store
const addQ = (qTitle, qDesc, qQuestions) => 
{
    // getting the timestamp
    const curDate = getDate();
    // returning the ADD_Q action object
    return {
        type: "ADD_Q",
        payload: {
            title: qTitle,
            desc: qDesc,
            que: qQuestions,
            status: true,
            date: curDate
        },
    }
}
//action to toggle the status between ACTIVE & INACTIVE in the store
const toggleStatus = (stat, i) =>
{
    // returning the TGL_STAT action object with new status and the quiz index
    return {
        type: "TGL_STAT",
        payload: {
            status: stat,
            index: i
        },
    }
}
//action to delete a question from the store
const dltQ = (i) =>
{
    // returning the DLT_Q action object with payload as the index of Quiz to delete
    return {
        type: "DLT_Q",
        payload: i,
    }
}

//action to edit/update a question of the store
const editQ = (qTitle, qDesc, qQuestions, status, id) =>
{
    // getting the current timestamp
    const curDate = getDate();
    // returning the EDIT_Q action object
    return {
        type: "EDIT_Q",
        payload: {
            title: qTitle,
            desc: qDesc,
            que: qQuestions,
            status: status,
            date: curDate
        },
        editId: id,
    }
}

//  exporting all the actions
export { addQ, toggleStatus, dltQ, editQ }; 