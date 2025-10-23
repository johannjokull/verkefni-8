
import { empty } from "./elements";

// Leyfilegt að breyta skilgreiningum á föllum og bæta við fleiri föllum.


/**
 * Breytir stöðu atriðis í lista. Ef kláruð atriði eru sýnd er það sýnt, annars er það falið um leið og það er klárað.
 * @param {HTMLElement} item
 * @param {boolean} isShown `true` ef kláruð atriði eru sýnileg, annars `false`.
 * @returns {void}
 */
export function toggleTodoItemStatus(item, isShown = true) {
  const checkbox = item.querySelector('input[name="finished"]');
  if (!checkbox) return;
  item.classList.toggle('finished', checkbox.checked);
  item.style.display = (checkbox.checked && !isShown) ? 'none' : '';
}

/** 
 * @param {HTMLElement} item
 * @returns {void}
*/
function removeTodoItem(item) {
  console.log('EYÐA', item);
  const spanEl = item.querySelector('span.item');

  let text = '<unknown item>';
  if (!spanEl) {
    console.warn('cannot find spanEl');
  } else {
    text = spanEl.textContent;
  }

  if (confirm(`Viltu eyða „${text}"?`)) {
    item.remove();
  }
}


/**
 * Breytir sýnileika kláraðra atriða í lista.
 * @param {HTMLElement} todolist
 * @return {boolean} `true` if finished items are shown, `false` if hidden
 */
export function toggleFinished(todolist) {
  const isShown = todolist.dataset.finished !== 'hidden';
  const showNext = !isShown;
  todolist.dataset.finished = showNext ? 'shown' : 'hidden';
  const finishedItems = todolist.querySelectorAll('.list li.finished');
  finishedItems.forEach((item) => {
    item.style.display = showNext ? '' : 'none';
  });
  const button = todolist.querySelector('.toggle-finished');
  if (button) {
    button.textContent = showNext ? 'Fela kláruð atriði' : 'Sýna kláruð atriði';
  }
  checkListState(todolist);
  return showNext;
}

/**
 * Hreinsar allan lista.
 * @param {HTMLElement} todolist
 * @return {void}
 */
export function clearList(todolist) {
  const list = todolist.querySelector('.list');
  empty(list);
  updateStats(todolist);
  checkListState(todolist);
}

/**
 * Uppfærir upplýsingar um fjölda kláraðra og ókláraðra atriða í lista.
 * @param {Element | null} todolist
 * @return {void}
 */
export function updateStats(todolist) {
  const finishedEl = todolist.querySelector('.stats .finished')
  const unfinishedEl = todolist.querySelector('.stats .unfinished')

  if(!finishedEl || !unfinishedEl) {
    console.warn('could not find finished/unfinished nodes');
    return
  }

  const allItems = todolist.querySelectorAll('.list li')
  const allFinishedItems = todolist.querySelectorAll('.list li.finished')

  if (!allItems || !allFinishedItems) {
    return
  }

  const finishedCount = allFinishedItems.length
  const unfinishedCount = allItems.length - finishedCount

  finishedEl.textContent = finishedCount.toString()
  unfinishedEl.textContent = unfinishedCount.toString()

}

/**
 * Býr til nýtt atriði í lista með texta `text`.
 * @param {HTMLElement} todolist
 * @param {string} text
 * @return {void}
 */
export function createTodoItem(todolist, text) {
  /*
  <li>
            <label>
              <input type="checkbox" name="finished" checked />
              <span class="item"
                >Dæmi um atriði með löngum texta og orði sem er mjög langt
                Vaðlaheiðarvegavinnuverkfærageymsluskúrslyklakippuhringurinn</span
              >
            </label>
            <button title="Fjarlægja atriði">🗑️</button>
          </li>
  */
  const li = document.createElement('li');

  const button = document.createElement('button');
  button.textContent = '🗑️'
  button.addEventListener('click', () => {
    removeTodoItem(li);
    updateStats(todolist);
    checkListState(todolist);
  });

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = 'finished';
  

  const span = document.createElement('span');
  span.classList.add('item')
  span.textContent = text;

  const label = document.createElement('label');

  label.appendChild(input);
  label.appendChild(span);
  li.appendChild(label);
  li.appendChild(button);

  const list = todolist.querySelector('.list');
  if (!list) {
  console.error('List element not found');
  return;
}
list.appendChild(li);

  toggleTodoItemStatus(li, todolist.dataset.finished !== 'hidden');
  updateStats(todolist);
  checkListState(todolist);

  input.addEventListener('change', () => {
    toggleTodoItemStatus(li, todolist.dataset.finished !== 'hidden');
    updateStats(todolist);
    checkListState(todolist);
});

}

/**
 * Athugar hvort listinn sé tómur og sýnir eða felur skilaboð um tóman lista.
 * @param {HTMLElement} todolist
 * @return {void}
 */
function checkListState(todolist) {
  const emptyElement = todolist.querySelector('.empty');
  if (!emptyElement) return;
  const hasItems = todolist.querySelector('.list li') !== null;
  emptyElement.classList.toggle('hidden', hasItems);
}
