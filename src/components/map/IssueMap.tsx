'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  InfoWindow, 
  useMap 
} from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { Issue } from '@/types';
import { getCategoryInfo } from '@/lib/constants';
import MarkerPopup from './MarkerPopup';
import { MapPin, Sparkles } from 'lucide-react';

interface IssueMapProps {
  issues: Issue[];
}

const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 }; // Bengaluru default
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

// Inner component to handle clustering since we need the map instance from useMap()
function ClusteredMarkers({ 
  issues, 
  onMarkerClick 
}: { 
  issues: Issue[]; 
  onMarkerClick: (issue: Issue) => void 
}) {
  const map = useMap();
  const [markers, setMarkers] = useState<{ [key: string]: google.maps.marker.AdvancedMarkerElement }>({});
  const clustererRef = useRef<MarkerClusterer | null>(null);

  // Initialize MarkerClusterer
  useEffect(() => {
    if (!map) return;
    
    if (!clustererRef.current) {
      clustererRef.current = new MarkerClusterer({
        map,
        algorithmOptions: { maxZoom: 15 },
      });
    }

    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
      }
    };
  }, [map]);

  // Update markers inside clusterer
  useEffect(() => {
    if (!clustererRef.current) return;

    clustererRef.current.clearMarkers();
    
    // Filters out markers that aren't mounted/ready yet
    const activeMarkers = Object.values(markers).filter(Boolean);
    clustererRef.current.addMarkers(activeMarkers);
  }, [markers, issues]);

  const setRef = (marker: google.maps.marker.AdvancedMarkerElement | null, id: string) => {
    if (marker) {
      setMarkers((prev) => ({ ...prev, [id]: marker }));
    } else {
      setMarkers((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }
  };

  return (
    <>
      {issues.map((issue) => {
        const catInfo = getCategoryInfo(issue.category);
        const isHighSeverity = issue.severity >= 4;

        return (
          <AdvancedMarker
            key={issue.id}
            position={{ lat: issue.location.lat, lng: issue.location.lng }}
            ref={(marker) => setRef(marker, issue.id)}
            onClick={() => onMarkerClick(issue)}
            title={issue.title}
          >
            <div className="relative flex flex-col items-center cursor-pointer group">
              {/* Pulsing glow for high severity */}
              {isHighSeverity && (
                <span className="absolute -top-1.5 -left-1.5 inline-flex h-11 w-11 rounded-full bg-red-500/35 animate-ping pointer-events-none" />
              )}
              
              {/* Custom Pin Container */}
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 transition-transform duration-200 group-hover:scale-110 relative z-10"
                style={{ backgroundColor: catInfo.color }}
              >
                <span className="text-base leading-none select-none">{catInfo.emoji}</span>
              </div>
              
              {/* Pin Triangle Pointer */}
              <div 
                className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[7px] -mt-[2px] z-0 shadow-md"
                style={{ borderTopColor: catInfo.color }}
              />
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

export default function IssueMap({ issues }: IssueMapProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(12);

  // Focus on the first issue's location if available, or stay at default
  useEffect(() => {
    if (issues.length > 0) {
      // Find the first issue with valid lat/lng
      const validIssue = issues.find(i => i.location && typeof i.location.lat === 'number' && typeof i.location.lng === 'number');
      if (validIssue) {
        setCenter({ lat: validIssue.location.lat, lng: validIssue.location.lng });
        setZoom(13);
      }
    }
  }, [issues.length]);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 p-6 text-center">
        <div className="p-4 rounded-full bg-slate-900 border border-white/5 mb-4">
          <MapPin className="w-8 h-8 text-amber-500 animate-bounce" />
        </div>
        <h3 className="font-heading text-lg font-bold text-white mb-2">Google Maps API Key Missing</h3>
        <p className="text-sm max-w-md text-slate-400 mb-4">
          Please add <code className="bg-slate-900 px-1.5 py-0.5 rounded text-amber-400 font-mono text-xs">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> to your environment variables to enable the interactive map.
        </p>
        <div className="text-xs text-slate-500 border border-white/5 bg-white/5 px-4 py-3 rounded-lg max-w-sm">
          💡 You can still view and report issues via the <span className="text-amber-500 font-semibold">Issues Feed</span>.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative bg-slate-950">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          center={center}
          zoom={zoom}
          onCenterChanged={(e) => setCenter(e.detail.center)}
          onZoomChanged={(e) => setZoom(e.detail.zoom)}
          mapId="DEMO_MAP_ID" // Required for AdvancedMarker
          gestureHandling="cooperative"
          disableDefaultUI={false}
          className="w-full h-full"
          styles={[
            // Dark mode map styling
            { elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#1e293b' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#cbd5e1' }],
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#94a3b8' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#0f172a' }],
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#475569' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#0f172a' }],
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1e293b' }],
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#64748b' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#334155' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1e293b' }],
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#cbd5e1' }],
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#1e293b' }],
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#cbd5e1' }],
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#0f172a' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#475569' }],
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#0f172a' }],
            },
          ]}
        >
          {/* Cluster and render markers */}
          <ClusteredMarkers 
            issues={issues} 
            onMarkerClick={(issue) => setSelectedIssue(issue)} 
          />

          {/* Info Window for selected issue */}
          {selectedIssue && (
            <InfoWindow
              position={{ lat: selectedIssue.location.lat, lng: selectedIssue.location.lng }}
              onCloseClick={() => setSelectedIssue(null)}
              // Simple style override for Google Maps default InfoWindow wrapper
              headerDisabled
            >
              <MarkerPopup issue={selectedIssue} />
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* Mini Overlay Stats */}
      <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 py-2 px-3 rounded-lg flex items-center gap-2 text-xs text-slate-300 shadow-xl pointer-events-none z-10">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <span>
          Showing <strong>{issues.length}</strong> reports in this view
        </span>
      </div>
    </div>
  );
}
