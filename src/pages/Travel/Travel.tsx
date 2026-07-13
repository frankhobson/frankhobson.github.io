import React, { useState, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "@vnedyalk0v/react19-simple-maps";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Feature, FeatureCollection } from "geojson";
type Longitude = number & { __brand: "longitude" };
type Latitude = number & { __brand: "latitude" };
import { travelLocations } from "../../data/mockData";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import type { TravelLocation } from "../../types";
import styles from "./Travel.module.css";
import { COUNTRY_ISO_MAP, STATE_OPTIONS } from "../../data/geoData";

// Special countries that have state-level drill down
const SPECIAL_COUNTRIES = {
  USA: {
    name: "United States",
    code: "USA",
    file: "/maps/countries/usa.json",
    center: [-96, 38] as [number, number],
    scale: 900,
  },
  AUS: {
    name: "Australia",
    code: "AUS",
    file: "/maps/countries/australia.json",
    center: [133, -25] as [number, number],
    scale: 650,
  },
  VNM: {
    name: "Vietnam",
    code: "VNM",
    file: "/maps/countries/vietnam.json",
    center: [106, 16] as [number, number],
    scale: 1800,
  },
  ARG: {
    name: "Argentina",
    code: "ARG",
    file: "/maps/countries/argentina.json",
    center: [-65, -38] as [number, number],
    scale: 650,
  },
};

const VIETNAM_CONSOLIDATION_MAP: Record<string, string> = {
  "VN-CB": "VN-CB",
  "VN-DB": "VN-DB",
  "VN-328": "VN-328",
  "VN-LI": "VN-LI",
  "VN-LS": "VN-LS",
  "VN-NA": "VN-NA",
  "VN-QN": "VN-QN",
  "VN-TH": "VN-TH",
  "VN-311": "VN-311",
  "VN-318": "VN-318",
  "VN-TT": "VN-TT",
  "VN-KG": "VN-AG",
  "VN-AG": "VN-AG",
  "VN-BG": "VN-BN",
  "VN-BN": "VN-BN",
  "VN-BL": "VN-CM",
  "VN-CM": "VN-CM",
  "VN-ST": "VN-333",
  "VN-337": "VN-333",
  "VN-333": "VN-333",
  "VN-300": "VN-DA",
  "VN-DA": "VN-DA",
  "VN-PY": "VN-723",
  "VN-723": "VN-723",
  "VN-BP": "VN-331",
  "VN-331": "VN-331",
  "VN-TG": "VN-DT",
  "VN-DT": "VN-DT",
  "VN-BD": "VN-724",
  "VN-724": "VN-724",
  "VN-BI": "VN-HC",
  "VN-BV": "VN-HC",
  "VN-HC": "VN-HC",
  "VN-HD": "VN-3623",
  "VN-3623": "VN-3623",
  "VN-TB": "VN-317",
  "VN-317": "VN-317",
  "VN-NT": "VN-KH",
  "VN-KH": "VN-KH",
  "VN-BU": "VN-LD",
  "VN-6365": "VN-LD",
  "VN-LD": "VN-LD",
  "VN-YB": "VN-LO",
  "VN-LO": "VN-LO",
  "VN-HM": "VN-NB",
  "VN-ND": "VN-NB",
  "VN-NB": "VN-NB",
  "VN-HO": "VN-PT",
  "VN-VC": "VN-PT",
  "VN-PT": "VN-PT",
  "VN-299": "VN-QG",
  "VN-QG": "VN-QG",
  "VN-LA": "VN-TN",
  "VN-TN": "VN-TN",
  "VN-307": "VN-TY",
  "VN-TY": "VN-TY",
  "VN-HG": "VN-TQ",
  "VN-TQ": "VN-TQ",
  "VN-BR": "VN-VL",
  "VN-TV": "VN-VL",
  "VN-VL": "VN-VL",
  "VN-QB": "VN-QT",
  "VN-QT": "VN-QT",
};

const getConsolidatedStateCode = (hcKey: string): string => {
  const formattedKey = hcKey.toUpperCase();
  if (formattedKey.startsWith("VN-")) {
    return VIETNAM_CONSOLIDATION_MAP[formattedKey] || formattedKey;
  }
  return formattedKey;
};

