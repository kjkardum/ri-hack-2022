

class NodeRating:
    @staticmethod
    def get_node_rating(attrs):
        rating = 1
        for key in attrs.keys():
            if key == "building:levels":
                rating += 0.25 * int(attrs[key])

            if key == "amenity":
                rating += 1

            if key == "tourism":
                rating += 1

        return rating
