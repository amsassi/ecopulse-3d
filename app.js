const ORE_BASE = "https://opendata.agenceore.fr/data-fair/api/v1/datasets";
const CONSO_DATASET = "consommation-annuelle-d-electricite-et-gaz-par-commune";
const PROD_DATASET = "registre-national-installation-production-stockage-electricite-agrege";
const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const REGION_BY_CODE = {
  "11": "Ile-de-France",
  "24": "Centre-Val de Loire",
  "27": "Bourgogne-Franche-Comte",
  "28": "Normandie",
  "32": "Hauts-de-France",
  "44": "Grand Est",
  "52": "Pays de la Loire",
  "53": "Bretagne",
  "75": "Nouvelle-Aquitaine",
  "76": "Occitanie",
  "84": "Auvergne-Rhone-Alpes",
  "93": "Provence-Alpes-Cote d'Azur",
  "94": "Corse",
};

const API_REGION_NAMES = {
  "Ile-de-France": "\u00cele-de-France",
  "Bourgogne-Franche-Comte": "Bourgogne-Franche-Comt\u00e9",
  "Auvergne-Rhone-Alpes": "Auvergne-Rh\u00f4ne-Alpes",
  "Provence-Alpes-Cote d'Azur": "Provence-Alpes-C\u00f4te d'Azur",
};

const DISPLAY_REGION_NAMES = {
  "Ile-de-France": "\u00cele-de-France",
  "Bourgogne-Franche-Comte": "Bourgogne-Franche-Comt\u00e9",
  "Auvergne-Rhone-Alpes": "Auvergne-Rh\u00f4ne-Alpes",
  "Provence-Alpes-Cote d'Azur": "Provence-Alpes-C\u00f4te d'Azur",
};

const FALLBACK_CONSO_MWH = {
  "Ile-de-France": 59973301,
  "Auvergne-Rhone-Alpes": 56352480,
  "Hauts-de-France": 40841546,
  "Grand Est": 37124789,
  "Nouvelle-Aquitaine": 35342860,
  "Provence-Alpes-Cote d'Azur": 33450661,
  Occitanie: 31304063,
  "Pays de la Loire": 23023265,
  Normandie: 22906566,
  Bretagne: 19965960,
  "Bourgogne-Franche-Comte": 17600688,
  "Centre-Val de Loire": 15971392,
  Corse: 1963324,
};

const FALLBACK_PROD_KWH = {
  "Auvergne-Rhone-Alpes": 31197196706,
  "Grand Est": 21146361481,
  Occitanie: 20639699874,
  "Nouvelle-Aquitaine": 15884645241,
  "Hauts-de-France": 14616591125,
  "Provence-Alpes-Cote d'Azur": 13519050429,
  "Pays de la Loire": 7813449662,
  Bretagne: 6314273584,
  "Centre-Val de Loire": 5239819387,
  Normandie: 5210017839,
  "Bourgogne-Franche-Comte": 4602858762,
  "Ile-de-France": 1512577124,
  Corse: 0,
};

const REGION_CENTERS = {
  "Ile-de-France": [2.43, 48.86],
  "Centre-Val de Loire": [1.72, 47.5],
  "Bourgogne-Franche-Comte": [5.2, 47.25],
  Normandie: [0.3, 49.1],
  "Hauts-de-France": [2.8, 50.2],
  "Grand Est": [5.9, 48.75],
  "Pays de la Loire": [-0.85, 47.45],
  Bretagne: [-2.9, 48.2],
  "Nouvelle-Aquitaine": [0.15, 45.25],
  Occitanie: [2.15, 43.8],
  "Auvergne-Rhone-Alpes": [4.9, 45.7],
  "Provence-Alpes-Cote d'Azur": [6.05, 43.9],
  Corse: [9.05, 42.15],
};

const PRODUCTION_ICONS = createProductionIcons();

const state = {
  year: "2024",
  energy: "Electricit\u00e9",
  future: false,
  solar: 35,
  renovation: 22,
  selectedRegion: null,
  regions: null,
  prodPoints: [],
  loadMode: "live",
  viewState: {
    longitude: 2.55,
    latitude: 46.65,
    zoom: 5,
    minZoom: 4,
    maxZoom: 12,
    pitch: 42,
    bearing: -8,
  },
  time: 0,
};

