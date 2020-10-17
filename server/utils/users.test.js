const expect = require('expect');

const {Users} = require('./users');

describe("Users", () => {
  var users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: "1",
      name: "User one",
      room: "Room one"
    }, {
      id: "2",
      name: "User two",
      room: "Room two"
    }, {
      id: "3",
      name: "User three",
      room: "Room one"
    }];
  });

  it("should add new user", () => {
    var users = new Users();
    var user = {
      id : "123",
      name : "expamle",
      room : "room example"
    };
    var result = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });

  it("should remove a user", () => {
    var user = users.removeUser("1");
    expect(user).toMatchObject({
      id: "1",
      name: "User one",
      room: "Room one"
    });
    expect(users.users.length).toBe(2);
  });

  it("should not remove a user", () => {
    var user = users.removeUser("10");
    expect(user).toBeFalsy();
    expect(users.users.length).toBe(3);
  });

  it("should find user", () => {
    var user = users.getUser("1");
    expect(user.id).toBe("1");
    expect(user.name).toBe("User one");
    expect(user.room).toBe("Room one");
  })

  it("should not find a user", () => {
    var user = users.getUser("10");
    expect(user).toBeFalsy();
  });

  it("should return names for Room one", () => {
    var userList = users.getUserList("Room one");
    expect(userList).toEqual(["User one", "User three"]);
  });

  it("should return names for Room two", () => {
    var userList = users.getUserList("Room two");
    expect(userList).toEqual(["User two"]);
  });


});
