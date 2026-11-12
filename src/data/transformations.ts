export interface Transformation {
  id: string
  village: string
  villageHindi: string
  title: string
  titleHindi: string
  type: 'wood' | 'aluminium'
  beforeImage: string
  afterImage: string
  specs: {
    material: string
    hardware: string
    delivery: string
  }
  quote: string
  quoteAuthor: string
  quoteAuthorHindi: string
  warranty: string
}

export const TRANSFORMATIONS: Transformation[] = [
  {
    id: 't1',
    village: 'Rampur',
    villageHindi: 'रामपुर',
    title: 'Termite-Damaged Door to Carved Sagwan Main Door',
    titleHindi: 'दीमक लगा पुराना टूटा दरवाजा - मजबूत नक्काशीदार सागवान दरवाजा',
    type: 'wood',
    beforeImage: 'https://placehold.co/600x400/8b8b8b/ffffff?text=BEFORE+-+Old+Broken+Door',
    afterImage: 'https://placehold.co/600x400/542809/ffdbc9?text=AFTER+-+Carved+Sagwan+Door',
    specs: {
      material: 'Grade-A CP Teak (Sagwan)',
      hardware: 'Heavy Brass Handles & Bolts',
      delivery: 'Delivered in 7 Days',
    },
    quote: '"शर्मा जी ने 7 दिन में बिल्कुल वैसा दरवाजा बनाया जैसा हमने सोचा था। दीमक का नामोनिशान नहीं।"',
    quoteAuthor: 'Sukhbeer Singh',
    quoteAuthorHindi: 'सुखबीर सिंह, रामपुर',
    warranty: '10-Year Termite Guarantee',
  },
  {
    id: 't2',
    village: 'Bilaspur',
    villageHindi: 'बिलासपुर',
    title: 'Bare Concrete Alcove to 3-Door Aluminium Wardrobe',
    titleHindi: 'कच्ची खाली दीवार - 3-डोर वाटरप्रूफ एल्युमिनियम अलमारी',
    type: 'aluminium',
    beforeImage: 'https://placehold.co/600x400/8b8b8b/ffffff?text=BEFORE+-+Empty+Alcove',
    afterImage: 'https://placehold.co/600x400/263447/acbbd2?text=AFTER+-+Aluminium+Wardrobe',
    specs: {
      material: 'Jindal 3-Door Aluminium Section',
      hardware: 'ACP Panel Shutters, Godrej Lock',
      delivery: 'Installed in 4 Days',
    },
    quote: '"बारिश और सीलन से परेशान थे। एल्युमिनियम अलमारी ने पूरी समस्या खत्म कर दी।"',
    quoteAuthor: 'Pradeep Kumar',
    quoteAuthorHindi: 'प्रदीप कुमार, बिलासपुर',
    warranty: '5-Year Frame & Hinge Warranty',
  },
  {
    id: 't3',
    village: 'Kithore',
    villageHindi: 'किठौर',
    title: 'Broken Iron Choukhat to 3-Track Aluminium Sliding Window',
    titleHindi: 'टूटी घिसी जंग लगी जाली - 3-ट्रैक एल्युमिनियम स्लाइडिंग खिड़की',
    type: 'aluminium',
    beforeImage: 'https://placehold.co/600x400/8b8b8b/ffffff?text=BEFORE+-+Rusted+Window',
    afterImage: 'https://placehold.co/600x400/263447/d5e3fc?text=AFTER+-+3-Track+Sliding+Window',
    specs: {
      material: 'Jindal 3-Track Aluminium + 5mm Float Glass',
      hardware: 'SS Mosquito Net, Heavy Rollers',
      delivery: 'Installed in 3 Days',
    },
    quote: '"हमारी खिड़की 15 साल पुरानी जंग खाई थी। नई खिड़की लगने के बाद घर की रंगत बदल गई।"',
    quoteAuthor: 'Ramkali Devi',
    quoteAuthorHindi: 'रामकली देवी, किठौर',
    warranty: '5-Year Waterproof Seal Guarantee',
  },
  {
    id: 't4',
    village: 'Daurala',
    villageHindi: 'दौराला',
    title: 'Old Family Bed Full Restoration & Re-Polish',
    titleHindi: 'पुरानी पीढ़ी का चोला, नया जैसा चमकदार बेड',
    type: 'wood',
    beforeImage: 'https://placehold.co/600x400/8b8b8b/ffffff?text=BEFORE+-+Old+Faded+Bed',
    afterImage: 'https://placehold.co/600x400/904d00/ffdcc3?text=AFTER+-+Restored+Polished+Bed',
    specs: {
      material: 'Sheesham (Restored)',
      hardware: 'New Melamine Polish, Repaired Joints',
      delivery: 'Completed in 2 Days',
    },
    quote: '"40 साल पुराना बेड था। शर्मा जी ने 2 दिन में बिल्कुल नया बना दिया।"',
    quoteAuthor: 'Shyam Lal Verma',
    quoteAuthorHindi: 'श्याम लाल वर्मा, दौराला',
    warranty: '2-Year Re-polish Warranty',
  },
  {
    id: 't5',
    village: 'Sardhana',
    villageHindi: 'सरधना',
    title: 'Open Porch to Modern Aluminium Glass Shopfront',
    titleHindi: 'खुला बरामदा - आधुनिक वाटरप्रूफ ग्लास पार्टीशन व कैबिनेट',
    type: 'aluminium',
    beforeImage: 'https://placehold.co/600x400/8b8b8b/ffffff?text=BEFORE+-+Open+Porch',
    afterImage: 'https://placehold.co/600x400/263447/acbbd2?text=AFTER+-+Modern+Shopfront',
    specs: {
      material: 'Jindal 18G Dark Bronze + 10mm Toughened Glass',
      hardware: 'Commercial Sliding Track, ACP Soffit',
      delivery: 'Installed in 5 Days',
    },
    quote: '"दुकान में धूल आना बंद हो गई और लुक पूरी तरह बदल गया। बिक्री भी बढ़ी।"',
    quoteAuthor: 'Dinesh Agarwal',
    quoteAuthorHindi: 'दिनेश अग्रवाल, सरधना',
    warranty: '3-Year Commercial Warranty',
  },
]

