const storageKey = "cleanTimeline";
const debug = false;
const parentElementSelector = "#discussion_bucket .js-discussion";
const eventItemSelector =
  ".js-discussion .js-timeline-item > .js-socket-channel";
let hideEvents;

// call function to remove ad when dom tree has been changed
const mutationObserver = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === "childList") init();
  });
});

// observe app dom tree changes
mutationObserver.observe(document.querySelector(parentElementSelector), {
  childList: true,
  subtree: true,
});

function init() {
  logger("EXTENSION INIT - Retrieving storage value");
  chrome.storage.local.get([storageKey]).then(({ cleanTimeline }) => {
    logger(`STORAGE VALUE: ${cleanTimeline}`);

    if (hideEvents === cleanTimeline && hideEvents !== undefined) return;

    logger(`PREPARE TO RENDER WITH cleanTimeline=${cleanTimeline}`);

    if (cleanTimeline === true) {
      hideEvents = true;
      handleTimeline();
    } else if (cleanTimeline === false) {
      hideEvents = false;
      handleTimeline();
    } else {
      chrome.storage.local.set({ [storageKey]: true }).then(() => {
        hideEvents = true;
        handleTimeline();
      });
    }
  });

  chrome.storage.onChanged.addListener((changes) => {
    logger("ON CHROME STORAGE CHANGE", { changes });
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key !== storageKey || oldValue === newValue) return;

      hideEvents = newValue;
      handleTimeline();
    }
  });
}

function handleTimeline() {
  logger(`handleTimeline() called with hideEvents=${hideEvents}`);
  if (hideEvents) {
    hideTimelineEvents();
  } else {
    showTimelineEvents();
  }
}

function hideTimelineEvents() {
  // find all Github PR events
  const eventItemsToRemove = document.querySelectorAll(eventItemSelector);

  // hide from the UI
  eventItemsToRemove.forEach((elem) => {
    elem.style.display = "none";
  });
}

function showTimelineEvents() {
  // find all Github PR events
  const eventItemsToRemove = document.querySelectorAll(eventItemSelector);

  // hide from the UI
  eventItemsToRemove.forEach((elem) => {
    elem.style.display = "";
  });
}

function logger() {
  if (debug) console.log(...arguments);
}
