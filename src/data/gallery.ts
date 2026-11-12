export type GalleryCategory = 'doors' | 'windows' | 'almirahs' | 'beds-mandirs' | 'farm-shop' | 'repairs'
export type MaterialType = 'wood' | 'aluminium'

export interface GalleryItem {
  id: string
  category: GalleryCategory
  title: string
  titleHindi: string
  village: string
  material: MaterialType
  image: string
  approxPrice: number
}

export const GALLERY: GalleryItem[] = [
  { id: 'g1', category: 'doors', title: 'Carved Sagwan Main Door', titleHindi: 'नक्काशीदार सागवान मेन दरवाजा', village: 'Rampur', material: 'wood', image: 'https://placehold.co/400x500/542809/ffdbc9?text=Carved+Sagwan+Door', approxPrice: 11000 },
  { id: 'g2', category: 'doors', title: 'Aluminium Sliding Entry Door', titleHindi: 'एल्युमिनियम स्लाइडिंग एंट्री', village: 'Bilaspur', material: 'aluminium', image: 'https://placehold.co/400x500/263447/d5e3fc?text=Aluminium+Entry+Door', approxPrice: 7500 },
  { id: 'g3', category: 'doors', title: 'Double Panel Sagwan Door', titleHindi: 'डबल पैनल सागवान दरवाजा', village: 'Kithore', material: 'wood', image: 'https://placehold.co/400x500/542809/ffdbc9?text=Double+Panel+Door', approxPrice: 15000 },
  { id: 'g4', category: 'doors', title: 'Commercial Glass & Aluminium Door', titleHindi: 'कमर्शियल ग्लास दरवाजा', village: 'Sardhana', material: 'aluminium', image: 'https://placehold.co/400x500/263447/acbbd2?text=Commercial+Door', approxPrice: 18000 },
  { id: 'g5', category: 'windows', title: '3-Track Sliding Window', titleHindi: '3-ट्रैक स्लाइडिंग खिड़की', village: 'Daurala', material: 'aluminium', image: 'https://placehold.co/400x300/263447/d5e3fc?text=3-Track+Window', approxPrice: 4200 },
  { id: 'g6', category: 'windows', title: 'Wooden Mesh Window', titleHindi: 'लकड़ी जाली खिड़की', village: 'Mawana', material: 'wood', image: 'https://placehold.co/400x300/542809/ffdbc9?text=Wood+Mesh+Window', approxPrice: 5500 },
  { id: 'g7', category: 'windows', title: 'Fixed Aluminium Louvre Window', titleHindi: 'फिक्स्ड लूवर खिड़की', village: 'Rampur', material: 'aluminium', image: 'https://placehold.co/400x300/263447/acbbd2?text=Louvre+Window', approxPrice: 3200 },
  { id: 'g8', category: 'windows', title: 'Bay Window Wooden Frame', titleHindi: 'बे खिड़की लकड़ी', village: 'Bilaspur', material: 'wood', image: 'https://placehold.co/400x300/6f3e1e/ffdbc9?text=Bay+Window', approxPrice: 8500 },
  { id: 'g9', category: 'almirahs', title: '3-Door Marine Ply Wardrobe', titleHindi: '3-डोर मरीन प्लाई अलमारी', village: 'Kithore', material: 'wood', image: 'https://placehold.co/400x500/6f3e1e/ffdbc9?text=Marine+Ply+Wardrobe', approxPrice: 18000 },
  { id: 'g10', category: 'almirahs', title: 'Aluminium ACP Wardrobe', titleHindi: 'एल्युमिनियम ACP अलमारी', village: 'Sardhana', material: 'aluminium', image: 'https://placehold.co/400x500/263447/acbbd2?text=ACP+Wardrobe', approxPrice: 12000 },
  { id: 'g11', category: 'almirahs', title: 'Wall-to-Wall Built-in Wardrobe', titleHindi: 'दीवार से दीवार बिल्ट-इन', village: 'Daurala', material: 'wood', image: 'https://placehold.co/400x500/542809/ffdbc9?text=Built-in+Wardrobe', approxPrice: 25000 },
  { id: 'g12', category: 'beds-mandirs', title: 'Hydraulic Storage Double Bed', titleHindi: 'हाइड्रोलिक डबल बेड', village: 'Rampur', material: 'wood', image: 'https://placehold.co/400x300/904d00/ffdcc3?text=Hydraulic+Double+Bed', approxPrice: 14000 },
  { id: 'g13', category: 'beds-mandirs', title: 'Hand-Carved Pooja Mandir', titleHindi: 'हाथ से नक्काशी पूजा मंदिर', village: 'Bilaspur', material: 'wood', image: 'https://placehold.co/400x400/542809/ffdbc9?text=Carved+Pooja+Mandir', approxPrice: 4500 },
  { id: 'g14', category: 'beds-mandirs', title: 'Sheesham Single Bed', titleHindi: 'शीशम सिंगल बेड', village: 'Mawana', material: 'wood', image: 'https://placehold.co/400x300/904d00/ffdcc3?text=Sheesham+Single+Bed', approxPrice: 7500 },
  { id: 'g15', category: 'beds-mandirs', title: 'Grand Wedding Dressing Table', titleHindi: 'शादी वाली ड्रेसिंग टेबल', village: 'Kithore', material: 'wood', image: 'https://placehold.co/400x400/6f3e1e/ffdbc9?text=Dressing+Table', approxPrice: 6000 },
  { id: 'g16', category: 'farm-shop', title: 'Tractor Trolley Sheesham Body', titleHindi: 'शीशम ट्रैक्टर ट्रॉली बॉडी', village: 'Kithore', material: 'wood', image: 'https://placehold.co/400x300/52443c/ffdbc9?text=Tractor+Trolley', approxPrice: 22000 },
  { id: 'g17', category: 'farm-shop', title: 'Shop Glass Aluminium Partition', titleHindi: 'दुकान ग्लास पार्टीशन', village: 'Bilaspur', material: 'aluminium', image: 'https://placehold.co/400x300/263447/acbbd2?text=Shop+Glass+Partition', approxPrice: 35000 },
  { id: 'g18', category: 'farm-shop', title: 'Farm Storage Shed Timber', titleHindi: 'खेत भंडारण शेड टिंबर', village: 'Daurala', material: 'wood', image: 'https://placehold.co/400x300/52443c/d5e3fc?text=Farm+Shed+Timber', approxPrice: 15000 },
  { id: 'g19', category: 'repairs', title: 'Sagwan Door Full Re-polish', titleHindi: 'सागवान दरवाजा री-पॉलिश', village: 'Sardhana', material: 'wood', image: 'https://placehold.co/400x300/84746b/ffdbc9?text=Door+Re-polish', approxPrice: 1200 },
  { id: 'g20', category: 'repairs', title: 'Wardrobe Hinge & Lock Repair', titleHindi: 'अलमारी कब्जा और ताला ठीक', village: 'Rampur', material: 'wood', image: 'https://placehold.co/400x300/84746b/ffffff?text=Hinge+Lock+Repair', approxPrice: 450 },
  { id: 'g21', category: 'doors', title: 'Bathroom Aluminium Door', titleHindi: 'बाथरूम एल्युमिनियम दरवाजा', village: 'Mawana', material: 'aluminium', image: 'https://placehold.co/400x500/263447/d5e3fc?text=Bathroom+Door', approxPrice: 3500 },
  { id: 'g22', category: 'almirahs', title: 'L-Shaped Kitchen Cabinet', titleHindi: 'L-शेप किचन कैबिनेट', village: 'Hastinapur', material: 'wood', image: 'https://placehold.co/400x300/6f3e1e/ffdbc9?text=Kitchen+Cabinet', approxPrice: 20000 },
  { id: 'g23', category: 'beds-mandirs', title: 'Sofa-cum-Bed Sheesham', titleHindi: 'शीशम सोफा-कम-बेड', village: 'Lawar', material: 'wood', image: 'https://placehold.co/400x300/904d00/ffdcc3?text=Sofa+cum+Bed', approxPrice: 9500 },
  { id: 'g24', category: 'farm-shop', title: 'Office Aluminium Partition', titleHindi: 'ऑफिस एल्युमिनियम पार्टीशन', village: 'Bilaspur', material: 'aluminium', image: 'https://placehold.co/400x300/263447/acbbd2?text=Office+Partition', approxPrice: 18000 },
]

