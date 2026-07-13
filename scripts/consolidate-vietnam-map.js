import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const topojson = require('topojson-client');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vietnamMapPath = path.join(__dirname, '../public/maps/countries/vietnam.json');

const VIETNAM_CONSOLIDATION_MAP = {
  "VN-CB": "VN-CB", "VN-DB": "VN-DB", "VN-328": "VN-328", "VN-LI": "VN-LI", "VN-LS": "VN-LS",
  "VN-NA": "VN-NA", "VN-QN": "VN-QN", "VN-TH": "VN-TH", "VN-311": "VN-311", "VN-318": "VN-318",
  "VN-TT": "VN-TT",
  "VN-KG": "VN-AG", "VN-AG": "VN-AG",
  "VN-BG": "VN-BN", "VN-BN": "VN-BN",
  "VN-BL": "VN-CM", "VN-CM": "VN-CM",
  "VN-ST": "VN-333", "VN-337": "VN-333", "VN-333": "VN-333",
  "VN-300": "VN-DA", "VN-DA": "VN-DA",
  "VN-PY": "VN-723", "VN-723": "VN-723",
  "VN-BP": "VN-331", "VN-331": "VN-331",
  "VN-TG": "VN-DT", "VN-DT": "VN-DT",
  "VN-BD": "VN-724", "VN-724": "VN-724",
  "VN-BI": "VN-HC", "VN-BV": "VN-HC", "VN-HC": "VN-HC",
  "VN-HD": "VN-3623", "VN-3623": "VN-3623",
  "VN-TB": "VN-317", "VN-317": "VN-317",
  "VN-NT": "VN-KH", "VN-KH": "VN-KH",
  "VN-BU": "VN-LD", "VN-6365": "VN-LD", "VN-LD": "VN-LD",
  "VN-YB": "VN-LO", "VN-LO": "VN-LO",
  "VN-HM": "VN-NB", "VN-ND": "VN-NB", "VN-NB": "VN-NB",
  "VN-HO": "VN-PT", "VN-VC": "VN-PT", "VN-PT": "VN-PT",
  "VN-299": "VN-QG", "VN-QG": "VN-QG",
  "VN-LA": "VN-TN", "VN-TN": "VN-TN",
  "VN-307": "VN-TY", "VN-TY": "VN-TY",
  "VN-HG": "VN-TQ", "VN-TQ": "VN-TQ",
  "VN-BR": "VN-VL", "VN-TV": "VN-VL", "VN-VL": "VN-VL",
  "VN-QB": "VN-QT", "VN-QT": "VN-QT"
};

const STATE_NAMES = {
  "VN-AG": "An Giang",
  "VN-BN": "Bắc Ninh",
  "VN-CB": "Cao Bằng",
  "VN-CM": "Cà Mau",
  "VN-333": "Cần Thơ",
  "VN-DA": "Đà Nẵng",
  "VN-723": "Đắk Lắk",
  "VN-DB": "Điện Biên",
  "VN-331": "Đồng Nai",
  "VN-DT": "Đồng Tháp",
  "VN-724": "Gia Lai",
  "VN-318": "Hà Nội",
  "VN-328": "Hà Tĩnh",
  "VN-3623": "Hải Phòng",
  "VN-HC": "Hồ Chí Minh",
  "VN-TT": "Huế",
  "VN-317": "Hưng Yên",
  "VN-KH": "Khánh Hòa",
  "VN-LI": "Lai Châu",
  "VN-LS": "Lạng Sơn",
  "VN-LD": "Lâm Đồng",
  "VN-LO": "Lào Cai",
  "VN-NA": "Nghệ An",
  "VN-NB": "Ninh Bình",
  "VN-PT": "Phú Thọ",
  "VN-QG": "Quảng Ngãi",
  "VN-QN": "Quảng Ninh",
  "VN-QT": "Quảng Trị",
  "VN-311": "Sơn La",
  "VN-TN": "Tây Ninh",
  "VN-TY": "Thái Nguyên",
  "VN-TH": "Thanh Hóa",
  "VN-TQ": "Tuyên Quang",
  "VN-VL": "Vĩnh Long"
};

const run = () => {
  if (!fs.existsSync(vietnamMapPath)) {
    console.error(`Map file not found at ${vietnamMapPath}`);
    process.exit(1);
  }

  const topology = JSON.parse(fs.readFileSync(vietnamMapPath, 'utf8'));

  // If it's already a FeatureCollection, we shouldn't re-process it from TopoJSON
  if (topology.type === 'FeatureCollection') {
    console.log('Vietnam map is already a GeoJSON FeatureCollection.');
    return;
  }

  const geoms = topology.objects.default.geometries;

  // Group geometries by consolidated code
  const groups = {};
  geoms.forEach(g => {
    const hcKey = g.properties['hc-key'];
    const code = (hcKey.toUpperCase().startsWith('VN-') ? hcKey.toUpperCase() : 'VN-' + hcKey.toUpperCase());
    const consolidated = VIETNAM_CONSOLIDATION_MAP[code] || code;
    if (!groups[consolidated]) {
      groups[consolidated] = [];
    }
    groups[consolidated].push(g);
  });

  const features = Object.keys(groups).map(code => {
    const geomsInGroup = groups[code];
    // Merge the TopoJSON geometries into a single GeoJSON geometry (MultiPolygon/Polygon)
    const mergedGeometry = topojson.merge(topology, geomsInGroup);
    const name = STATE_NAMES[code] || geomsInGroup[0].properties.name;

    return {
      type: "Feature",
      properties: {
        name: name,
        "hc-key": code.toLowerCase(),
        id: code
      },
      geometry: mergedGeometry
    };
  });

  const featureCollection = {
    type: "FeatureCollection",
    features: features
  };

  fs.writeFileSync(vietnamMapPath, JSON.stringify(featureCollection, null, 2));
  console.log(`Successfully consolidated Vietnam map into 34 subdivisions! File saved to ${vietnamMapPath}`);
};

run();
