const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const { events } = require("./merge");
const jwt = require("jsonwebtoken");
const { errorName } = require("../../errors/contants");

module.exports = {
  users: () => {
    return User.find().then((users) => {
      return users.map((user) => {
        return {
          ...user._doc,
          _id: user.id,
          createdEvents: events.bind(this, user._doc.createdEvents),
        };
      });
    });
  },
  createUser: (args) => {
    const { email, password } = args.eventInput;
    return User.find({ email: email })
      .then((user) => {
        if (user && user.length) {
          throw new Error(errorName.USER_EXIST);
        }
        return bcrypt.hash(password, 12);
      })
      .then((hashedPassword) => {
        const user = new User({
          email,
          password: hashedPassword,
        });
        return user.save();
      })
      .then((user) => {
        return {
          ...user._doc,
          _id: user.id,
          createdEvents: events.bind(this, user._doc.createdEvents),
        };
      })
      .catch((err) => {
        throw err;
      });
  },
  login: (args) => {
    const { email, password } = args;
    let currentUser;
    return User.findOne({ email })
      .then((user) => {
        if (!user) {
          throw new Error(errorName.USER_NOT_EXIST);
        }
        currentUser = user;
        return bcrypt.compare(password, user.password);
      })
      .then((isEqual) => {
        if (!isEqual) {
          throw new Error(errorName.USER_NOT_EXIST);
        }
        return jwt.sign(
          { userId: currentUser.id, email: currentUser.email },
          "somesuppersecretky",
          {
            expiresIn: "1h",
          }
        );
      })
      .then((token) => {
        return {
          userId: currentUser.id,
          token,
          tokenExpiration: 1,
        };
      })
      .catch((err) => {
        throw err;
      });
  },
};
