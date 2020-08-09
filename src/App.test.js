import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { ASRContext } from "./api/asr/useASR";
import { mockAsrClient } from "./mocks/asr";

describe("<App/>", () => {
  const FullApp = () => (
    <ASRContext.Provider value={mockAsrClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </ASRContext.Provider>
  );
  it("renders <App/>", () => {
    const { queryByTestId } = render(<FullApp />);

    // check heading text
    expect(queryByTestId("session-status-heading").textContent).toBe(
      "status: session disconnected"
    );

    // check button text
    expect(queryByTestId("manage-session-button").textContent).toBe(
      "Start Session"
    );
  });

  it("changes status on click of start session button", async () => {
    const { queryByTestId } = render(<FullApp />);

    const manageSessionBtn = queryByTestId("manage-session-button");
    expect(manageSessionBtn).not.toBeNull();

    // click on button to start the session
    fireEvent.click(manageSessionBtn);

    // wait till the session is started and the button changes it's text
    await waitFor(() =>
      expect(queryByTestId("manage-session-button").textContent).toBe(
        "Stop Session"
      )
    );

    // check if the header text is changed too
    expect(queryByTestId("session-status-heading").textContent).toBe(
      "status: session started"
    );
  });
});
