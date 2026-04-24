import { describe, expect, it } from "vitest";
import { getRoleDefinition, roleDefinitions } from "@/lib/roles";

describe("roleDefinitions", () => {
  it("includes the expected starter roles", () => {
    expect(roleDefinitions.length).toBeGreaterThanOrEqual(4);
    expect(roleDefinitions.map((role) => role.id)).toEqual(
      expect.arrayContaining(["frontend", "backend", "data-analyst", "support"])
    );
  });

  it("falls back to the default role for unknown ids", () => {
    expect(getRoleDefinition("unknown-role")).toEqual(roleDefinitions[0]);
  });
});
