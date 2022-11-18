class Task {
  constructor(id, name, completed) {
    this.id = id
    this.name = name
    this.completed = completed
  }

  onCompleteTask(boardId) {
    const board = toDo.boards.find((board) => board.id === boardId);
  
    const completedTask = board.tasks.find((task) => task.id === this.id);
    completedTask.completed = !completedTask.completed;
  
    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${boardId}"]`
    );
    taskContainer.classList.toggle("completed");
  }

  onDeleteTask(boardId) {
    const board = toDo.boards.find((board) => board.id === boardId);
    board.tasks = board.tasks.filter((task) => task.id !== this.id);
  
    const taskContainer = document.querySelector(
      `[data-task-id="${this.id}"][data-board-id="${boardId}"]`
    );
    taskContainer.remove();
  }
}

class Board {
  constructor(id, title, tasks) {
    this.id = id
    this.title = title
    this.tasks = tasks
  }

  onDuplicateBoard() {
    const boardsContainer = document.querySelector(".boards");
    const newBoard = structuredClone(this);
    const lastBoardId = toDo.boards[toDo.boards.length - 1].id;
    newBoard.id = lastBoardId + 1;
    newBoard.title = `${newBoard.title} Copy`;
  
    const boardContainer = toDo.getBoardView(newBoard);
    boardsContainer.appendChild(boardContainer);
    toDo.boards.push(newBoard);
  }

  onDeleteBoard() {
    toDo.boards = toDo.boards.filter((board) => board.id !== this.id);
  
    const boardContainer = document.querySelector(`[data-board-id="${this.id}"]`);
    boardContainer.remove();
  }

  onBoardTitleClick() {
    const newTitle = prompt("Novo titulo do board");
    if (!newTitle) {
      alert("Insira o novo título!");
      return;
    }
  
    const boardTitleElement = document.querySelector(
      `[data-board-id="${this.id}"] .board-title`
    );
    boardTitleElement.textContent = newTitle;
  }

  onAddTask(newTaskName) {
    const board = toDo.boards.find((board) => board.id === Number(this.id));
    const lastTaskId = board.tasks[board.tasks.length - 1]?.id || 0;

    const task = new Task(lastTaskId + 1, newTaskName, false);
    board.tasks.push(task);
  
    const tasksContainer = document.querySelector(
      `[data-board-id="${this.id}"] .tasks`
    );
    const taskContainer = this.getTaskView(task);
    tasksContainer.appendChild(taskContainer);
  }

  getTaskView(taskParameter) {
    const task = new Task(taskParameter.id, taskParameter.name, taskParameter.completed);
    const taskContainer = document.createElement("li");
    taskContainer.classList.add("task");
    taskContainer.dataset.taskId = task.id;
    taskContainer.dataset.boardId = this.id;
    if (task.completed) {
      taskContainer.classList.add("completed");
    }
  
    const taskCheckbox = document.createElement("input");
    taskCheckbox.id = `checkbox-${task.id}-${Date.now()}`;
    taskCheckbox.classList.add("checkbox");
    taskCheckbox.type = "checkbox";
    taskCheckbox.checked = task.completed;
    taskCheckbox.addEventListener("click", () =>
      task.onCompleteTask(this.id)
    );
    taskContainer.appendChild(taskCheckbox);
  
    const taskName = document.createElement("label");
    taskName.classList.add("task-name");
    taskName.textContent = task.name;
    taskName.htmlFor = taskCheckbox.id;
    taskContainer.appendChild(taskName);
  
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => task.onDeleteTask(this.id));
    taskContainer.appendChild(deleteButton);
  
    return taskContainer;
  }

  handleNewTaskInputKeypress(e) {
    if (e.key === "Enter") {
      this.onAddTask(e.target.value);
      e.target.value = "";
    }
  }
}

class ToDo {
  constructor(boards) {
    this.boards = boards
  }

  renderizarBoards() {
    const boardsContainer = document.querySelector(".boards");
  
    this.boards.forEach((board) => {
      const boardContainer = this.getBoardView(board);
  
      boardsContainer.appendChild(boardContainer);
    });
  }

  onAddBoard(newBoardTitle) {
    const lastBoardId = this.boards[this.boards.length - 1]?.id || 0;

    const board = new Board(lastBoardId + 1, newBoardTitle, []);
    this.boards.push(board);
  
    const boardsContainer = document.querySelector(".boards");
    const boardContainer = this.getBoardView(board);
    boardsContainer.appendChild(boardContainer);
  }

  getBoardView(boardParameter) {
    const board = new Board(boardParameter.id, boardParameter.title, boardParameter.tasks);
    const boardContainer = document.createElement("div");
    boardContainer.classList.add("board");
    boardContainer.dataset.boardId = board.id;
  
    const htmlRow = document.createElement("div");
    htmlRow.classList.add("row");
  
    const duplicateButton = document.createElement("button");
    duplicateButton.classList.add("duplicate-button");
    duplicateButton.textContent = "Duplicate board";
    duplicateButton.addEventListener("click", () => board.onDuplicateBoard());
    htmlRow.appendChild(duplicateButton);
  
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "X";
    deleteButton.addEventListener("click", () => board.onDeleteBoard());
    htmlRow.appendChild(deleteButton);
  
    boardContainer.appendChild(htmlRow);
  
    const boardTitle = document.createElement("p");
    boardTitle.classList.add("board-title");
    boardTitle.textContent = board.title;
    boardTitle.addEventListener("click", () => board.onBoardTitleClick());
    boardContainer.appendChild(boardTitle);
  
    const tasksContainer = document.createElement("ul");
    tasksContainer.classList.add("tasks");
    boardContainer.appendChild(tasksContainer);
  
    board.tasks.forEach((task) => {
      const taskContainer = board.getTaskView(task);
      tasksContainer.appendChild(taskContainer);
    });
  
    const newTaskInput = document.createElement("input");
    newTaskInput.dataset.boardId = board.id;
    newTaskInput.classList.add("new-task-input");
    newTaskInput.type = "text";
    newTaskInput.placeholder = "Nova tarefa";
    newTaskInput.addEventListener("keypress", (e) => board.handleNewTaskInputKeypress(e));
    boardContainer.appendChild(newTaskInput);
  
    return boardContainer;
  }

  handleNewBoardInputKeypress(e) {
    if (e.key === "Enter") {
      this.onAddBoard(e.target.value);
      e.target.value = "";
    }
  }
}

const boardPessoal = {
  id: 1,
  title: "Title",
  tasks: [
    { id: 1, name: "tarefa 1", completed: false },
    { id: 2, name: "tarefa 2", completed: false },
    { id: 3, name: "tarefa 3", completed: true },
    { id: 4, name: "tarefa 4", completed: false },
    { id: 5, name: "tarefa 5", completed: true },
  ],
};

boardPessoal.tasks.forEach((task) => new Task(task.id, task.name, task.completed));

const board = new Board(boardPessoal.id, boardPessoal.title, boardPessoal.tasks);

const toDo = new ToDo([board]);

toDo.renderizarBoards();

const newBoardInput = document.querySelector(".new-board-input");
newBoardInput.addEventListener("keypress", (e) => toDo.handleNewBoardInputKeypress(e));
