'use client';

import { BuilderComponent, builder } from '@builder.io/react';

// Inserisci la tua chiave pubblica Builder (la trovi nel tuo account)
builder.init('cdbdf73361a44b3687cf831991799007');

export default function BuilderDashboard() {
  return <BuilderComponent model="page" />;
}
