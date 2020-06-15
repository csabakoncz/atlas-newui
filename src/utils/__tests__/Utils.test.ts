import Utils from '../Utils'

let a: string;

a = 'plain'
test("Escaping", () => {
    expect(Utils.escapeHtml("plain")).toBe(a);
    expect(Utils.escapeHtml('quote: "')).toBe('quote: &quot;');
});
