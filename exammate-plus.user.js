// ==UserScript==
// @name         exammate+
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  Exammate+
// @author       cavxs
// @homepage     https://github.com/cavxs
// @match        https://www.exam-mate.com/topicalpastpapers*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exam-mate.com
// @resource style https://raw.githubusercontent.com/cavxs/exammate-plus/main/style.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(GM_getResourceText("style"));
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
    new Audio(
      "https://audio-previews.elements.envatousercontent.com/files/98129221/preview.mp3"
    ),
    new Audio(
      "https://audio-previews.elements.envatousercontent.com/files/294342990/preview.mp3"
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
      statsContainer.classList.add("statsContainer");

      const subjectName = document.createElement("h1");
      subjectName.classList.add("subjectName");
      statsContainer.appendChild(subjectName);

      const totalText = document.createElement("h2");
      totalText.classList.add("totalText");
      const total = this._getSubProp("total");

      totalText.textContent =
        total == 0
          ? "You've solved no questions yet in " + this.subject.name + " wtf"
          : "You've solved " + String(total) + " questions!";
      statsContainer.appendChild(totalText);

      for (const topic in this._getSubProp("topics")) {
        const topicText = document.createElement("h2");
        const total = this._getSubProp("topics")[topic]["total"];
        topicText.classList.add("topicText");
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
      this.counterContainer.classList.add("counterContainer");

      this.countText = document.createElement("p");
      this.countText.classList.add("countText");

      this.face = document.createElement("div");
      this.face.classList.add("face");

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
      if (this.face.textContent != chosen_emoji) {
        this.face.classList.remove("rotate");
        this.face.offsetWidth;
        this.face.classList.add("rotate");
        setTimeout(() => {
          this.face.textContent = chosen_emoji;
        }, 500);
      }
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
      this.motivatorContainerScreen.classList.add("motivatorContainerScreen");
      this.motivatorContainerScreen.classList.add("motivator");
      document.body.appendChild(this.motivatorContainerScreen);
    }
    show(msg) {
      this.motivatorContainerScreen.textContent = msg;
      this.motivatorContainerScreen.classList.add("shown");
      setTimeout(() => {
        this.motivatorContainerScreen.classList.remove("shown");
      }, 5000);
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
        } else {
          console.log("money has been tampered with.");
        }
      }
      this.securitySolveArray = [];
      this._cashConstant = {
        9709: [0.5, 0.5, 0.5, 0.6, 0.7],
        9700: [0.2, 0.5, 0.5, 0.6, 0.6],
        9701: [0.2, 0.5, 0.5, 0.6, 0.6],
        9702: [0.2, 0.5, 0.5, 0.6, 0.6],
      };
      this._createMoneyElement();
      this._timerInterval = null;
      this._timeLeft = 20;
      this._moneyJustAdded = 0;
      this._currentQ = "";
    }
    _createMoneyElement() {
      this.moneyContainer = document.createElement("div");
      this.moneyContainer.classList.add("counterContainer");
      this.moneyContainer.classList.add("money");

      this.moneyText = document.createElement("p");
      this.moneyText.classList.add("countText");

      this._updateMoneyText();

      this.moneyContainer.appendChild(this.moneyText);
      document.body.appendChild(this.moneyContainer);
    }
    _updateMoneyText() {
      this.moneyText.textContent = `₺${this.money_deserved.toFixed(2)}`;
    }
    /**
     *
     * @param {object} qtype this is the paper subject and the paper type, is it paper 1 or 2 or etc.. it will be considered when adding money
     */
    add(qtype, fncEl = null) {
      if (this._timeLeft > 0) return;

      const moneyToAdd = this._cashConstant[qtype.subject][qtype.paper - 1];
      this._moneyJustAdded = moneyToAdd * (fncEl?.isDouble ? 2 : 1);
      this.money_deserved += this._moneyJustAdded;

      if (fncEl) fncEl.isDouble = false;

      this.saveMoney();
    }
    remove() {
      if (this._timeLeft > 0) return;

      this.money_deserved -= this._moneyJustAdded;
      this.saveMoney();
    }
    saveMoney() {
      setStorageItem("m", mCipher(this.money_deserved.toString()));
      this._updateMoneyText();
    }

    timer_restart(qtype, qid) {
      if (this._currentQ != qid) {
        this._currentQ = qid;
        this._timeLeft =
          (this._cashConstant[qtype.subject][qtype.paper - 1] / 0.6) * 40;
        if (this._timerInterval) clearInterval(this._timerInterval);
        this._timerInterval = setInterval(() => {
          if (!document.hidden) {
            this._timeLeft--;
            if (this._timeLeft <= 0) return clearInterval(this._timerInterval);
          }
        }, 1000);
      }
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
    const allButtons = tr.querySelectorAll("td");
    const questionBtn = allButtons[0];
    const solvedBtnFuncEl = createSolvedButton(tr, questionBtn);

    if (!solved.includes(solvedBtnFuncEl.getAttribute("id"))) {
      setSolved(solvedBtnFuncEl, false, true);
    } else {
      setSolved(solvedBtnFuncEl, true, true);
    }
    const qInfo = getQuestionInfo(question);
    // the orange question button
    const questionBtnA = questionBtn.querySelector("a");
    questionBtnA.addEventListener("click", () => {
      money.timer_restart(qInfo, question.getAttribute("id"));
    });
    solvedBtnFuncEl.addEventListener("click", () => {
      setSolvedInput(
        solvedBtnFuncEl,
        !solvedBtnFuncEl.isSolved,
        onQuestion(allButtons),
        qInfo
      );
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

  function setSolved(fncEl, val, pgLoad = false) {
    fncEl.textContent = val ? "✔️" : "📝";
    fncEl.isSolved = val;
    if (!val && pgLoad) fncEl.isDouble = Math.random() < 0.3 ? true : false;
    if (fncEl.isDouble) fncEl.textContent += "💰";
  }
  /**
   * This function gives general information about the question
   * @param {HTML Element} questionHtml the html element of the question.
   * @returns {object} an object with 'subject' and 'paper' that represents the subject and the paper of the question
   */
  function getQuestionInfo(questionHtml) {
    const paperInfoText = questionHtml.firstElementChild.textContent
      .trim()
      .split(" ");
    return {
      subject: paperInfoText[0].substring(1, paperInfoText[0].length - 2),
      paper: Number(paperInfoText[2][0]),
    };
  }
  /**
   * gets if the user is on the question. i.e. they pressed the 'Question' or 'Answer' button and are looking at the question
   * @param {HTML element array} allButtons
   * @returns {boolean}
   */
  function onQuestion(allButtons) {
    const quesBtn = allButtons[0].querySelector("a");
    const ansBtn = allButtons[1].querySelector("a");

    return (
      quesBtn.getAttribute("style") ===
        "padding-top: 5px; background-color: rgb(233, 65, 59) !important; color: rgb(255, 255, 255) !important;" ||
      ansBtn.getAttribute("style") ===
        "padding-top: 5px; background-color: rgb(233, 65, 59) !important; color: rgb(255, 255, 255) !important;"
    );
  }
  function setSolvedInput(fncEl, val, onQues, qtype) {
    if (val) {
      solved.push(fncEl.getAttribute("id"));
      niceAudio.play();
      counter.updateCount(1);
      stats.updateTopics(fncEl.subjectTopics, 1);
      // if the question is selected
      if (onQues) {
        money.add(qtype, fncEl);
      }

      motivator.showRandom();
    } else {
      solved.splice(solved.indexOf(fncEl.getAttribute("id")), 1);
      counter.updateCount(-1);
      stats.updateTopics(fncEl.subjectTopics, -1);

      // if the question is selected
      if (onQues) {
        money.remove();
      }
    }
    setSolved(fncEl, val);
    setStorageItem(LOCALSTORAGEVALUES.questions_solved, solved);
  }
})();
