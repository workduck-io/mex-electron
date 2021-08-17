/* eslint-disable @typescript-eslint/no-explicit-any */

const toggleWindow = (appWindow: any, isSelection: boolean) => {
  if (!isSelection && (appWindow.isFocused() || appWindow.isVisible())) {
    appWindow.hide();
  } else {
    appWindow.show();
    // appWindow.focus();
  }
};

export default toggleWindow;
