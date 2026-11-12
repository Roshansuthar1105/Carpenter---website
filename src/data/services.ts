export interface ServiceItem {
  id: string
  nameHindi: string
  nameEn: string
  startingPrice: number
  unit: string
  descHindi: string
  image: string
  specs: string[]
}

export interface ServiceCategory {
  id: string
  icon: string
  titleHindi: string
  titleEn: string
  type: 'wood' | 'aluminium' | 'both' | 'repair'
  items: ServiceItem[]
}

export const SERVICES: ServiceCategory[] = [
  {
    id: 'doors',
    icon: 'door_front',
    titleHindi: 'दरवाजे और चौखट',
    titleEn: 'Doors & Chaukhat',
    type: 'both',
    items: [
      {
        id: 'sagwan-door',
        nameHindi: 'सागवान मेन दरवाजा',
        nameEn: 'Sagwan Main Door',
        startingPrice: 8500,
        unit: 'नग',
        descHindi: 'पक्का सागवान, नक्काशी के साथ, 10 वर्ष दीमक गारंटी',
        image: 'https://placehold.co/400x300/542809/ffdbc9?text=Sagwan+Main+Door',
        specs: ['100% CP Sagwan', 'Brass Handles & Bolts', '10-Year Termite Guarantee'],
      },
      {
        id: 'alum-room-door',
        nameHindi: 'एल्युमिनियम रूम दरवाजा',
        nameEn: 'Aluminium Room Door',
        startingPrice: 3200,
        unit: 'नग',
        descHindi: 'जिंदल 18G, वाटरप्रूफ, बाथरूम और कमरे के लिए',
        image: 'https://placehold.co/400x300/263447/d5e3fc?text=Aluminium+Room+Door',
        specs: ['Jindal 18G Section', 'Powder Coated', 'Rust-Free Lifetime'],
      },
      {
        id: 'alum-main-door',
        nameHindi: 'एल्युमिनियम मेन दरवाजा',
        nameEn: 'Aluminium Main Door',
        startingPrice: 6500,
        unit: 'नग',
        descHindi: 'हेवी-ड्यूटी जिंदल सेक्शन, डिजाइनर ग्लास के साथ',
        image: 'https://placehold.co/400x300/263447/acbbd2?text=Aluminium+Main+Door',
        specs: ['Heavy 16G Section', 'Toughened Glass', '5-Year Frame Warranty'],
      },
    ],
  },
  {
    id: 'windows',
    icon: 'window',
    titleHindi: 'खिड़कियाँ और मच्छर जाली',
    titleEn: 'Windows & Mosquito Jali',
    type: 'both',
    items: [
      {
        id: 'wood-mesh-window',
        nameHindi: 'लकड़ी चौखट व जाली खिड़की',
        nameEn: 'Wood Frame + Mesh Window',
        startingPrice: 3800,
        unit: 'खिड़की',
        descHindi: 'शीशम या सागवान, मजबूत SS जाली के साथ',
        image: 'https://placehold.co/400x300/542809/ffdbc9?text=Wood+Mesh+Window',
        specs: ['Sheesham / Sagwan Wood', 'SS 304 Heavy Net', '5-Year Warranty'],
      },
      {
        id: '3track-window',
        nameHindi: '3-ट्रैक स्लाइडिंग एल्युमिनियम खिड़की',
        nameEn: '3-Track Sliding Window',
        startingPrice: 2100,
        unit: 'खिड़की',
        descHindi: 'जिंदल एल्युमिनियम, 3 ट्रैक, वाटरप्रूफ सील, मच्छर जाली',
        image: 'https://placehold.co/400x300/263447/d5e3fc?text=3-Track+Sliding+Window',
        specs: ['Jindal 3-Track Section', '5mm Float Glass', 'SS Mosquito Net'],
      },
    ],
  },
  {
    id: 'almirahs',
    icon: 'shelves',
    titleHindi: 'अलमारी और वार्डरोब',
    titleEn: 'Almirahs & Wardrobes',
    type: 'both',
    items: [
      {
        id: 'marine-ply-almirah',
        nameHindi: '18mm मरीन प्लाई अलमारी',
        nameEn: 'Marine Ply Wardrobe',
        startingPrice: 14000,
        unit: 'यूनिट',
        descHindi: '18mm वाटरप्रूफ मरीन प्लाई, लॉकर, चूड़ी रैक',
        image: 'https://placehold.co/400x300/6f3e1e/ffdbc9?text=Marine+Ply+Wardrobe',
        specs: ['18mm Waterproof Marine Ply', 'Godrej Lock', 'Full-Length Mirror'],
      },
      {
        id: 'alum-wardrobe',
        nameHindi: 'एल्युमिनियम सीलन-मुक्त अलमारी',
        nameEn: 'Aluminium Wardrobe',
        startingPrice: 9500,
        unit: 'यूनिट',
        descHindi: 'एल्युमिनियम फ्रेम, ACP शटर, सीलन और दीमक मुक्त',
        image: 'https://placehold.co/400x300/263447/acbbd2?text=Aluminium+Wardrobe',
        specs: ['Aluminium Frame', 'ACP Shutter', 'Rust & Termite Free'],
      },
    ],
  },
  {
    id: 'furniture',
    icon: 'bed',
    titleHindi: 'घरेलू फर्नीचर',
    titleEn: 'Household Furniture',
    type: 'wood',
    items: [
      {
        id: 'hydraulic-bed',
        nameHindi: 'हाइड्रोलिक स्टोरेज डबल बेड',
        nameEn: 'Hydraulic Storage Double Bed',
        startingPrice: 12000,
        unit: 'बेड',
        descHindi: '6x6 फीट, पूरा सागवान, हाइड्रोलिक लिफ्ट स्टोरेज',
        image: 'https://placehold.co/400x300/904d00/ffdcc3?text=Hydraulic+Double+Bed',
        specs: ['Pure Sagwan Wood', 'Hydraulic Lift', '6x6 Feet'],
      },
      {
        id: 'pooja-mandir',
        nameHindi: 'नक्काशीदार पूजा मंदिर',
        nameEn: 'Carved Pooja Mandir',
        startingPrice: 2500,
        unit: 'मंदिर',
        descHindi: 'सागवान, हाथ से नक्काशी, पीतल फिटिंग',
        image: 'https://placehold.co/400x300/542809/ffdbc9?text=Carved+Pooja+Mandir',
        specs: ['Hand Carved Sagwan', 'Brass Fittings', 'Custom Size'],
      },
      {
        id: 'sofa-cum-bed',
        nameHindi: 'शीशम सोफा-कम-बेड',
        nameEn: 'Sheesham Sofa-cum-Bed',
        startingPrice: 8500,
        unit: 'यूनिट',
        descHindi: 'मजबूत शीशम, फोल्ड होने वाला, डबल उपयोग',
        image: 'https://placehold.co/400x300/6f3e1e/ffdbc9?text=Sheesham+Sofa+Bed',
        specs: ['Pure Sheesham', 'Foldable Design', 'Foam Cushion Included'],
      },
    ],
  },
  {
    id: 'repairs',
    icon: 'build',
    titleHindi: 'त्वरित मरम्मत और री-पॉलिश',
    titleEn: 'Quick Repairs & Re-polishing',
    type: 'repair',
    items: [
      {
        id: 'lock-hinge',
        nameHindi: 'ताला व कब्जा बदलना',
        nameEn: 'Lock & Hinge Replacement',
        startingPrice: 250,
        unit: 'से शुरू',
        descHindi: 'अलमारी, कमरे या मेन गेट के जाम ताले खोलना व नया कब्जा लगाना',
        image: 'https://placehold.co/400x300/84746b/ffffff?text=Lock+Replacement',
        specs: ['All Door Types', 'Same Day Service', 'Quality Hardware'],
      },
      {
        id: 'door-planing',
        nameHindi: 'दरवाजा रगड़ व लेवलिंग',
        nameEn: 'Door Planing & Leveling',
        startingPrice: 300,
        unit: 'पल्ला',
        descHindi: 'फर्श से घिसटने वाले दरवाजों की रंदे से सही सेटिंग',
        image: 'https://placehold.co/400x300/84746b/ffffff?text=Door+Planing',
        specs: ['Wood & Aluminium Doors', 'On-Site Service', 'Guaranteed Fix'],
      },
      {
        id: 'repolish',
        nameHindi: 'हाथ व मशीन री-पॉलिश',
        nameEn: 'Hand & Machine Re-polish',
        startingPrice: 35,
        unit: 'वर्ग फीट',
        descHindi: 'पुराने फीके पड़े फर्नीचर पर नई जैसी मेलामाइन चमक',
        image: 'https://placehold.co/400x300/84746b/ffdbc9?text=Re-Polish',
        specs: ['Melamine Finish', 'All Wood Types', 'Home Visit Service'],
      },
      {
        id: 'anti-termite',
        nameHindi: 'एंटी-दीमक रासायनिक उपचार',
        nameEn: 'Anti-Termite Treatment',
        startingPrice: 450,
        unit: 'कमरा',
        descHindi: 'लकड़ी की चौखटों के भीतर विशेष केमिकल इंजेक्शन ड्रिलिंग तकनीक',
        image: 'https://placehold.co/400x300/84746b/ffffff?text=Anti-Termite',
        specs: ['Chemical Injection Drilling', '5-Year Protection', 'All Wood Types'],
      },
    ],
  },
]

