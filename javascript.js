
    let texts = [];

    // Load texts from local storage on page load
    window.onload = function() {
      if(localStorage.getItem('storedTexts')) {
        texts = JSON.parse(localStorage.getItem('storedTexts'));
        displayTexts();
      }
    };

    function addText() {
      const textInput = document.getElementById("textInput");
      const text = textInput.value;
      if (text !== "") {
        texts.push(text);
        saveToLocalStorage();
        displayTexts();
        textInput.value = "";
      }
    }

    function displayTexts() {
      const textList = document.getElementById("textList");
      textList.innerHTML = "";
      texts.forEach((text, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
          ${text}
          <button onclick="editText(${index})">Edit</button>
          <button onclick="deleteText(${index})">Delete</button>
          <input type="time" id="alarmTime${index}" onchange="setAlarm(${index}, this.value)">
        `;
        textList.appendChild(listItem);
      });
    }

    function editText(index) {
      const newText = prompt("Enter new text:");
      if (newText !== null) {
        texts[index] = newText;
        saveToLocalStorage();
        displayTexts();
      }
    }

    function deleteText(index) {
      texts.splice(index, 1);
      saveToLocalStorage();
      displayTexts();
    }

    function setAlarm(index, time) {
      const alarmTime = new Date();
      const currentHour = alarmTime.getHours();
      const currentMinute = alarmTime.getMinutes();
      const [hour, minute] = time.split(":");
      
      alarmTime.setHours(parseInt(hour));
      alarmTime.setMinutes(parseInt(minute));
      alarmTime.setSeconds(0);
      
      let timeDifference = alarmTime.getTime() - Date.now();
      if (timeDifference < 0) {
        timeDifference += 86400000; // set for next day if the time has already passed
      }
      
      const speech = new SpeechSynthesisUtterance(texts[index]);
      let repeatCount = 0;
      
      const interval = setInterval(() => {
        window.speechSynthesis.speak(speech);
        repeatCount++;
        
        if (repeatCount === 5) {
          clearInterval(interval);
        }
      }, timeDifference);
    }

    function saveToLocalStorage() {
      localStorage.setItem('storedTexts', JSON.stringify(texts));
    }

    displayTexts();
