// Screenshots of the Allplan 2027 launch package (Screenshots folder), resized to web JPEGs; see docs/brand/assets-license-log.md.
// tests/test_feature_screens.py checks that every mapping points at a real screen and a real feature title.
export const screens: Record<string, { src: string }> = {
  "reinforcement-modification": {
    "src": "/assets/previews/allplan-2027-screens/reinforcement-modification.jpg"
  },
  "beam-reinforcement": {
    "src": "/assets/previews/allplan-2027-screens/beam-reinforcement.jpg"
  },
  "wall-reinforcement": {
    "src": "/assets/previews/allplan-2027-screens/wall-reinforcement.jpg"
  },
  "reinforcement-ai-drafter": {
    "src": "/assets/previews/allplan-2027-screens/reinforcement-ai-drafter.jpg"
  },
  "ai-drafter": {
    "src": "/assets/previews/allplan-2027-screens/ai-drafter.jpg"
  },
  "associative-leaders": {
    "src": "/assets/previews/allplan-2027-screens/associative-leaders.jpg"
  },
  "curved-contours": {
    "src": "/assets/previews/allplan-2027-screens/curved-contours.jpg"
  },
  "object-representation": {
    "src": "/assets/previews/allplan-2027-screens/object-representation.jpg"
  },
  "cloud-bim-manager": {
    "src": "/assets/previews/allplan-2027-screens/cloud-bim-manager.jpg"
  },
  "mark-numbering": {
    "src": "/assets/previews/allplan-2027-screens/mark-numbering.jpg"
  },
  "element-tooltips": {
    "src": "/assets/previews/allplan-2027-screens/element-tooltips.jpg"
  },
  "clash-groups": {
    "src": "/assets/previews/allplan-2027-screens/clash-groups.jpg"
  },
  "ifc-xref": {
    "src": "/assets/previews/allplan-2027-screens/ifc-xref.jpg"
  },
  "georeferencing": {
    "src": "/assets/previews/allplan-2027-screens/georeferencing.jpg"
  },
  "gis-connector": {
    "src": "/assets/previews/allplan-2027-screens/gis-connector.jpg"
  },
  "ai-bim-analyst": {
    "src": "/assets/previews/allplan-2027-screens/ai-bim-analyst.jpg"
  },
  "ai-bim-modeler": {
    "src": "/assets/previews/allplan-2027-screens/ai-bim-modeler.jpg"
  },
  "ai-formula-writer": {
    "src": "/assets/previews/allplan-2027-screens/ai-formula-writer.jpg"
  },
  "ai-coach": {
    "src": "/assets/previews/allplan-2027-screens/ai-coach.jpg"
  },
  "ai-visualizer": {
    "src": "/assets/previews/allplan-2027-screens/ai-visualizer.jpg"
  },
  "max-ai-analyst": {
    "src": "/assets/previews/allplan-2027-screens/max-ai-analyst.jpg"
  }
};

// Turkish feature title (Rebar and Parametric pages) -> screen id.
export const featureScreens: Record<string, string> = {
  "Donatı Düzenleme": "reinforcement-modification",
  "Otomatik Kiriş Donatısı": "beam-reinforcement",
  "Otomatik Duvar Donatısı": "wall-reinforcement",
  "Donatı AI Drafter": "reinforcement-ai-drafter",
  "AI Drafter": "ai-drafter",
  "İlişkisel Metin Okları": "associative-leaders",
  "Dinamik Konturlar": "curved-contours",
  "Görünümlerde Nesne Gösterimi": "object-representation",
  "Cloud BIM Manager": "cloud-bim-manager",
  "Mark Numaralandırma": "mark-numbering",
  "BIM'e Hazır İpuçları": "element-tooltips",
  "Gruplanmış Donatı Çakışmaları": "clash-groups",
  "Kesitlerde ve Görünümlerde IFC Xref'leri": "ifc-xref",
  "Merkezî Jeoreferanslama": "georeferencing",
  "Harici Veri Kaynakları": "gis-connector",
  "AI BIM Analyst": "ai-bim-analyst",
  "AI BIM Modeler": "ai-bim-modeler",
  "AI Formula Writer": "ai-formula-writer",
  "AI Coach": "ai-coach",
  "AI Visualizer": "ai-visualizer"
};

// Feature label of the Allplan 2027 edition news pages -> screen id.
export const editionScreens: Record<string, string> = {
  "Allplan Max": "max-ai-analyst",
  "BIM'e hazır ipuçları": "element-tooltips",
  "Mark Numbering 2.0": "mark-numbering",
  "Cloud BIM Manager": "cloud-bim-manager",
  "Donatı iş akışı otomasyonu": "wall-reinforcement",
  "Cloud BIM Manager ve Mark Numbering 2.0": "cloud-bim-manager"
};
