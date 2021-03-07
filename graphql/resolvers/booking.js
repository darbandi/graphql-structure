const Event = require("../../models/event");
const Booking = require("../../models/booking");
const { transformBooking, transformEvent } = require("./merge");
const { errorName } = require("../../errors/contants");

module.exports = {
  bookings: (args, req) => {
    if (!req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    return Booking.find()
      .then((bookings) => {
        return bookings.map((booking) => {
          return transformBooking(booking);
        });
      })
      .catch((err) => {
        throw err;
      });
  },
  bookEvent: (args, req) => {
    if (!req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    const { eventId } = args;
    return Event.findOne({ _id: eventId })
      .then((event) => {
        const booking = new Booking({
          user: req.userId,
          event: event,
        });
        return booking.save();
      })
      .then((booking) => {
        return transformBooking(booking);
      })
      .catch((err) => {
        throw err;
      });
  },
  removeBooking: (args, req) => {
    if (!req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    return Booking.remove()
      .then(() => {
        return "success!";
      })
      .catch((err) => {
        throw err;
      });
  },
  cancelBooking: (args, req) => {
    if (!req.isAuth) {
      throw new Error(errorName.UNAUTHORIZED);
    }
    const { bookingId } = args;
    let eventCreate;
    return Booking.findById(bookingId)
      .populate("event")
      .then((booking) => {
        eventCreate = transformEvent(booking.event);
        return booking.deleteOne({ _id: bookingId });
      })
      .then(() => {
        return eventCreate;
      })
      .catch((err) => {
        throw err;
      });
  },
};
