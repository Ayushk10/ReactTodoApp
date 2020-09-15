import React,{useEffect, useState, useRef} from 'react';
import AddTaskForm from './components/AddTaskForm';
import {debounce} from './debounce';
import './App.css';

const TodoApp = () => {

  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [allMarked, setAllMarked] = useState(false);
  const newSessionRef = useRef(true);
  const hasTasks = Boolean(tasks.length);
  // load items array from localStorage, set in state
  if (!hasTasks && newSessionRef.current) {
    let itemsList = JSON.parse(localStorage.getItem('tasks'));
    if(itemsList && itemsList.length){
      setTasks(itemsList);
    }
  }
  const getTaskDueDays = (dueDate)=>{
    const oneDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    return Math.round(Math.abs((dueDate - now) / oneDay));
  }
  const addTask = (text, dueDate) => {
    let dueDays;
    const dateVal = dueDate.value;
    if(dueDate && dueDate.valueAsDate){
      dueDays = getTaskDueDays(dueDate.valueAsDate)
    }
    setTasks([...tasks, { text,dateVal,dueDays }]);
  }
  const dueDateClass = dueDays =>{
    
    if(dueDays<7){
      return 'red';
    }
    else if(dueDays>7 &&dueDays<30){
      return 'yellow';
    }
    else {
      return 'green';
    }
  }
  const handleSearch = (e)=>{
    debounce(setSearchTerm(e.target.value),100);
  }
  const toggleTask = index => {
    const newTasks = [...tasks];
    newTasks[index].isCompleted = !newTasks[index].isCompleted;
    setTasks(newTasks);
  };
  const prioritizeTask = index => {
    const newTasks = [...tasks];
    newTasks.unshift(newTasks.splice(index, 1)[0]);
    setTasks(newTasks);
  }
  
  const removeTask = index => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };
  const markAll = () => {
    const newTasks = [...tasks];
    newTasks.forEach((task)=>{task.isCompleted = allMarked ? false : true});
    setTasks(newTasks);
    setAllMarked(!allMarked);
  }
  useEffect(()=>{
    // on each update, sync our state with localStorage
    newSessionRef.current = false;
    localStorage.setItem('tasks', JSON.stringify(tasks))
  },[tasks,setTasks]);

  let _tasks = tasks;
  let search = searchTerm.trim().toLowerCase();

  if (search.length > 0) {
    _tasks = _tasks.filter((task)=> {
      return task.text.toLowerCase().match(search);
    });
  }
  return (
    <div className="todo-list">
    <h1>TODO LIST</h1>
    <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="search here..."
          />
    {hasTasks && <button className='markAll' onClick={markAll}>{allMarked ? 'Unmark All': 'Mark All Complete'}</button>}
      {hasTasks ? _tasks.map((task, index) => (
        <div className="todo">
        <input type="checkbox" checked={task.isCompleted} id="form-check-input" onChange={() => toggleTask(index)} />
          <span onClick={() => toggleTask(index)} className={task.isCompleted ? "todo-text todo-completed" : "todo-text"}>
            {task.text}
          </span>
          <span className={task.isCompleted ? "todo-text todo-completed" : "todo-text"}>
            <p className={dueDateClass(task.dueDays)}>{task.dateVal}</p>
          </span>
          <span className="buttonsWrapper">
            <button onClick={() => removeTask(index)}><i className="fas fa-trash-alt"></i></button>
            <button onClick={() => prioritizeTask(index)}><i className="fas fa-level-up-alt"></i></button>
          </span>
        </div>
      )): <p>Please add some tasks</p>}
      <AddTaskForm addTask={addTask} />
    </div>
  );
}

export default TodoApp;
