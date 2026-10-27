(() => {
  "use strict";
  // Ten data objects; each has id, title, tag, priority and status.
  const tasks = [
    {id:1,title:"Plan the page layout",tag:"design",priority:"high",status:"todo"},
    {id:2,title:"Choose color palette",tag:"design",priority:"medium",status:"todo"},
    {id:3,title:"Write project copy",tag:"content",priority:"low",status:"todo"},
    {id:4,title:"Create header component",tag:"code",priority:"high",status:"progress"},
    {id:5,title:"Build responsive cards",tag:"code",priority:"high",status:"progress"},
    {id:6,title:"Add navigation links",tag:"code",priority:"medium",status:"progress"},
    {id:7,title:"Check form labels",tag:"test",priority:"medium",status:"done"},
    {id:8,title:"Test keyboard focus",tag:"test",priority:"high",status:"todo"},
    {id:9,title:"Review mobile layout",tag:"test",priority:"low",status:"done"},
    {id:10,title:"Polish empty states",tag:"design",priority:"medium",status:"todo"}
  ];
  const columns = [{id:"todo",label:"To do"},{id:"progress",label:"In progress"},{id:"done",label:"Done"}];
  const board = document.querySelector("#board"), filter = document.querySelector("#tagFilter"), sort = document.querySelector("#prioritySort");
  const message = document.querySelector("#boardMessage");
  const priorityRank = {high:0,medium:1,low:2};
  function render() {
    board.replaceChildren();
    let visible = tasks.filter(task => filter.value === "all" || task.tag === filter.value);
    if (sort.value === "high") visible.sort((a,b) => priorityRank[a.priority] - priorityRank[b.priority]);
    for (const columnData of columns) {
      const column = document.createElement("section"); column.className = "column"; column.dataset.status = columnData.id;
      const heading = document.createElement("h3"); heading.textContent = columnData.label;
      const count = document.createElement("span"); count.textContent = visible.filter(t => t.status === columnData.id).length; heading.append(count); column.append(heading);
      for (const task of visible.filter(t => t.status === columnData.id)) {
        const card = document.createElement("article"); card.className = "task-card"; card.dataset.id = task.id;
        const title = document.createElement("h4"); title.textContent = task.title;
        const tag = document.createElement("span"); tag.className = "tag"; tag.textContent = task.tag;
        const priority = document.createElement("p"); priority.className = "priority"; priority.textContent = `Priority: ${task.priority}`;
        const actions = document.createElement("div"); actions.className = "task-actions";
        const prev = document.createElement("button"); prev.type="button"; prev.dataset.move="-1"; prev.textContent="← Back"; prev.disabled = columnData.id === "todo";
        const next = document.createElement("button"); next.type="button"; next.dataset.move="1"; next.textContent="Move →"; next.disabled = columnData.id === "done";
        actions.append(prev,next); card.append(title,tag,priority,actions); column.append(card);
      }
      if (!visible.some(t => t.status === columnData.id)) { const empty=document.createElement("p"); empty.className="muted"; empty.textContent="No cards here."; column.append(empty); }
      board.append(column);
    }
    // Calculate completion using our own loop.
    let total=0, completed=0; for (const task of tasks) { total++; if(task.status === "done") completed++; }
    const percent = Math.round(completed / total * 100);
    document.querySelector("#progressText").textContent = `${percent}%`;
    document.querySelector("#progressFill").style.width = `${percent}%`;
    document.querySelector("#progressBar").setAttribute("aria-valuenow", String(percent));
    message.textContent = visible.length ? `${visible.length} task(s) shown. The In progress column is limited to 3 cards.` : "No tasks match this filter.";
    message.className = `message ${visible.length ? "" : "error"}`;
  }
  // One delegated listener handles every card button.
  board.addEventListener("click", event => {
    const button = event.target.closest("button[data-move]");
    if (!button) return;
    const card = button.closest("[data-id]"); const task = tasks.find(t => t.id === Number(card.dataset.id));
    const index = columns.findIndex(c => c.id === task.status); const target = columns[index + Number(button.dataset.move)];
    if (!target) return;
    if (target.id === "progress" && tasks.filter(t => t.status === "progress").length >= 3) {
      message.textContent = "Move blocked: In progress can contain at most 3 cards."; message.className = "message error"; return;
    }
    task.status = target.id; render();
  });
  filter.addEventListener("change",render); sort.addEventListener("change",render); render();
})();