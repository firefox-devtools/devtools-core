/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const { Menu, MenuItem } = require("devtools-modules");

function inToolbox() {
  return window.parent.document.documentURI == "about:devtools-toolbox";
}

if (!inToolbox()) {
  require("./menu.css");
}

function createPopup(doc) {
  let popup = doc.createElement("menupopup");
  popup.className = "landing-popup";
  if (popup.openPopupAtScreen) {
    return popup;
  }

  function preventDefault(e) {
    e.preventDefault();
    e.returnValue = false;
  }

  let mask = document.querySelector("#contextmenu-mask");
  if (!mask) {
    mask = doc.createElement("div");
    mask.id = "contextmenu-mask";
    document.body.appendChild(mask);
  }

  mask.onclick = () => popup.hidePopup();

  popup.openPopupAtScreen = function (clientX, clientY) {
    this.style.setProperty("left", `${clientX}px`);
    this.style.setProperty("top", `${clientY}px`);
    mask = document.querySelector("#contextmenu-mask");
    window.onwheel = preventDefault;
    mask.classList.add("show");
    this.dispatchEvent(new Event("popupshown"));
    this.popupshown;
  };

  popup.hidePopup = function () {
    this.remove();
    mask = document.querySelector("#contextmenu-mask");
    mask.classList.remove("show");
    window.onwheel = null;
  };

  return popup;
}

if (!inToolbox()) {
  Menu.prototype.createPopup = createPopup;
}

function onShown(menu, popup) {
  popup.childNodes.forEach((menuItemNode, i) => {
    let item = menu.items[i];

    if (!item.disabled && item.visible) {
      menuItemNode.onclick = () => {
        item.click();
        popup.hidePopup();
      };

      showSubMenu(item.submenu, menuItemNode, popup);
    }
  });
}

function showMenu(evt, items) {
  if (items.length === 0) {
    return;
  }

  let menu = new Menu();
  items
    .filter((item) => item.visible === undefined || item.visible === true)
    .forEach((item) => {
      let menuItem = new MenuItem(item);
      menuItem.submenu = createSubMenu(item.submenu);
      menu.append(menuItem);
    });

  if (inToolbox()) {
    menu.popup(evt.screenX, evt.screenY, { doc: window.parent.document });
    return;
  }

  menu.on("open", (_, popup) => onShown(menu, popup));
  menu.popup(evt.clientX, evt.clientY, { doc: document });
}

function createSubMenu(subItems) {
  if (subItems) {
    let subMenu = new Menu();
    subItems.forEach((subItem) => {
      subMenu.append(new MenuItem(subItem));
    });
    return subMenu;
  }
  return null;
}

function showSubMenu(subMenu, menuItemNode, popup) {
  if (subMenu) {
    let subMenuNode = menuItemNode.querySelector("menupopup");
    let { left, top, width } = popup.getBoundingClientRect();
    subMenuNode.style.setProperty("left", `${left + width}px`);
    subMenuNode.style.setProperty("top", `${top}px`);

    let subMenuItemNodes = menuItemNode
      .querySelector("menupopup:not(.landing-popup)").childNodes;
    subMenuItemNodes.forEach((subMenuItemNode, j) => {
      let subMenuItem = subMenu.items.filter((item) =>
        item.visible === undefined || item.visible === true)[j];
      if (!subMenuItem.disabled && subMenuItem.visible) {
        subMenuItemNode.onclick = () => {
          subMenuItem.click();
          popup.hidePopup();
        };
      }
    });
  }
}

function buildMenu(items) {
  return items.map(itm => {
    const hide = typeof itm.hidden === "function" ? itm.hidden() : itm.hidden;
    return hide ? null : itm.item;
  }).filter(itm => itm !== null);
}

module.exports = {
  showMenu,
  buildMenu
};
