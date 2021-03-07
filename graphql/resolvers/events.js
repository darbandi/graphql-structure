const Event = require("../../models/event");
const User = require("../../models/user");
const { transformEvent } = require("./merge");
const { errorName } = require("../../errors/contants");

module.exports = {
  events: () => {
    return Event.find().then((events) => {
      return events.map((event) => {
        return transformEvent(event);
      });
    });
  },
  createEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    const { title, price, description, date } = args.eventInput;
    const event = new Event({
      title,
      price,
      description,
      date,
      creator: req.userId,
    });
    let eventResult;
    return event
      .save()
      .then((event) => {
        eventResult = transformEvent(event);
        return User.findById(req.userId);
      })
      .then((user) => {
        if (!user) {
          throw new Error(errorName.USER_NOT_EXIST);
        }
        user.createdEvents.push(event);
        return user.save();
      })
      .then(() => {
        return eventResult;
      })
      .catch((err) => {
        throw err;
      });
  },
};
