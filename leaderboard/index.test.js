
import { helloWorld } from './index.js';

describe('index.js', () => {
  describe('hello world', () => {
    it('Outputs str to console', () => {
      const stub = jest.spyOn(console, 'log');
      helloWorld('Hello');
      expect(stub).toHaveBeenCalledWith('Hello');
    });
  });
});
