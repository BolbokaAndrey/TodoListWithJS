
const countTasks = () => {
    if (!localStorage.getItem("id")) {
        localStorage.setItem("id", "1");
    }
    return localStorage.getItem("id") * 1;
}

const incrementCountTasks = () => {
    let count = localStorage.getItem("id") * 1 + 1
    localStorage.setItem("id", `${count}`);
}

const inputsLogic = () => {
    document.addEventListener('click', (event) => {
        let searchInput = document.getElementById('search-input');
        let addTaskInput = document.getElementById('add-task-input');
        let tasks = document.querySelectorAll(".task__text");

        if (event.target.classList.contains('todo__search-btn')) {
            if (searchInput.classList.contains('active')) {
                tasks.forEach(task => {
                    if (searchInput.value !== "" && !task.innerText.includes(searchInput.value)) {
                        task.parentElement.classList.add("not-search")
                    }
                })
            } else {
                searchInput.classList.toggle('active');
                searchInput.value = "";
                addTaskInput.classList.toggle('active');
            }

        } else if (!event.target.classList.contains('todo__search-input')) {
            searchInput.classList.remove('active');
            addTaskInput.classList.add('active');
            tasks.forEach(task => {
                task.parentElement.classList.remove("not-search");
            })
        }

        if (event.target.classList.contains('todo__add-task-btn')) {
            if (addTaskInput.classList.contains('active')) {
                let task = addTaskInput.value;
                if (task !== "") {
                    if (localStorage.length < 2) {
                        removeDefault();
                    }
                    let key = `task${countTasks()}`
                    localStorage.setItem(key, JSON.stringify({
                        text: task,
                        done: false
                    }));
                    incrementCountTasks();
                    addTaskInput.value = "";
                    addTaskInList(document.getElementById('tasks-list'), key);
                }
            }
        }
    })
}


const tasksListLogic = () => {
    let tasksList = document.getElementById('tasks-list');

    if (localStorage.length < 2) {
        addDefault(tasksList)
    } else {
        for(let i=0; i<localStorage.length; i++) {
            let key = localStorage.key(i);
            addTaskInList(tasksList, key);
        }
    }

    tasksList.addEventListener('click', (event) => {
        let taskKey = event.target.parentElement.dataset.id;

        if (event.target.classList.contains('task__delete-btn')) {
            localStorage.removeItem(taskKey);
            tasksList.removeChild(event.target.parentElement);
            if (localStorage.length < 2) {
                addDefault(tasksList);
            }
        }
        else if (event.target.classList.contains('task__edit-btn')) {
            let taskTextDiv = event.target.previousSibling;
            let taskText = taskTextDiv.innerText;
            taskTextDiv.innerText = "";
            let newEditInput = document.createElement("input");
            newEditInput.value = taskText;
            newEditInput.type = "text";
            newEditInput.className = "task__edit-input";
            taskTextDiv.appendChild(newEditInput);
            newEditInput.focus();
            newEditInput.onblur = () => {
                localStorage.setItem(taskKey, JSON.stringify({
                    text: newEditInput.value,
                    done: false
                }));
                taskTextDiv.removeChild(newEditInput);
                taskTextDiv.innerText = newEditInput.value;
            }
        }
        else if (event.target.classList.contains('task__check-btn')) {
            event.target.classList.toggle("done");
            let taskObj = JSON.parse(localStorage.getItem(taskKey));
            let taskText = taskObj.text;
            let done = taskObj.done;
            localStorage.setItem(taskKey, JSON.stringify({
                text: taskText,
                done: !done
            }))

            const editBtn = event.target.nextSibling.nextSibling;

            if (!done) {
                editBtn.setAttribute('disabled', 'true');
            } else {
                editBtn.removeAttribute('disabled');
            }
        }
    })
}


const addDefault = (tasksList) => {
    let defaultDiv = document.createElement('div');
    defaultDiv.classList.add('task-default');
    defaultDiv.innerText = "Задач нет!"
    tasksList.appendChild(defaultDiv);
}

const removeDefault = () => {
    let defaultDiv = document.querySelector(".task-default");
    defaultDiv.remove();
}

const addTaskInList = (tasksList, key) => {

    if (key.startsWith("task")) {
        let newTask = document.createElement("div");
        newTask.classList.add("todo__task");
        newTask.classList.add("task");
        newTask.dataset.id = key;

        let taskObj = JSON.parse(localStorage.getItem(key));

        let newCheckBtn = document.createElement("button");
        newCheckBtn.classList.add("task__check-btn");
        if (taskObj.done) {
            newCheckBtn.classList.add("done");
        }

        let newTaskText = document.createElement("div");
        newTaskText.classList.add("task__text");

        newTaskText.innerText = taskObj.text;

        let newEditBtn = document.createElement("button");
        newEditBtn.classList.add("task__edit-btn");
        newEditBtn.disabled = !!taskObj.done;

        let newDeleteBtn = document.createElement("button");
        newDeleteBtn.classList.add("task__delete-btn");

        tasksList.appendChild(newTask)
        newTask.appendChild(newCheckBtn)
        newTask.appendChild(newTaskText)
        newTask.appendChild(newEditBtn)
        newTask.appendChild(newDeleteBtn)
    }
}

inputsLogic()
tasksListLogic()

