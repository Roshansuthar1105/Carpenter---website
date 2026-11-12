export interface VillagePin {
  id: string
  name: string
  nameHindi: string
  distanceKm: number
  lat: number
  lng: number
  workCount: number
  rating: number
  featuredWorkTitle: string
  featuredWorkTitleHindi: string
  image: string
  videoUrl?: string
  quote: string
  quoteAuthor: string
  workType: string
  deliveryTime: string
  materials: string
  warranty: string
}

export interface VillageDirectory {
  name: string
  nameHindi: string
  distanceKm: number
  visitDays: string
  visitTime: string
  workCount: number
  whatsapp: string
}

export interface VideoReview {
  id: string
  customer: string
  village: string
  villageHindi: string
  duration: string
  thumbnail: string
  videoUrl?: string
  quote: string
  verified: boolean
}

export const WORKSHOP_LOCATION = {
  name: 'Sharma Ji Workshop (Main Workshop Hub)',
  nameHindi: 'शर्मा जी मुख्य वर्कशॉप (रामपुर)',
  lat: 28.9800,
  lng: 77.7800,
  address: 'Main Bilaspur Road, Near Old Grain Market, Rampur',
}

export const VILLAGE_PINS: VillagePin[] = [
  {
    id: 'rampur',
    name: 'Rampur',
    nameHindi: 'रामपुर (मुख्यालय)',
    distanceKm: 0,
    lat: 28.9800,
    lng: 77.7800,
    workCount: 180,
    rating: 5.0,
    featuredWorkTitle: 'Hand-Carved Sagwan Temple & Main Door',
    featuredWorkTitleHindi: 'पंडित जी का सागवान नक्काशीदार मंदिर व मुख्य द्वार',
    image: 'https://placehold.co/500x350/542809/ffdbc9?text=Rampur+Featured+Work',
    videoUrl: '',
    quote: '"शर्मा जी ने 10 साल पहले हमारे घर का मुख्य दरवाजा और मंदिर बनाया था। आज तक एक भी पेंच ढीला नहीं हुआ।"',
    quoteAuthor: 'Sukhbeer Ji, Rampur',
    workType: 'Main Door & Sagwan Mandir',
    deliveryTime: '7 Days',
    materials: '100% CP Sagwan',
    warranty: '5-Year On-Site Warranty',
  },
  {
    id: 'bilaspur',
    name: 'Bilaspur',
    nameHindi: 'बिलासपुर',
    distanceKm: 6,
    lat: 28.8800,
    lng: 77.6500,
    workCount: 95,
    rating: 4.9,
    featuredWorkTitle: 'Commercial Aluminium Glass Shopfront',
    featuredWorkTitleHindi: 'प्रदीप जी इलेक्ट्रॉनिक्स: कमर्शियल एल्युमिनियम फ्रंट',
    image: 'https://placehold.co/500x350/263447/acbbd2?text=Bilaspur+Shopfront',
    videoUrl: '',
    quote: '"शर्मा जी ने 18 गेज के जिंदल सेक्शन से ऐसा शीशा लगाया कि AC की ठंडक अंदर ही रहती है।"',
    quoteAuthor: 'Pradeep Kumar, Bilaspur',
    workType: 'Shop Front & Glass Partition',
    deliveryTime: '4 Days',
    materials: 'Jindal 18G + 10mm Glass',
    warranty: '3-Year Free Slider Service',
  },
  {
    id: 'kithore',
    name: 'Kithore',
    nameHindi: 'किठौर',
    distanceKm: 11,
    lat: 28.8667,
    lng: 77.9833,
    workCount: 72,
    rating: 5.0,
    featuredWorkTitle: 'Sheesham Tractor Trolley & Farm Shed',
    featuredWorkTitleHindi: 'चौधरी जगजीत: शीशम ट्रैक्टर ट्रॉली व फार्म शेड',
    image: 'https://placehold.co/500x350/52443c/ffdbc9?text=Kithore+Trolley',
    videoUrl: '',
    quote: '"गन्ने की भारी भराई में भी लकड़ी हिली नहीं। पिछले 6 सालों से ट्रॉली धुआंधार चल रही है।"',
    quoteAuthor: 'Jagjit Singh, Kithore',
    workType: 'Trolley Body & Farm Shed',
    deliveryTime: '5 Days',
    materials: 'Seasoned Sheesham + Galvanised Hardware',
    warranty: '10-Year Termite Guarantee',
  },
  {
    id: 'daurala',
    name: 'Daurala',
    nameHindi: 'दौराला',
    distanceKm: 14,
    lat: 29.1167,
    lng: 77.7167,
    workCount: 64,
    rating: 4.8,
    featuredWorkTitle: 'Colony Aluminium Sliding Windows',
    featuredWorkTitleHindi: 'मिल कॉलोनी: जिंदल स्लाइडिंग विंडो व बालकनी ग्रिल',
    image: 'https://placehold.co/500x350/263447/d5e3fc?text=Daurala+Windows',
    videoUrl: '',
    quote: '"बारिश के पानी की सीलन से परेशान थे। एल्युमिनियम खिड़कियाँ लगने के बाद आवाज और सीलन दोनों बंद।"',
    quoteAuthor: 'Verma Ji, Daurala',
    workType: 'Sliding Windows & Mosquito Net',
    deliveryTime: '3 Days',
    materials: 'Jindal Gold Anodized Aluminium',
    warranty: '5-Year Waterproof Seal',
  },
  {
    id: 'sardhana',
    name: 'Sardhana',
    nameHindi: 'सरधना',
    distanceKm: 18,
    lat: 29.1500,
    lng: 77.6167,
    workCount: 50,
    rating: 5.0,
    featuredWorkTitle: 'Heritage Haveli Sagwan Restoration',
    featuredWorkTitleHindi: 'पुरातन हवेली का सागवान चौखट व नक्काशी रीस्टोरेशन',
    image: 'https://placehold.co/500x350/6f3e1e/ffdbc9?text=Sardhana+Heritage+Door',
    videoUrl: '',
    quote: '"100 साल पुरानी हवेली की चौखट थी। शर्मा जी ने बिल्कुल उसी डिजाइन में नई बनाई।"',
    quoteAuthor: 'Sharma Family, Sardhana',
    workType: 'Heritage Restoration',
    deliveryTime: '10 Days',
    materials: 'Aged Sagwan (Matched Grain)',
    warranty: '5-Year Craftsman Warranty',
  },
  {
    id: 'mawana',
    name: 'Mawana',
    nameHindi: 'मवाना',
    distanceKm: 22,
    lat: 29.1000,
    lng: 77.9167,
    workCount: 42,
    rating: 4.9,
    featuredWorkTitle: 'Industrial Aluminium Windows & Partitions',
    featuredWorkTitleHindi: 'कमर्शियल एल्युमिनियम विंडो व इंटीरियर पार्टीशन',
    image: 'https://placehold.co/500x350/263447/acbbd2?text=Mawana+Partitions',
    videoUrl: '',
    quote: '"शर्मा जी का काम समय पर और दाम में बिल्कुल सही। कोई छुपा हुआ चार्ज नहीं।"',
    quoteAuthor: 'Ramesh Tyagi, Mawana',
    workType: 'Office Windows & Partitions',
    deliveryTime: '5 Days',
    materials: 'Jindal Aluminium + Toughened Glass',
    warranty: '3-Year Commercial Warranty',
  },
  {
    id: 'hastinapur',
    name: 'Hastinapur',
    nameHindi: 'हस्तिनापुर',
    distanceKm: 28,
    lat: 29.1667,
    lng: 78.0167,
    workCount: 30,
    rating: 4.8,
    featuredWorkTitle: 'Temple Committee Hall Doors & Windows',
    featuredWorkTitleHindi: 'मंदिर समिति: हॉल के दरवाजे और खिड़कियाँ',
    image: 'https://placehold.co/500x350/542809/ffdbc9?text=Hastinapur+Temple+Work',
    videoUrl: '',
    quote: '"मंदिर के लिए सागवान के दरवाजे बनवाए। पूरी समिति खुश है। बहुत शानदार काम।"',
    quoteAuthor: 'Temple Committee, Hastinapur',
    workType: 'Temple Hall Doors & Windows',
    deliveryTime: '12 Days',
    materials: 'Grade-A Sagwan',
    warranty: '10-Year Termite Guarantee',
  },
  {
    id: 'lawar',
    name: 'Lawar',
    nameHindi: 'लावर',
    distanceKm: 20,
    lat: 29.1167,
    lng: 77.7833,
    workCount: 35,
    rating: 4.9,
    featuredWorkTitle: 'Complete Home Furnishing - 3 BHK',
    featuredWorkTitleHindi: 'पूरे 3 BHK घर का फर्नीचर',
    image: 'https://placehold.co/500x350/904d00/ffdcc3?text=Lawar+Home+Furnishing',
    videoUrl: '',
    quote: '"नए घर का पूरा फर्नीचर शर्मा जी से बनवाया। दरवाजे, खिड़कियाँ, अलमारी, बेड—सब कुछ।"',
    quoteAuthor: 'Vikas Sharma, Lawar',
    workType: 'Full Home - Doors, Windows, Almirahs, Beds',
    deliveryTime: '20 Days (Full Home)',
    materials: 'Sagwan Doors + Aluminium Windows',
    warranty: '5-Year All-Inclusive Warranty',
  },
]