const els = {
  year: document.querySelector("#year-select"),
  energy: document.querySelector("#energy-select"),
  future: document.querySelector("#future-toggle"),
  solar: document.querySelector("#solar-slider"),
  solarValue: document.querySelector("#solar-value"),
  renovation: document.querySelector("#renovation-slider"),
  renovationValue: document.querySelector("#renovation-value"),
  viewFrance: document.querySelector("#view-france"),
  viewMontreuil: document.querySelector("#view-montreuil"),
  totalConsumption: document.querySelector("#total-consumption"),
  totalProduction: document.querySelector("#total-production"),
  totalRatio: document.querySelector("#total-ratio"),
  selectedKicker: document.querySelector("#selected-kicker"),
  selectedName: document.querySelector("#selected-name"),
  selectedConsumption: document.querySelector("#selected-consumption"),
  selectedProduction: document.querySelector("#selected-production"),
  selectedPulse: document.querySelector("#selected-pulse"),
  aboutOpen: document.querySelector("#about-open"),
  aboutClose: document.querySelector("#about-close"),
  aboutModal: document.querySelector("#about-modal"),
};

let deckgl;

window.addEventListener("DOMContentLoaded", init);

async function init() {
  await waitForDeck();
  bindControls();
  initDeck();
  await loadAllData();
  animate();
}

function waitForDeck() {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const tick = () => {
      if (window.deck) resolve();
      else if (tries++ > 80) reject(new Error("Deck.gl indisponible"));
      else setTimeout(tick, 50);
    };
    tick();
  });
}

function bindControls() {
  els.year.addEventListener("change", async () => {
    state.year = els.year.value;
    await loadAllData();
  });

  els.energy.addEventListener("change", async () => {
    state.energy = els.energy.value;
    await loadAllData();
  });

  els.future.addEventListener("change", () => {
    state.future = els.future.checked;
    updateMetrics();
    renderLayers();
  });

  els.solar.addEventListener("input", () => {
    state.solar = Number(els.solar.value);
    els.solarValue.value = `${state.solar}%`;
    updateMetrics();
    renderLayers();
  });

  els.renovation.addEventListener("input", () => {
    state.renovation = Number(els.renovation.value);
    els.renovationValue.value = `${state.renovation}%`;
    updateMetrics();
    renderLayers();
  });

  els.viewFrance.addEventListener("click", () => flyToFrance());
  els.viewMontreuil.addEventListener("click", () => flyToMontreuil());

  els.aboutOpen.addEventListener("click", () => openAbout());
  els.aboutClose.addEventListener("click", () => closeAbout());
  els.aboutModal.addEventListener("click", (event) => {
    if (event.target === els.aboutModal) closeAbout();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.aboutModal.hidden) closeAbout();
  });
}

function openAbout() {
  els.aboutModal.hidden = false;
  els.aboutClose.focus();
}

function closeAbout() {
  els.aboutModal.hidden = true;
  els.aboutOpen.focus();
}

function initDeck() {
  deckgl = new deck.DeckGL({
    container: "deck",
    initialViewState: state.viewState,
    controller: true,
    effects: [
      new deck.LightingEffect({
        ambientLight: new deck.AmbientLight({ color: [135, 255, 225], intensity: 1.15 }),
        dirLight: new deck.DirectionalLight({
          color: [120, 210, 255],
          intensity: 1.8,
          direction: [-3, -4, -6],
        }),
      }),
    ],
    parameters: {
      clearColor: [0.01, 0.018, 0.02, 1],
    },
    getTooltip,
    onViewStateChange: ({ viewState }) => {
      state.viewState = viewState;
      deckgl.setProps({ viewState });
    },
  });
}

async function loadAllData() {
  setLoadingText();
  try {
    const [geo, consumption, production, points] = await Promise.all([
      fetch("data/regions.geojson").then((res) => res.json()),
      fetchConsumptionAgg(),
      fetchProductionAgg(),
      fetchProductionPoints(),
    ]);

    state.regions = prepareRegions(geo, consumption, production);
    state.prodPoints = points;
    state.loadMode = "live";
  } catch (error) {
    console.warn("Mode secours EcoPulse", error);
    const geo = await fetch("data/regions.geojson").then((res) => res.json());
    state.regions = prepareRegions(geo, fallbackAgg(FALLBACK_CONSO_MWH), fallbackAgg(FALLBACK_PROD_KWH));
    state.prodPoints = fallbackProductionPoints();
    state.loadMode = "fallback";
  }

  updateMetrics();
  renderLayers();
}

