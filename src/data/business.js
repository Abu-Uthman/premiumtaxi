const siteUrl = "https://www.premiummaxicab.com.au/";

const business = {
  name: "Premium Maxi Taxi Melbourne",
  shortName: "Premium Maxi Taxi",
  domain: "premiummaxicab.com.au",
  url: siteUrl,
  phoneDisplay: "0474 707 005",
  phoneHref: "tel:+61474707005",
  telephone: "+61474707005",
  secondaryPhoneDisplay: "0424 438 088",
  secondaryPhoneHref: "tel:+61424438088",
  secondaryTelephone: "+61424438088",
  email: "booking@premiummaxicab.com.au",
  emailHref: "mailto:booking@premiummaxicab.com.au",
  serviceAreaMode: "Service-area business",
  publicAddressPolicy: "Address hidden for service-area bookings",
  serviceAreaLabel: "Melbourne and Victoria",
  primaryServiceAreas: [
    "Melbourne",
    "Melbourne Airport",
    "Avalon Airport",
    "Geelong",
    "Ballarat",
    "Bendigo",
    "Mornington Peninsula",
    "Yarra Valley",
    "Phillip Island",
    "Great Ocean Road"
  ],
  description:
    "Premium Maxi Taxi Melbourne supports Melbourne and Victorian taxi, maxi cab, airport, family, accessibility, parcel, event, school, corporate, and regional booking requests.",
  schemaId: `${siteUrl}#business`,
};

export function getBusinessUrl(path = "/") {
  return new URL(path, business.url).href;
}

export function getBusinessContactPoint() {
  return [
    {
      "@type": "ContactPoint",
      telephone: business.telephone,
      email: business.email,
      contactType: "primary bookings",
      areaServed: "AU-VIC",
      availableLanguage: "en-AU"
    },
    {
      "@type": "ContactPoint",
      telephone: business.secondaryTelephone,
      email: business.email,
      contactType: "booking enquiries",
      areaServed: "AU-VIC",
      availableLanguage: "en-AU"
    }
  ];
}

export function getBusinessProviderSchema() {
  return {
    "@type": ["LocalBusiness", "TaxiService"],
    "@id": business.schemaId,
    name: business.name,
    url: business.url,
    telephone: business.telephone,
    additionalProperty: {
      "@type": "PropertyValue",
      name: "Secondary booking phone",
      value: business.secondaryTelephone
    },
    email: business.email,
    areaServed: [
      { "@type": "City", name: "Melbourne" },
      { "@type": "AdministrativeArea", name: "Victoria" }
    ]
  };
}

export function getBusinessSchema(imageUrl) {
  return {
    "@context": "https://schema.org",
    ...getBusinessProviderSchema(),
    image: imageUrl,
    description: business.description,
    priceRange: "$$",
    contactPoint: getBusinessContactPoint(),
    serviceArea: {
      "@type": "AdministrativeArea",
      name: "Victoria"
    },
    knowsAbout: [
      "Maxi taxi bookings",
      "Airport taxi transfers",
      "Wheelchair accessible taxi requests",
      "Baby seat taxi requests",
      "Parcel delivery by taxi",
      "Group transport",
      "Regional Victorian taxi trips"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Premium Maxi Taxi Melbourne Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Maxi Cab Melbourne" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Airport Taxi Melbourne" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wheelchair Accessible Taxi Melbourne" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Baby Seat Taxi Melbourne" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Parcel Delivery Taxi Melbourne" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate Transfers Melbourne" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding and Event Transfers Melbourne" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Outer Melbourne Taxi" } }
      ]
    }
  };
}

export default business;