export const VILLAGE_DIRECTORY: VillageDirectory[] = [
  { name: 'Rampur', nameHindi: 'रामपुर', distanceKm: 0, visitDays: 'Daily', visitTime: '8:00 AM - 7:00 PM', workCount: 180, whatsapp: 'https://wa.me/919876543210?text=Rampur%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Bilaspur', nameHindi: 'बिलासपुर', distanceKm: 6, visitDays: 'Mon, Wed, Fri', visitTime: '9:00 AM - 5:00 PM', workCount: 95, whatsapp: 'https://wa.me/919876543210?text=Bilaspur%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Kithore', nameHindi: 'किठौर', distanceKm: 11, visitDays: 'Tue, Thu, Sat', visitTime: '9:00 AM - 4:00 PM', workCount: 72, whatsapp: 'https://wa.me/919876543210?text=Kithore%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Daurala', nameHindi: 'दौराला', distanceKm: 14, visitDays: 'Mon, Thu', visitTime: '10:00 AM - 4:00 PM', workCount: 64, whatsapp: 'https://wa.me/919876543210?text=Daurala%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Sardhana', nameHindi: 'सरधना', distanceKm: 18, visitDays: 'Wed, Sat', visitTime: '9:00 AM - 3:00 PM', workCount: 50, whatsapp: 'https://wa.me/919876543210?text=Sardhana%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Mawana', nameHindi: 'मवाना', distanceKm: 22, visitDays: 'Tue, Fri', visitTime: '10:00 AM - 4:00 PM', workCount: 42, whatsapp: 'https://wa.me/919876543210?text=Mawana%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Hastinapur', nameHindi: 'हस्तिनापुर', distanceKm: 28, visitDays: 'Sat', visitTime: '9:00 AM - 2:00 PM', workCount: 30, whatsapp: 'https://wa.me/919876543210?text=Hastinapur%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Lawar', nameHindi: 'लावर', distanceKm: 20, visitDays: 'Mon, Fri', visitTime: '9:00 AM - 4:00 PM', workCount: 35, whatsapp: 'https://wa.me/919876543210?text=Lawar%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Muradnagar', nameHindi: 'मुरादनगर', distanceKm: 32, visitDays: 'Wed', visitTime: '10:00 AM - 3:00 PM', workCount: 20, whatsapp: 'https://wa.me/919876543210?text=Muradnagar%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Khatauli', nameHindi: 'खतौली', distanceKm: 35, visitDays: 'Thu', visitTime: '9:00 AM - 2:00 PM', workCount: 18, whatsapp: 'https://wa.me/919876543210?text=Khatauli%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Gajraula', nameHindi: 'गजरौला', distanceKm: 25, visitDays: 'Sat', visitTime: '10:00 AM - 3:00 PM', workCount: 15, whatsapp: 'https://wa.me/919876543210?text=Gajraula%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Amroha', nameHindi: 'अमरोहा', distanceKm: 40, visitDays: 'By Appointment', visitTime: 'Call First', workCount: 12, whatsapp: 'https://wa.me/919876543210?text=Amroha%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Hapur', nameHindi: 'हापुड़', distanceKm: 38, visitDays: 'By Appointment', visitTime: 'Call First', workCount: 10, whatsapp: 'https://wa.me/919876543210?text=Hapur%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Pilkhuwa', nameHindi: 'पिलखुवा', distanceKm: 30, visitDays: 'Fri', visitTime: '9:00 AM - 3:00 PM', workCount: 22, whatsapp: 'https://wa.me/919876543210?text=Pilkhuwa%20se%20naap%20ke%20liye%20bulana%20hai' },
  { name: 'Loni', nameHindi: 'लोनी', distanceKm: 45, visitDays: 'By Appointment', visitTime: 'Call First', workCount: 8, whatsapp: 'https://wa.me/919876543210?text=Loni%20se%20naap%20ke%20liye%20bulana%20hai' },
]

