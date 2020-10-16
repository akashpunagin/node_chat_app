const expect = require('expect');

var {generateMessage, generateLocationMessage} = require('./message');

describe("generate message", () => {
  it("should generate message object", () => {
    var from = "example";
    var text = "hi example this is fun";
    var message = generateMessage(from, text);
    expect(message).toMatchObject({from, text});
    expect(typeof message.createdAt).toBe('number');
  });
});

describe("generate location message", () => {
  it("should generate correct location object", () => {
    var from = "example";
    var latitude = 100;
    var longitude = 200;
    var locationMessage = generateLocationMessage(from, latitude, longitude);
    expect(locationMessage.from).toBe(from);
    expect(typeof locationMessage.createdAt).toBe('number');
    expect(locationMessage.url).toBe(`https://www.google.com/maps?q=${latitude},${longitude}`)
  });
});
