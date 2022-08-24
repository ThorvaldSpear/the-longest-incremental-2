// BIG QUESTION: how should we decide on updating DOM?
// this is not util stuff smh

/**
 * Cache for DOM elements.
 * @type {Map<string, HTMLElement>}
 */
const cache = new Map();

/**
 * Gets the element with specific id from the cache and sets it if it isn't cached yet.
 * @param {string} id id of the element to get.
 */
export function getElement(id) {
  if (!cache.has(id)) {
    cache.set(id, document.getElementById(id));
  }
  return cache.get(id);
}

/**
 * sets innerHTML to given text of element with given id.
 * @param {string} id id of the element.
 * @param {string} text the HTML to insert.
 */
export function editHTML(id, text) {
  getElement(id).innerHTML = text;
}

function traverseNodes(nodeList, callback) {
  for (const element of nodeList) {
    if (element.children && element.children.length > 0)
      traverseNodes(element.children, callback);
    callback(element);
  }
}
const clickAccess = {};
// well we finally have the ability to do anything
// LMAO and that was cause i prefer doing technical stuff over real things
function fixNodes(mutation) {
  traverseNodes(mutation, (ele) => {
    const val = ele.getAttribute("onclick");
    if (val !== null) {
      ele.removeAttribute("onclick");
      ele.addEventListener("click", () => {
        // eslint-disable-next-line no-new-func
        Function(
          ...Object.keys(clickAccess),
          val
        )(...Object.values(clickAccess));
      });
    }
  });
}
new MutationObserver((mutList) => {
  for (const mutation of mutList) {
    if (mutation.addedNodes.length > 0) {
      fixNodes(mutation.addedNodes);
    }
  }
}).observe(document.body, {
  childList: true,
  subtree: true
});
// fix stuff originally added
fixNodes(document.body.children);