async function fetchConsumptionAgg() {
  const qs = `annee:"${state.year}" AND filiere:"${state.energy}"`;
  const url = new URL(`${ORE_BASE}/${CONSO_DATASET}/values_agg`);
  url.searchParams.set("field", "nom_region");
  url.searchParams.set("metric", "sum");
  url.searchParams.set("metric_field", "conso_totale_mwh");
  url.searchParams.set("agg_size", "20");
  url.searchParams.set("qs", qs);

  const json = await fetch(url).then(assertJson);
  return normalizeAggs(json.aggs);
}

async function fetchProductionAgg() {
  const qs = `regime:"En service" AND (filiere:Solaire OR filiere:Eolien OR filiere:Hydraulique OR filiere:Bio\u00e9nergies OR filiere:G\u00e9othermie OR filiere:"Energies Marines")`;
  const url = new URL(`${ORE_BASE}/${PROD_DATASET}/values_agg`);
  url.searchParams.set("field", "region");
  url.searchParams.set("metric", "sum");
  url.searchParams.set("metric_field", "energieannuelleglissanteinjectee");
  url.searchParams.set("agg_size", "20");
  url.searchParams.set("qs", qs);

  const json = await fetch(url).then(assertJson);
  return normalizeAggs(json.aggs);
}

async function fetchProductionPoints() {
  const requests = Object.keys(REGION_CENTERS).map(async (region) => {
    const qs = `region:"${apiRegionName(region)}" AND regime:"En service" AND (filiere:Solaire OR filiere:Eolien OR filiere:Hydraulique OR filiere:Bio\u00e9nergies OR filiere:G\u00e9othermie OR filiere:"Energies Marines")`;
    const url = new URL(`${ORE_BASE}/${PROD_DATASET}/lines`);
    url.searchParams.set("size", "10");
    url.searchParams.set("sort", "-maxpuis");
    url.searchParams.set(
      "select",
      "nominstallation,commune,region,filiere,technologie,maxpuis,energieannuelleglissanteinjectee,_coords.lat,_coords.lon",
    );
    url.searchParams.set("qs", qs);

    const json = await fetch(url).then(assertJson);
    return json.results.map((item) => productionPointFromLine(item, region));
  });

  return (await Promise.all(requests))
    .flat()
    .filter((item) => Number.isFinite(item.position[0]) && Number.isFinite(item.position[1]));
}

