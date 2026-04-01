class Todo {
  constructor() {
    this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    this.term = "";

    this.list = document.getElementById("todoList");
    this.text = document.getElementById("taskInput");
    this.date = document.getElementById("dateInput");
    this.search = document.getElementById("searchInput");

    document.getElementById("addButton").onclick = () => this.addFromInputs();
    this.search.oninput = e => {
      this.term = e.target.value.toLowerCase();
      this.draw();
    };

    this.draw();
  }

  save() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  validate(text, date) {
    if (text.length < 3 || text.length > 255) return false;
    if (date && new Date(date) <= new Date()) return false;
    return true;
  }

  addFromInputs() {
    const t = this.text.value.trim();
    const d = this.date.value;

    if (!this.validate(t, d)) return alert("Błąd danych");

    this.tasks.push({ id: Date.now(), text: t, date: d });
    this.text.value = "";
    this.date.value = "";

    this.save();
    this.draw();
  }

  delete(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.save();
    this.draw();
  }

  edit(id, text, date) {
    if (!this.validate(text, date)) return;

    const t = this.tasks.find(t => t.id === id);
    t.text = text;
    t.date = date;

    this.save();
    this.draw();
  }

  get filtered() {
    return this.term.length < 2
      ? this.tasks
      : this.tasks.filter(t =>
        t.text.toLowerCase().includes(this.term)
      );
  }

  highlight(text) {
    if (this.term.length < 2) return text;
    return text.replace(
      new RegExp(this.term, "gi"),
      m => `<mark>${m}</mark>`
    );
  }

  draw() {
    this.list.innerHTML = "";

    this.filtered.forEach(task => {
      const div = document.createElement("div");
      div.className = "todo-item";

      const content = document.createElement("div");
      content.className = "todo-content";
      content.innerHTML = `
        ${this.highlight(task.text)}
        ${task.date ? `<span class="todo-date">${task.date}</span>` : ""}
      `;

      content.onclick = () => this.startEdit(task);

      const del = document.createElement("button");
      del.textContent = "Usuń";
      del.className = "delete-btn";
      del.onclick = () => this.delete(task.id);

      div.append(content, del);
      this.list.appendChild(div);
    });
  }

  startEdit(task) {
    this.list.innerHTML = "";

    this.filtered.forEach(t => {
      const div = document.createElement("div");
      div.className = "todo-item";

      if (t.id === task.id) {
        const text = document.createElement("input");
        text.value = t.text;

        const date = document.createElement("input");
        date.type = "datetime-local";
        date.value = t.date;

        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Zapisz";

        saveBtn.onclick = () => {
          this.edit(t.id, text.value, date.value);
        };

        div.append(text, date, saveBtn);
      } else {
        const c = document.createElement("div");
        c.className = "todo-content";
        c.innerHTML = this.highlight(t.text);
        c.onclick = () => this.startEdit(t);

        div.appendChild(c);
      }

      const del = document.createElement("button");
      del.textContent = "Usuń";
      del.onclick = () => this.delete(t.id);

      div.appendChild(del);
      this.list.appendChild(div);
    });
  }
}

document.todo = new Todo();
