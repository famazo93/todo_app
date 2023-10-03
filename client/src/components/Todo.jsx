import {useState} from 'react';

function Todo(props) {
    const {todo, user, setStageTodos} = props;

    const removeTodo = async () => {
        await fetch(`http://localhost:3000/todos/${user}/${todo.id}`, {
            method: "DELETE"
        })

        setStageTodos((prevTodos) => prevTodos.filter((prevTodo) => prevTodo.id !== todo.id))
    }

    const priorities = ['High', 'Medium', 'Low', 'No'];
    const handlePrioChange = async (event) => {
        const updatedTodo = {...todo, priority: event.target.value};

        await fetch(`http://localhost:3000/todos/${user}/${todo.id}`, {
            method: "PATCH",
            body: JSON.stringify(updatedTodo),
            headers: {
                "Content-type": "application/json"
            }
        });
        setStageTodos((prevTodos) => [...prevTodos.filter(prevTodo => prevTodo.id !== todo.id), updatedTodo])
    }

    //state to edit todo deadline -> turn deadline div into input field
    const [editing, setEditing] = useState(false);
    const toggleEdit = () => {
        setEditing(true);
    }

    const handleDeadlineChange = async (event) => {
        const updatedTodo = {...todo, deadline: event.target.value};

        await fetch(`http://localhost:3000/todos/${user}/${todo.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(updatedTodo)
        });

        setStageTodos((prevTodos) => [...prevTodos.filter(prevTodo => prevTodo.id !== todo.id), updatedTodo]);
        setEditing(false);
    }

    return (
        <div className="todo-added" id={`${todo.id}`}>
            <div className='todo-top-container'>
                <div className='todo-top-text-container'>
                    <div className='todo-title'>{todo.title}</div>
                    <div className="todo-text">{todo.description}</div>
                </div>
                <button onClick={removeTodo} id={`remove-${todo.id}`}>X</button>
            </div>
            <div className='todo-bottom-container'>
                {!editing ? <div onClick={toggleEdit} className='todo-date'>{todo.deadline}</div> : <input onChange={handleDeadlineChange} type='date' name='todo-deadline' className='existingtask-date-input'></input>}
                <select name='select-prio' className={`todo-prio prio-${todo.priority}`} onChange={handlePrioChange}>
                    <option value={todo.priority}>{todo.priority} Prio</option>
                    {priorities.filter(prio => prio !== todo.priority).map(prio => <option key={prio} value={prio}>{prio} Prio</option>)}
                </select>
            </div>

        </div>
    )
}

export default Todo;