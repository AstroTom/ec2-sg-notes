
const mainLayout = '#aws-console-rootlayout';
const tableElem = '.LJG';
const selectedName = '.BMD .BLB';
const inboundTab = '.A1H.gwt-TabLayoutPanelContent';
const inboundTable = 'table.GEB';
const inboundRow = 'tbody tr';
const inboundRuleId = '.B3B .DRG';

const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const eventListenerSupported = window.addEventListener;

function observeDOM (obj, cb) {
  if (MutationObserver) {
    // define a new observer
    var obs = new MutationObserver(function (mutations, observer) {
      if (mutations[0].addedNodes.length || mutations[0].removedNodes.length) {
        cb();
      }
    });
    // have the observer observe foo for changes in children
    obs.observe(obj, { childList:true, subtree:true });
  }
  else if (eventListenerSupported) {
    obj.addEventListener('DOMNodeInserted', cb, false);
    obj.addEventListener('DOMNodeRemoved', cb, false);
  }
};

const body = document.getElementsByTagName("body")[0];
let attached = false;
observeDOM(body, function () {
  const table = document.querySelector(`${mainLayout} ${tableElem}`);
  if (!attached && table) {
    attached = true;
    setup()
  }
})

function setup() {

  // console.log(`Observing ${mainLayout} ${tableElem}, `, document.querySelectorAll(`${mainLayout} ${tableElem}`).length > 0)
  observeDOM(document.querySelectorAll(`${mainLayout} ${tableElem}`)[0], function () {
    const selected = document.querySelectorAll(`${mainLayout} ${selectedName}`)[0].textContent;
    const table = document.querySelector(`${mainLayout} ${inboundTab} ${inboundTable}`);

    const cells = table.querySelectorAll('td,th');
    for (let i = 0, n = cells.length; i < n; i++) {
      (function (cell) {
        cell.style.width = '20%';
      })(cells[i])
    }

    const heading = table.querySelector('thead tr');
    const notes = table.querySelector('thead tr th.notes');
    if (!notes) {
      const header = document.createElement('th');
      header.classList = 'notes';
      const headerDiv = document.createElement('div');
      headerDiv.textContent = 'Notes';
      header.append(headerDiv);
      heading.append(header);
    }

    const rows = table.querySelectorAll('tbody tr');
    for (let i = 0, n = rows.length; i < n; i++) {
      (function (row) {
        const src = row.querySelector(`${inboundRuleId}`);
        // console.log('src', src)
        if (!src) return;
        const id = src.textContent;
        if (!id) return;
        const td = document.createElement('td');
        const div = document.createElement('div');
        const input = document.createElement('input');
        const key = `${selected}||${id}`;
        input.placeholder = "Comment/Note";
        chrome.storage.sync.get(key, function (value) {
          if (value && value[key]) {
            input.value = value[key];
          }
          input.addEventListener('keyup', function () {
            const save = { [key]: input.value };
            chrome.storage.sync.set(save);
          })
          div.append(input);
          td.append(div);
          row.append(td);
        })
      })(rows[i])
    }

    // console.log(`CHANGED!!!`);
  })
}
