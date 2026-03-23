export const fetchDonations = async () => {
  return {
    data: [
      {
        id: 1,
        food_type: "Rice & Curry",
        quantity: 5,
        unit: "plates",
        lat: 11.2588,
        lng: 75.7804,
        distance: 1.2,
      },
      {
        id: 2,
        food_type: "Biriyani",
        quantity: 10,
        unit: "plates",
        lat: 11.26,
        lng: 75.775,
        distance: 2.5,
      },
    ],
  };
};
