import Utils from '../Utils'

it("Escaping", () => {
    expect(Utils.escapeHtml("plain")).toBe("plain");
    expect(Utils.escapeHtml('quote: "')).toBe('quote: &quot;');
});