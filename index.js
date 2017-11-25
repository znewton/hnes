
console.log("Extension Running...");
const body = document.body;
body.setAttribute('ontouchstart','');
changeAllOfTagToNewTag('center', 'div');
changeAllOfTagToNewTag('table', 'div');
changeAllOfTagToNewTag('tbody', 'div');
changeAllOfTagToNewTag('tr', 'div');
changeAllOfTagToNewTag('td', 'div');
console.log('All bad tags converted.')

/**
 * 
 * @param {HTMLElement} element 
 * @param {string} tag 
 * @return {HTMLElement} newElement
 */
function copyToNewTag(element, tag) {
    let newElement = document.createElement(tag);
    while (element.firstChild) {
        newElement.appendChild(element.firstChild);
    }
    for (let i = element.attributes.length-1; i >= 0; --i) {
        newElement.attributes.setNamedItem(element.attributes[i].cloneNode());
    }
    element.parentElement.replaceChild(newElement, element);
    return newElement;
}

/**
 * 
 * @param {string} tag 
 * @param {string} newTag 
 */
function changeAllOfTagToNewTag(tag, newTag) {
    let tagElements = document.getElementsByTagName(tag);
    let element = tagElements.item(tagElements.length - 1);
    while (element) {
        let newElement = copyToNewTag(element, newTag);
        newElement.classList.add(tag);
        tagElements = document.getElementsByTagName(tag);
        element = tagElements.item(tagElements.length - 1);
    }
}