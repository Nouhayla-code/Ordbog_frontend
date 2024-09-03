"use strict";

import { getEntryAt, getSizes } from "./rest.js";

window.addEventListener("load", initApp);

let endTime;
let startTime;
let count = 0;

async function initApp() {
  document.querySelector("form");
  document.addEventListener("submit", receiveInput);
}
async function binarySearch(searchTerm) {
  const values = await getSizes();

  let min = values.min;

  let max = values.max;

  console.log(values);

  while (min <= max) {
    count++;
    let middle = Math.floor((max + min) / 2);
    const entry = await getEntryAt(middle);

    const comp = searchTerm.localeCompare(entry.inflected);
    if (comp === 0) {
      console.log("count: " + count);
      return entry;
    } else if (comp > 0) {
      min = middle + 1;
      console.log("min: " + min, "max: " + max);
    } else if (comp < 0) {
      max = middle - 1;
      console.log("min: " + min, "max: " + max);
    }
    console.log(comp);
    console.log(searchTerm);
    console.log(entry.inflected);
  }

  console.log("count: " + count);

  return -1;
}

function compare(x, y) {
  return x - y;
}

function stringCompare(a, b) {
  return a.localeCompare(b);
}

function nameCompare(a, b) {
  return a.name.localeCompare(b.name);
}
function receiveInput(e) {
  e.preventDefault();

  const form = e.target;
  const input = form.input.value;
  console.log(input);
  displayOutput(input);
  startTime = performance.now();
}

async function displayOutput(input) {
  const entry = await binarySearch(input);

  document.querySelector("#output").innerHTML = "";
  endTime = performance.now();
  if (entry === -1) {
    document.querySelector("#output").insertAdjacentHTML(
      "beforeend",
      /* HTMl*/ `  
           <p> Ordet  findes ikke i ordbogen </p>
            <p> Server request ${count}</p>
            <p>Request Tid: ${(endTime - startTime).toFixed(2)} ms</p>
                `
    );

    count = 0;
  } else {
    document.querySelector("#output").insertAdjacentHTML(
      "beforeend",
      /* HTMl*/ `  
            <p> Server request ${count}</p>
            <p> Bøjningsform ${entry.inflected}</p>
            <p> Opslagsord ${entry.headword}</p>
            <p> Ordklasse ${entry.partofspeech}</p>
            <p> Id ${entry.id}</p>
            <p>Request Tid: ${(endTime - startTime).toFixed(2)} ms</p>
                `
    );

    count = 0;
  }
}
