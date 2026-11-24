'use strict';

// Native dialog commands work without JavaScript in browsers that support them.
for (const trigger of document.querySelectorAll('.demo-open')) {
  const dialog = document.getElementById(trigger.getAttribute('aria-controls'));
  if (!('commandForElement' in HTMLButtonElement.prototype)) {
    trigger.addEventListener('click', () => dialog.showModal());
  }
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', () => {
    trigger.focus({ preventScroll: true });
  });
}
