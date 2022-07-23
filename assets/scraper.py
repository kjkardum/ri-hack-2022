import xml.etree.ElementTree as ET
from noderating import NodeRating
from json import dump


tree = ET.parse('mapa.osm')
root = tree.getroot()

buildings = []

filter_table = ["building", "building:levels", "leisure", "sport", "amenity", "shop", "tourism", "historic", "natural", "healthcare"]

for child in root.findall('node'):
    attr_dict = {}
    for node_children in child:
        attr_dict[node_children.attrib.get("k")] = node_children.attrib.get("v")

    for key in attr_dict.keys():
        if key in filter_table:
            rating = NodeRating.get_node_rating(attr_dict)
            buildings.append({**attr_dict, "rating": rating, **{"lat": child.attrib.get("lat"), "lon": child.attrib.get("lon")}})
            break

with open('buildings.json', 'w') as f:
    dump(buildings, f)
