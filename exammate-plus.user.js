// ==UserScript==
// @name         exammate+
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  Exammate+
// @author       You
// @match        https://www.exam-mate.com/topicalpastpapers/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=exam-mate.com
// @downloadUrl //TODO: Add download URL
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    class Stats {
        constructor(stats, subject) {
          this.stats = stats || this.initStatsObject();
          this.subject = subject || {id: "00", name: "nosubject"};
    
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
                ? "You've solved no questions yet in " + this.subject.name + " wtf"
                : "You've solved " + String(total) + " questions!";
            statsContainer.appendChild(topicText);
    
    
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
        initStatsObject(subject) {
          const newStatsObj = {};
          const subjectId = String(subject.id);
          const subjectName = String(subject.name);
          newStatsObj["total"] = 0;
          newStatsObj[subjectId] = {};
          newStatsObj[subjectId]["name"] = subjectName;
          newStatsObj[subjectId]["total"] = 0;
          newStatsObj[subjectId]["topics"] = {}
          return newStatsObj;
        }
        _topicExists(topicName) {
            return this._getSubProp("topics")[topicName];
        }
        _createTopic(topicName) {
            this._getSubProp("topics")[topicName] = {"total":0};
            return this._getSubProp("topics")[topicName];
        }
        _createAndReturnTopicIfNotExists (topicName) {
            if (this._topicExists(topicName)){
                return _getSubProp("topics")[topicName];
            } else {
                return this._createTopic(topicName);
            }
        }
        _getSubProp(prop) {
            return this.stats[this.subject.id][prop];
        } 
        updateTopic(topicName, diff, QPAPERTYPE) {
            this.stats["total"] += diff;
            this._getSubProp("total") += diff;
            const topic = this._createAndReturnTopicIfNotExists(topicName);
            topic["total"] += diff;
            if (QPAPERTYPE) topic[QPAPERTYPE] += diff;
            setStorageItem(LOCALSTORAGEVALUES.stats, this.stats);
        }
        updateTopics(topics, diff, QPAPERTYPE) {
            this.stats["total"] += diff;
            this._getSubProp("total") += diff;
            for (const topicN of topics) {
                const topic = this._createAndReturnTopicIfNotExists(topicN);
                topic["total"] += diff;
                if (QPAPERTYPE) topic[QPAPERTYPE] += diff;
            }
        }
      }
      class Counter {
        constructor(initialCount) {
            this.count = initialCount || 0;
            this._createCounterElement();
        }
        _createCounterElement() {
            this.this.counterContainer = document.createElement("div");
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
            this.face.textContent = "☹️";
      
            this.counterContainer.addEventListener("click", () => {
              this.count = 0;
              setCountText(0);
              setStorageItem(
                LOCALSTORAGEVALUES.today_solved,
                JSON.stringify(this.count)
              );
            });
      
            this.counterContainer.appendChild(this.countText);
            this.counterContainer.appendChild(this.face);
            document.body.appendChild(this.counterContainer);
        }
        _updateFace(cnt) {
          let chosen_emoji = EMOJIS[0].emoji;
          for (const emoji_at_val of EMOJIS) {
            if (cnt >= emoji_at_val.at) {
              chosen_emoji = emoji_at_val.emoji;
              break;
            }
          }
          this.face.textContent = chosen_emoji;
        }
        _updateCountText() {
          this.countText.textContent = this.count + " 🔥";
          this._updateFace(this.count);
        }
        updateCount(diff){
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

    const niceAudio = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8c8a73467.mp3?filename=correct-2-46134.mp3"
    );
    const LOCALSTORAGEVALUES = {
      questions_solved: "solved",
      today_solved: "count",
      last_day_solved: "lastDay",
      stats: "stats",
    };
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
  
    let solved = getFromStorage(LOCALSTORAGEVALUES.questions_solved, []);
    let lastDay = getFromStorage(LOCALSTORAGEVALUES.last_day_solved, 0);
  
    const questions = document.getElementsByClassName("question");
    
    const subject = initSubject();
    
    // check if today is the last day i worked: if yes, if not then set timer to 0, save, and set today
    const today = getToday();
    
    // init stats array if not there
    const counter = new Counter(getFromStorage(LOCALSTORAGEVALUES.today_solved, 0));
    const stats = new Stats(getFromStorage(LOCALSTORAGEVALUES.stats, null), subject);
  
    //console.log(today, lastDay);
    if (!(today === lastDay)) {
      counter.resetCount();
      setStorageItem(LOCALSTORAGEVALUES.last_day_solved, today);
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
        setSolvedInput(solvedBtnFuncEl, !solvedBtnFuncEl.isSolved);
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
    function setSolvedInput(fncEl, val) {
      setSolved(fncEl, val)
      if (val === true) {
          solved.push(fncEl.getAttribute("id"));
          niceAudio.play();
          counter.updateCount(1);
          stats.updateTopics(fncEl.subjectTopics, 1);
        } else {
          solved.splice(solved.indexOf(fncEl.getAttribute("id")), 1);
          counter.updateCount(-1);
          stats.updateTopics(fncEl.subjectTopics, -1);
        }
  
        setStorageItem(LOCALSTORAGEVALUES.questions_solved, solved);
    }
  
    
  })();
  