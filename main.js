class Table {
    constructor(data) {
        this._data = data;
    }

    get data() {
        return this._data;
    }

    set data(value) {
        this._data = value;
    }

    show() {
        document.getElementById("tab").style.display = "block";
    }
    createTable(json) {
        this.show();
        document.getElementById("tab").append(document.createElement('tbody'));
        let tbody = document.getElementsByTagName("tbody")[0];
        for (let key in json) {
            //создание массива фраз
            let memoArr = [];
            for (let k in json[key].memo) {
                memoArr[k] = json[key].memo[k];
            }
            let tr = document.createElement('tr');
            tr.innerHTML = `<td>${json[key].id}</td>
             <td>${json[key].name.first}</td>
             <td>${json[key].name.last}</td>
             <td>${json[key].gender}</td>
             <td>${memoArr.join('<br>')}</td>
             <td><img src="${json[key].img}"></td>`;
            tr.onclick = function() {
                let modal = new Modal(tr);
                modal.open(json[key].name.first, json[key].name.last, json[key].gender, memoArr);
                document.getElementById("edit_ok").onclick = modal.saveChanges.bind(modal);
            };
            tbody.append(tr);
        }
    }
}

   async function makeTable() {
    let response = await fetch('tableData.json');
    let json =  await response.json();
    let table = new Table(json);
    table.createTable(table.data);
}

function findByWord() {
    let enteredWord = document.getElementById("search").value;
    if (enteredWord.trim() === '') {
        return;
    }
    let table = document.getElementById("tab");
    let reg = new RegExp(enteredWord, 'i');
    let flag = false;
    for (let i = 1; i < table.rows.length; i++) {
        flag = false;
        for (let j = table.rows[i].cells.length - 1; j >= 0; j--) {
            flag = reg.test(table.rows[i].cells[j].innerHTML);
            if (flag) {
                table.rows[i].cells[j].style.backgroundColor = "yellow";
            } else {
                table.rows[i].cells[j].style.backgroundColor = "white";
            }
        }
    }
}

function setColumnInvisible(colNum, table) {
    let rowCells = table.rows[0].getElementsByTagName("th");
    rowCells[colNum].style.display = "none";
    for (let i = 1; i < table.rows.length; i++) {
        rowCells = table.rows[i].getElementsByTagName("td");
        rowCells[colNum].style.display = "none";
    }
}

function setColumnVisible(colNum, table) {
    let rowCells = table.rows[0].getElementsByTagName("th");
    rowCells[colNum].style.display = "";
    for (let i = 1; i < table.rows.length; i++) {
        rowCells = table.rows[i].getElementsByTagName("td");
        rowCells[colNum].style.display = "";
    }
}

function setAllColumnsVisibility() {
    let table = document.getElementById("tab");
    if (!document.getElementById("id").checked) {
        setColumnInvisible(0, table);
    } else {
        setColumnVisible(0, table);
    }
    if (!document.getElementById("first").checked) {
        setColumnInvisible(1, table);
    } else {
        setColumnVisible(1, table);
    }
    if (!document.getElementById("last").checked) {
       setColumnInvisible(2, table);
    } else {
        setColumnVisible(2, table);
    }
    if (!document.getElementById("gender").checked) {
        setColumnInvisible(3, table);
    } else {
        setColumnVisible(3, table);
    }
    if (!document.getElementById("memo").checked) {
        setColumnInvisible(4, table);
    } else {
        setColumnVisible(4, table);
    }
    if (!document.getElementById("img").checked) {
        setColumnInvisible(5, table);
    } else {
        setColumnVisible(5, table);
    }
}

class Modal {
    constructor(row) {
        this._tableRow = row;
    }

    get tableRow() {
        return this._tableRow;
    }

    open(first, last, gender, memo) {
        document.getElementById("modal").style.display = "block";
        document.getElementById("edit_name").value = first;
        document.getElementById("edit_surname").value = last;
        if (gender == "Male") {
            document.getElementById("male").checked = true;
        } else document.getElementById("female").checked = true;
        document.getElementById("edit_memo").value = memo.join('\n');
    }
    saveChanges() {
        let newName = document.getElementById("edit_name").value;
        let newSurname = document.getElementById("edit_surname").value;
        let gender;
        document.getElementById("male").checked ? gender = "Male" : gender = "Female";
        let memo = document.getElementById("edit_memo").value.split('\n');
        if (document.getElementById("hasPicture").checked) this.tableRow.cells[5].firstElementChild.style.display = "none";
        this.tableRow.cells[1].innerHTML = newName;
        this.tableRow.cells[2].innerHTML = newSurname;
        this.tableRow.cells[3].innerHTML = gender;
        this.tableRow.cells[4].innerHTML = memo.join('<br>');
        closeModal();
    }
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

