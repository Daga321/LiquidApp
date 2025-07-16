import { createRoot } from 'react-dom/client';
import { App } from './App';
import { StateProvider } from "./Utils/StateContext";

// Mount the app to the root element
const rootElement = document.getElementById("root");
if (!rootElement) {
    throw new Error("Root element not found");
}

const root = createRoot(rootElement);
root.render(
  <StateProvider>
    <App />
  </StateProvider>
);

export function validate(data: any): boolean {
    return true;
}
