## Steps to mount Grafana + Prometheus separetely loading the datasource and dashboard manually
### Set up the /metrics endpoint
1. Merge the branch called `add metrics endpoint`
2. Pull in the repository from the droplet
3. Run npm install
4. Run npm reload (it may have other flags that I don't remember)
Now the app should have metrics served in endpoint /metrics --- test manually
### Set up monitoring
1. Clone this branch on the droplet
2. From DevOps-group_s run: docker-compose -f ./docker-compose-monitoring.yml up -d --build
3. Access http://localhost:3005/
4. Enter credentials (admin, admin)
5. Go to Datasources > Add new Datasource
    Choose any name
    Type: Prometheus
    Url: http://localhost:9090
    Access: direct
    Click Add
6. Go to Dashboards
   Look for "Import Dashboard" in the top menu
   Copy the content of the file in /grafana/dashboard.json
7. Add more Metrics
8. Create a user:
    Go to the left bar > Admin
    Go to > Manage Users > Add new user
    Enter the credentials provided by Helge in the main repository

<<<<<<< HEAD
=======
### Tear down and re build containers

1. From DevOps-group_s run:  docker-compose -f ./docker-compose-monitoring.yml down -v
2. git pull
3. docker-compose -f ./docker-compose-monitoring.yml up -d --build

### Now both container should be running on ports 9090 (prometheus), and 3005 (grafana) and listening to the app running on localhost:3000 (our Minitwit app)
>>>>>>> 0c66b2372909b3d9fc8ac6ea1d31cadffa3cf323

##Apply changes to droplet##

    Go to the left bar > Admin
    Go to > Manage Users > Add new user
    Enter the credentials provided by Helge in the main repository

### Now both container should be running on ports 9090 (prometheus), and 3005 (grafana) and listening to the app running on localhost:3000 (our Minitwit app)
