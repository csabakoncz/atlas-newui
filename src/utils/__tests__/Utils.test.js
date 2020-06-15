import {test, expect} from '@jest/globals'
import Utils from '../Utils'

test("Escaping", () => {
    expect(Utils.escapeHtml("plain")).toBe("plain");
    expect(Utils.escapeHtml('quote: "')).toBe('quote: &quot;');
});