export const VIDEO_REVIEWS: VideoReview[] = [
  {
    id: 'v1',
    customer: 'Sukhbeer Ji',
    village: 'Rampur',
    villageHindi: 'रामपुर',
    duration: '0:35',
    thumbnail: 'https://placehold.co/400x225/542809/ffdbc9?text=Video+Review+Rampur',
    quote: '"शर्मा जी ने 10 साल पहले हमारे घर का मुख्य दरवाजा और मंदिर बनाया था। आज तक एक भी पेंच ढीला नहीं हुआ और दीमक का नामोनिशान नहीं है।"',
    verified: true,
  },
  {
    id: 'v2',
    customer: 'Pradeep Kumar',
    village: 'Bilaspur',
    villageHindi: 'बिलासपुर',
    duration: '0:42',
    thumbnail: 'https://placehold.co/400x225/263447/d5e3fc?text=Video+Review+Bilaspur',
    quote: '"बाजार में धूल बहुत आती थी। शर्मा जी ने 18 गेज के जिंदल सेक्शन से ऐसा शीशा लगाया कि AC की ठंडक अंदर ही रहती है।"',
    verified: true,
  },
  {
    id: 'v3',
    customer: 'Chaudhary Jagjit Singh',
    village: 'Kithore',
    villageHindi: 'किठौर',
    duration: '0:50',
    thumbnail: 'https://placehold.co/400x225/904d00/ffdcc3?text=Video+Review+Kithore',
    quote: '"गन्ने की भारी भराई में भी लकड़ी हिली नहीं। पिछले 6 सालों से ट्रॉली धुआंधार चल रही है। शर्मा जी की शीशम में कोई मिलावट नहीं।"',
    verified: true,
  },
]
