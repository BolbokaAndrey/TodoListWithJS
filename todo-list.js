
document.addEventListener('click', (event) => {
    let searchInput = document.getElementById('search-input');
    let addTaskInput = document.getElementById('add-task-input');

    if (event.target.classList.contains('todo__search-btn')) {
        if (searchInput.classList.contains('active')) {
            console.log(searchInput.value);
        } else {
            searchInput.classList.toggle('active');
            addTaskInput.classList.toggle('active');
        }

    } else if (!event.target.classList.contains('todo__search-input')) {
        searchInput.classList.remove('active');
        addTaskInput.classList.add('active');
    }
})

