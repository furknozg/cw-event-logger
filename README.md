# cw-event-logger

Event Logging using Pub/Sub, Dataflow, Cloud Storage and BigQuery


Usage: The code is automatically deployed to google cloud run, the endpoint is https://cw-pubquery-service-hzqzkoxvpq-uc.a.run.app/ for both get and post
If you are to test the code locally, it may prompt you to have access to the cloud project...

The master repository is for deployment only.

See https://cloud.google.com/docs/authentication/getting-started if you want to test locally, you need to authenticate to google cloud and also have the access to the project.

While running docker locally, you may need to execute the commands inside the dockerfile, I have not done so since I do not test locally with docker but only npm.

To run you will only require to execute: 
  "npm run start"
or
  "docker-compose build;
  docker-compose up -d"
depending on the version of docker-compose the command may differ to "docker compose"...

To test compose a JSON post request, send it to either to the url given above, or if you're authenticated locally, to localhost:8080/ it may take a little to reflect from pubsub to bigquery but it will.
You can observe the table on Bigquery at the events dataset on the logs table.
After the reflection you can use the same endpoint with a get request to observe the analytics.

The database is not populated so not much will show, if you desire to do so and populate it, make sure it is called the logs table for now (I forgot to set its name as an env variable).


System Architecture:

![SystemArch drawio](https://github.com/furknozg/cw-event-logger/assets/72404454/08ca8406-81bc-4be5-8437-3dd0a7842118)
