const setEmployerAuth = (win) => {
  const auth = {
    accessToken: "test-access-token",
    refreshToken: "test-refresh-token",
    user: {
      id: "test-employer-id",
      full_name: "Test Employer",
      role: "EMPLOYER",
    },
  };
  win.localStorage.setItem("auth", JSON.stringify(auth));
};

describe("Employer Candidate Search", () => {
  it("does not call search API on load and only calls after search action", () => {
    cy.intercept("GET", "**/api/employer/candidates/**", (req) => {
      req.reply({
        statusCode: 200,
        body: { count: 0, results: [] },
      });
    }).as("searchCandidates");

    cy.visit("/employer/search", {
      onBeforeLoad: setEmployerAuth,
    });

    cy.wait(800);
    cy.get("@searchCandidates.all").should("have.length", 0);

    cy.contains("Start typing or apply filters to search candidates.").should("be.visible");

    cy.get("input[placeholder='React, Python, UX']").type("python");
    cy.contains("button", "Search").click();

    cy.wait("@searchCandidates");
    cy.get("@searchCandidates.all").should("have.length", 1);
  });
});
