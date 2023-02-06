/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";
import { HopeProvider, NotificationsProvider } from "@hope-ui/solid";

render(
  () => (
    <HopeProvider>
      <NotificationsProvider>
        <App />
      </NotificationsProvider>
    </HopeProvider>
  ),
  document.getElementById("root") as HTMLElement
);
