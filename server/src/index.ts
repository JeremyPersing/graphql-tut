import express from "express";
import { graphqlHTTP } from "express-graphql";
import cors from "cors";
import { createConnection } from "typeorm";
import { schema } from "./Schema";
import { Users } from "./Entities/Users";

const main = async () => {
  createConnection({
    type: "mysql",
    database: "graphqlcrud",
    username: "root",
    password: "somePasswordHere",
    logging: true,
    synchronize: false, // True = Used to create tables automatically with typeorm, but have to turn to false cuz will keep trying to create table
    entities: [Users],
  })
    .then(() => console.log("connected to db"))
    .catch((err) => console.error(err));

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );

  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => console.log("server listening on port " + PORT));
};

main().catch((err) => {
  console.error(err);
});
