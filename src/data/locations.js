const regionDetails = {
  "inner-melbourne": {
    name: "Inner Melbourne",
    title: "Inner Melbourne Taxi & Maxi Cab Service Areas",
    description: "Taxi and maxi cab bookings across Melbourne CBD, inner suburbs, hotels, hospitals, event venues, and transport hubs.",
    intro: "Inner Melbourne trips often involve hotels, venues, hospitals, offices, apartments, and tight pickup zones. Pre-booked taxi and maxi cab transport helps groups, families, wheelchair passengers, and business travellers move without splitting into multiple cars.",
    corridors: ["CityLink", "West Gate Freeway", "Kings Way", "St Kilda Road", "Hoddle Street"],
    tripTypes: ["CBD hotel transfers", "corporate travel", "events and concerts", "hospital visits", "airport connections"]
  },
  "western-suburbs": {
    name: "Western Suburbs",
    title: "Western Suburbs Taxi & Maxi Cab Service Areas",
    description: "Taxi and maxi cab bookings across Melbourne's west, including Point Cook, Werribee, Tarneit, Truganina, Sunshine, and surrounding suburbs.",
    intro: "Melbourne's west has strong demand for airport transfers, family taxi bookings, group travel, school runs, parcel delivery, and outer-suburb point-to-point trips. Larger vehicles are useful where luggage, prams, sports gear, or multiple passengers need to travel together.",
    corridors: ["M1", "M80 Ring Road", "Western Ring Road", "Ballarat Road", "Princes Freeway"],
    tripTypes: ["airport transfers", "baby seat taxi", "school runs", "group transfers", "outer-suburb taxi bookings"]
  },
  "northern-suburbs": {
    name: "Northern Suburbs",
    title: "Northern Suburbs Taxi & Maxi Cab Service Areas",
    description: "Taxi and maxi cab bookings across Melbourne's north, including Brunswick, Coburg, Preston, Reservoir, Craigieburn, Epping, and airport corridor suburbs.",
    intro: "Northern suburbs bookings often connect homes, schools, medical appointments, Melbourne Airport, shopping centres, and event venues. Pre-booking helps secure the right taxi type for passengers, luggage, accessibility, and timing.",
    corridors: ["CityLink", "M80 Ring Road", "Tullamarine Freeway", "Hume Highway", "Plenty Road"],
    tripTypes: ["airport corridor trips", "medical appointments", "wheelchair taxi", "group transfers", "parcel delivery"]
  },
  "eastern-suburbs": {
    name: "Eastern Suburbs",
    title: "Eastern Suburbs Taxi & Maxi Cab Service Areas",
    description: "Taxi and maxi cab bookings across Melbourne's east, including Hawthorn, Kew, Camberwell, Box Hill, Doncaster, Ringwood, and Glen Waverley.",
    intro: "Eastern suburbs trips often cover offices, schools, hospitals, shopping precincts, family homes, and long cross-city travel. Maxi cab and taxi bookings can be matched to passengers, luggage, child seats, accessibility, or premium comfort needs.",
    corridors: ["Eastern Freeway", "M3", "Burwood Highway", "Maroondah Highway", "Springvale Road"],
    tripTypes: ["corporate transfers", "family taxi", "wheelchair taxi", "shopping trips", "airport transfers"]
  },
  "south-eastern-suburbs": {
    name: "South Eastern Suburbs",
    title: "South Eastern Suburbs Taxi & Maxi Cab Service Areas",
    description: "Taxi and maxi cab bookings across Melbourne's south east, including Dandenong, Clayton, Springvale, Berwick, Cranbourne, Pakenham, and Frankston.",
    intro: "The south east covers busy employment zones, hospitals, universities, schools, wedding venues, and outer-suburb family travel. Pre-booked taxi and maxi cab transport is useful when the trip needs space, timing, and clear pickup instructions.",
    corridors: ["Monash Freeway", "EastLink", "Princes Highway", "South Gippsland Highway", "Nepean Highway"],
    tripTypes: ["wheelchair taxi", "student transport", "wedding transfers", "group transfers", "outer Melbourne taxi"]
  },
  "bayside-peninsula": {
    name: "Bayside & Peninsula",
    title: "Bayside & Peninsula Taxi & Maxi Cab Service Areas",
    description: "Taxi and maxi cab bookings across Bayside and the Mornington Peninsula for family trips, beach suburbs, events, winery travel, and airport transfers.",
    intro: "Bayside and Peninsula trips often involve families, luggage, prams, beach gear, wedding venues, winery tours, and longer airport connections. A planned taxi or maxi cab booking helps choose the correct vehicle before pickup.",
    corridors: ["Nepean Highway", "Beach Road", "Moorabbin corridor", "Mornington Peninsula Freeway", "EastLink"],
    tripTypes: ["family taxi", "wedding transfers", "winery trips", "airport transfers", "group travel"]
  },
  "airport-outer-melbourne": {
    name: "Airport & Outer Melbourne",
    title: "Airport & Outer Melbourne Taxi & Maxi Cab Service Areas",
    description: "Taxi and maxi cab bookings for Melbourne Airport, Avalon Airport, outer Melbourne, and selected Victorian regional destinations.",
    intro: "Airport and outer Melbourne trips need clear pickup timing, luggage planning, passenger count, and the right vehicle type. This region covers long-distance taxi and maxi cab journeys beyond short CBD rides.",
    corridors: ["Tullamarine Freeway", "M80 Ring Road", "Princes Freeway", "Western Freeway", "Calder Freeway"],
    tripTypes: ["airport transfers", "regional taxi trips", "outer-suburb pickups", "group transfers", "day trips"]
  }
};

