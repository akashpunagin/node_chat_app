const expect = require('expect');

var {generateMessage} = require('./message');

describe("generate message", () => {
  it("should generate message object", () => {
    var from = "example";
    var text = "hi example this is fun";
    var message = generateMessage(from, text);
    expect(message).toMatchObject({from, text});
    expect(typeof message.createdAt).toBe('number');
  });
});
