import type { Station } from '../../schemas/station.schema';

export const stations: readonly Station[] = [
  {
    id: 'station-0',
    arcsCleared: 0,
    title: 'Initiate',
    description:
      'The man who has taken the vow and set his foot on the path — the first and most important act.',
    sealSource: 'semantic',
    sealId: 'primary',
  },
  {
    id: 'station-1',
    arcsCleared: 1,
    title: 'Seeker',
    description:
      'One arc held — he has learned the difference between impulse and intent, and chosen the latter.',
    sealSource: 'arc',
    sealId: '1',
  },
  {
    id: 'station-2',
    arcsCleared: 2,
    title: 'Warden',
    description:
      'Two arcs held — he knows which gates matter and keeps the watch before the fire rises.',
    sealSource: 'arc',
    sealId: '2',
  },
  {
    id: 'station-3',
    arcsCleared: 3,
    title: 'Foreman',
    description:
      'Three arcs held — the body has answered the vow and the practice has a physical foundation.',
    sealSource: 'arc',
    sealId: '3',
  },
  {
    id: 'station-4',
    arcsCleared: 4,
    title: 'Stoic',
    description:
      'Four arcs held — the assent is commanded; impressions arrive but they do not rule.',
    sealSource: 'arc',
    sealId: '4',
  },
  {
    id: 'station-5',
    arcsCleared: 5,
    title: 'Sovereign of Self',
    description:
      'Five arcs held — the inner kingdom has a king; reason and spirit govern, appetite serves.',
    sealSource: 'arc',
    sealId: '5',
  },
  {
    id: 'station-6',
    arcsCleared: 6,
    title: 'Craftsman',
    description:
      'Six arcs held — the fire no longer waits for release; it enters the hands and becomes real work.',
    sealSource: 'arc',
    sealId: '6',
  },
  {
    id: 'station-7',
    arcsCleared: 7,
    title: 'Brother',
    description:
      'Seven arcs held — his strength is no longer hoarded; others are steadier because he is here.',
    sealSource: 'arc',
    sealId: '7',
  },
  {
    id: 'station-8',
    arcsCleared: 8,
    title: 'Shadow Walker',
    description:
      'Eight arcs held — he has looked at what the lapse protected and named it without flinching.',
    sealSource: 'arc',
    sealId: '8',
  },
  {
    id: 'station-9',
    arcsCleared: 9,
    title: 'Crowned',
    description:
      'Nine arcs held and the crown received — the practice is not what he does; it is who he is.',
    sealSource: 'arc',
    sealId: '9',
  },
] as const;