const locationSeeds = [
  ["melbourne-cbd", "Melbourne CBD", "3000", "inner-melbourne", ["Crown Melbourne", "Southern Cross Station", "Federation Square"], ["Southbank", "Docklands", "Carlton"], ["CBD hotel transfers", "corporate travel", "silver service taxi", "parcel delivery taxi"], "Airport travel from Melbourne CBD usually follows CityLink or the Tullamarine corridor depending on traffic and pickup location."],
  ["southbank", "Southbank", "3006", "inner-melbourne", ["Crown Melbourne", "Southbank Promenade", "Melbourne Convention and Exhibition Centre"], ["Melbourne CBD", "Docklands", "South Melbourne"], ["hotel transfers", "events", "corporate transfers", "cruise transfers"], "Southbank airport trips often need luggage space because many pickups are from hotels and serviced apartments."],
  ["docklands", "Docklands", "3008", "inner-melbourne", ["Marvel Stadium", "Victoria Harbour", "Docklands waterfront"], ["Melbourne CBD", "Southbank", "Port Melbourne"], ["event transfers", "corporate travel", "group transfers", "airport transfers"], "Docklands pickups can use CityLink quickly when traffic around stadium events is planned ahead."],
  ["port-melbourne", "Port Melbourne", "3207", "inner-melbourne", ["Station Pier", "Bay Street", "Port Melbourne Beach"], ["South Melbourne", "Albert Park", "Docklands"], ["cruise transfers", "parcel delivery", "airport connections", "group transfers"], "Port Melbourne is important for Station Pier cruise transfers and luggage-heavy trips."],
  ["south-melbourne", "South Melbourne", "3205", "inner-melbourne", ["South Melbourne Market", "Clarendon Street", "Albert Park Lake"], ["Port Melbourne", "Southbank", "Albert Park"], ["market trips", "corporate transfers", "family taxi", "airport transfers"], "South Melbourne pickups can connect quickly to the West Gate or CityLink corridors."],
  ["carlton", "Carlton", "3053", "inner-melbourne", ["Lygon Street", "Royal Exhibition Building", "Melbourne Museum"], ["Fitzroy", "Melbourne CBD", "Brunswick"], ["restaurant transfers", "student transport", "silver service taxi", "group transfers"], "Carlton trips often involve restaurant precincts, university areas, and city-edge accommodation."],
  ["fitzroy", "Fitzroy", "3065", "inner-melbourne", ["Brunswick Street", "Smith Street", "Fitzroy Gardens"], ["Collingwood", "Carlton", "Abbotsford"], ["night-out transfers", "parcel delivery", "group taxi", "events"], "Fitzroy late-night bookings benefit from pre-arranged pickup points around busy streets."],
  ["collingwood", "Collingwood", "3066", "inner-melbourne", ["Smith Street", "Victoria Park", "Collingwood Yards"], ["Fitzroy", "Abbotsford", "Richmond"], ["event transfers", "corporate travel", "parcel delivery", "group transfers"], "Collingwood is close to inner-city venues and can require careful pickup notes during peak periods."],
  ["abbotsford", "Abbotsford", "3067", "inner-melbourne", ["Victoria Gardens", "Abbotsford Convent", "Yarra River"], ["Richmond", "Collingwood", "Hawthorn"], ["shopping trips", "event transfers", "group taxi", "airport transfers"], "Abbotsford trips often connect through Hoddle Street, Victoria Street, or the Eastern Freeway."],
  ["richmond", "Richmond", "3121", "inner-melbourne", ["MCG", "Swan Street", "Melbourne Park"], ["Abbotsford", "South Yarra", "Hawthorn"], ["sports transfers", "concert transfers", "corporate travel", "airport transfers"], "Richmond event pickups around the MCG and Melbourne Park should be pre-booked with a clear meeting point."],
  ["south-yarra", "South Yarra", "3141", "inner-melbourne", ["Chapel Street", "Royal Botanic Gardens", "Como Centre"], ["Prahran", "Toorak", "Richmond"], ["silver service taxi", "shopping trips", "corporate travel", "airport transfers"], "South Yarra airport trips usually need allowance for Punt Road, CityLink, or Monash Freeway traffic."],
  ["prahran", "Prahran", "3181", "inner-melbourne", ["Chapel Street", "Prahran Market", "Greville Street"], ["South Yarra", "St Kilda", "Toorak"], ["night-out transfers", "shopping trips", "baby seat taxi", "group taxi"], "Prahran bookings benefit from clear pickup instructions around busy Chapel Street venues."],
  ["toorak", "Toorak", "3142", "inner-melbourne", ["Toorak Village", "Como Park", "Yarra River"], ["South Yarra", "Prahran", "Hawthorn"], ["silver service taxi", "corporate travel", "airport transfers", "family taxi"], "Toorak trips often suit SUV, wagon, or silver service taxi requests where comfort and luggage matter."],
  ["st-kilda", "St Kilda", "3182", "inner-melbourne", ["St Kilda Beach", "Luna Park", "Palais Theatre"], ["Prahran", "Elsternwick", "Albert Park"], ["event transfers", "night-out transfers", "baby seat taxi", "airport transfers"], "St Kilda pickups for events and beachside venues should be pre-booked during weekends and public holidays."],
  ["albert-park", "Albert Park", "3206", "inner-melbourne", ["Albert Park Lake", "MSAC", "Kerferd Road Pier"], ["South Melbourne", "Port Melbourne", "St Kilda"], ["sports transfers", "family taxi", "event transfers", "airport transfers"], "Albert Park trips often connect to city venues, bayside suburbs, and airport corridors."],

  ["footscray", "Footscray", "3011", "western-suburbs", ["Footscray Market", "Victoria University", "Maribyrnong River"], ["Yarraville", "Seddon", "Sunshine"], ["parcel delivery", "student transport", "group transfers", "airport transfers"], "Footscray connects quickly to inner Melbourne, the west, and airport routes via major arterial roads."],
  ["yarraville", "Yarraville", "3013", "western-suburbs", ["Yarraville Village", "Sun Theatre", "Cruickshank Park"], ["Footscray", "Williamstown", "Altona"], ["family taxi", "event transfers", "baby seat taxi", "airport transfers"], "Yarraville trips often use the West Gate corridor for city, airport, and bayside connections."],
  ["williamstown", "Williamstown", "3016", "western-suburbs", ["Williamstown Beach", "Nelson Place", "Seaworks"], ["Yarraville", "Altona", "Altona North"], ["wedding transfers", "family taxi", "cruise connections", "group transfers"], "Williamstown taxi bookings often involve waterfront venues, events, and longer airport connections."],
  ["altona", "Altona", "3018", "western-suburbs", ["Altona Beach", "Pier Street", "Cherry Lake"], ["Altona North", "Point Cook", "Williamstown"], ["family taxi", "group transfers", "airport transfers", "outer-suburb taxi"], "Altona airport and city trips commonly use the Princes Freeway or West Gate corridor."],
  ["altona-north", "Altona North", "3025", "western-suburbs", ["Altona Gate", "Millers Road", "Paisley Park"], ["Altona", "Williamstown", "Derrimut"], ["parcel delivery", "airport transfers", "group taxi", "school runs"], "Altona North is well placed for western industrial, residential, and freeway corridor trips."],
  ["point-cook", "Point Cook", "3030", "western-suburbs", ["Point Cook Town Centre", "Sanctuary Lakes", "RAAF Museum"], ["Werribee", "Altona", "Truganina"], ["maxi cab bookings", "baby seat taxi", "airport transfers", "group transfers"], "Point Cook trips often need larger vehicles for families, luggage, prams, and airport runs."],
  ["werribee", "Werribee", "3030", "western-suburbs", ["Werribee Open Range Zoo", "Werribee Mansion", "Watton Street"], ["Point Cook", "Hoppers Crossing", "Tarneit"], ["outer Melbourne taxi", "family taxi", "group transfers", "airport transfers"], "Werribee bookings often involve longer travel to Melbourne Airport, Avalon Airport, the city, or regional destinations."],
  ["hoppers-crossing", "Hoppers Crossing", "3029", "western-suburbs", ["Pacific Werribee", "Hoppers Crossing Station", "Old Geelong Road"], ["Werribee", "Tarneit", "Truganina"], ["shopping trips", "baby seat taxi", "school runs", "airport transfers"], "Hoppers Crossing taxi bookings often need careful timing around shopping precincts and school travel."],
  ["tarneit", "Tarneit", "3029", "western-suburbs", ["Tarneit Central", "Tarneit Station", "Davis Creek"], ["Hoppers Crossing", "Truganina", "Werribee"], ["baby seat taxi", "maxi cab bookings", "school runs", "airport transfers"], "Tarneit is a priority suburb for family taxi, baby seat, school, and airport transfer searches."],
  ["truganina", "Truganina", "3029", "western-suburbs", ["Truganina industrial precincts", "Dohertys Creek", "Leakes Road"], ["Tarneit", "Derrimut", "Point Cook"], ["parcel delivery", "worker transport", "group transfers", "airport transfers"], "Truganina trips often involve industrial estates, warehouses, family homes, and freeway access."],
  ["derrimut", "Derrimut", "3026", "western-suburbs", ["Derrimut Village", "Boundary Road", "Industrial precincts"], ["Truganina", "Sunshine", "St Albans"], ["parcel delivery", "corporate transfers", "airport transfers", "worker transport"], "Derrimut is useful for parcel delivery taxi and business transport across Melbourne's west."],
  ["sunshine", "Sunshine", "3020", "western-suburbs", ["Sunshine Marketplace", "Sunshine Station", "Kororoit Creek"], ["St Albans", "Footscray", "Derrimut"], ["airport transfers", "student transport", "wheelchair taxi", "parcel delivery"], "Sunshine is a western transport hub with strong connections to the airport, CBD, and nearby suburbs."],
  ["caroline-springs", "Caroline Springs", "3023", "western-suburbs", ["Caroline Springs Square", "Lake Caroline", "CS Square"], ["St Albans", "Burnside", "Sydenham"], ["family taxi", "baby seat taxi", "group transfers", "airport transfers"], "Caroline Springs airport and family bookings often require extra space for luggage and prams."],
  ["st-albans", "St Albans", "3021", "western-suburbs", ["St Albans Station", "Main Road West", "Errington Reserve"], ["Sunshine", "Caroline Springs", "Derrimut"], ["airport transfers", "wheelchair taxi", "school runs", "parcel delivery"], "St Albans trips often connect residential pickups with hospitals, schools, shops, and airport corridors."],

  ["brunswick", "Brunswick", "3056", "northern-suburbs", ["Sydney Road", "Brunswick Station", "Barkly Square"], ["Coburg", "Carlton", "Northcote"], ["night-out transfers", "parcel delivery", "group taxi", "airport transfers"], "Brunswick pickups around Sydney Road should include clear meeting points for busy evenings."],
  ["coburg", "Coburg", "3058", "northern-suburbs", ["Coburg Lake", "Sydney Road", "Coburg Station"], ["Brunswick", "Preston", "Thornbury"], ["family taxi", "airport transfers", "school runs", "wheelchair taxi"], "Coburg is well placed for northern suburb, city, and airport corridor taxi bookings."],
  ["preston", "Preston", "3072", "northern-suburbs", ["Preston Market", "High Street", "Northland Shopping Centre"], ["Reservoir", "Thornbury", "Coburg"], ["shopping trips", "wheelchair taxi", "group transfers", "airport transfers"], "Preston trips often involve shopping, medical appointments, family travel, and northern airport routes."],
  ["reservoir", "Reservoir", "3073", "northern-suburbs", ["Edwardes Lake", "Reservoir Station", "Broadway"], ["Preston", "Epping", "Bundoora"], ["school runs", "wheelchair taxi", "family taxi", "airport transfers"], "Reservoir bookings can involve longer cross-suburb travel and benefit from pre-booking."],
  ["thornbury", "Thornbury", "3071", "northern-suburbs", ["High Street", "Penders Park", "Thornbury Theatre"], ["Northcote", "Preston", "Brunswick"], ["event transfers", "night-out transfers", "group taxi", "airport transfers"], "Thornbury event and restaurant pickups should be planned around High Street traffic and venue timing."],
  ["northcote", "Northcote", "3070", "northern-suburbs", ["High Street", "Northcote Plaza", "All Nations Park"], ["Thornbury", "Fitzroy", "Brunswick"], ["night-out transfers", "family taxi", "parcel delivery", "airport transfers"], "Northcote trips often connect inner north venues with homes, stations, and airport travel."],
  ["essendon", "Essendon", "3040", "northern-suburbs", ["Essendon Fields", "Mount Alexander Road", "Windy Hill"], ["Airport West", "Moonee Ponds", "Tullamarine"], ["airport transfers", "silver service taxi", "corporate transfers", "family taxi"], "Essendon is close to airport corridors and suits pre-booked airport, business, and family trips."],
  ["airport-west", "Airport West", "3042", "northern-suburbs", ["Westfield Airport West", "Matthews Avenue", "Essendon Fields"], ["Essendon", "Tullamarine", "Broadmeadows"], ["airport transfers", "parcel delivery", "corporate transfers", "group taxi"], "Airport West trips can connect quickly to Tullamarine, Essendon Fields, and the M80."],
  ["tullamarine", "Tullamarine", "3043", "airport-outer-melbourne", ["Melbourne Airport", "URBNSURF", "Airport Drive"], ["Airport West", "Broadmeadows", "Greenvale"], ["airport transfers", "maxi cab bookings", "baby seat taxi", "group transfers"], "Tullamarine is the main Melbourne Airport corridor and is a priority page for luggage-heavy taxi bookings."],
  ["broadmeadows", "Broadmeadows", "3047", "northern-suburbs", ["Broadmeadows Central", "Broadmeadows Station", "Hume Global Learning Centre"], ["Tullamarine", "Craigieburn", "Greenvale"], ["airport transfers", "school runs", "wheelchair taxi", "parcel delivery"], "Broadmeadows is close to the airport and useful for northern suburb taxi bookings."],
  ["craigieburn", "Craigieburn", "3064", "northern-suburbs", ["Craigieburn Central", "Craigieburn Station", "Hume Highway"], ["Broadmeadows", "Epping", "Greenvale"], ["outer Melbourne taxi", "family taxi", "school runs", "airport transfers"], "Craigieburn airport trips are common and should be pre-booked for early flights or larger groups."],
  ["epping", "Epping", "3076", "northern-suburbs", ["Pacific Epping", "Epping Station", "Northern Hospital"], ["Reservoir", "Craigieburn", "Thomastown"], ["medical taxi", "wheelchair taxi", "school runs", "airport transfers"], "Epping bookings often involve hospital appointments, family travel, and outer-north airport connections."],
  ["greenvale", "Greenvale", "3059", "northern-suburbs", ["Greenvale Reservoir", "Greenvale Shopping Centre", "Somerton Road"], ["Tullamarine", "Craigieburn", "Broadmeadows"], ["airport transfers", "family taxi", "SUV taxi", "group transfers"], "Greenvale is close to Melbourne Airport and suits family, SUV, and pre-booked airport taxi needs."],

  ["hawthorn", "Hawthorn", "3122", "eastern-suburbs", ["Glenferrie Road", "Swinburne University", "Yarra River"], ["Kew", "Richmond", "Camberwell"], ["student transport", "corporate transfers", "silver service taxi", "airport transfers"], "Hawthorn trips often connect schools, university areas, offices, and inner-east homes."],
  ["kew", "Kew", "3101", "eastern-suburbs", ["Kew Junction", "Studley Park", "Yarra Bend"], ["Hawthorn", "Camberwell", "Templestowe"], ["silver service taxi", "school runs", "family taxi", "airport transfers"], "Kew taxi bookings often need reliable timing for schools, appointments, and airport travel."],
  ["camberwell", "Camberwell", "3124", "eastern-suburbs", ["Camberwell Junction", "Rivoli Cinemas", "Burke Road"], ["Hawthorn", "Kew", "Box Hill"], ["shopping trips", "school runs", "silver service taxi", "airport transfers"], "Camberwell trips often involve shopping precincts, schools, and inner-east arterial roads."],
  ["box-hill", "Box Hill", "3128", "eastern-suburbs", ["Box Hill Central", "Box Hill Hospital", "Whitehorse Road"], ["Doncaster", "Blackburn", "Camberwell"], ["medical taxi", "wheelchair taxi", "parcel delivery", "airport transfers"], "Box Hill is a major eastern hub for hospital, shopping, business, and group taxi bookings."],
  ["doncaster", "Doncaster", "3108", "eastern-suburbs", ["Westfield Doncaster", "Doncaster Road", "Ruffey Lake Park"], ["Box Hill", "Templestowe", "Kew"], ["shopping trips", "family taxi", "SUV taxi", "airport transfers"], "Doncaster airport trips often use the Eastern Freeway and CityLink depending on timing."],
  ["templestowe", "Templestowe", "3106", "eastern-suburbs", ["Templestowe Village", "Westerfolds Park", "Manningham Road"], ["Doncaster", "Box Hill", "Ringwood"], ["wheelchair taxi", "family taxi", "outer Melbourne taxi", "airport transfers"], "Templestowe is a priority suburb for wheelchair-accessible taxi and planned family transport."],
  ["ringwood", "Ringwood", "3134", "eastern-suburbs", ["Eastland", "Ringwood Station", "Ringwood Lake"], ["Croydon", "Mitcham", "Doncaster"], ["shopping trips", "group transfers", "outer Melbourne taxi", "airport transfers"], "Ringwood trips often connect eastern suburbs, EastLink, and longer airport or regional routes."],
  ["croydon", "Croydon", "3136", "eastern-suburbs", ["Croydon Main Street", "Croydon Station", "Wyreena"], ["Ringwood", "Bayswater", "Mooroolbark"], ["outer Melbourne taxi", "family taxi", "school runs", "airport transfers"], "Croydon bookings can involve longer eastern suburb travel and should be pre-booked for early airport trips."],
  ["glen-waverley", "Glen Waverley", "3150", "eastern-suburbs", ["The Glen", "Kingsway", "Glen Waverley Station"], ["Mount Waverley", "Mulgrave", "Blackburn"], ["family taxi", "corporate transfers", "baby seat taxi", "airport transfers"], "Glen Waverley trips often involve restaurants, schools, offices, and family airport travel."],
  ["mount-waverley", "Mount Waverley", "3149", "eastern-suburbs", ["Mount Waverley Village", "Syndal", "Valley Reserve"], ["Glen Waverley", "Box Hill", "Clayton"], ["school runs", "family taxi", "SUV taxi", "airport transfers"], "Mount Waverley bookings often need extra space for family travel, school runs, and airport luggage."],
  ["nunawading", "Nunawading", "3131", "eastern-suburbs", ["Nunawading Station", "Whitehorse Road", "Brand Smart"], ["Blackburn", "Mitcham", "Box Hill"], ["parcel delivery", "shopping trips", "group taxi", "airport transfers"], "Nunawading is useful for eastern suburb shopping, business, and parcel delivery taxi trips."],
  ["blackburn", "Blackburn", "3130", "eastern-suburbs", ["Blackburn Lake", "Blackburn Station", "Whitehorse Road"], ["Box Hill", "Nunawading", "Doncaster"], ["family taxi", "wheelchair taxi", "school runs", "airport transfers"], "Blackburn bookings often connect homes, schools, medical appointments, and eastern transport corridors."],

  ["dandenong", "Dandenong", "3175", "south-eastern-suburbs", ["Dandenong Market", "Dandenong Hospital", "Drum Theatre"], ["Noble Park", "Springvale", "Clayton"], ["wheelchair taxi", "parcel delivery", "group transfers", "airport transfers"], "Dandenong is a priority suburb for wheelchair taxi, parcel delivery, group transport, and outer-suburb taxi searches."],
  ["clayton", "Clayton", "3168", "south-eastern-suburbs", ["Monash Medical Centre", "Monash University", "Clayton Station"], ["Springvale", "Mulgrave", "Mount Waverley"], ["medical taxi", "student transport", "wheelchair taxi", "airport transfers"], "Clayton trips often involve hospitals, university travel, student bookings, and accessibility needs."],
  ["springvale", "Springvale", "3171", "south-eastern-suburbs", ["Springvale Shopping Centre", "Springvale Station", "Springvale Botanical Cemetery"], ["Dandenong", "Clayton", "Noble Park"], ["family taxi", "parcel delivery", "wheelchair taxi", "airport transfers"], "Springvale bookings often need clear pickup notes around shopping precincts and station areas."],
  ["mulgrave", "Mulgrave", "3170", "south-eastern-suburbs", ["Wellington Road", "Monash Freeway", "Waverley Park"], ["Clayton", "Glen Waverley", "Springvale"], ["corporate transfers", "parcel delivery", "SUV taxi", "airport transfers"], "Mulgrave is strong for business, industrial, and Monash Freeway taxi corridors."],
  ["noble-park", "Noble Park", "3174", "south-eastern-suburbs", ["Noble Park Station", "Ross Reserve", "Douglas Street"], ["Dandenong", "Springvale", "Keysborough"], ["school runs", "family taxi", "wheelchair taxi", "airport transfers"], "Noble Park taxi bookings often involve residential pickups, schools, medical trips, and group travel."],
  ["berwick", "Berwick", "3806", "south-eastern-suburbs", ["Berwick Village", "Federation University", "Casey Hospital"], ["Narre Warren", "Cranbourne", "Pakenham"], ["school runs", "medical taxi", "outer Melbourne taxi", "airport transfers"], "Berwick is a priority area for school runs, medical travel, and longer outer-suburb taxi trips."],
  ["narre-warren", "Narre Warren", "3805", "south-eastern-suburbs", ["Westfield Fountain Gate", "Narre Warren Station", "Bunjil Place"], ["Berwick", "Cranbourne", "Dandenong"], ["shopping trips", "event transfers", "family taxi", "airport transfers"], "Narre Warren bookings often connect Fountain Gate, homes, events, and Monash Freeway routes."],
  ["cranbourne", "Cranbourne", "3977", "south-eastern-suburbs", ["Cranbourne Park", "Royal Botanic Gardens Cranbourne", "Cranbourne Station"], ["Berwick", "Frankston", "Pakenham"], ["outer Melbourne taxi", "family taxi", "school runs", "airport transfers"], "Cranbourne airport and city trips are longer and benefit from pre-booked timing and vehicle selection."],
  ["pakenham", "Pakenham", "3810", "south-eastern-suburbs", ["Pakenham Central", "Pakenham Station", "Cardinia Road"], ["Berwick", "Cranbourne", "Narre Warren"], ["outer Melbourne taxi", "school runs", "group transfers", "airport transfers"], "Pakenham is an outer-southeast anchor for longer taxi, group, and airport trips."],
  ["frankston", "Frankston", "3199", "south-eastern-suburbs", ["Frankston Beach", "Bayside Centre", "Frankston Hospital"], ["Mornington", "Mordialloc", "Cranbourne"], ["medical taxi", "wedding transfers", "outer Melbourne taxi", "airport transfers"], "Frankston connects bayside, Peninsula, hospital, and longer airport taxi requirements."],
  ["cheltenham", "Cheltenham", "3192", "south-eastern-suburbs", ["Southland Shopping Centre", "Cheltenham Station", "Charman Road"], ["Moorabbin", "Mentone", "Bentleigh"], ["shopping trips", "family taxi", "baby seat taxi", "airport transfers"], "Cheltenham trips often involve Southland, family pickups, and bayside-to-airport travel."],
  ["moorabbin", "Moorabbin", "3189", "south-eastern-suburbs", ["Moorabbin Airport", "Moorabbin Station", "Industrial precincts"], ["Cheltenham", "Bentleigh", "Mentone"], ["parcel delivery", "corporate transfers", "airport transfers", "SUV taxi"], "Moorabbin is useful for business, airport, parcel, and industrial-area taxi bookings."],
  ["bentleigh", "Bentleigh", "3204", "south-eastern-suburbs", ["Centre Road", "Bentleigh Station", "Allnutt Park"], ["Caulfield", "Moorabbin", "Brighton"], ["family taxi", "school runs", "baby seat taxi", "airport transfers"], "Bentleigh bookings often involve family travel, school runs, and southeast-to-airport connections."],

  ["brighton", "Brighton", "3186", "bayside-peninsula", ["Brighton Beach", "Church Street", "Dendy Street Beach"], ["Elsternwick", "Sandringham", "Bentleigh"], ["family taxi", "silver service taxi", "wedding transfers", "airport transfers"], "Brighton bookings often suit family, premium, beachside, wedding, and airport travel."],
  ["elsternwick", "Elsternwick", "3185", "bayside-peninsula", ["Glen Huntly Road", "Classic Cinemas", "Elsternwick Station"], ["St Kilda", "Caulfield", "Brighton"], ["family taxi", "night-out transfers", "baby seat taxi", "airport transfers"], "Elsternwick trips connect inner south, bayside suburbs, and family taxi demand."],
  ["caulfield", "Caulfield", "3162", "bayside-peninsula", ["Caulfield Racecourse", "Monash University Caulfield", "Caulfield Station"], ["Elsternwick", "Bentleigh", "Prahran"], ["race day transfers", "student transport", "group taxi", "airport transfers"], "Caulfield has strong event, race day, student, and group transfer demand."],
  ["sandringham", "Sandringham", "3191", "bayside-peninsula", ["Sandringham Beach", "Sandringham Village", "Sandringham Yacht Club"], ["Brighton", "Mentone", "Mordialloc"], ["family taxi", "wedding transfers", "group transfers", "airport transfers"], "Sandringham taxi bookings often involve bayside venues, family travel, and longer airport trips."],
  ["mordialloc", "Mordialloc", "3195", "bayside-peninsula", ["Mordialloc Beach", "Mordialloc Creek", "Main Street"], ["Mentone", "Frankston", "Cheltenham"], ["family taxi", "event transfers", "group taxi", "airport transfers"], "Mordialloc connects bayside venues, family homes, and Peninsula routes."],
  ["mentone", "Mentone", "3194", "bayside-peninsula", ["Mentone Beach", "Mentone Station", "Como Parade"], ["Cheltenham", "Mordialloc", "Sandringham"], ["school runs", "family taxi", "baby seat taxi", "airport transfers"], "Mentone bookings often need timing around schools, family pickups, and bayside arterial roads."],
  ["mornington", "Mornington", "3931", "bayside-peninsula", ["Mornington Main Street", "Mornington Pier", "Peninsula wineries"], ["Frankston", "Mordialloc", "Dromana"], ["wedding transfers", "winery trips", "group transfers", "airport transfers"], "Mornington is a priority area for group transfers, winery trips, weddings, and longer airport taxi bookings."],
  ["geelong", "Geelong", "3220", "airport-outer-melbourne", ["Geelong Waterfront", "Avalon Airport", "GMHBA Stadium"], ["Werribee", "Point Cook", "Ballarat"], ["outer Melbourne taxi", "group transfers", "airport transfers", "regional taxi"], "Geelong bookings often connect Avalon Airport, Melbourne Airport, events, and regional group travel."],
  ["ballarat", "Ballarat", "3350", "airport-outer-melbourne", ["Sovereign Hill", "Lake Wendouree", "Ballarat Station"], ["Geelong", "Bendigo", "Melbourne CBD"], ["regional taxi", "group transfers", "day trips", "airport transfers"], "Ballarat is a regional anchor for planned long-distance taxi and maxi cab bookings."],
  ["bendigo", "Bendigo", "3550", "airport-outer-melbourne", ["Bendigo Art Gallery", "Rosalind Park", "Bendigo Station"], ["Ballarat", "Melbourne CBD", "Tullamarine"], ["regional taxi", "group transfers", "corporate travel", "airport transfers"], "Bendigo bookings require advance planning for long-distance airport, business, and group trips."],
  ["yarra-valley", "Yarra Valley", "3775", "airport-outer-melbourne", ["Healesville Sanctuary", "Yarra Valley wineries", "Domaine Chandon"], ["Ringwood", "Croydon", "Mornington"], ["wedding transfers", "winery tours", "group transfers", "day trips"], "Yarra Valley trips often involve winery, wedding, and group bookings where no one should need to drive."]
];

