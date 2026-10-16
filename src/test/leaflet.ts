// Minimal stand-in for Leaflet, installed in jest.setup.js: jsdom has no layout or tiles,
// so tests check the checkout flow around the map, not the map itself.
const chain = () => {
  const layer = {
    addTo: () => layer,
    on: () => layer,
    setLatLng: () => layer,
    getLatLng: () => ({ lat: 0, lng: 0 }),
    setView: () => layer,
    invalidateSize: () => layer,
    remove: () => undefined,
  };
  return layer;
};

export const leafletMock = {
  map: chain,
  tileLayer: chain,
  marker: chain,
  divIcon: () => ({}),
};
