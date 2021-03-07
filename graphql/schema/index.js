const { buildSchema } = require("graphql");

module.exports = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        title: String!
        date: String!
        price: String!
        description: String!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String!
        createdEvents: [Event!]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }


    input EventInput {
        title: String!
        date: String!
        price: String!
        description: String!
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        events: [Event!]!
        users: [User!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(eventInput: UserInput): User
        bookEvent(eventId: ID!): Booking!
        cancelBooking(bookingId: ID!): Event!
        removeBooking: String! 
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
