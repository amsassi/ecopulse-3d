# EcoPulse 3D

Maquette interactive dark/neon pour visualiser le pouls energetique des regions
francaises : consommation annuelle, production EnR locale, fond OpenStreetMap,
anneaux energetiques, flux pointilles et mode futur.

## Lancer la demo

```powershell
python -m http.server 5173 --bind 127.0.0.1
```

Puis ouvrir :

```txt
http://127.0.0.1:5173/
```

## Donnees

- Consommation : Agence ORE Data Fair, dataset
  `consommation-annuelle-d-electricite-et-gaz-par-commune`
- Production EnR : Agence ORE Data Fair, dataset
  `registre-national-installation-production-stockage-electricite-agrege`
- Fond cartographique : tuiles OpenStreetMap
- Contours : `data/regions.geojson`

L'application tente les appels ORE en direct. Si l'API ou le reseau ne repond pas,
elle bascule sur un jeu de donnees de secours pour garder la demo fonctionnelle.

## Scenario pitch

1. Vue France : la carte reste plate et lisible sur un fond OpenStreetMap.
2. Anneaux : rouge pour la consommation, cyan/vert pour la production EnR.
3. Flux : les sites de production envoient des pointilles vers le centre de
   leur region, comme une alimentation locale.
4. Montreuil : zoom sur l'Ile-de-France, region fortement consommatrice.
5. Mode futur : les curseurs solaire local et renovation modifient la taille
   des anneaux et apaisent progressivement le pulse.
