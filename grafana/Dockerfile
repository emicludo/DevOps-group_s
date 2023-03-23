FROM grafana/grafana:4.5.2

# Install plugins
RUN grafana-cli plugins install grafana-piechart-panel
RUN grafana-cli plugins install grafana-worldmap-panel

# Copy custom dashboard
COPY dashboard.json /usr/share/grafana/conf/provisioning/dashboards/

# Configure Prometheus datasource
COPY datasources.json /usr/share/grafana/conf/provisioning/datasources/

COPY grafana.ini /usr/share/grafana/conf/

# Expose Grafana port
EXPOSE 3000