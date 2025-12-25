import { render, screen } from "@testing-library/react";
import { MainWrapper } from "@/components/layout/Main-Wrapper";

describe("MainWrapper", () => {
  it("рендерит children", () => {
    render(
      <MainWrapper>
        <div>Test Content</div>
      </MainWrapper>
    );
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("имеет правильный role", () => {
    render(
      <MainWrapper>
        <div>Test</div>
      </MainWrapper>
    );
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();
  });

  it("применяет правильные классы", () => {
    render(
      <MainWrapper>
        <div>Test</div>
      </MainWrapper>
    );
    const main = screen.getByRole("main");
    expect(main).toHaveClass("flex-1", "p-2", "animate-in");
  });
});