async function assertJson(response) {
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

function prepareRegions(geojson, consumptionAgg, productionAgg) {
  const maxConso = Math.max(...Object.values(consumptionAgg), 1);

  geojson.features = geojson.features.map((feature) => {
    const code = feature.properties.code;
    const region = REGION_BY_CODE[code] || feature.properties.nom;
    const consumption = consumptionAgg[region] || 0;
    const productionKwh = productionAgg[region] || 0;
    const productionMwh = productionKwh / 1000;
    const metrics = buildMetrics(consumption, productionMwh, maxConso);

    return {
      ...feature,
      properties: {
        ...feature.properties,
        code,
        region,
        metrics,
      },
    };
  });

  return geojson;
}

function buildMetrics(consumption, production, maxConso) {
  const futureConsumption = state.future ? consumption * (1 - state.renovation / 100) : consumption;
  const futureProduction = state.future
    ? production + production * (state.solar / 100) * 1.2 + consumption * (state.solar / 100) * 0.2
    : production;
  const safeConso = Math.max(futureConsumption, 1);
  const ratio = futureProduction / safeConso;
  const deficit = Math.max(0, 1 - Math.min(ratio, 1));
  const consumptionNormalized = Math.pow(Math.max(futureConsumption, 1) / maxConso, 0.68);
  const productionNormalized = Math.pow(Math.max(futureProduction, 1) / maxConso, 0.68);

  return {
    consumption,
    production,
    futureConsumption,
    futureProduction,
    ratio,
    deficit,
    consumptionRadius: 26000 + consumptionNormalized * 82000,
    productionRadius: 20000 + productionNormalized * 76000,
    pulse: 0.25 + deficit * 0.75,
  };
}

function updateAllFeatureMetrics() {
  if (!state.regions) return;
  const maxConso = Math.max(...state.regions.features.map((f) => f.properties.metrics.consumption), 1);
  state.regions.features.forEach((feature) => {
    feature.properties.metrics = buildMetrics(
      feature.properties.metrics.consumption,
      feature.properties.metrics.production,
      maxConso,
    );
  });
}

function renderLayers() {
  if (!deckgl || !state.regions) return;
  updateAllFeatureMetrics();

  const pulse = 0.5 + Math.sin(state.time * 0.002) * 0.5;
  const selected = state.selectedRegion;
  const rings = energyRings();

  deckgl.setProps({
    layers: [
      osmTileLayer(),
      new deck.GeoJsonLayer({
        id: "regions-flat",
        data: state.regions,
        pickable: true,
        stroked: true,
        filled: true,
        extruded: false,
        lineWidthMinPixels: 1.25,
        getLineColor: (feature) =>
          feature.properties.region === selected ? [235, 255, 245, 230] : [80, 255, 215, 115],
        getFillColor: (feature) => regionColor(feature, pulse),
        updateTriggers: {
          getFillColor: [state.time, state.future, state.solar, state.renovation, selected],
          getLineColor: [selected],
        },
        onClick: ({ object }) => {
          if (!object) return;
          state.selectedRegion = object.properties.region;
          updateMetrics();
          renderLayers();
        },
      }),
      new deck.ScatterplotLayer({
        id: "energy-ring-halos",
        data: rings,
        pickable: false,
        getPosition: (d) => d.position,
        getRadius: (d) => d.radius * 1.18,
        getFillColor: (d) => ringColor(d, 18 + pulse * 18),
        getLineColor: (d) => ringColor(d, 130),
        lineWidthMinPixels: 1,
        stroked: true,
        parameters: { depthTest: false },
      }),
      new deck.ScatterplotLayer({
        id: "energy-rings",
        data: rings,
        pickable: true,
        getPosition: (d) => d.position,
        getRadius: (d) => d.radius,
        getFillColor: [0, 0, 0, 0],
        getLineColor: (d) => ringColor(d, d.region === selected ? 245 : 190 + pulse * d.pulse * 48),
        lineWidthMinPixels: (d) => (d.type === "consumption" ? 4 : 3),
        stroked: true,
        filled: true,
        parameters: { depthTest: false },
        updateTriggers: {
          getLineColor: [state.time, state.future, state.solar, state.renovation, selected],
          getRadius: [state.future, state.solar, state.renovation],
        },
        onClick: ({ object }) => {
          if (!object) return;
          state.selectedRegion = object.region;
          updateMetrics();
          renderLayers();
        },
      }),
      new deck.ScatterplotLayer({
        id: "production-sites",
        data: state.prodPoints,
        pickable: false,
        getPosition: (d) => d.position,
        getRadius: (d) => Math.max(1400, Math.sqrt(d.power || 25) * 180),
        radiusMinPixels: 1,
        radiusMaxPixels: 4,
        getFillColor: (d) => productionSiteColor(d, 210),
        getLineColor: [230, 255, 248, 175],
        lineWidthMinPixels: 1,
        stroked: true,
        parameters: { depthTest: false },
      }),
      new deck.IconLayer({
        id: "production-icons",
        data: state.prodPoints,
        pickable: true,
        getPosition: (d) => d.position,
        getIcon: (d) => productionIcon(d),
        getSize: (d) => Math.max(18, Math.min(34, 16 + Math.sqrt(d.power || 25) * 0.22)),
        sizeUnits: "pixels",
        billboard: true,
        parameters: { depthTest: false },
      }),
      new deck.ScatterplotLayer({
        id: "production-flow-dots",
        data: productionFlowDots(),
        pickable: false,
        getPosition: (d) => d.position,
        getRadius: (d) => d.radius,
        radiusMinPixels: 1,
        radiusMaxPixels: 3,
        getFillColor: (d) => d.color,
        parameters: { depthTest: false },
      }),
    ],
  });
}

function osmTileLayer() {
  return new deck.TileLayer({
    id: "openstreetmap",
    data: OSM_TILE_URL,
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,
    opacity: 0.38,
    renderSubLayers: (props) => {
      const {
        bbox: { west, south, east, north },
      } = props.tile;

      return new deck.BitmapLayer(props, {
        data: null,
        image: props.data,
        bounds: [west, south, east, north],
      });
    },
  });
}

function regionColor(feature, pulse) {
  const { ratio, deficit } = feature.properties.metrics;
  const isSelected = feature.properties.region === state.selectedRegion;
  const alpha = isSelected ? 128 : 48 + pulse * deficit * 24;

  if (ratio >= 1) return [22, 126, 135, alpha];
  if (ratio >= 0.52) return [28, 120, 88, alpha];
  if (ratio >= 0.26) return [126, 104, 42, alpha];
  return [118, 39, 55, alpha];
}

function energyRings() {
  return (state.regions?.features || []).flatMap((feature) => {
    const region = feature.properties.region;
    const center = REGION_CENTERS[region];
    if (!center) return [];

    const metrics = feature.properties.metrics;

    return [
      {
        region,
        type: "consumption",
        label: "Consommation",
        position: center,
        value: metrics.futureConsumption,
        radius: metrics.consumptionRadius,
        ratio: metrics.ratio,
        pulse: metrics.pulse,
      },
      {
        region,
        type: "production",
        label: "Production EnR",
        position: center,
        value: metrics.futureProduction,
        radius: metrics.productionRadius,
        ratio: metrics.ratio,
        pulse: 0.45,
      },
    ];
  });
}

function ringColor(ring, alpha) {
  if (ring.type === "consumption") {
    if (ring.ratio >= 0.6) return [255, 181, 71, alpha];
    return [255, 59, 87, alpha];
  }

  if (ring.ratio >= 0.8) return [99, 255, 141, alpha];
  return [54, 245, 255, alpha];
}

function productionFlowDots() {
  const dots = [];
  state.prodPoints.slice(0, 120).forEach((point, pointIndex) => {
    const target = REGION_CENTERS[point.region];
    if (!target) return;

    for (let dotIndex = 0; dotIndex < 4; dotIndex += 1) {
      const phase = (state.time * 0.00016 + pointIndex * 0.071 + dotIndex * 0.21) % 1;
      const eased = phase * phase * (3 - 2 * phase);
      const lon = point.position[0] + (target[0] - point.position[0]) * eased;
      const lat = point.position[1] + (target[1] - point.position[1]) * eased;
      const glow = Math.sin(phase * Math.PI);

      dots.push({
        position: [lon, lat],
        radius: 650 + Math.sqrt(point.power || 20) * 35,
        color: productionSiteColor(point, 65 + glow * 165),
      });
    }
  });

  return dots;
}

function productionSiteColor(point, alpha) {
  if (point.filiere === "Eolien") return [54, 245, 255, alpha];
  if (point.filiere === "Hydraulique") return [66, 154, 255, alpha];
  if (point.filiere === "Bio\u00e9nergies" || point.filiere === "G\u00e9othermie") return [99, 255, 141, alpha];
  return [140, 255, 196, alpha];
}

function createProductionIcons() {
  const icons = {
    solar: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="9" fill="#63ff8d"/>
        <g stroke="#edfff8" stroke-width="3" stroke-linecap="round">
          <path d="M24 5v7M24 36v7M5 24h7M36 24h7M10.6 10.6l5 5M32.4 32.4l5 5M37.4 10.6l-5 5M15.6 32.4l-5 5"/>
        </g>
        <circle cx="24" cy="24" r="17" fill="none" stroke="#36f5ff" stroke-width="1.6" opacity=".85"/>
      </svg>`,
    wind: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M24 22v20" stroke="#edfff8" stroke-width="4" stroke-linecap="round"/>
        <circle cx="24" cy="22" r="4" fill="#36f5ff"/>
        <path d="M24 22 12 12M24 22l16-4M24 22l-4 16" stroke="#63ff8d" stroke-width="4" stroke-linecap="round"/>
        <path d="M17 42h14" stroke="#edfff8" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    hydro: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M24 5c7 9 13 16 13 25a13 13 0 0 1-26 0c0-9 6-16 13-25Z" fill="#36f5ff"/>
        <path d="M15 31c4 3 7 3 11 0s7-3 11 0" fill="none" stroke="#edfff8" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    bio: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M39 10C25 10 13 18 13 32c14 0 26-8 26-22Z" fill="#63ff8d"/>
        <path d="M12 38c7-13 16-18 27-28" fill="none" stroke="#edfff8" stroke-width="3" stroke-linecap="round"/>
        <path d="M18 28c4 0 9 1 13 4" fill="none" stroke="#36f5ff" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    geo: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="15" fill="none" stroke="#ffb547" stroke-width="4"/>
        <circle cx="24" cy="24" r="6" fill="#ff3b57"/>
        <path d="M14 39c4-4 4-8 0-12M24 43c4-5 4-10 0-15M34 39c-4-4-4-8 0-12" fill="none" stroke="#edfff8" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
    marine: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M8 19c5-5 10-5 15 0s10 5 15 0" fill="none" stroke="#36f5ff" stroke-width="4" stroke-linecap="round"/>
        <path d="M8 30c5-5 10-5 15 0s10 5 15 0" fill="none" stroke="#63ff8d" stroke-width="4" stroke-linecap="round"/>
        <circle cx="24" cy="24" r="17" fill="none" stroke="#edfff8" stroke-width="1.6" opacity=".75"/>
      </svg>`,
  };

  return Object.fromEntries(
    Object.entries(icons).map(([key, svg]) => [
      key,
      {
        url: svgDataUrl(svg),
        width: 48,
        height: 48,
        anchorX: 24,
        anchorY: 24,
        mask: false,
      },
    ]),
  );
}

function svgDataUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

function productionIcon(point) {
  if (point.filiere === "Solaire") return PRODUCTION_ICONS.solar;
  if (point.filiere === "Eolien") return PRODUCTION_ICONS.wind;
  if (point.filiere === "Hydraulique") return PRODUCTION_ICONS.hydro;
  if (point.filiere === "Bio\u00e9nergies") return PRODUCTION_ICONS.bio;
  if (point.filiere === "G\u00e9othermie") return PRODUCTION_ICONS.geo;
  if (point.filiere === "Energies Marines") return PRODUCTION_ICONS.marine;
  return PRODUCTION_ICONS.solar;
}

function updateMetrics() {
  updateAllFeatureMetrics();
  const features = state.regions?.features || [];
  const totals = features.reduce(
    (acc, feature) => {
      acc.consumption += feature.properties.metrics.futureConsumption;
      acc.production += feature.properties.metrics.futureProduction;
      return acc;
    },
    { consumption: 0, production: 0 },
  );

  els.totalConsumption.textContent = formatEnergy(totals.consumption);
  els.totalProduction.textContent = formatEnergy(totals.production);
  els.totalRatio.textContent = formatRatio(totals.production / Math.max(totals.consumption, 1));

  const selectedFeature = features.find((feature) => feature.properties.region === state.selectedRegion);
  if (selectedFeature) {
    const metrics = selectedFeature.properties.metrics;
    els.selectedKicker.textContent = state.loadMode === "live" ? "Region ORE" : "Region demo";
    els.selectedName.textContent = displayRegionName(selectedFeature.properties.region);
    els.selectedConsumption.textContent = formatEnergy(metrics.futureConsumption);
    els.selectedProduction.textContent = formatEnergy(metrics.futureProduction);
    els.selectedPulse.textContent = formatPulse(metrics);
  } else {
    els.selectedKicker.textContent = state.loadMode === "live" ? "Territoire ORE" : "Territoire demo";
    els.selectedName.textContent = "France m\u00e9tropolitaine";
    els.selectedConsumption.textContent = formatEnergy(totals.consumption);
    els.selectedProduction.textContent = formatEnergy(totals.production);
    els.selectedPulse.textContent = formatPulse({
      ratio: totals.production / Math.max(totals.consumption, 1),
      deficit: Math.max(0, 1 - totals.production / Math.max(totals.consumption, 1)),
    });
  }
}

function setLoadingText() {
  els.totalConsumption.textContent = "...";
  els.totalProduction.textContent = "...";
  els.totalRatio.textContent = "...";
  els.selectedConsumption.textContent = "...";
  els.selectedProduction.textContent = "...";
  els.selectedPulse.textContent = "...";
}

function flyToFrance() {
  state.selectedRegion = null;
  els.viewFrance.classList.add("active");
  els.viewMontreuil.classList.remove("active");
  setView({
    longitude: 2.55,
    latitude: 46.65,
    zoom: 5,
    pitch: 42,
    bearing: -8,
  });
  updateMetrics();
  renderLayers();
}

function flyToMontreuil() {
  state.selectedRegion = "Ile-de-France";
  els.viewMontreuil.classList.add("active");
  els.viewFrance.classList.remove("active");
  setView({
    longitude: 2.43,
    latitude: 48.86,
    zoom: 8.4,
    pitch: 48,
    bearing: -22,
  });
  updateMetrics();
  renderLayers();
}

function setView(nextView) {
  state.viewState = { ...state.viewState, ...nextView, transitionDuration: 1250 };
  deckgl.setProps({ viewState: state.viewState });
}

function animate(timestamp = 0) {
  state.time = timestamp;
  renderLayers();
  requestAnimationFrame(animate);
}

function normalizeAggs(aggs = []) {
  return aggs.reduce((acc, item) => {
    const key = normalizeRegionName(item.value);
    acc[key] = Number(item.metric || 0);
    return acc;
  }, {});
}

function fallbackAgg(source) {
  return { ...source };
}

function normalizeRegionName(value) {
  return (
    Object.entries(API_REGION_NAMES).find(([, apiName]) => apiName === value)?.[0] ||
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  );
}

function apiRegionName(region) {
  return API_REGION_NAMES[region] || region;
}

function displayRegionName(region) {
  return DISPLAY_REGION_NAMES[region] || region;
}

function fallbackProductionPoints() {
  return Object.entries(REGION_CENTERS).flatMap(([region, center], regionIndex) =>
    Array.from({ length: 5 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2 + regionIndex * 0.37;
      const distance = 0.22 + (index % 3) * 0.18;
      const filieres = ["Solaire", "Eolien", "Hydraulique", "Bio\u00e9nergies"];
      return {
        name: `${displayRegionName(region)} EnR ${index + 1}`,
        region,
        position: [center[0] + Math.cos(angle) * distance, center[1] + Math.sin(angle) * distance * 0.68],
        filiere: filieres[(index + regionIndex) % filieres.length],
        power: 80 + ((index + 1) * 45 + regionIndex * 23) % 900,
        injected: 0,
      };
    }),
  );
}

function productionPointFromLine(item, fallbackRegion) {
  const region = normalizeRegionName(item.region || apiRegionName(fallbackRegion));
  return {
    name: item.nominstallation || "Installation EnR",
    region,
    position: [Number(item["_coords.lon"]), Number(item["_coords.lat"])],
    filiere: item.filiere,
    power: Number(item.maxpuis || 0),
    injected: Number(item.energieannuelleglissanteinjectee || 0),
  };
}

function getTooltip({ object, layer }) {
  if (!object) return null;

  if (layer?.id === "regions-flat") {
    const metrics = object.properties.metrics;
    return {
      className: "deck-tooltip",
      html: `<strong>${displayRegionName(object.properties.region)}</strong><span>Conso ${formatEnergy(metrics.futureConsumption)}</span><span>EnR ${formatEnergy(metrics.futureProduction)}</span><span>Autonomie ${formatRatio(metrics.ratio)}</span>`,
    };
  }

  if (layer?.id === "energy-rings") {
    return {
      className: "deck-tooltip",
      html: `<strong>${displayRegionName(object.region)}</strong><span>${object.label} ${formatEnergy(object.value)}</span><span>Autonomie ${formatRatio(object.ratio)}</span>`,
    };
  }

  if (layer?.id === "production-icons") {
    return {
      className: "deck-tooltip",
      html: `<strong>${object.name}</strong><span>${displayRegionName(object.region)} | ${object.filiere || "EnR"} | ${Math.round(object.power || 0)} kW</span>`,
    };
  }

  return null;
}

function formatEnergy(mwh) {
  if (!Number.isFinite(mwh)) return "...";
  if (Math.abs(mwh) >= 1_000_000) return `${(mwh / 1_000_000).toFixed(1)} TWh`;
  if (Math.abs(mwh) >= 1_000) return `${(mwh / 1_000).toFixed(1)} GWh`;
  return `${Math.round(mwh)} MWh`;
}

function formatRatio(value) {
  if (!Number.isFinite(value)) return "...";
  return `${Math.round(value * 100)}%`;
}

function formatPulse(metrics) {
  if (!Number.isFinite(metrics.ratio)) return "...";
  if (metrics.ratio >= 1) return "apais\u00e9";
  if (metrics.ratio >= 0.52) return "transition";
  if (metrics.ratio >= 0.26) return "sous tension";
  return "critique";
}
