/* eslint-disable no-undef */
// const appUrl = "https://i2x.vercel.app"
const appUrl = "http://localhost:3000";
describe("Transcript processing app", () => {
  it("visits the app", () => {
    cy.visit(appUrl);
    cy.get("[data-testid=session-status-heading]").contains(
      "status: session disconnected"
    );
    cy.get("[data-testid=manage-session-button]").should(
      "have.text",
      "Start Session"
    );
  });

  it("starts the session on click start session button", () => {
    cy.visit(appUrl);
    cy.get("[data-testid=manage-session-button]").click();
    cy.get("[data-testid=session-status-heading]").contains(
      "status: session started"
    );
    cy.get("[data-testid=manage-session-button]").should(
      "have.text",
      "Stop Session"
    );
  });

  it("stops the session on click stop session button", () => {
    cy.visit(appUrl);
    cy.get("[data-testid=manage-session-button]").click();
    cy.get("[data-testid=manage-session-button]").should(
      "have.text",
      "Stop Session"
    );
    cy.get("[data-testid=session-status-heading]").contains(
      "status: session started"
    );
    cy.get("[data-testid=manage-session-button]").click();
    cy.get("[data-testid=manage-session-button]").should(
      "have.text",
      "Start Session"
    );
    cy.get("[data-testid=session-status-heading]").contains(
      "status: session disconnected"
    );
  });
});
