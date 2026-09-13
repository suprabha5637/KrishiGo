from typing import List

class RecommendationEngine:
    # Simulated frequent itemsets / associations
    ASSOCIATIONS = {
        "tomato": ["onion", "potato", "coriander"],
        "wheat": ["rice", "lentils", "mustard"],
        "apple": ["banana", "orange", "grapes"],
        "fertilizer": ["seeds", "pesticide", "tractor rent"],
        "potato": ["onion", "tomato"],
        "rice": ["wheat", "lentils"],
    }

    def recommend(self, purchased_items: List[str], max_recommendations: int = 3) -> List[str]:
        """
        Suggests items frequently bought together based on purchased_items.
        
        :param purchased_items: List of items the user has already bought or added to cart.
        :param max_recommendations: Maximum number of recommendations to return.
        :return: List of recommended item names.
        """
        recommendations = {}
        
        for item in purchased_items:
            item_lower = item.lower()
            if item_lower in self.ASSOCIATIONS:
                for associated_item in self.ASSOCIATIONS[item_lower]:
                    # Do not recommend items already in the purchased list
                    if associated_item.lower() not in [p.lower() for p in purchased_items]:
                        recommendations[associated_item] = recommendations.get(associated_item, 0) + 1

        # Sort recommendations by frequency of association
        sorted_recs = sorted(recommendations.keys(), key=lambda k: recommendations[k], reverse=True)
        return sorted_recs[:max_recommendations]
