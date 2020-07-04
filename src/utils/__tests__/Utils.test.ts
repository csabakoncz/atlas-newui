import Utils from '../Utils'

let a: string;

a = 'plain'
it("Escaping", () => {
    expect(Utils.escapeHtml("plain")).toBe(a);
    expect(Utils.escapeHtml('quote: "')).toBe('quote: &quot;');
});
