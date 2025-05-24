// Add this file with simplified mock data
export const getNeighborhoodData = (location: string) => {
  // Extract city from location (format is usually "City, Area")
  const city = location.split(",")[0].trim()

  // Default to Zagreb data if no match
  return neighborhoodData[city] || neighborhoodData["Zagreb"]
}

const neighborhoodData: Record<string, any> = {
  Zagreb: {
    name: "Donji grad",
    description:
      "Donji grad je povijesno središte Zagreba s brojnim kulturnim znamenitostima, restoranima i trgovinama. Područje je dobro povezano javnim prijevozom.",
    image: "/placeholder.svg?height=400&width=800&text=Zagreb+Donji+grad",
    ratings: [
      { category: "Sigurnost", score: 85 },
      { category: "Javni prijevoz", score: 90 },
      { category: "Restorani i kafići", score: 95 },
      { category: "Škole", score: 80 },
      { category: "Parkovi", score: 75 },
    ],
    pointsOfInterest: [
      { id: "z1", name: "Osnovna škola Petra Preradovića", type: "school", distance: 450, rating: 4.2 },
      { id: "z2", name: "Tržnica Dolac", type: "shop", distance: 800, rating: 4.8 },
      { id: "z3", name: "Restoran Vinodol", type: "restaurant", distance: 350, rating: 4.5 },
      { id: "z4", name: "Tramvajska stanica Trg bana Jelačića", type: "transport", distance: 200 },
      { id: "z5", name: "Park Zrinjevac", type: "park", distance: 600, rating: 4.7 },
      { id: "z6", name: "Konzum", type: "shop", distance: 300, rating: 3.9 },
      { id: "z7", name: "Gimnazija Tituša Brezovačkog", type: "school", distance: 750, rating: 4.4 },
    ],
  },
  Split: {
    name: "Žnjan",
    description:
      "Žnjan je moderno stambeno područje u Splitu s prekrasnim plažama i pogledom na more. Područje se brzo razvija s novim stambenim zgradama i sadržajima.",
    image: "/placeholder.svg?height=400&width=800&text=Split+Žnjan",
    ratings: [
      { category: "Sigurnost", score: 80 },
      { category: "Plaže", score: 95 },
      { category: "Restorani i kafići", score: 85 },
      { category: "Javni prijevoz", score: 70 },
      { category: "Parkovi", score: 75 },
    ],
    pointsOfInterest: [
      { id: "s1", name: "Plaža Žnjan", type: "park", distance: 400, rating: 4.6 },
      { id: "s2", name: "Tommy supermarket", type: "shop", distance: 350, rating: 4.0 },
      { id: "s3", name: "Restoran Dalmatino", type: "restaurant", distance: 500, rating: 4.4 },
      { id: "s4", name: "Autobusna stanica Žnjan", type: "transport", distance: 250 },
      { id: "s5", name: "Osnovna škola Žnjan-Pazdigrad", type: "school", distance: 600, rating: 4.3 },
    ],
  },
  Rijeka: {
    name: "Centar",
    description:
      "Centar Rijeke je živahno područje s povijesnim zgradama, trgovinama i kulturnim sadržajima. Blizina mora i šetnice Korzo čini ga atraktivnim za život.",
    image: "/placeholder.svg?height=400&width=800&text=Rijeka+Centar",
    ratings: [
      { category: "Sigurnost", score: 75 },
      { category: "Javni prijevoz", score: 85 },
      { category: "Restorani i kafići", score: 90 },
      { category: "Kulturni sadržaji", score: 95 },
      { category: "Škole", score: 80 },
    ],
    pointsOfInterest: [
      { id: "r1", name: "Korzo", type: "shop", distance: 200, rating: 4.7 },
      { id: "r2", name: "Gradska tržnica", type: "shop", distance: 350, rating: 4.5 },
      { id: "r3", name: "Restoran Konoba Na kantunu", type: "restaurant", distance: 300, rating: 4.6 },
      { id: "r4", name: "Autobusni kolodvor", type: "transport", distance: 500 },
      { id: "r5", name: "Prva riječka hrvatska gimnazija", type: "school", distance: 450, rating: 4.4 },
    ],
  },
  Zadar: {
    name: "Borik",
    description:
      "Borik je popularno turističko područje u Zadru s prekrasnim plažama i brojnim hotelima. Idealno za obitelji i ljubitelje morskih aktivnosti.",
    image: "/placeholder.svg?height=400&width=800&text=Zadar+Borik",
    ratings: [
      { category: "Sigurnost", score: 85 },
      { category: "Plaže", score: 90 },
      { category: "Restorani i kafići", score: 80 },
      { category: "Javni prijevoz", score: 75 },
      { category: "Parkovi", score: 70 },
    ],
    pointsOfInterest: [
      { id: "zd1", name: "Plaža Borik", type: "park", distance: 300, rating: 4.7 },
      { id: "zd2", name: "Konzum", type: "shop", distance: 400, rating: 3.8 },
      { id: "zd3", name: "Restoran Borik", type: "restaurant", distance: 350, rating: 4.3 },
      { id: "zd4", name: "Autobusna stanica Borik", type: "transport", distance: 200 },
      { id: "zd5", name: "Osnovna škola Voštarnica", type: "school", distance: 800, rating: 4.2 },
    ],
  },
}
