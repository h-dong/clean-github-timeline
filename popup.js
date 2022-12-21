const storageKey = 'cleanTimeline';

chrome.storage.local.get([storageKey]).then(({ cleanTimeline }) => {
  console.log('cleanTimeline', cleanTimeline);
  if (cleanTimeline === true) {
    renderToggle(true);
  } else if (cleanTimeline === false) {
    renderToggle(false);
  } else {
    toggle(true);
  }
});

document.getElementById('toggle-on').addEventListener('click', () => toggle(true));
document.getElementById('toggle-off').addEventListener('click', () => toggle(false));

function renderToggle(value) {
  if (value) {
    document.getElementById('toggle-on').classList = ['active'];
    document.getElementById('toggle-off').classList = [''];

    chrome.action.setIcon({
      path: {
        48: '/images/eye-closed-48.png',
        96: '/images/eye-closed-96.png',
        128: '/images/eye-closed-128.png',
      },
    });
  } else {
    document.getElementById('toggle-on').classList = [''];
    document.getElementById('toggle-off').classList = ['active'];

    chrome.action.setIcon({
      path: {
        48: '/images/eye-48.png',
        96: '/images/eye-96.png',
        128: '/images/eye-128.png',
      },
    });
  }
}

function toggle(value) {
  chrome.storage.local.set({ [storageKey]: value }).then(() => {
    renderToggle(value);
  });
}
