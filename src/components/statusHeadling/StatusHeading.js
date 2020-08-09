import React from "react";
import { Heading1 } from "../typography/Typography";
export const StatusHeading = React.memo(({ statusText }) => {
  return (
    <Heading1 data-testid="session-status-heading">
      <span className="textXL">status:</span>
      {` session ${statusText}`}
    </Heading1>
  );
});
