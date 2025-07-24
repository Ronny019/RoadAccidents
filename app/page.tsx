'use client';

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import '../styles/map.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function AccidentMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapRef.current!,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-123.1207, 49.2827],
      zoom: 13
    });

    map.on('load', () => {
      map.addSource('accidents', {
        type: 'geojson',
        data: '/roads.geojson'
      });

      map.addLayer({
        id: 'accident-roads',
        type: 'line',
        source: 'accidents',
        paint: {
          'line-width': 5,
          'line-color': [
            'interpolate',
            ['linear'],
            ['get', 'accidents'],
            0, '#00FF00',
            10, '#FFA500',
            20, '#FF0000'
          ]
        }
      });

      map.on('click', 'accident-roads', (e) => {
        const props = e.features?.[0].properties;
        const street = props?.street;
        const accidents = props?.accidents;
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<strong>${street}</strong><br/>Accidents: ${accidents}`)
          .addTo(map);
      });

      map.on('mouseenter', 'accident-roads', () => {
        map.getCanvas().style.cursor = 'pointer';
      });

      map.on('mouseleave', 'accident-roads', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapRef} id="map" />;
}
