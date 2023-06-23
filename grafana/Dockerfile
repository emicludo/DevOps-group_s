FROM grafana/grafana:8.5.27-ubuntu

COPY ./prometheus.yaml /etc/grafana/provisioning/datasources/
#RUN chown -R grafana:grafana /etc/grafana/provisioning /var/lib/grafana/dashboards/

# Expose Grafana port
EXPOSE 3000