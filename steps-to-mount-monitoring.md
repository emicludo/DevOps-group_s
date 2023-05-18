## Steps to mount Grafana + Prometheus separetely loading the datasource and dashboard manually
### Set up monitoring
1. Clone this branch on the droplet
2. Install docker on the droplet following this article https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04
3. From DevOps-group_s run: docker-compose -f ./docker-compose-monitoring.yml up -d --build
4. Access http://localhost:3005/
5. Enter credentials (admin, admin)
6. Go to Datasources > Add new Datasource
    Choose any name
    Type: Prometheus
    Url: http://localhost:9090
    Access: direct
    Click Add
7. Go to Dashboards
   Look for "Import Dashboard" in the top menu
   Copy the content of the file in /grafana/dashboard.json
### Tear down and re build containers

1. From DevOps-group_s run:  docker-compose -f ./docker-compose-monitoring.yml down -v
2. git pull
3. docker-compose -f ./docker-compose-monitoring.yml up -d --build

### Now both container should be running on ports 9090 (prometheus), and 3005 (grafana) and listening to the app running on localhost:3000 (our Minitwit app)

### Add users for Helge and Mircea
1. Go to the left bar > Admin
2. Go to > Manage Users > Add new user
3. Enter the credentials provided by Helge in the main repository
4. 