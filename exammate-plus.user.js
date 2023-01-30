// ==UserScript==
// @name         exammate+
// @namespace    http://tampermonkey.net/
// @version      1.6.1
// @description  Exammate+
// @author       cavxs
// @homepage     https://github.com/cavxs
// @match        https://www.exam-mate.com/topicalpastpapers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exam-mate.com
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const niceAudio = new Audio(
    "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=correct-2-46134.mp3"
  );
  const mCipher = cipher("money4ever");
  const mDecipher = decipher("money4ever");
  const wows = [
    new Audio(
      "https://cdn.pixabay.com/download/audio/2021/08/04/audio_0625c1539c.mp3?filename=success-1-6297.mp3"
    ),
    new Audio(
      "https://dm0qx8t0i9gc9.cloudfront.net/previews/audio/BsTwCwBHBjzwub4i4/audioblocks-positive-game-hit-magic-poof-spell-gameplay-2_SWXltuQFPL_NWM.mp3"
    ),
  ];
  const EMOJIS = [
    {
      emoji: "☹️",
      at: 1,
    },
    {
      emoji: "🙁",
      at: 3,
    },
    {
      emoji: "😮",
      at: 5,
    },
    {
      emoji: "🙂",
      at: 8,
    },
    {
      emoji: "😄",
      at: 10,
    },
    {
      emoji: "😂",
      at: 15,
    },
    {
      emoji: "😍",
      at: 20,
    },
    {
      emoji: "😱",
      at: 25,
    },
    {
      emoji: "🥵",
      at: 30,
    },
    {
      emoji: "😈",
      at: 35,
    },
    {
      emoji: "🥶",
      at: 40,
    },
    {
      emoji: "☠️",
      at: 45,
    },
    {
      emoji: "🦸‍♀️",
      at: 50,
    },
  ];
  const MOTIVATIONAL_MESSAGES = [
    "You're mastering the concepts and excelling in A Level questions!",
    "Great job, your understanding of A Level material is evident!",
    "You're making impressive strides in A Level!",
    "Keep up the fantastic work, you're well on your way to A Level success!",
    "Your ability to tackle the questions with confidence is inspiring!",
    "Your dedication to A Level studies is paying off, keep it up!",
    "You're showing excellent problem-solving skills in A Level questions!",
    "Keep pushing your limits in these questions, the results will speak for themselves!",
    "You're expanding your knowledge and reaching new heights!",
    "You're showing exceptional abilities in these questions, keep reaching for the stars!",
  ];
  class Stats {
    constructor(stats, subject) {
      this.subject = subject || { id: "00", name: "nosubject" };
      this.stats = this.initStatsObject(stats);

      this.createStatsElement();
    }
    createStatsElement() {
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
      subjectName.textContent = this.subject.name;
      statsContainer.appendChild(subjectName);

      const totalText = document.createElement("h2");
      const total = this._getSubProp("total");
      totalText.style.width = "100%";
      totalText.style.textAlign = "center";
      totalText.style.fontSize = "28px";
      totalText.style.fontWeight = "bold";
      totalText.style.fontFamily = "'Helvetica', sans-serif";
      totalText.style.color = "#000";

      totalText.textContent =
        total == 0
          ? "You've solved no questions yet in " + this.subject.name + " wtf"
          : "You've solved " + String(total) + " questions!";
      statsContainer.appendChild(totalText);

      for (const topic in this._getSubProp("topics")) {
        const topicText = document.createElement("h2");
        const total = this._getSubProp("topics")[topic]["total"];
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
      }

      document.body
        .querySelector("#main-content")
        .insertBefore(
          statsContainer,
          document.body.querySelector(".recommended-links")
        );
    }
    setSubject(id, name) {
      this.subject.id = String(id);
      this.subject.name = String(name);
    }
    initStatsObject(stats) {
      let newStatsObj = stats ? { ...stats } : {};
      if (!newStatsObj["total"]) newStatsObj["total"] = 0;
      if (!newStatsObj[this.subject.id]) newStatsObj[this.subject.id] = {};
      if (!newStatsObj[this.subject.id]["name"])
        newStatsObj[this.subject.id]["name"] = this.subject.name;
      if (!newStatsObj[this.subject.id]["total"])
        newStatsObj[this.subject.id]["total"] = 0;
      if (!newStatsObj[this.subject.id]["topics"])
        newStatsObj[this.subject.id]["topics"] = {};

      // update old version table
      for (const s in newStatsObj) {
        for (const o in newStatsObj[s]) {
          if (o !== "total" && o !== "name" && o !== "topics") {
            console.log(o);
            if (!newStatsObj[s]["topics"]) newStatsObj[s]["topics"] = {};
            newStatsObj[s]["topics"][o] = { ...newStatsObj[s][o] };
            delete newStatsObj[s][o];
          }
        }
      }

      setStorageItem(LOCALSTORAGEVALUES.stats, newStatsObj);

      return newStatsObj;
    }
    _topicExists(topicName) {
      return this._getSubProp("topics")[topicName];
    }
    _createTopic(topicName) {
      this._getSubProp("topics")[topicName] = { total: 0 };
      return this._getSubProp("topics")[topicName];
    }
    _createAndReturnTopicIfNotExists(topicName) {
      if (this._topicExists(topicName)) {
        return this._getSubProp("topics")[topicName];
      } else {
        return this._createTopic(topicName);
      }
    }
    _getSubProp(prop) {
      return this.stats[this.subject.id][prop];
    }
    updateTopic(topicName, diff, QPAPERTYPE) {
      this.stats["total"] += diff;
      this.stats[this.subject.id]["total"] += diff;
      const topic = this._createAndReturnTopicIfNotExists(topicName);
      topic["total"] += diff;
      if (QPAPERTYPE) topic[QPAPERTYPE] += diff;
      setStorageItem(LOCALSTORAGEVALUES.stats, this.stats);
    }
    updateTopics(topics, diff, QPAPERTYPE) {
      this.stats["total"] += diff;
      this.stats[this.subject.id]["total"] += diff;
      for (const topicN of topics) {
        const topic = this._createAndReturnTopicIfNotExists(topicN);
        topic["total"] += diff;
        if (QPAPERTYPE) topic[QPAPERTYPE] += diff;
      }
      setStorageItem(LOCALSTORAGEVALUES.stats, this.stats);
    }
  }
  class Counter {
    constructor(initialCount) {
      this.count = initialCount || 0;
      this._createCounterElement();
    }
    _createCounterElement() {
      this.counterContainer = document.createElement("div");
      this.counterContainer.style.position = "fixed";
      this.counterContainer.style.left = "17px";
      this.counterContainer.style.top = "13px";
      this.counterContainer.style.width = "83px";
      this.counterContainer.style.height = "38px";
      this.counterContainer.style.backgroundColor = "#fff";
      this.counterContainer.style.borderRadius = "16px";
      this.counterContainer.style.userSelect = "none";
      this.counterContainer.style.cursor = "pointer";
      this.counterContainer.style.border = "solid 2px rgb(233, 65, 59)";

      this.countText = document.createElement("p");
      this.countText.style.width = "100%";
      this.countText.style.height = "100%";
      this.countText.style.fontSize = "25px";
      this.countText.style.fontFamily = "'Helvetica', sans-serif";
      this.countText.style.color = "#000";
      this.countText.style.textAlign = "center";
      this.countText.style.lineHeight = "37px";
      this.countText.style.fontWeight = "bold";

      this.face = document.createElement("div");
      this.face.style.position = "fixed";
      this.face.style.left = "17px";
      this.face.style.top = "56px";
      this.face.style.width = "83px";
      this.face.style.fontSize = "30px";
      this.face.style.textAlign = "center";
      this.face.style.userSelect = "none";

      this.counterContainer.addEventListener("click", () => {
        this.count = 0;
        this._updateCountText();
        setStorageItem(
          LOCALSTORAGEVALUES.today_solved,
          JSON.stringify(this.count)
        );
      });

      this._updateCountText();

      this.counterContainer.appendChild(this.countText);
      this.counterContainer.appendChild(this.face);
      document.body.appendChild(this.counterContainer);
    }
    _updateFace(cnt) {
      let chosen_emoji = EMOJIS[0].emoji;
      for (const emoji_at_val of EMOJIS) {
        if (cnt < emoji_at_val.at) break;
        chosen_emoji = emoji_at_val.emoji;
      }
      this.face.textContent = chosen_emoji;
    }
    _updateCountText() {
      this.countText.textContent = this.count + " 🔥";
      this._updateFace(this.count);
    }
    updateCount(diff) {
      this.count += diff;
      if (this.count < 0) this.count = 0;
      setStorageItem(LOCALSTORAGEVALUES.today_solved, this.count);
      this._updateCountText();
    }
    resetCount() {
      this.count = 0;
      setStorageItem(LOCALSTORAGEVALUES.today_solved, 0);
      this._updateCountText();
    }
  }
  class MotivatorMessages {
    constructor() {
      this.motivatorContainerScreen = document.createElement("div");
      this.motivatorContainerScreen.style.display = "flex";
      this.motivatorContainerScreen.style.alignItems = "center";
      this.motivatorContainerScreen.style.justifyContent = "center";
      this.motivatorContainerScreen.style.position = "absolute";
      this.motivatorContainerScreen.style.backgroundColor =
        "rgba(0, 0, 0, 0.5)";
      this.motivatorContainerScreen.style.width = "100%";
      this.motivatorContainerScreen.style.height = "100%";
      this.motivatorContainerScreen.style.top = "0";
      this.motivatorContainerScreen.style.left = "0";
      this.motivatorContainerScreen.style.pointerEvents = "none";
      this.motivatorContainerScreen.style.textAlign = "center";
      this.motivatorContainerScreen.style.color = "#ff0000";
      this.motivatorContainerScreen.style.fontSize = "80px";
      this.motivatorContainerScreen.style.fontWeight = "bolder";
      this.motivatorContainerScreen.style.fontFamily =
        "'Helvetica', sans-serif";
      this.motivatorContainerScreen.classList.add("motivator");
      const styles = `
   .motivator {
   transition: 0.5s all;
   opacity: 0;
   }
  .motivator.showm {
  transition: 0.2s all;
  opacity: 1;
  }
`;
      var styleSheet = document.createElement("style");
      styleSheet.innerText = styles;

      document.head.appendChild(styleSheet);
      document.body.appendChild(this.motivatorContainerScreen);
    }
    show(msg) {
      this.motivatorContainerScreen.textContent = msg;
      this.motivatorContainerScreen.classList.add("showm");
      setTimeout(() => {
        this.motivatorContainerScreen.classList.remove("showm");
      }, 3000);
      wows[Math.floor(Math.random() * wows.length)].play();
    }
    showRandom() {
      const showOrNotArr = [0, 0, 0, 1];
      const showOrNot =
        showOrNotArr[Math.floor(Math.random() * showOrNotArr.length)];
      const message =
        MOTIVATIONAL_MESSAGES[
          Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)
        ];
      if (showOrNot) this.show(message);
    }
  }
  class Money {
    constructor(o_m) {
      this.money_deserved = 0;
      if (!(o_m === 0)) {
        const decipheredM = mDecipher(o_m);
        if (!isNaN(decipheredM) && !isNaN(parseFloat(decipheredM))) {
          this.money_deserved = Number(decipheredM);
          console.log("loaded money");
        } else {
          console.log("money has been tampered with.");
        }
      }
      this.securitySolveArray = [];
      this._cashConstant = 0.75;
      this._createCounterElement();
      this._timerInterval = null;
      this._timeLeft = 30;
    }
    _createCounterElement() {
      this.counterContainer = document.createElement("div");
      this.counterContainer.style.position = "fixed";
      this.counterContainer.style.left = "17px";
      this.counterContainer.style.top = "100px";
      this.counterContainer.style.width = "83px";
      this.counterContainer.style.height = "38px";
      this.counterContainer.style.backgroundColor = "transparent";
      this.counterContainer.style.userSelect = "none";
      this.counterContainer.style.cursor = "pointer";

      this.countText = document.createElement("p");
      this.countText.style.width = "100%";
      this.countText.style.height = "100%";
      this.countText.style.fontSize = "25px";
      this.countText.style.fontFamily = "'Helvetica', sans-serif";
      this.countText.style.color = "#000";
      this.countText.style.textAlign = "center";
      this.countText.style.lineHeight = "37px";
      this.countText.style.fontWeight = "bold";

      this._updateMoneyText();

      this.counterContainer.appendChild(this.countText);
      document.body.appendChild(this.counterContainer);
    }
    _updateMoneyText() {
      this.countText.textContent = "₺" + this.money_deserved.toFixed(2);
    }
    add(q_name) {
      console.log(this._timeLeft);
      if (this._timeLeft <= 0) {
        this.money_deserved += this._cashConstant;
        setStorageItem("m", mCipher(this.money_deserved.toString()));
        this._updateMoneyText();
      }
    }

    remove(q_name) {
      if (this._timeLeft <= 0) {
        this.money_deserved -= this._cashConstant;
        setStorageItem("m", mCipher(this.money_deserved.toString()));
        this._updateMoneyText();
      }
    }

    timer_restart() {
      console.log("restarting timer");
      this._timeLeft = 30;
      if (this._timerInterval) clearInterval(this._timerInterval);
      this._timerInterval = setInterval(() => {
        this._timeLeft--;
        console.log(this._timeLeft);
        if (this._timeLeft <= 0) return clearInterval(this._timerInterval);
      }, 1000);
    }
  }
  const LOCALSTORAGEVALUES = {
    questions_solved: "solved",
    today_solved: "count",
    last_day_solved: "lastDay",
    stats: "stats",
  };
  function cipher(salt) {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);

    return (text) =>
      text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
  }

  function decipher(salt) {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) =>
      textToChars(salt).reduce((a, b) => a ^ b, code);
    return (encoded) =>
      encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
  }

  let solved = getFromStorage(LOCALSTORAGEVALUES.questions_solved, []);
  let lastDay = getFromStorage(LOCALSTORAGEVALUES.last_day_solved, 0);

  const questions = document.getElementsByClassName("question");

  const subject = initSubject();

  // check if today is the last day i worked: if yes, if not then set timer to 0, save, and set today
  const today = getToday();

  // init stats array if not there
  const counter = new Counter(
    getFromStorage(LOCALSTORAGEVALUES.today_solved, 0)
  );
  const stats = new Stats(
    getFromStorage(LOCALSTORAGEVALUES.stats, null),
    subject
  );
  const money = new Money(getFromStorage("m", 0));
  const motivator = new MotivatorMessages();

  //console.log(today, lastDay);
  if (!(today === lastDay)) {
    counter.resetCount();
    setStorageItem(LOCALSTORAGEVALUES.last_day_solved, today);
  }

  const createSolvedButton = (tr, buttonTemplate) => {
    const topicsIncludedString = buttonTemplate
      .querySelector("a")
      .getAttribute("onClick")
      .split(", '")[3]
      .slice(0, -3);
    const topicsIncludedArr = topicsIncludedString.split(", ");
    const solvedBtn = buttonTemplate.cloneNode(true);
    const solvedBtnFuncEl = solvedBtn.querySelector("a");
    solvedBtnFuncEl.setAttribute("onClick", "");
    solvedBtnFuncEl.setAttribute("href", "#");
    solvedBtnFuncEl.setAttribute(
      "id",
      "s" + solvedBtnFuncEl.getAttribute("id").slice(1)
    );
    solvedBtnFuncEl.subjectTopics = topicsIncludedArr;
    tr.appendChild(solvedBtn);
    return solvedBtnFuncEl;
  };
  for (const question of questions) {
    const tr = question.querySelector("table tr");
    const buttonTemplate = tr.querySelector("td");
    const solvedBtnFuncEl = createSolvedButton(tr, buttonTemplate);

    if (!solved.includes(solvedBtnFuncEl.getAttribute("id"))) {
      setSolved(solvedBtnFuncEl, false);
    } else {
      setSolved(solvedBtnFuncEl, true);
    }
    // the orange question button
    const questionBtn = buttonTemplate.querySelector("a");
    questionBtn.addEventListener("click", () => {
      money.timer_restart();
    });
    solvedBtnFuncEl.addEventListener("click", () => {
      setSolvedInput(solvedBtnFuncEl, !solvedBtnFuncEl.isSolved, questionBtn);
    });
  }

  function initSubject() {
    const newSubObj = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    newSubObj["id"] = urlParams.get("subject");
    newSubObj["name"] = document.body
      .querySelector(".about-section .container h1")
      .textContent.split(" - ")[1];

    return newSubObj;
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

  function setSolved(fncEl, val) {
    fncEl.textContent = val ? "✔️" : "📝";
    fncEl.isSolved = val;
  }
  function setSolvedInput(fncEl, val, btntmp) {
    setSolved(fncEl, val);
    if (val === true) {
      solved.push(fncEl.getAttribute("id"));
      niceAudio.play();
      counter.updateCount(1);
      stats.updateTopics(fncEl.subjectTopics, 1);
      console.log(btntmp.getAttribute("style"));
      // if the question is selected
      if (
        btntmp.getAttribute("style") ==
        "padding-top: 5px; background-color: rgb(233, 65, 59) !important; color: rgb(255, 255, 255) !important;"
      ) {
        money.add();
        money.timer_restart();
      }

      motivator.showRandom();
    } else {
      solved.splice(solved.indexOf(fncEl.getAttribute("id")), 1);
      counter.updateCount(-1);
      stats.updateTopics(fncEl.subjectTopics, -1);

      // if the question is selected
      if (
        btntmp.getAttribute("style") ==
        "padding-top: 5px; background-color: rgb(233, 65, 59) !important; color: rgb(255, 255, 255) !important;"
      ) {
        money.remove();
      }
    }

    setStorageItem(LOCALSTORAGEVALUES.questions_solved, solved);
  }
})();
