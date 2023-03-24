## Steps to mount Grafana + Prometheus separetely loading the datasource and dashboard manually
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

### Now both container should be running on ports 9090 (prometheus), and 3005 (grafana) and listening to the app running on localhost:3000 (our Minitwit app)

