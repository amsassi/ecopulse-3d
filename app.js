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

const SOURCE_COLORS = {
  Solaire: [244, 205, 101],
  Eolien: [126, 214, 200],
  Hydraulique: [88, 160, 218],
  "Bio\u00e9nergies": [156, 224, 113],
  "G\u00e9othermie": [226, 135, 91],
  "Energies Marines": [118, 199, 232],
  National: [242, 248, 239],
  EnR: [186, 231, 151],
};

const SOURCE_LABELS = {
  Solaire: "Solaire",
  Eolien: "\u00c9olien",
  Hydraulique: "Hydro",
  "Bio\u00e9nergies": "Bio",
  "G\u00e9othermie": "G\u00e9othermie",
  "Energies Marines": "Marin",
  EnR: "Renouvelable",
};

const PRODUCTION_PHOTOS = {
  Solaire: {
    src: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=760&q=80",
    alt: "Panneaux solaires photovolta\u00efques",
    credit: "Photo illustrative Unsplash",
  },
  Eolien: {
    src: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=760&q=80",
    alt: "\u00c9oliennes sur un paysage ouvert",
    credit: "Photo illustrative Unsplash",
  },
  Hydraulique: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Parker_Dam.jpg/250px-Parker_Dam.jpg",
    alt: "Barrage hydro\u00e9lectrique",
    credit: "Photo illustrative Wikimedia Commons",
  },
  "Bio\u00e9nergies": {
    src: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=760&q=80",
    alt: "Mati\u00e8re organique et biomasse",
    credit: "Photo illustrative Unsplash",
  },
  "G\u00e9othermie": {
    src: "https://commons.wikimedia.org/wiki/Special:FilePath/HellisheidiPowerStation01.jpg?width=760",
    alt: "Centrale g\u00e9othermique de Hellishei\u00f0i",
    credit: "Photo Wikimedia Commons",
  },
  "Energies Marines": {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=760&q=80",
    alt: "\u00c9nergie marine",
    credit: "Photo illustrative Unsplash",
  },
  EnR: {
    src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=760&q=80",
    alt: "Infrastructure \u00e9lectrique renouvelable",
    credit: "Photo illustrative Unsplash",
  },
};

const REGION_PHOTOS = {
  "Ile-de-France": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons.jpg/330px-Tour_Eiffel_Wikimedia_Commons.jpg",
    alt: "Tour Eiffel a Paris",
    label: "Tour Eiffel",
    credit: "Wikimedia Commons",
  },
  "Centre-Val de Loire": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Chambord_Castle_Northwest_facade.jpg/330px-Chambord_Castle_Northwest_facade.jpg",
    alt: "Chateau de Chambord",
    label: "Chambord",
    credit: "Wikimedia Commons",
  },
  "Bourgogne-Franche-Comte": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Beaune_-_H%C3%B4tel-Dieu_-_Cour_-_05.jpg/330px-Beaune_-_H%C3%B4tel-Dieu_-_Cour_-_05.jpg",
    alt: "Hospices de Beaune",
    label: "Hospices de Beaune",
    credit: "Wikimedia Commons",
  },
  Normandie: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Mont-Saint-Michel_vu_du_ciel.jpg/330px-Mont-Saint-Michel_vu_du_ciel.jpg",
    alt: "Mont-Saint-Michel vu du ciel",
    label: "Mont-Saint-Michel",
    credit: "Wikimedia Commons",
  },
  "Hauts-de-France": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Lille_mairie_face.jpg/330px-Lille_mairie_face.jpg",
    alt: "Beffroi de Lille",
    label: "Beffroi de Lille",
    credit: "Wikimedia Commons",
  },
  "Grand Est": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Strasbourg_Cathedral_Exterior_-_Diliff.jpg/330px-Strasbourg_Cathedral_Exterior_-_Diliff.jpg",
    alt: "Cathedrale de Strasbourg",
    label: "Cathedrale de Strasbourg",
    credit: "Wikimedia Commons",
  },
  "Pays de la Loire": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Nantes_a%C3%A9rien_ch%C3%A2teau3.jpg/330px-Nantes_a%C3%A9rien_ch%C3%A2teau3.jpg",
    alt: "Chateau des ducs de Bretagne a Nantes",
    label: "Chateau des ducs",
    credit: "Wikimedia Commons",
  },
  Bretagne: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Bretagne_Finistere_PointeduRaz15119.jpg/330px-Bretagne_Finistere_PointeduRaz15119.jpg",
    alt: "Pointe du Raz",
    label: "Pointe du Raz",
    credit: "Wikimedia Commons",
  },
  "Nouvelle-Aquitaine": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/DunePyla.JPG/330px-DunePyla.JPG",
    alt: "Dune du Pilat",
    label: "Dune du Pilat",
    credit: "Wikimedia Commons",
  },
  Occitanie: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Pont_du_Gard_BLS.jpg/330px-Pont_du_Gard_BLS.jpg",
    alt: "Pont du Gard",
    label: "Pont du Gard",
    credit: "Wikimedia Commons",
  },
  "Auvergne-Rhone-Alpes": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mont_Blanc_Aiguille.jpg/330px-Mont_Blanc_Aiguille.jpg",
    alt: "Mont Blanc",
    label: "Mont Blanc",
    credit: "Wikimedia Commons",
  },
  "Provence-Alpes-Cote d'Azur": {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Sugiton_-_panoramio_%281%29.jpg/330px-Sugiton_-_panoramio_%281%29.jpg",
    alt: "Calanque de Sugiton",
    label: "Calanque de Sugiton",
    credit: "Wikimedia Commons",
  },
  Corse: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Aerial_image_of_Bonifacio_%28view_from_the_southwest%29.jpg/330px-Aerial_image_of_Bonifacio_%28view_from_the_southwest%29.jpg",
    alt: "Falaises de Bonifacio",
    label: "Bonifacio",
    credit: "Wikimedia Commons",
  },
};

