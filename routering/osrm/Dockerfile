FROM osrm/osrm-backend

COPY data/ /data/

ENTRYPOINT ["osrm-routed", "-p", "5001", "--max-matching-size", "10000", "--max-table-size", "10000", "--max-viaroute-size", "10000", "--algorithm", "ch", "/data/map.osrm"]