export const WEDDING_COMBO = {
  titleHindi: 'बेटी के विवाह हेतु संपूर्ण गृहस्थी फर्नीचर सेट',
  titleEn: 'Complete Wedding Furniture Set',
  items: [
    'सागवान डबल बेड (6x6 हाइड्रोलिक स्टोरेज + 2 साइड टेबल)',
    '3-डोर भारी अलमारी (6.5x4 फीट, लॉकर, चूड़ी रैक व पूरा दर्पण)',
    'नक्काशीदार ड्रेसिंग टेबल (फुल लेंथ शीशा, स्टूल और 3 दराज)',
    'मुफ़्त डिलीवरी (20 किमी दायरे में आपके गाँव तक)',
  ],
  marketPrice: 58000,
  offerPrice: 42500,
  savings: 15500,
  image: 'https://placehold.co/600x400/6f3e1e/ffdbc9?text=Wedding+Furniture+Set',
  whatsapp: 'https://wa.me/919876543210?text=Namaste%20Sharma%20Ji%2C%20Shadi%20Special%20Furniture%20Set%20ki%20booking%20karni%20hai',
}

export const PRICE_CALCULATOR_ITEMS = [
  { label: 'सागवान मेन दरवाजा', labelEn: 'Sagwan Main Door', pricePerUnit: 8500, unit: 'door' },
  { label: 'एल्युमिनियम बाथरूम दरवाजा', labelEn: 'Aluminium Room Door', pricePerUnit: 3200, unit: 'door' },
  { label: '3-ट्रैक स्लाइडिंग खिड़की', labelEn: '3-Track Sliding Window', pricePerUnit: 2100, unit: 'window' },
  { label: 'लकड़ी चौखट व जाली खिड़की', labelEn: 'Wood Frame + Mesh Window', pricePerUnit: 3800, unit: 'window' },
  { label: 'मरीन प्लाई अलमारी', labelEn: 'Marine Ply Wardrobe', pricePerUnit: 14000, unit: 'unit' },
  { label: 'एल्युमिनियम अलमारी', labelEn: 'Aluminium Wardrobe', pricePerUnit: 9500, unit: 'unit' },
  { label: 'हाइड्रोलिक डबल बेड', labelEn: 'Hydraulic Double Bed', pricePerUnit: 12000, unit: 'bed' },
]

