import React,{useState} from 'react';

const AddTaskForm = ({ addTask }) => {
    const [value, setValue] = useState("");
    const [dueDate, setDueDate] = useState({});
    const [errorMsg, setError] = useState("");

    const handleSubmit = e => {
      e.preventDefault();
      if(value){
        addTask(value,dueDate);
        setError('');
        setValue('');
        setDueDate({});
      }
      else{
        setError("Please add some task title");
      }
    };
    const dateInputHandler =(event)=>{
        setDueDate({value: event.target.value, valueAsDate: event.target.valueAsDate});
    }
    return (
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <div className="fieldContainer">
        <label className="labelText" for="task">Task Title:</label>
            <input
            type="text"
            id="task"
            value={value}
            placeholder="Enter a title for this task…"
            onChange={e => setValue(e.target.value)}
            />
        </div>
        <div className="fieldContainer">
            <label className="labelText" for="dueDate">Due Date:</label>
            <input type="date" id="dueDate" name="due date" value={dueDate.value}
            onChange={dateInputHandler}/>
        </div>
            <button className="button" type="submit">ADD</button>
      </form>
      {errorMsg && <p className="error"> {errorMsg} </p>}
      </React.Fragment>
    );
  }
export default AddTaskForm; 