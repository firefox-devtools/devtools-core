const { Menu, MenuItem } = require("devtools-modules");
const { isFirefoxPanel } = require("devtools-config");

if (!isFirefoxPanel()) {
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

  popup.openPopupAtScreen = function(clientX, clientY) {
    this.style.setProperty("left", `${clientX}px`);
    this.style.setProperty("top", `${clientY}px`);
    mask = document.querySelector("#contextmenu-mask");
    window.onwheel = preventDefault;
    mask.classList.add("show");
    this.dispatchEvent(new Event("popupshown"));
    this.popupshown;
  };

  popup.hidePopup = function() {
    this.remove();
    mask = document.querySelector("#contextmenu-mask");
    mask.classList.remove("show");
    window.onwheel = null;
  };

  return popup;
}

if (!isFirefoxPanel()) {
  Menu.prototype.createPopup = createPopup;
}

function onShown(menu, popup) {
  popup.childNodes.forEach((menuItemNode, i) => {
    let item = menu.items[i];

    if (!item.disabled) {
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
  items.forEach((item) => {
    let menuItem = new MenuItem(item);
    menuItem.submenu = createSubMenu(item.submenu);
    menu.append(menuItem);
  });

  if (isFirefoxPanel()) {
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
      let subMenuItem = subMenu.items[j];
      if (!subMenuItem.disabled) {
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
