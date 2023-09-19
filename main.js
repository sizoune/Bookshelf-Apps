const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    const isComplete = document.getElementById('inputBookIsComplete')

    isComplete.addEventListener("change", function() {
        const button = document.getElementById('bookSubmit');
        var span = button.querySelector("span");
        if (isComplete.checked) {
            span.innerText = 'Selesai dibaca';
        } else {
            span.innerText = 'Belum selesai dibaca';
        }
    });
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';
    
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';
    
    for (const bookItem of books) {
        const bookElement = makeBookshelf(bookItem);
        if (!bookItem.isCompleted)
            incompleteBookshelfList.append(bookElement);
        else
            completeBookshelfList.append(bookElement);
    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    
    const generatedID = generateBookId();
    const bookObject = generateBookObject(generatedID, title, author, year, isComplete);

    books.push(bookObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBookshelf(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = bookObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = bookObject.year;
    
    const actionContainer = document.createElement('div');
    actionContainer.classList.add('action');
    
    const greenButton = document.createElement('button');
    greenButton.classList.add('green');
    greenButton.innerText = getGreenButtonText(bookObject.isCompleted);

    const redButton = document.createElement('button');
    redButton.classList.add('red');
    redButton.innerText = 'Hapus buku';

    greenButton.addEventListener('click', function () {
        changeBookCompleteStat(bookObject.id, bookObject.isCompleted);
    });
    redButton.addEventListener('click', function () {
        removeBook(bookObject.id);
    });

    actionContainer.append(greenButton, redButton);
    
    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(textTitle, textAuthor, textYear, actionContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
    
    return container;
}

function getGreenButtonText(isCompleted){
    if (isCompleted) {
        return 'Belum selesai di Baca'
    } else {
        return 'Selesai dibaca'
    }
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function changeBookCompleteStat(bookId, isCompleted){
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;
    
    bookTarget.isCompleted = !isCompleted;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;
    
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function generateBookId() {
    return `book-${+new Date()}`;
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() /* boolean */ {
    if (typeof (Storage) === "undefined") {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    
    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}