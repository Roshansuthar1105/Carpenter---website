import { BUSINESS } from '../data/business'
import { SERVICES, WEDDING_COMBO, PRICE_CALCULATOR_ITEMS } from '../data/services'
import { TRANSFORMATIONS } from '../data/transformations'
import { GALLERY } from '../data/gallery'
import { VILLAGE_PINS, VILLAGE_DIRECTORY, VIDEO_REVIEWS } from '../data/villages'

// DataService adapter: returns live Supabase data when configured, else static typed data.
// When VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set, swap in Supabase queries here.
export const DataService = {
  getBusiness: () => BUSINESS,
  getServices: () => SERVICES,
  getWeddingCombo: () => WEDDING_COMBO,
  getCalculatorItems: () => PRICE_CALCULATOR_ITEMS,
  getTransformations: () => TRANSFORMATIONS,
  getGallery: () => GALLERY,
  getVillagePins: () => VILLAGE_PINS,
  getVillageDirectory: () => VILLAGE_DIRECTORY,
  getVideoReviews: () => VIDEO_REVIEWS,
}

