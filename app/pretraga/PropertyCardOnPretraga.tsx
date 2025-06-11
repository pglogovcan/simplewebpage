function PropertyCard({
    property,
    viewMode,
    getActiveImageIndex,
    prevImage,
    nextImage,
    formatPrice,
    compareList,
    toggleCompare,
    getPlaceholderImage,
  }: {
    property: Property
    viewMode: "grid" | "list"
    getActiveImageIndex: (id: string) => number
    prevImage: (id: string, total: number, e: React.MouseEvent) => void
    nextImage: (id: string, total: number, e: React.MouseEvent) => void
    formatPrice: (price: number) => string
    compareList: string[]
    toggleCompare: (propertyId: string, e: React.MouseEvent) => void
    getPlaceholderImage: (title: string) => string
  }) {
    // Ensure property.images is always an array
    const images = property.images || []
    // Check if this property is in the compare list
    const isInCompare = compareList.includes(String(property.id).trim())
  
    // Check if compare is disabled (when 2 properties are selected and this one isn't one of them)
    const isCompareDisabled = compareList.length >= 2 && !isInCompare
  
    // Function to handle compare button click
    const handleCompareClick = (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
  
      // Only proceed if not disabled
      if (!isCompareDisabled) {
        toggleCompare(String(property.id), e)
      }
    }
  
    if (viewMode === "grid") {
      return (
        <Link href={`/nekretnine/${property.id}`} className="block group">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full">
            <div className="relative h-40 sm:h-48">
              {/* Image slider */}
              <div className="relative w-full h-full overflow-hidden">
                {images.length > 0 ? (
                  images.map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        "absolute inset-0 transition-opacity duration-300",
                        getActiveImageIndex(property.id) === index ? "opacity-100" : "opacity-0",
                      )}
                    >
                      <Image
                        src={getPlaceholderImage(property.title) || "/placeholder.svg"}
                        alt={`${property.title} - slika ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <Image
                    src={getPlaceholderImage(property.title) || "/placeholder.svg"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                )}
  
                {/* Navigation arrows */}
                <button
                  onClick={(e) => prevImage(property.id, images.length || 1, e)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                  aria-label="Prethodna slika"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
  
                <button
                  onClick={(e) => nextImage(property.id, images.length || 1, e)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                  aria-label="Sljedeća slika"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
  
              {/* Property badges - placed in a column */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {property.featured && (
                  <div className="bg-rose-400 text-white text-xs font-semibold px-2 py-0.5 rounded">IZDVOJENO</div>
                )}
                {property.new && (
                  <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded">NOVO</div>
                )}
              </div>
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                <button
                  className="bg-white/80 hover:bg-white text-gray-600 hover:text-rose-500 rounded-full p-1.5 transition-colors"
                  aria-label="Dodaj u favorite"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Heart className="h-3.5 w-3.5" />
                </button>
                <button
                  className={cn(
                    "bg-white/80 rounded-full p-1.5 flex items-center gap-1 transition-colors",
                    isInCompare
                      ? "text-teal-500 hover:text-teal-600"
                      : isCompareDisabled
                        ? "text-gray-400 opacity-50 pointer-events-none"
                        : "text-gray-600 hover:text-gray-700",
                  )}
                  aria-label={isInCompare ? "Ukloni iz usporedbe" : "Dodaj u usporedbu"}
                  onClick={handleCompareClick}
                  disabled={isCompareDisabled}
                  title={isCompareDisabled ? "Možete usporediti samo 2 nekretnine" : ""}
                >
                  <Scale className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 z-10">
                <div className="text-white font-bold text-lg sm:text-xl">{formatPrice(property.price)}</div>
              </div>
            </div>
  
            <div className="p-3">
              <div className="flex items-start gap-1 text-gray-500 text-xs sm:text-sm mb-1 sm:mb-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
                <span className="truncate">{property.location}</span>
              </div>
              <h3 className="font-semibold text-sm sm:text-lg mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
                {property.title}
              </h3>
              <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2 sm:gap-4">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.area} m²</span>
                  </div>
                </div>
                <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">{property.property_type}</span>
              </div>
            </div>
          </div>
        </Link>
      )
    } else {
      // List view
      return (
        <Link href={`/nekretnine/${property.id}`} className="block group">
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-1/3 h-40 sm:h-48">
                {/* Image slider */}
                <div className="relative w-full h-full overflow-hidden">
                  {images.length > 0 ? (
                    images.map((image, index) => (
                      <div
                        key={index}
                        className={cn(
                          "absolute inset-0 transition-opacity duration-300",
                          getActiveImageIndex(property.id) === index ? "opacity-100" : "opacity-0",
                        )}
                      >
                        <Image
                          src={getPlaceholderImage(property.title) || "/placeholder.svg"}
                          alt={`${property.title} - slika ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <Image
                      src={getPlaceholderImage(property.title) || "/placeholder.svg"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  )}
  
                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => prevImage(property.id, images.length || 1, e)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                    aria-label="Prethodna slika"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
  
                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => nextImage(property.id, images.length || 1, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-1 transition-colors z-10"
                    aria-label="Sljedeća slika"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
  
                {/* Property badges - placed in a column */}
                <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                  {property.featured && (
                    <div className="bg-rose-400 text-white text-xs font-semibold px-2 py-0.5 rounded">IZDVOJENO</div>
                  )}
                  {property.new && (
                    <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-0.5 rounded">NOVO</div>
                  )}
                </div>
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  <button
                    className="bg-white/80 hover:bg-white text-gray-600 hover:text-rose-500 rounded-full p-1.5 transition-colors"
                    aria-label="Dodaj u favorite"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Heart className="h-3.5 w-3.5" />
                  </button>
                  <button
                    className={cn(
                      "bg-white/80 rounded-full p-1.5 flex items-center gap-1 transition-colors",
                      isInCompare
                        ? "text-teal-500 hover:text-teal-600"
                        : isCompareDisabled
                          ? "text-gray-400 opacity-50 pointer-events-none"
                          : "text-gray-600 hover:text-gray-700",
                    )}
                    aria-label={isInCompare ? "Ukloni iz usporedbe" : "Dodaj u usporedbu"}
                    onClick={handleCompareClick}
                    disabled={isCompareDisabled}
                    title={isCompareDisabled ? "Možete usporediti samo 2 nekretnine" : ""}
                  >
                    <Scale className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 z-10">
                  <div className="text-white font-bold text-lg">{formatPrice(property.price)}</div>
                </div>
              </div>
  
              <div className="p-3 sm:p-4 flex-1 flex flex-col">
                <div className="flex items-start gap-1 text-gray-500 text-xs sm:text-sm mb-1">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 shrink-0 mt-0.5" />
                  <span className="truncate">{property.location}</span>
                </div>
                <h3 className="font-semibold text-sm sm:text-lg mb-1 sm:mb-2 group-hover:text-rose-500 transition-colors line-clamp-2">
                  {property.title}
                </h3>
  
                <div className="flex items-center gap-3 mb-2 sm:mb-4 flex-wrap">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                      <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                    <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.bathrooms}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-gray-600">
                    <Maximize className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                    <span>{property.area} m²</span>
                  </div>
                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full">{property.property_type}</span>
                </div>
  
                <div className="mt-auto flex justify-between items-center">
                  <div className="text-rose-500 font-bold text-base sm:text-xl">{formatPrice(property.price)}</div>
                  <div className="text-xs text-gray-500 hidden sm:block">
                    Dodano: {new Date(property.dateAdded).toLocaleDateString("hr-HR")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )
    }
  }