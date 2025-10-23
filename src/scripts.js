
import { updateStats, createTodoItem, clearList, toggleFinished } from "./lib/todo";
/**
 * @param {HTMLElement} todolist
 */
function initialize(todolist) {
  const form = todolist.querySelector('.form');
  const input = todolist.querySelector('#string');
  const toggleButton = todolist.querySelector('.toggle-finished');
  const clearButton = todolist.querySelector('.clear-all');

    if(!form || !input) {
    console.error('form eða input fannst ekki, hætti');
    return;
  }
  if (!('finished' in todolist.dataset)) todolist.dataset.finished = 'shown';

  const listEl = todolist.querySelector('.list');
  if (listEl) {
    listEl.querySelectorAll('li').forEach((li) => {
      const checkbox = li.querySelector('input[name="finished"]');
    if (!checkbox) return;

    li.classList.toggle('finished', checkbox.checked);
    if (checkbox.checked && todolist.dataset.finished === 'hidden') {
      li.style.display = 'none';
    }
    checkbox.addEventListener('change', () => {
      toggleTodoItemStatus(li, todolist.dataset.finished !== 'hidden');
      updateStats(todolist);
      checkListState(todolist);
    });
  });
}

  if (toggleButton) {
    const finishedShown = todolist.dataset.finished !== 'hidden';
    toggleButton.textContent = finishedShown ? 'Fela kláruð atriði': 'Sýna kláruð atriði';
    toggleButton.addEventListener('click', () => {
      toggleFinished(todolist);
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', () => {
      clearList(todolist);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value.length === 0) return;

    createTodoItem(todolist, value);
    updateStats(todolist);

    input.value = '';
    input.focus();
  });
  
  

  if(todolist.dataset.finished === "hidden") {
    todolist.querySelectorAll(".list li.finished").forEach((li) => (li.style.display = "none"));
  }

  }



// Finnum todo lista og keyrum fall sem setur allt upp
const todolist = document.querySelector(".todo-list");

// Viljum vera viss um að todoList hafi fundist og sé HTMLElement
if (todolist && todolist instanceof HTMLElement) {
  initialize(todolist);
} else {
  console.error("no todo list found");
}

