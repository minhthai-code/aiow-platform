export interface HydrationMarker {
  id: string;
  selector: string;
}

export interface HydrationPlan {
  routeId: string;
  markers: HydrationMarker[];
}

