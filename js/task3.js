(() => {
  "use strict";
  const form = document.querySelector("#characterForm");
  const fields = ["charName","charClass","strength","magic","agility","wisdom"];
  const skills = ["strength","magic","agility","wisdom"];
  const takenNames = ["admin","root","guest"];
  const errorSummary = document.querySelector("#formErrorSummary");
  const preview = document.querySelector("#characterPreview");
  const pointsCounter = document.querySelector("#pointsCounter");
  form.noValidate = true;
  function value(id) { return document.querySelector(`#${id}`).value.trim(); }
  function skillTotal() { let total=0; for (const id of skills) total += Number(value(id)); return total; }
  function validate(id) {
    const input = document.querySelector(`#${id}`); let error = "";
    if (id === "charName") {
      const name = value(id);
      if (name.length < 3 || name.length > 16) error = "Name must contain 3–16 characters.";
      else if (takenNames.includes(name.toLowerCase())) error = "This name is reserved. Choose another one.";
      else if (!/^[a-zA-Z0-9 ]+$/.test(name)) error = "Use letters, numbers and spaces only.";
    } else if (id === "charClass") {
      if (!value(id)) error = "Choose a character class.";
    } else if (skills.includes(id)) {
      const n = Number(value(id));
      if (value(id) === "" || !Number.isInteger(n) || n < 1 || n > 10) error = "Enter a whole number from 1 to 10.";
      else if (skillTotal() !== 20) error = `All four skills must total exactly 20 (current total: ${skillTotal()}).`;
      else if (value("charClass") === "Mage" && Number(value("magic")) < 5) error = "A Mage needs at least 5 Magic points.";
      else if (value("charClass") === "Warrior" && Number(value("strength")) < 5) error = "A Warrior needs at least 5 Strength points.";
      else if (value("charClass") === "Ranger" && Number(value("agility")) < 5) error = "A Ranger needs at least 5 Agility points.";
    }
    const errorNode = document.querySelector(`#${id}Error`);
    if (errorNode) errorNode.textContent = error;
    input.setAttribute("aria-invalid", String(Boolean(error)));
    return error;
  }
  function validateAll() { return fields.map(validate).filter(Boolean); }
  function updatePreview() {
    document.querySelector("#previewName").textContent = value("charName") || "Your hero";
    document.querySelector("#previewClass").textContent = value("charClass") || "Choose a class";
    preview.className = `preview-card ${value("charColor") || "violet"}`;
    const list = document.querySelector("#previewSkills"); list.replaceChildren();
    for (const id of skills) { const pill=document.createElement("div"); pill.className="skill-pill"; pill.textContent=`${id[0].toUpperCase()+id.slice(1)}: ${value(id) || "—"}`; list.append(pill); }
    const remaining = 20 - skillTotal();
    pointsCounter.textContent = `${remaining} point(s) left · ${skillTotal()} / 20 allocated`;
    pointsCounter.classList.toggle("error", remaining !== 0);
  }
  for (const id of fields) {
    const input = document.querySelector(`#${id}`);
    input.addEventListener("blur", () => { validate(id); updatePreview(); });
    input.addEventListener("input", () => { if (input.dataset.touched === "true") validate(id); updatePreview(); });
    input.addEventListener("change", () => { validate(id); updatePreview(); });
    input.addEventListener("blur", () => { input.dataset.touched = "true"; });
  }
  for (const id of ["charColor"]) document.querySelector(`#${id}`).addEventListener("change", updatePreview);
  form.addEventListener("submit", event => {
    event.preventDefault(); const errors = validateAll(); updatePreview();
    if (errors.length) {
      errorSummary.hidden = false; errorSummary.textContent = `Please fix ${errors.length} validation error(s) before creating your character.`;
      const first = fields.find(id => validate(id)); document.querySelector(`#${first}`).focus(); return;
    }
    errorSummary.hidden = true;
    const result = document.querySelector("#finalCharacter"); result.hidden = false; result.className = "final-result";
    result.textContent = `Character created: ${value("charName")} the ${value("charClass")}. Skill total: ${skillTotal()}/20.`;
    document.querySelector("#previewStatus").textContent = "Character created successfully!";
    document.querySelector("#previewStatus").className = "message success";
    form.reset(); updatePreview(); fields.forEach(id => { const input=document.querySelector(`#${id}`); input.removeAttribute("aria-invalid"); input.dataset.touched="false"; const e=document.querySelector(`#${id}Error`); if(e)e.textContent=""; });
  });
  form.addEventListener("reset", () => setTimeout(() => { errorSummary.hidden=true; document.querySelector("#finalCharacter").hidden=true; document.querySelector("#previewStatus").textContent="Complete the form to create your character."; fields.forEach(id=>{const input=document.querySelector(`#${id}`);input.removeAttribute("aria-invalid");input.dataset.touched="false";const e=document.querySelector(`#${id}Error`);if(e)e.textContent="";}); updatePreview(); },0));
  updatePreview();
})();