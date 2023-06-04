Ssh into the droplet

Follow the guide on:
https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04

Run:
apt install docker-compose

clone the repository

docker-compose -f docker-compose-logging.yml up -d --build

Elastic search will be available on:
http://localhost:9200/

Our app will be available on:
http://localhost:5000/

Kibana will be available on:
http://localhost:5601/app/home#/

Wait 1 minute for Kibana and ES to kick off and become available to Filebeat

On kibana go to:
  Left menu > Analytics > Discover
  Create index pattern
  Choose "my-app-logs" or "all", and "@timestamp" as options and Create the index

Send a get request to http://localhost:5000/api/

On kibana go to Discover again
  Choose the index created
  Check the log records on Kibana

To put it down:
docker-compose down -v