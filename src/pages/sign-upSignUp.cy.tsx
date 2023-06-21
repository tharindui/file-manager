import React from "react";
import SignUp from "./sign-up";

describe("<SignUp />", () => {
  it("renders", () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<SignUp />);
  });
});