const PRODUCTION_ICONS = createProductionIcons();

const state = {
  year: "2024",
  energy: "Electricit\u00e9",
  future: false,
  solar: 35,
  renovation: 22,
  selectedRegion: null,
  selectedProductionSite: null,
  hoveredProductionSite: null,
  sitePopupPosition: null,
  productionPopupPinned: false,
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
  selectedChart: document.querySelector("#selected-chart"),
  sitePopup: document.querySelector("#site-popup"),
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
    if (event.key === "Escape") closeProductionPopup();
  });
  document.addEventListener("pointerdown", (event) => {
    if (!state.selectedProductionSite || !els.sitePopup || els.sitePopup.hidden) return;
    if (els.sitePopup.contains(event.target)) return;
    if (state.hoveredProductionSite && !state.productionPopupPinned) {
      state.productionPopupPinned = true;
      return;
    }
    closeProductionPopup();
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
    onClick: ({ layer }) => {
      if (layer?.id !== "production-icons") closeProductionPopup();
    },
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
  const network = energyNetwork();

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
          feature.properties.region === selected ? [242, 248, 239, 235] : [161, 207, 151, 128],
        getFillColor: (feature) => regionColor(feature, pulse),
        updateTriggers: {
          getFillColor: [state.time, state.future, state.solar, state.renovation, selected],
          getLineColor: [selected],
        },
        onClick: ({ object }) => {
          if (!object) return;
          closeProductionPopup();
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
          closeProductionPopup();
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
      new deck.PathLayer({
        id: "national-grid-halo",
        data: network.nationalLinks,
        pickable: false,
        getPath: (d) => d.path,
        getColor: (d) => d.haloColor,
        getWidth: (d) => d.width * 5,
        widthUnits: "pixels",
        widthMinPixels: 4,
        widthMaxPixels: 28,
        jointRounded: true,
        capRounded: true,
        parameters: { depthTest: false },
        updateTriggers: {
          getColor: [selected],
          getWidth: [selected],
        },
      }),
      new deck.PathLayer({
        id: "national-grid-link",
        data: network.nationalLinks,
        pickable: false,
        getPath: (d) => d.path,
        getColor: (d) => d.color,
        getWidth: (d) => d.width,
        widthUnits: "pixels",
        widthMinPixels: 1,
        widthMaxPixels: 5,
        jointRounded: true,
        capRounded: true,
        parameters: { depthTest: false },
        updateTriggers: {
          getColor: [selected],
          getWidth: [selected],
        },
      }),
      new deck.PathLayer({
        id: "regional-grid-halo",
        data: network.regionalLinks,
        pickable: false,
        getPath: (d) => d.path,
        getColor: (d) => d.haloColor,
        getWidth: (d) => d.width * 3.6,
        widthUnits: "pixels",
        widthMinPixels: 3,
        widthMaxPixels: 18,
        jointRounded: true,
        capRounded: true,
        parameters: { depthTest: false },
        updateTriggers: {
          getColor: [selected],
          getWidth: [selected],
        },
      }),
      new deck.PathLayer({
        id: "regional-grid-link",
        data: network.regionalLinks,
        pickable: false,
        getPath: (d) => d.path,
        getColor: (d) => d.color,
        getWidth: (d) => d.width,
        widthUnits: "pixels",
        widthMinPixels: 1,
        widthMaxPixels: 4,
        jointRounded: true,
        capRounded: true,
        parameters: { depthTest: false },
        updateTriggers: {
          getColor: [selected],
          getWidth: [selected],
        },
      }),
      new deck.PathLayer({
        id: "energy-grid-light",
        data: productionFlowHighlights(network.animatedLinks),
        pickable: false,
        getPath: (d) => d.path,
        getColor: (d) => d.color,
        getWidth: (d) => d.width,
        widthUnits: "pixels",
        widthMinPixels: 1,
        widthMaxPixels: 4,
        jointRounded: true,
        capRounded: true,
        parameters: { depthTest: false },
        updateTriggers: {
          getPath: [state.time],
          getColor: [state.time, selected],
        },
      }),
      new deck.ScatterplotLayer({
        id: "energy-grid-glints",
        data: productionFlowGlints(network.animatedLinks),
        pickable: false,
        getPosition: (d) => d.position,
        getRadius: (d) => d.radius,
        radiusMinPixels: 4,
        radiusMaxPixels: 8,
        getFillColor: (d) => d.color,
        stroked: false,
        parameters: { depthTest: false },
        updateTriggers: {
          getPosition: [state.time],
          getFillColor: [state.time],
        },
      }),
      new deck.ScatterplotLayer({
        id: "grid-nodes",
        data: network.nodes,
        pickable: false,
        getPosition: (d) => d.position,
        getRadius: (d) => d.radius,
        radiusMinPixels: 4,
        radiusMaxPixels: 14,
        getFillColor: (d) => d.color,
        getLineColor: (d) => d.lineColor,
        lineWidthMinPixels: 1,
        stroked: true,
        parameters: { depthTest: false },
        updateTriggers: {
          getFillColor: [selected],
          getLineColor: [selected],
        },
      }),
      new deck.IconLayer({
        id: "production-icons",
        data: state.prodPoints,
        pickable: true,
        getPosition: (d) => d.position,
        getIcon: (d) => productionIcon(d),
        getSize: (d) => productionIconSize(d),
        sizeUnits: "pixels",
        billboard: true,
        parameters: { depthTest: false },
        onHover: (info) => {
          if (state.productionPopupPinned) return;
          if (info.object) {
            state.hoveredProductionSite = info.object;
            showProductionPopup(info.object, info);
          } else {
            state.hoveredProductionSite = null;
            closeHoveredProductionPopup();
          }
        },
        onClick: (info) => {
          if (!info.object) return false;
          showProductionPopup(info.object, info, { pinned: true });
          return true;
        },
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
  const alpha = isSelected ? 136 : 50 + pulse * deficit * 22;

  if (ratio >= 1) return [70, 132, 82, alpha];
  if (ratio >= 0.52) return [87, 126, 65, alpha];
  if (ratio >= 0.26) return [128, 104, 65, alpha];
  return [130, 77, 63, alpha];
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
        label: "Production renouvelable",
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
    if (ring.ratio >= 0.6) return [220, 168, 94, alpha];
    return [233, 107, 88, alpha];
  }

  if (ring.ratio >= 0.8) return [156, 224, 113, alpha];
  return [126, 214, 200, alpha];
}

function energyNetwork() {
  const regionalPoints = groupedVisibleFlowPoints();
  const regionalLinks = [];
  const nodes = [];

  let linkIndex = 0;
  Object.entries(regionalPoints).forEach(([region, points]) => {
    const center = REGION_CENTERS[region];
    if (!center || points.length === 0) return;

    const selectedBoost = !state.selectedRegion || state.selectedRegion === region ? 1 : 0.32;
    const dominantSource = dominantFiliere(points);
    const centerColor = sourceColor(dominantSource, Math.round(95 + selectedBoost * 105));

    nodes.push({
      type: "region",
      region,
      position: center,
      radius: 19000,
      color: centerColor,
      lineColor: sourceColor("National", Math.round(120 + selectedBoost * 90)),
    });

    createRegionalMeshLinks(region, points, selectedBoost).forEach((link) => {
      regionalLinks.push({ ...link, phase: (linkIndex * 0.137) % 1 });
      linkIndex += 1;
    });
  });

  const nationalLinks = createInterRegionalMeshLinks(regionalPoints, linkIndex);

  return {
    regionalLinks,
    nationalLinks,
    animatedLinks: [...nationalLinks, ...regionalLinks.filter((link) => link.kind !== "regional-mesh")],
    nodes,
  };
}

function groupedVisibleFlowPoints() {
  const byRegion = state.prodPoints.reduce((acc, point) => {
    if (!REGION_CENTERS[point.region]) return acc;
    acc[point.region] = acc[point.region] || [];
    acc[point.region].push(point);
    return acc;
  }, {});

  if (state.selectedRegion && byRegion[state.selectedRegion]) {
    return {
      [state.selectedRegion]: rankedFlowPoints(byRegion[state.selectedRegion], 20),
    };
  }

  return Object.fromEntries(
    Object.entries(byRegion).map(([region, points]) => [region, rankedFlowPoints(points, 5)]),
  );
}

function rankedFlowPoints(points, limit) {
  return [...points]
    .sort((a, b) => Number(b.power || 0) - Number(a.power || 0))
    .slice(0, limit);
}

function createRegionalMeshLinks(region, points, selectedBoost) {
  const links = [];
  const seen = new Set();

  points.forEach((point) => {
    nearestPoints(point, points, state.selectedRegion === region ? 2 : 1).forEach((neighbor) => {
      const key = linkKey(point, neighbor);
      if (seen.has(key)) return;
      seen.add(key);
      links.push(createNetworkLink(point, neighbor.position, selectedBoost * 0.78, "regional-mesh", neighbor));
    });
  });

  return links;
}

function nearestPoints(point, points, limit) {
  return points
    .filter((candidate) => candidate !== point)
    .map((candidate) => ({
      ...candidate,
      distance: geoDistance(point.position, candidate.position),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

function linkKey(a, b) {
  const aKey = `${a.name || ""}:${a.position.join(",")}`;
  const bKey = `${b.name || ""}:${b.position.join(",")}`;
  return [aKey, bKey].sort().join("|");
}

function createNetworkLink(point, target, selectedBoost, kind, neighbor = null) {
  const power = Math.max(point.power || 25, 12);
  const width = Math.max(0.85, Math.min(3.4, 0.9 + Math.sqrt(power) * 0.065)) * selectedBoost;
  const colorAlpha = kind === "regional-mesh" ? 64 + selectedBoost * 74 : 88 + selectedBoost * 104;

  return {
    point,
    neighbor,
    kind,
    region: point.region,
    path: curvedFlowPath(point.position, target, 0, kind === "regional-mesh" ? 0.16 : 0.28),
    width,
    phase: 0,
    color: productionSiteColor(point, Math.round(colorAlpha)),
    haloColor: productionSiteColor(point, Math.round(22 + selectedBoost * 42)),
  };
}

function createInterRegionalMeshLinks(regionalPoints, startIndex) {
  const summaries = Object.entries(REGION_CENTERS).map(([region, center]) => {
    const points = regionalPoints[region] || rankedFlowPoints(
      state.prodPoints.filter((point) => point.region === region),
      4,
    );

    return {
      region,
      center,
      points,
      source: dominantFiliere(points),
      power: Math.max(totalPower(points), 80),
    };
  });

  const seen = new Set();
  const links = [];
  let index = startIndex;

  summaries.forEach((summary) => {
    const selectedBoost = !state.selectedRegion || state.selectedRegion === summary.region ? 0.92 : 0.34;
    nearestRegions(summary, summaries, state.selectedRegion === summary.region ? 3 : 2).forEach((neighbor) => {
      const key = [summary.region, neighbor.region].sort().join("|");
      if (seen.has(key)) return;
      seen.add(key);

      const source = summary.power >= neighbor.power ? summary.source : neighbor.source;
      const pseudoPoint = { filiere: source, region: summary.region, power: Math.max(summary.power, neighbor.power) };
      const width = Math.max(1, Math.min(3.7, 1.1 + Math.sqrt(pseudoPoint.power) * 0.035)) * selectedBoost;

      links.push({
        point: pseudoPoint,
        kind: "inter-regional",
        region: summary.region,
        path: curvedFlowPath(summary.center, neighbor.center, index, 0.2),
        width,
        phase: (index * 0.137) % 1,
        color: productionSiteColor(pseudoPoint, Math.round(88 + selectedBoost * 98)),
        haloColor: productionSiteColor(pseudoPoint, Math.round(24 + selectedBoost * 52)),
      });
      index += 1;
    });
  });

  return links;
}

function nearestRegions(region, regions, limit) {
  return regions
    .filter((candidate) => candidate.region !== region.region)
    .map((candidate) => ({
      ...candidate,
      distance: geoDistance(region.center, candidate.center),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit);
}

function dominantFiliere(points) {
  const totals = points.reduce((acc, point) => {
    const filiere = point.filiere || "EnR";
    acc[filiere] = (acc[filiere] || 0) + Number(point.power || 0);
    return acc;
  }, {});

  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "EnR";
}

function totalPower(points) {
  return points.reduce((total, point) => total + Number(point.power || 0), 0);
}

function geoDistance(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function productionFlowHighlights(links) {
  return links
    .map((link) => {
      const progress = flowProgress(link);
      const tail = Math.max(0, progress - 0.12);
      const head = Math.min(1, progress + 0.03);
      const path = sliceFlowPath(link.path, tail, head);
      const glow = Math.sin(progress * Math.PI);

      return {
        path,
        width: Math.max(1.2, link.width * 0.72),
        color: productionSiteColor(link.point, Math.round(150 + glow * 80)),
      };
    })
    .filter((link) => link.path.length > 1);
}

function productionFlowGlints(links) {
  return links.map((link) => {
    const progress = flowProgress(link);
    const glow = Math.sin(progress * Math.PI);

    return {
      position: pointOnPath(link.path, progress),
      radius: 1100 + glow * 850,
      color: productionSiteColor(link.point, Math.round(205 + glow * 45)),
    };
  });
}

function flowProgress(link) {
  return (state.time * 0.000055 + link.phase) % 1;
}

function curvedFlowPath(source, target, index, intensity = 1) {
  const dx = target[0] - source[0];
  const dy = target[1] - source[1];
  const distance = Math.hypot(dx, dy);
  if (distance < 0.01) return [source, target];

  const side = index % 2 === 0 ? 1 : -1;
  const curveStrength = Math.min(0.44, Math.max(0.04, distance * 0.12)) * intensity;
  const wobble = 0.66 + (index % 5) * 0.07;
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const control = [
    (source[0] + target[0]) / 2 + normalX * curveStrength * side * wobble,
    (source[1] + target[1]) / 2 + normalY * curveStrength * side * wobble,
  ];

  return Array.from({ length: 25 }, (_, step) => {
    const t = step / 24;
    const inv = 1 - t;
    return [
      inv * inv * source[0] + 2 * inv * t * control[0] + t * t * target[0],
      inv * inv * source[1] + 2 * inv * t * control[1] + t * t * target[1],
    ];
  });
}

function sliceFlowPath(path, start, end) {
  if (end <= 0 || start >= 1 || path.length < 2) return [];

  const safeStart = Math.max(0, Math.min(1, start));
  const safeEnd = Math.max(safeStart, Math.min(1, end));
  const segment = [pointOnPath(path, safeStart)];

  path.forEach((point, index) => {
    const t = index / (path.length - 1);
    if (t > safeStart && t < safeEnd) segment.push(point);
  });

  segment.push(pointOnPath(path, safeEnd));
  return segment;
}

function pointOnPath(path, progress) {
  const scaled = progress * (path.length - 1);
  const index = Math.floor(scaled);
  const nextIndex = Math.min(index + 1, path.length - 1);
  const localT = scaled - index;
  const current = path[index];
  const next = path[nextIndex];

  return [
    current[0] + (next[0] - current[0]) * localT,
    current[1] + (next[1] - current[1]) * localT,
  ];
}

function productionSiteColor(point, alpha) {
  return sourceColor(point.filiere || "EnR", alpha);
}

function sourceColor(source, alpha) {
  const [r, g, b] = SOURCE_COLORS[source] || SOURCE_COLORS.EnR;
  return [r, g, b, alpha];
}

function createProductionIcons() {
  const icons = {
    solar: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="9" fill="#f4cd65"/>
        <g stroke="#f2f8ef" stroke-width="3" stroke-linecap="round">
          <path d="M24 5v7M24 36v7M5 24h7M36 24h7M10.6 10.6l5 5M32.4 32.4l5 5M37.4 10.6l-5 5M15.6 32.4l-5 5"/>
        </g>
        <circle cx="24" cy="24" r="17" fill="none" stroke="#9ce071" stroke-width="1.6" opacity=".85"/>
      </svg>`,
    wind: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M24 22v20" stroke="#f2f8ef" stroke-width="4" stroke-linecap="round"/>
        <circle cx="24" cy="22" r="4" fill="#7ed6c8"/>
        <path d="M24 22 12 12M24 22l16-4M24 22l-4 16" stroke="#9ce071" stroke-width="4" stroke-linecap="round"/>
        <path d="M17 42h14" stroke="#f2f8ef" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    hydro: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M24 5c7 9 13 16 13 25a13 13 0 0 1-26 0c0-9 6-16 13-25Z" fill="#58a0da"/>
        <path d="M15 31c4 3 7 3 11 0s7-3 11 0" fill="none" stroke="#f2f8ef" stroke-width="3" stroke-linecap="round"/>
      </svg>`,
    bio: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M39 10C25 10 13 18 13 32c14 0 26-8 26-22Z" fill="#9ce071"/>
        <path d="M12 38c7-13 16-18 27-28" fill="none" stroke="#f2f8ef" stroke-width="3" stroke-linecap="round"/>
        <path d="M18 28c4 0 9 1 13 4" fill="none" stroke="#7ed6c8" stroke-width="2" stroke-linecap="round"/>
      </svg>`,
    geo: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="15" fill="none" stroke="#dca85e" stroke-width="4"/>
        <circle cx="24" cy="24" r="6" fill="#e2875b"/>
        <path d="M14 39c4-4 4-8 0-12M24 43c4-5 4-10 0-15M34 39c-4-4-4-8 0-12" fill="none" stroke="#f2f8ef" stroke-width="2.5" stroke-linecap="round"/>
      </svg>`,
    marine: `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <path d="M8 19c5-5 10-5 15 0s10 5 15 0" fill="none" stroke="#76c7e8" stroke-width="4" stroke-linecap="round"/>
        <path d="M8 30c5-5 10-5 15 0s10 5 15 0" fill="none" stroke="#58a0da" stroke-width="4" stroke-linecap="round"/>
        <circle cx="24" cy="24" r="17" fill="none" stroke="#f2f8ef" stroke-width="1.6" opacity=".75"/>
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

function productionIconSize(point) {
  const baseSize = 16 + Math.sqrt(point.power || 25) * 0.22;
  if (point.filiere === "Eolien") return Math.max(28, Math.min(46, baseSize * 1.32));
  return Math.max(18, Math.min(34, baseSize));
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
    renderSelectedChart(selectedFeature.properties.region);
  } else {
    els.selectedKicker.textContent = state.loadMode === "live" ? "Territoire ORE" : "Territoire demo";
    els.selectedName.textContent = "France m\u00e9tropolitaine";
    els.selectedConsumption.textContent = formatEnergy(totals.consumption);
    els.selectedProduction.textContent = formatEnergy(totals.production);
    els.selectedPulse.textContent = formatPulse({
      ratio: totals.production / Math.max(totals.consumption, 1),
      deficit: Math.max(0, 1 - totals.production / Math.max(totals.consumption, 1)),
    });
    renderSelectedChart(null);
  }
}

function setLoadingText() {
  els.totalConsumption.textContent = "...";
  els.totalProduction.textContent = "...";
  els.totalRatio.textContent = "...";
  els.selectedConsumption.textContent = "...";
  els.selectedProduction.textContent = "...";
  els.selectedPulse.textContent = "...";
  if (els.selectedChart) {
    els.selectedChart.innerHTML = "";
  }
}

function showProductionPopup(site, info, options = {}) {
  if (!els.sitePopup) return;

  state.selectedProductionSite = site;
  state.sitePopupPosition = { x: info.x || 0, y: info.y || 0 };
  state.productionPopupPinned = Boolean(options.pinned);

  const source = site.filiere || "EnR";
  const photo = productionPhoto(source);
  const sourceLabel = SOURCE_LABELS[source] || source;
  const color = sourceColorHex(source);
  const power = `${Math.round(Number(site.power || 0))} kW`;
  const injected = Number(site.injected || 0);

  els.sitePopup.innerHTML = `
    <figure class="site-photo">
      <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy" />
      <figcaption>${escapeHtml(photo.credit)}</figcaption>
    </figure>
    <div class="site-popup-body">
      <div class="site-popup-head">
        <span class="site-source" style="--source-color:${color};">${escapeHtml(sourceLabel)}</span>
        <button class="site-popup-close" type="button" aria-label="Fermer">&times;</button>
      </div>
      <strong>${escapeHtml(site.name || "Installation renouvelable")}</strong>
      <dl>
        <div><dt>R\u00e9gion</dt><dd>${escapeHtml(displayRegionName(site.region))}</dd></div>
        <div><dt>Puissance</dt><dd>${escapeHtml(power)}</dd></div>
        <div><dt>Fili\u00e8re</dt><dd>${escapeHtml(sourceLabel)}</dd></div>
        ${
          injected > 0
            ? `<div><dt>Injection</dt><dd>${escapeHtml(formatEnergy(injected / 1000))}</dd></div>`
            : ""
        }
      </dl>
    </div>
  `;

  els.sitePopup.hidden = false;
  positionProductionPopup(info.x || 0, info.y || 0);

  const closeButton = els.sitePopup.querySelector(".site-popup-close");
  closeButton?.addEventListener("click", closeProductionPopup);
  const img = els.sitePopup.querySelector("img");
  img?.addEventListener("error", () => {
    img.removeAttribute("src");
    img.alt = "Image indisponible";
    img.closest(".site-photo")?.classList.add("image-missing");
  });
}

function positionProductionPopup(x, y) {
  if (!els.sitePopup) return;

  const margin = 18;
  const popupWidth = Math.min(340, window.innerWidth - margin * 2);
  const rect = els.sitePopup.getBoundingClientRect();
  const width = rect.width || popupWidth;
  const height = rect.height || 320;
  const maxLeft = window.innerWidth - width - margin;
  const maxTop = window.innerHeight - height - margin;
  const candidates = [
    { left: x + 20, top: y - 40 },
    { left: x - width - 20, top: y - 40 },
    { left: x - width / 2, top: y + 24 },
    { left: x - width / 2, top: y - height - 24 },
  ].map((candidate) => ({
    left: Math.max(margin, Math.min(maxLeft, candidate.left)),
    top: Math.max(margin, Math.min(maxTop, candidate.top)),
  }));

  const placement =
    candidates.find((candidate) => !pointInsideRect(x, y, candidate.left, candidate.top, width, height)) ||
    candidates[0];

  els.sitePopup.style.left = `${placement.left}px`;
  els.sitePopup.style.top = `${placement.top}px`;
}

function pointInsideRect(x, y, left, top, width, height) {
  const buffer = 8;
  return x >= left - buffer && x <= left + width + buffer && y >= top - buffer && y <= top + height + buffer;
}

function closeProductionPopup() {
  if (!els.sitePopup || els.sitePopup.hidden) return;
  state.selectedProductionSite = null;
  state.hoveredProductionSite = null;
  state.sitePopupPosition = null;
  state.productionPopupPinned = false;
  els.sitePopup.hidden = true;
  els.sitePopup.innerHTML = "";
}

function closeHoveredProductionPopup() {
  if (state.productionPopupPinned) return;
  closeProductionPopup();
}

function productionPhoto(source) {
  return PRODUCTION_PHOTOS[source] || PRODUCTION_PHOTOS.EnR;
}

function renderSelectedChart(region) {
  if (!els.selectedChart) return;

  const mix = productionMixData(region);
  const title = region
    ? `Mix renouvelable - ${displayRegionName(region)}`
    : "Mix national des energies renouvelables";

  if (mix.length === 0) {
    els.selectedChart.innerHTML = `
      <div class="chart-head">
        <strong>${escapeHtml(title)}</strong>
        <span>Aucune source</span>
      </div>
      <p class="chart-empty">Pas de site de production disponible pour ce territoire.</p>
    `;
    return;
  }

  let cursor = 0;
  const gradient = mix
    .map((item) => {
      const start = cursor;
      cursor += item.share * 100;
      return `${item.color} ${start.toFixed(2)}% ${cursor.toFixed(2)}%`;
    })
    .join(", ");

  const legend = mix
    .map(
      (item) => `
        <li>
          <span class="chart-dot" style="background:${item.color}; box-shadow:0 0 10px ${item.color};"></span>
          <span>${escapeHtml(item.label)}</span>
          <strong>${Math.round(item.share * 100)}%</strong>
        </li>
      `,
    )
    .join("");

  els.selectedChart.innerHTML = `
    <div class="chart-head">
      <strong>${escapeHtml(title)}</strong>
      <span>${mix.length} sources</span>
    </div>
    <div class="chart-body">
      <div class="pie-chart" style="background:conic-gradient(${gradient});">
        <span>${escapeHtml(mix[0].label)}</span>
      </div>
      <ul>${legend}</ul>
    </div>
  `;
}

function productionMixData(region) {
  const points = state.prodPoints.filter((point) => !region || point.region === region);
  const totals = points.reduce((acc, point) => {
    const source = point.filiere || "EnR";
    const value = productionPointWeight(point);
    acc[source] = (acc[source] || 0) + value;
    return acc;
  }, {});
  const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
  if (!total) return [];

  return Object.entries(totals)
    .map(([source, value]) => ({
      source,
      label: SOURCE_LABELS[source] || source,
      value,
      share: value / total,
      color: sourceColorHex(source),
    }))
    .sort((a, b) => b.value - a.value);
}

function productionPointWeight(point) {
  const power = Number(point.power || 0);
  if (power > 0) return power;

  const injected = Number(point.injected || 0);
  if (injected > 0) return injected / 1000;

  return 1;
}

function sourceColorHex(source) {
  const [r, g, b] = SOURCE_COLORS[source] || SOURCE_COLORS.EnR;
  return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
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
        name: `${displayRegionName(region)} renouvelable ${index + 1}`,
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
    name: item.nominstallation || "Installation renouvelable",
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
    const region = displayRegionName(object.properties.region);
    return {
      className: "deck-tooltip",
      html: [
        tooltipRegionPhoto(object.properties.region),
        tooltipTitle(region),
        tooltipRow("Consommation", formatEnergy(metrics.futureConsumption)),
        tooltipRow("Production renouvelable", formatEnergy(metrics.futureProduction)),
        tooltipRow("Autonomie locale", formatRatio(metrics.ratio)),
        tooltipNote(tooltipMessage(metrics.ratio)),
      ].join(""),
    };
  }

  if (layer?.id === "energy-rings") {
    return {
      className: "deck-tooltip",
      html: [
        tooltipRegionPhoto(object.region),
        tooltipTitle(displayRegionName(object.region)),
        tooltipRow(object.label, formatEnergy(object.value)),
        tooltipRow("Autonomie locale", formatRatio(object.ratio)),
        tooltipNote(object.type === "consumption" ? "Demande energetique du territoire." : "Production renouvelable mesuree localement."),
      ].join(""),
    };
  }

  return null;
}

function tooltipRegionPhoto(region) {
  const photo = regionPhoto(region);
  return `
    <figure class="tooltip-photo">
      <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy" />
      <figcaption>
        <span>${escapeHtml(photo.label)}</span>
        <small>${escapeHtml(photo.credit)}</small>
      </figcaption>
    </figure>
  `;
}

function regionPhoto(region) {
  return REGION_PHOTOS[region] || REGION_PHOTOS["Ile-de-France"];
}

function tooltipTitle(value) {
  return `<strong>${escapeHtml(value)}</strong>`;
}

function tooltipRow(label, value) {
  return `<span>${escapeHtml(label)}<em>${escapeHtml(value)}</em></span>`;
}

function tooltipNote(value) {
  return `<small class="tooltip-note">${escapeHtml(value)}</small>`;
}

function tooltipMessage(ratio) {
  if (!Number.isFinite(ratio)) return "Donnees indisponibles pour ce territoire.";
  if (ratio >= 1) return "Territoire a production renouvelable excedentaire.";
  if (ratio >= 0.52) return "Equilibre en progression, production locale notable.";
  if (ratio >= 0.26) return "Transition active, encore dependante d'apports exterieurs.";
  return "Besoin local fort face a la production renouvelable disponible.";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[char];
  });
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
