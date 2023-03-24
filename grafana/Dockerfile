FROM grafana/grafana:latest

COPY prometheus.yaml /etc/grafana/provisioning/datasources/
COPY dashboard.json /var/lib/grafana/dashboards/

RUN chown -R grafana:grafana /etc/grafana/provisioning /var/lib/grafana/dashboards/

# Expose Grafana port
EXPOSE 3000