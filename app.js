const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const cors = require("cors");

const mongoose = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");
const isAuth = require("./middleware/is-auth");
const { errorType } = require("./errors/contants");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true,
    customFormatErrorFn: (err) => {
        console.log('err : ', err);
      const error = errorType[err.message] || errorType.ERROR_NOT_DEFINED;
      return {
        ...error,
        translateCode: err.message,
        // path:err.path,
        // locations: err.locations
      };
    },
  })
);

mongoose
  .connect(`${process.env.SERVER_ADDRESS}/${process.env.DTABASE_NAME}`)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("connected!");
    });
  })
  .catch((error) => {
    console.log("error : ", error);
  });
