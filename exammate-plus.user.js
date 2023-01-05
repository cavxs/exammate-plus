// ==UserScript==
// @name         exammate+
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Exammate+
// @author       You
// @match        https://www.exam-mate.com/topicalpastpapers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exam-mate.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const niceAudio = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=correct-2-46134.mp3"
  );

  const LOCALSTORAGEVALUES = {
    questions_solved: "solved",
    today_solved: "count",
    last_day_solved: "lastDay",
    stats: "stats",
  };

  let solved = getFromStorage(LOCALSTORAGEVALUES.questions_solved, []);
  let solvedCount = getFromStorage(LOCALSTORAGEVALUES.today_solved, 0);
  let lastDay = getFromStorage(LOCALSTORAGEVALUES.last_day_solved, 0);
  let stats = getFromStorage(LOCALSTORAGEVALUES.stats, {});

  const questions = document.getElementsByClassName("question");
  const sub_name = document.body
    .querySelector(".about-section .container h1")
    .textContent.split(" - ")[1];
  const subject = { id: getSubjectCode(), name: sub_name };
  const setCountText = createCounter();

  // check if today is the last day i worked: if yes, if not then set timer to 0, save, and set today
  const today = getToday();

  // init stats array if not there
  updateStats([], 0);
  createStats();

  //console.log(today, lastDay);
  if (!(today === lastDay)) {
    solvedCount = 0;
    setStorageItem(LOCALSTORAGEVALUES.today_solved, 0);
    setStorageItem(LOCALSTORAGEVALUES.last_day_solved, today);
  }

  function getSubjectCode() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const subject = urlParams.get("subject");
    return subject;
  }
  function getToday() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;
    return today;
  }
  function getFromStorage(val, def = null) {
    const lclStorageItem = localStorage.getItem(val);
    if (lclStorageItem) return JSON.parse(lclStorageItem);
    return def;
  }
  function setStorageItem(item, val) {
    localStorage.setItem(item, JSON.stringify(val));
  }
  for (const question of questions) {
    const tr = question.querySelector("table tr");
    const button_template = tr.querySelector("td");
    //console.log(button_template.querySelector("a").getAttribute("onClick").split(", '")[3].slice(0, -3));
    const topicsIncludedString = button_template
      .querySelector("a")
      .getAttribute("onClick")
      .split(", '")[3]
      .slice(0, -3);
    const topicsIncludedArr = topicsIncludedString.split(", ");
    const solvedBtn = button_template.cloneNode(true);
    const solvedBtnFuncEl = solvedBtn.querySelector("a");
    solvedBtnFuncEl.setAttribute("onClick", "");
    solvedBtnFuncEl.setAttribute("href", "#");
    solvedBtnFuncEl.setAttribute(
      "id",
      "s" + solvedBtnFuncEl.getAttribute("id").slice(1)
    );
    solvedBtnFuncEl.subjectTopics = topicsIncludedArr;

    tr.appendChild(solvedBtn);
    if (!solved.includes(solvedBtnFuncEl.getAttribute("id"))) {
      setSolved(solvedBtnFuncEl, false);
    } else {
      setSolved(solvedBtnFuncEl, true);
    }
    solvedBtnFuncEl.addEventListener("click", () => {
      setSolved(solvedBtnFuncEl, !solvedBtnFuncEl.isSolved, true);
    });
  }
  function updateStats(topics, diff) {
    console.log(topics);
    if (!stats["total"]) stats["total"] = 0;
    if (!stats[String(subject.id)]) stats[String(subject.id)] = {};
    if (!stats[String(subject.id)]["name"])
      stats[String(subject.id)]["name"] = subject.name;
    if (!stats[String(subject.id)]["total"])
      stats[String(subject.id)]["total"] = 0;
    //if (!stats[String(subject.id)]["topic"]) stats[String(subject.id)]["topic"] = {};
    //if (!stats[String(subject.id)]["topic"]["total"]) stats[String(subject.id)]["topic"]["total"] = 0;

    stats["total"] += diff;
    stats[String(subject.id)]["total"] += diff;
    for (const tp of topics) {
      if (!stats[String(subject.id)][tp]) {
        stats[String(subject.id)][tp] = { total: diff ? diff : 0 };
      } else {
        stats[String(subject.id)][tp]["total"] += diff;
      }
    }

    // save
    setStorageItem(LOCALSTORAGEVALUES.stats, stats);
  }
  function setSolved(fncEl, val, save = false) {
    fncEl.textContent = val ? "✔️" : "📝";
    fncEl.isSolved = val;
    if (save) {
      if (val === true) {
        solved.push(fncEl.getAttribute("id"));
        niceAudio.play();
        solvedCount++;
        updateStats(fncEl.subjectTopics, 1);
      } else {
        solved.splice(solved.indexOf(fncEl.getAttribute("id")), 1);
        solvedCount = Math.max(solvedCount - 1, 0);
        updateStats(fncEl.subjectTopics, -1);
      }
      setCountText(solvedCount);
      setStorageItem(LOCALSTORAGEVALUES.questions_solved, solved);
      setStorageItem(LOCALSTORAGEVALUES.today_solved, solvedCount);
    }
  }

  function createStats() {
    const statsContainer = document.createElement("div");
    statsContainer.style.width = "100%";
    statsContainer.style.padding = "0 50px";
    statsContainer.style.marginTop = "80px";

    const subjectName = document.createElement("h1");
    subjectName.style.width = "100%";
    subjectName.style.textAlign = "center";
    subjectName.style.fontSize = "45px";
    subjectName.style.fontFamily = "'Helvetica', sans-serif";
    subjectName.style.color = "rgb(233, 65, 59)";
    subjectName.style.fontWeight = "bold";
    subjectName.textContent = subject.name;
    statsContainer.appendChild(subjectName);

    for (const topic in stats[String(subject.id)]) {
      if (!(topic === "name") && !(topic === "total")) {
        const topicText = document.createElement("h2");
        const total = stats[String(subject.id)][topic]["total"];
        topicText.style.width = "100%";
        topicText.style.textAlign = "left";
        topicText.style.fontSize = "25px";
        topicText.style.fontWeight = "bold";
        topicText.style.marginTop = "50px";
        topicText.style.fontFamily = "'Helvetica', sans-serif";
        topicText.style.color = "#000";
        let stars = "";
        for (let x = total; x > 10; x -= 10) {
          stars = stars + "⭐";
        }
        const topicFormatted =
          topic[0].toUpperCase() + topic.substring(1).toLowerCase();
        topicText.textContent =
          topicFormatted + ": " + stars + " (" + String(total) + ")";
        statsContainer.appendChild(topicText);
      } else if (topic === "total") {
        const topicText = document.createElement("h2");
        const total = stats[String(subject.id)][topic];
        topicText.style.width = "100%";
        topicText.style.textAlign = "center";
        topicText.style.fontSize = "28px";
        topicText.style.fontWeight = "bold";
        topicText.style.fontFamily = "'Helvetica', sans-serif";
        topicText.style.color = "#000";

        topicText.textContent =
          total == 0
            ? "You've solved no questions yet in math wtf"
            : "You've solved " + String(total) + " questions!";
        statsContainer.appendChild(topicText);
      }
    }

    document.body
      .querySelector("#main-content")
      .insertBefore(
        statsContainer,
        document.body.querySelector(".recommended-links")
      );
  }
  function createFace() {
    const face = document.createElement("div");
    face.style.position = "fixed";
    face.style.left = "17px";
    face.style.top = "56px";
    face.style.width = "83px";
    face.style.fontSize = "30px";
    face.style.textAlign = "center";
    face.style.userSelect = "none";
    face.textContent = "☹️";
    document.body.appendChild(face);
    function updateFace(cnt) {
      console.log(cnt);
      if (cnt >= 1) {
        face.textContent = "☹️";
      }
      if (cnt >= 3) {
        face.textContent = "🙁";
      }
      if (cnt >= 5) {
        face.textContent = "😮";
      }
      if (cnt >= 8) {
        face.textContent = "🙂";
      }
      if (cnt >= 10) {
        face.textContent = "😄";
      }
      if (cnt >= 15) {
        face.textContent = "😂";
      }
      if (cnt >= 20) {
        face.textContent = "😍";
      }
      if (cnt >= 25) {
        face.textContent = "😱";
      }
      if (cnt >= 30) {
        face.textContent = "🥵";
      }
      if (cnt >= 35) {
        face.textContent = "😈";
      }
      if (cnt >= 40) {
        face.textContent = "🥶";
      }
      if (cnt >= 45) {
        face.textContent = "☠️";
      }
      if (cnt >= 50) {
        face.textContent = "🦸‍♀️";
      }
    }

    return updateFace;
  }
  function createCounter() {
    const counterContainer = document.createElement("div");
    counterContainer.style.position = "fixed";
    counterContainer.style.left = "17px";
    counterContainer.style.top = "13px";
    counterContainer.style.width = "83px";
    counterContainer.style.height = "38px";
    counterContainer.style.backgroundColor = "#fff";
    counterContainer.style.borderRadius = "16px";
    counterContainer.style.userSelect = "none";
    counterContainer.style.cursor = "pointer";
    counterContainer.style.border = "solid 2px rgb(233, 65, 59)";

    const count = document.createElement("p");
    count.style.width = "100%";
    count.style.height = "100%";
    count.style.fontSize = "25px";
    count.style.fontFamily = "'Helvetica', sans-serif";
    count.style.color = "#000";
    count.style.textAlign = "center";
    count.style.lineHeight = "37px";
    count.style.fontWeight = "bold";

    const updateFace = createFace();
    function setCountText(cnt) {
      count.textContent = cnt + " 🔥";
      updateFace(cnt);
    }

    counterContainer.addEventListener("click", () => {
      solvedCount = 0;
      setCountText(0);
      setStorageItem(
        LOCALSTORAGEVALUES.today_solved,
        JSON.stringify(solvedCount)
      );
    });
    setCountText(solvedCount);
    counterContainer.appendChild(count);

    document.body.appendChild(counterContainer);

    return setCountText;
  }
  // Your code here...
})();