const getSubdivisionName = (hcKey: string, defaultName: string) => {
  const consolidatedKey = getConsolidatedStateCode(hcKey);
  if (consolidatedKey.startsWith("VN-")) {
    const stateOpt = STATE_OPTIONS.VNM.find((s) => s.code === consolidatedKey);
    return stateOpt ? stateOpt.name : defaultName;
  }
  return defaultName;
};

const SMALL_TERRITORIES = [
  {
    id: "FJI",
    name: "Fiji",
    coordinates: [178.065, -17.7134] as any,
    type: "world",
  },
  {
    id: "SGP",
    name: "Singapore",
    coordinates: [103.8519, 1.2902] as any,
    type: "world",
  },
  {
    id: "AU-ACT",
    name: "Australian Capital Territory",
    coordinates: [149.1287, -35.2809] as any,
    type: "AUS",
  },
  {
    id: "AR-DF",
    name: "Ciudad de Buenos Aires",
    coordinates: [-58.3816, -34.6037] as any,
    type: "ARG",
  },
];

const getTravelImagePath = (img?: string) => {
  if (!img) return "/images/travel/default.png";
  if (
    img.startsWith("http://") ||
    img.startsWith("https://") ||
    img.startsWith("/")
  ) {
    return img;
  }
  return `/images/travel/${img}`;
};
interface MapProperties {
  name?: string;
  id?: string | number;
  "hc-key"?: string;
  "iso-a3"?: string;
  iso_a3?: string;
}

// Map standard world-atlas numeric IDs to our 3-letter ISO codes
// COUNTRY_ISO_MAP imported from src/data/geoData

