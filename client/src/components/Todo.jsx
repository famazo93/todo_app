import {useState} from 'react';
import { ItemTypes } from '../util/Constants';
import { useDrag } from 'react-dnd'

function Todo(props) {
    const {todo, user, setTodos} = props;

    const [{isDragging}, drag] = useDrag(() => ({
        type: ItemTypes.TODO,
        item: {todo},
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            handleStageChange(dropResult.draggedTodo.todo.stage);
        },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    }))

    const removeTodo = async () => {
        await fetch(`/api/todos/${user}/${todo.id}`, {
            method: "DELETE"
        })

        setTodos((prevTodos) => prevTodos.filter((prevTodo) => prevTodo.id !== todo.id))
    }

    const priorities = ['High', 'Medium', 'Low', 'No'];
    const handlePrioChange = async (event) => {
        const updatedTodo = {...todo, priority: event.target.value};

        await fetch(`/api/todos/${user}/${todo.id}`, {
            method: "PATCH",
            body: JSON.stringify(updatedTodo),
            headers: {
                "Content-type": "application/json"
            }
        });
        setTodos((prevTodos) => [...prevTodos.filter(prevTodo => prevTodo.id !== todo.id), updatedTodo])
    }
    
    const handleStageChange = async (newStage) => {
        const updatedTodo = {...todo, stage: newStage};

        await fetch(`/api/todos/${user}/${todo.id}`, {
            method: "PATCH",
            body: JSON.stringify(updatedTodo),
            headers: {
                "Content-type": "application/json"
            }
        });
    }
    //state to edit todo deadline -> turn deadline div into input field
    const [editing, setEditing] = useState(false);

    const toggleEdit = () => {
        setEditing(true);
    }

    const handleDeadlineChange = async (event) => {
        const updatedTodo = {...todo, deadline: event.target.value};

        await fetch(`/api/todos/${user}/${todo.id}`, {
            method: "PATCH",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(updatedTodo)
        });

        setTodos((prevTodos) => [...prevTodos.filter(prevTodo => prevTodo.id !== todo.id), updatedTodo]);
        setEditing(false);
    }

    return (
        <div ref={drag} style={{opacity: isDragging ? 0.5 : 1}} className="todo-added">
            <div className='todo-inner-container' id={`${todo.id}`} onMouseLeave={() => setEditing(false)}>
                <div className='todo-top-container'>
                    <div className='todo-top-text-container'>
                        <div className='todo-title'>{todo.title}</div>
                        <div className="todo-text">{todo.description}</div>
                    </div>
                    <button onClick={removeTodo} id={`remove-${todo.id}`}>X</button>
                </div>
                <div className='todo-bottom-container'>
                    {!editing ? <div onClick={toggleEdit} className='todo-date'>{todo.deadline}</div> : <input value={todo.deadline} onChange={handleDeadlineChange} type='date' name='todo-deadline' className='existingtask-date-input'></input>}
                    <select name='select-prio' className={`todo-prio prio-${todo.priority}`} onChange={handlePrioChange}>
                        <option value={todo.priority}>{todo.priority} Prio</option>
                        {priorities.filter(prio => prio !== todo.priority).map(prio => <option key={prio} value={prio}>{prio} Prio</option>)}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default Todo;