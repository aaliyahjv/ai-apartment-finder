import { describe, expect, it } from "vitest";
import { isValidApartmentId } from "@/lib/apartment-id";

describe("isValidApartmentId", () => {
  it("accepts valid apartment IDs", () => {
    expect(isValidApartmentId("apt-cap-hill-01")).toBe(true);
    expect(isValidApartmentId("APT-BALLARD-02")).toBe(true);
    expect(isValidApartmentId("a")).toBe(true);
  });

  it("rejects empty IDs", () => {
    expect(isValidApartmentId("")).toBe(false);
  });

  it("rejects IDs with invalid characters", () => {
    expect(isValidApartmentId("apt_cap_hill")).toBe(false);
    expect(isValidApartmentId("apt cap hill")).toBe(false);
    expect(isValidApartmentId("apt@home")).toBe(false);
    expect(isValidApartmentId("../secrets")).toBe(false);
  });

  it("rejects IDs longer than the maximum length", () => {
    expect(isValidApartmentId("a".repeat(64))).toBe(true);
    expect(isValidApartmentId("a".repeat(65))).toBe(false);
  });
});