const serviceHighlightsByTrip = {
  "baby seat taxi": "Child-seat requests can be noted during booking so the right vehicle setup is planned before pickup.",
  "wheelchair taxi": "Wheelchair and mobility requirements should be included with the booking so accessible transport can be arranged.",
  "parcel delivery": "Parcel-only taxi delivery can be useful for urgent point-to-point documents, bags, or small items.",
  "group transfers": "Maxi cab bookings help groups travel together with luggage, prams, sports gear, or event equipment.",
  "airport transfers": "Airport taxi bookings should include flight details, luggage needs, passenger count, and pickup instructions.",
  "school runs": "Pre-booked school and student transport can be planned around timing, passengers, and equipment.",
  "wedding transfers": "Wedding and event bookings can include venue-to-venue transfers and late-night return travel.",
  "silver service taxi": "Silver service taxi requests suit business travel, appointments, and premium point-to-point trips.",
  "SUV taxi": "SUV and wagon taxi requests are useful when passengers need extra luggage space without a full maxi cab.",
  "outer Melbourne taxi": "Outer Melbourne taxi bookings are best planned ahead for longer routes and multiple passengers."
};

function unique(items) {
  return [...new Set(items)].filter(Boolean);
}

function buildFaq(location, region) {
  return [
    {
      q: `Can I book a taxi or maxi cab in ${location.name}?`,
      a: `Yes. You can pre-book taxi and maxi cab transport in ${location.name} for local trips, group transfers, airport travel, appointments, events, and outer Melbourne journeys.`
    },
    {
      q: `What taxi services are popular in ${location.name}?`,
      a: `${location.name} bookings commonly include ${location.popularTripTypes.slice(0, 3).join(", ")}, with vehicle choice based on passengers, luggage, accessibility, and timing.`
    },
    {
      q: `Do you cover nearby suburbs around ${location.name}?`,
      a: `Yes. Nearby suburbs such as ${location.nearbySuburbs.join(", ")} can be included in pickup, drop-off, and multi-stop booking requests.`
    }
  ];
}

const locations = locationSeeds.map(([slug, name, postcode, region, poi, nearbySuburbs, popularTripTypes, airportRouteNote]) => {
  const regionMeta = regionDetails[region];
  const transportCorridors = regionMeta.corridors;
  const serviceHighlights = unique(popularTripTypes.map((trip) => serviceHighlightsByTrip[trip]).filter(Boolean)).slice(0, 4);
  const loc = {
    slug,
    name,
    postcode,
    region,
    nearbySuburbs,
    poi,
    transportCorridors,
    popularTripTypes,
    airportRouteNote,
    shortDescription: `Book taxi and maxi cab services in ${name} for ${popularTripTypes.slice(0, 3).join(", ")}, luggage-friendly travel, and pre-booked Melbourne transport.`,
    serviceHighlights,
    faq: []
  };
  loc.faq = buildFaq(loc, regionMeta);
  return loc;
});

export { regionDetails };
export default locations;