export const Travel: React.FC = () => {
  const [travelDataList] = useLocalStorageState<TravelLocation[]>(
    "portfolio_travel",
    travelLocations,
  );
  const [worldMapData, setWorldMapData] = useState<FeatureCollection | null>(
    null,
  );
  const [countryMapData, setCountryMapData] =
    useState<FeatureCollection | null>(null);
  const [zoomCountry, setZoomCountry] = useState<
    keyof typeof SPECIAL_COUNTRIES | null
  >(null);
  const [selectedLocation, setSelectedLocation] =
    useState<TravelLocation | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    setCarouselIndex(0);
  }, [selectedLocation]);

  useEffect(() => {
    if (!selectedLocation) return;

    const primaryImage = selectedLocation.image;
    const additionalImages = selectedLocation.images || [];
    const images = [
      primaryImage,
      ...additionalImages.filter((img) => img !== primaryImage),
    ].filter(Boolean);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedLocation(null);
      } else if (e.key === "ArrowLeft") {
        if (images.length > 1) {
          setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        }
      } else if (e.key === "ArrowRight") {
        if (images.length > 1) {
          setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedLocation]);

  useEffect(() => {
    document.title = "Travel | Frank Hobson";
  }, []);

  // Load World Map on mount
  useEffect(() => {
    setMapLoading(true);
    fetch("/maps/world-110m.json")
      .then((res) => res.json())
      .then((data) => {
        setWorldMapData(data);
        setMapLoading(false);
      })
      .catch((err) => {
        console.error("Error loading world map:", err);
        setMapLoading(false);
      });
  }, []);

  // Load country map when zoomed in
  useEffect(() => {
    if (!zoomCountry) {
      setCountryMapData(null);
      return;
    }

    setMapLoading(true);
    const countryConfig = SPECIAL_COUNTRIES[zoomCountry];
    fetch(countryConfig.file)
      .then((res) => res.json())
      .then((data) => {
        setCountryMapData(data);
        setMapLoading(false);
      })
      .catch((err) => {
        console.error(`Error loading map for ${zoomCountry}:`, err);
        setMapLoading(false);
      });
  }, [zoomCountry]);

  // Visited country ISO Codes
  const visitedCountryCodes = travelDataList.map(
    (loc) => loc.visitedCountryCode,
  );

  // Helper to extract standard 3-letter ISO code from map geometry
  const getIsoA3 = (geo: Feature) => {
    const numericId =
      geo.id !== undefined
        ? String(geo.id)
        : geo.properties &&
            (geo.properties as Record<string, any>).id !== undefined
          ? String((geo.properties as Record<string, any>).id)
          : "";
    if (numericId && numericId in COUNTRY_ISO_MAP) {
      return COUNTRY_ISO_MAP[numericId as keyof typeof COUNTRY_ISO_MAP];
    }
    const props = (geo.properties || {}) as MapProperties;
    return props["iso-a3"] || props["iso_a3"] || "";
  };

  // Helper to check if a country is visited
  const isCountryVisited = (isoA3: string) => {
    return visitedCountryCodes.includes(isoA3);
  };

  // Helper to get travel data for a standard visited country (non-drilldown)
  const getCountryTravelData = (isoA3: string) => {
    // If it's a special country, clicking it zooms in instead of showing a card
    if (Object.keys(SPECIAL_COUNTRIES).includes(isoA3)) return null;
    return (
      travelDataList.find((loc) => loc.visitedCountryCode === isoA3) || null
    );
  };

  // Helper to get state travel data
  const getStateTravelData = (stateHcKey: string) => {
    const consolidatedKey = getConsolidatedStateCode(stateHcKey);
    return (
      travelDataList.find((loc) => loc.stateCode === consolidatedKey) || null
    );
  };

  const handleCountryClick = (geo: Feature) => {
    const isoA3 = getIsoA3(geo);

    // 1. If it's one of the 4 special countries, zoom into it
    if (Object.keys(SPECIAL_COUNTRIES).includes(isoA3)) {
      setZoomCountry(isoA3 as keyof typeof SPECIAL_COUNTRIES);
      setSelectedLocation(null);
      return;
    }

    // 2. If it's a regular visited country, show its travel card
    const travelData = getCountryTravelData(isoA3);
    if (travelData) {
      setSelectedLocation(travelData);
    }
  };

  const handleStateClick = (geo: Feature) => {
    const props = (geo.properties || {}) as MapProperties;
    const hcKey = props["hc-key"] || "";
    const travelData = getStateTravelData(hcKey);
    if (travelData) {
      setSelectedLocation(travelData);
    }
  };

  const handleBackToWorld = () => {
    setZoomCountry(null);
    setSelectedLocation(null);
    setHoveredArea(null);
    setHoveredStateCode(null);
  };

  // Determine which map configuration to use
  const activeMapData = zoomCountry ? countryMapData : worldMapData;
  const projectionName = zoomCountry
    ? zoomCountry === "USA"
      ? "geoAlbersUsa"
      : "geoMercator"
    : "geoEqualEarth";
  const mapCenter = zoomCountry
    ? (SPECIAL_COUNTRIES[zoomCountry].center as [number, number])
    : ([0, 0] as [number, number]);
  const mapScale = zoomCountry ? SPECIAL_COUNTRIES[zoomCountry].scale : 140;

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerInner}>
          <span className={styles.sectionLabel}>Travel Map</span>
          <h1 className={styles.title}>Travel Journal</h1>
          <p className={styles.subtitle}>
            {zoomCountry
              ? `Exploring visited regions in ${SPECIAL_COUNTRIES[zoomCountry].name}. Click highlighted states/provinces to see trip details.`
              : "An interactive world map highlighting the countries I've visited. Click a highlighted country to explore my trips. Countries with darker shading are countries I have lived in, and you can view them in more detail than the others!"}
          </p>
        </div>
      </header>

      <div className={styles.mapWorkspace}>
        {/* Map Container */}
        <div className={styles.mapFrame}>
          {zoomCountry && (
            <button className={styles.backButton} onClick={handleBackToWorld}>
              <ArrowLeft size={16} />
              <span>Back to World Map</span>
            </button>
          )}

          {mapLoading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner} />
              <p>Loading geographical data...</p>
            </div>
          )}

          {hoveredArea && <div className={styles.tooltip}>{hoveredArea}</div>}

          <div className={styles.canvasContainer}>
            {activeMapData && (
              <ComposableMap
                projection={projectionName}
                projectionConfig={
                  zoomCountry === "USA"
                    ? { scale: SPECIAL_COUNTRIES.USA.scale }
                    : {
                        scale: mapScale,
                        center: mapCenter as [Longitude, Latitude],
                      }
                }
                width={800}
                height={500}
                style={{ width: "100%", height: "100%" }}
              >
                <ZoomableGroup zoom={1} minZoom={1} maxZoom={4}>
                  <Geographies geography={activeMapData}>
                    {({ geographies }: { geographies: Feature[] }) =>
                      geographies.map((geo, idx) => {
                        const isoA3 = getIsoA3(geo);
                        const props = (geo.properties || {}) as MapProperties;
                        const name = props.name || "";
                        const hcKey = props["hc-key"] || "";
                        const geoRwd = (geo as { rwd?: string }).rwd;

                        if (zoomCountry) {
                          // --- STATE LEVEL MAP ---
                          const travelData = getStateTravelData(hcKey);
                          const isVisited = !!travelData;
                          const consolidatedKey =
                            getConsolidatedStateCode(hcKey);
                          const isGroupHovered =
                            hoveredStateCode === consolidatedKey;

                          return (
                            <Geography
                              key={geoRwd || hcKey || `state-${idx}`}
                              geography={geo}
                              onMouseEnter={() => {
                                const resolvedName = getSubdivisionName(
                                  hcKey,
                                  name,
                                );
                                setHoveredArea(
                                  resolvedName +
                                    (isVisited ? " (Visited)" : ""),
                                );
                                setHoveredStateCode(consolidatedKey);
                              }}
                              onMouseLeave={() => {
                                setHoveredArea(null);
                                setHoveredStateCode(null);
                              }}
                              onClick={() => handleStateClick(geo)}
                              style={{
                                default: {
                                  fill: isGroupHovered
                                    ? isVisited
                                      ? "#1C1B1A"
                                      : "#e3dfd5"
                                    : isVisited
                                      ? "#7D7565"
                                      : "#eae6df", // visited state vs unvisited state
                                  stroke: "#FAF9F6",
                                  strokeWidth: 0.5,
                                  outline: "none",
                                  cursor: isVisited ? "pointer" : "default",
                                  transition: "fill 0.2s ease",
                                },
                                hover: {
                                  fill: isVisited ? "#1C1B1A" : "#e3dfd5",
                                  stroke: "#FAF9F6",
                                  strokeWidth: 0.5,
                                  outline: "none",
                                  cursor: isVisited ? "pointer" : "default",
                                },
                                pressed: {
                                  fill: "#1C1B1A",
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        } else {
                          // --- WORLD LEVEL MAP ---
                          const isVisited = isCountryVisited(isoA3);
                          const isSpecial = [
                            "USA",
                            "AUS",
                            "VNM",
                            "ARG",
                          ].includes(isoA3);

                          return (
                            <Geography
                              key={geoRwd || isoA3 || `world-${idx}`}
                              geography={geo}
                              onMouseEnter={() => {
                                let label = name;
                                if (isSpecial) {
                                  label += " (Click to explore regions)";
                                } else if (isVisited) {
                                  label += " (Visited)";
                                }
                                setHoveredArea(label);
                              }}
                              onMouseLeave={() => {
                                setHoveredArea(null);
                              }}
                              onClick={() =>
                                isVisited && handleCountryClick(geo)
                              }
                              style={{
                                default: {
                                  fill: isVisited
                                    ? isSpecial
                                      ? "#5c5549"
                                      : "#9b9382"
                                    : "#eae6df",
                                  stroke: "#FAF9F6",
                                  strokeWidth: 0.5,
                                  outline: "none",
                                  cursor: isVisited ? "pointer" : "default",
                                  transition: "fill 0.2s ease",
                                },
                                hover: {
                                  fill: isVisited
                                    ? isSpecial
                                      ? "#1c1b1a"
                                      : "#7a7263"
                                    : "#e3dfd5",
                                  stroke: "#FAF9F6",
                                  strokeWidth: 0.5,
                                  outline: "none",
                                  cursor: isVisited ? "pointer" : "default",
                                },
                                pressed: {
                                  fill: "#1c1b1a",
                                  outline: "none",
                                },
                              }}
                            />
                          );
                        }
                      })
                    }
                  </Geographies>

                  {SMALL_TERRITORIES.map((territory) => {
                    const shouldRender =
                      (territory.type === "world" && !zoomCountry) ||
                      (territory.type === "AUS" && zoomCountry === "AUS") ||
                      (territory.type === "ARG" && zoomCountry === "ARG");

                    if (!shouldRender) return null;

                    const travelData =
                      territory.type === "world"
                        ? travelDataList.find(
                            (loc) => loc.visitedCountryCode === territory.id,
                          )
                        : travelDataList.find(
                            (loc) => loc.stateCode === territory.id,
                          );
                    const isVisited = !!travelData;

                    return (
                      <Marker
                        key={territory.id}
                        coordinates={territory.coordinates}
                        onClick={() => {
                          if (travelData) {
                            setSelectedLocation(travelData);
                          }
                        }}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none" },
                          pressed: { outline: "none" },
                        }}
                      >
                        <circle
                          r={isVisited ? 6 : 3}
                          fill={isVisited ? "#7D7565" : "#eae6df"}
                          stroke="#FAF9F6"
                          strokeWidth={1}
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={() => {
                            setHoveredArea(
                              territory.name + (isVisited ? " (Visited)" : ""),
                            );
                          }}
                          onMouseLeave={() => {
                            setHoveredArea(null);
                          }}
                        />
                        {isVisited && (
                          <circle
                            r={10}
                            fill="transparent"
                            stroke="#7D7565"
                            strokeWidth={1}
                            strokeDasharray="2 2"
                            className={styles.rotating}
                            style={{
                              cursor: "pointer",
                            }}
                            onMouseEnter={() => {
                              setHoveredArea(territory.name + " (Visited)");
                            }}
                            onMouseLeave={() => {
                              setHoveredArea(null);
                            }}
                          />
                        )}
                      </Marker>
                    );
                  })}
                </ZoomableGroup>
              </ComposableMap>
            )}
          </div>
        </div>

        {/* Modal Overlay / Card when a country or state is clicked */}
        {selectedLocation && (
          <div
            className={styles.modalOverlay}
            onClick={() => setSelectedLocation(null)}
          >
            <div
              className={styles.modalCard}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeButton}
                onClick={() => setSelectedLocation(null)}
              >
                <X size={18} />
              </button>

              <div className={styles.modalImageContainer}>
                {(() => {
                  const primaryImage = selectedLocation.image;
                  const additionalImages = selectedLocation.images || [];
                  const images = [
                    primaryImage,
                    ...additionalImages.filter((img) => img !== primaryImage),
                  ].filter(Boolean);

                  return (
                    <>
                      {images.map((imgUrl, idx) => (
                        <React.Fragment key={idx}>
                          <img
                            src={getTravelImagePath(imgUrl)}
                            alt=""
                            className={`${styles.modalImageBlur} ${idx === carouselIndex ? styles.activeImage : styles.inactiveImage}`}
                          />
                          <img
                            src={getTravelImagePath(imgUrl)}
                            alt={`${selectedLocation.destination} ${idx + 1}`}
                            className={`${styles.modalImage} ${idx === carouselIndex ? styles.activeImage : styles.inactiveImage}`}
                          />
                        </React.Fragment>
                      ))}

                      {images.length > 1 && (
                        <>
                          <button
                            type="button"
                            className={styles.carouselButtonLeft}
                            onClick={() =>
                              setCarouselIndex((prev) =>
                                prev === 0 ? images.length - 1 : prev - 1,
                              )
                            }
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            type="button"
                            className={styles.carouselButtonRight}
                            onClick={() =>
                              setCarouselIndex((prev) =>
                                prev === images.length - 1 ? 0 : prev + 1,
                              )
                            }
                          >
                            <ChevronRight size={20} />
                          </button>

                          <div className={styles.carouselDots}>
                            {images.map((_, idx) => (
                              <span
                                key={idx}
                                className={`${styles.carouselDot} ${idx === carouselIndex ? styles.activeDot : ""}`}
                                onClick={() => setCarouselIndex(idx)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  );
                })()}
                <div className={styles.modalImageOverlay} />
                <div className={styles.modalHeaderInfo}>
                  <span className={styles.modalCountryLabel}>
                    <MapPin size={12} />
                    {selectedLocation.country}
                  </span>
                  <h2 className={styles.modalDestination}>
                    {selectedLocation.destination}
                  </h2>
                </div>
              </div>

              <div className={styles.modalContent}>
                <div className={styles.modalMeta}>
                  <Calendar size={14} className={styles.metaIcon} />
                  <span>{selectedLocation.dates}</span>
                </div>

                <p className={styles.modalDesc}>
                  {selectedLocation.description}
                </p>

                <div className={styles.highlightsSection}>
                  <h4 className={styles.highlightsHeader}>Trip Highlights</h4>
                  <ul className={styles.highlightsList}>
                    {selectedLocation.highlights.map((highlight, idx) => (
                      <li key={idx} className={styles.highlightItem}>
                        <div className={styles.checkIcon}>
                          <Check size={12} />
                        </div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Travel;
