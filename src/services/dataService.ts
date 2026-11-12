import { BUSINESS } from '../data/business'
import { SERVICES, WEDDING_COMBO, PRICE_CALCULATOR_ITEMS } from '../data/services'
import { TRANSFORMATIONS, Transformation } from '../data/transformations'
import { GALLERY, GalleryItem } from '../data/gallery'
import { VILLAGE_PINS, VILLAGE_DIRECTORY, VIDEO_REVIEWS, VillagePin } from '../data/villages'
import { supabase } from './supabase'

/**
 * DataService provides read & write methods connected directly to Supabase.
 * If Supabase is offline, not yet configured, or tables are empty,
 * it seamlessly falls back to the typed static dataset so the site never breaks.
 */
export const DataService = {
  // Synchronous getters for instant initial render
  getBusiness: () => BUSINESS,
  getServices: () => SERVICES,
  getWeddingCombo: () => WEDDING_COMBO,
  getCalculatorItems: () => PRICE_CALCULATOR_ITEMS,
  getTransformations: () => TRANSFORMATIONS,
  getGallery: () => GALLERY,
  getVillagePins: () => VILLAGE_PINS,
  getVillageDirectory: () => VILLAGE_DIRECTORY,
  getVideoReviews: () => VIDEO_REVIEWS,

  // =========================================================================
  // ASYNC SUPABASE FETCH METHODS
  // =========================================================================

  async fetchGallery(): Promise<GalleryItem[]> {
    if (!supabase) return GALLERY
    try {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        return GALLERY
      }

      return data.map((d: any) => ({
        id: String(d.id),
        category: d.category,
        title: d.title,
        titleHindi: d.title_hindi,
        village: d.village,
        material: d.material,
        image: d.image_url,
        approxPrice: Number(d.approx_price) || 0,
      }))
    } catch (err) {
      console.warn('Supabase gallery fetch error, using static defaults:', err)
      return GALLERY
    }
  },

  async fetchTransformations(): Promise<Transformation[]> {
    if (!supabase) return TRANSFORMATIONS
    try {
      const { data, error } = await supabase
        .from('transformations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        return TRANSFORMATIONS
      }

      return data.map((d: any) => ({
        id: String(d.id),
        village: d.village,
        villageHindi: d.village_hindi,
        title: d.title,
        titleHindi: d.title_hindi,
        type: d.type,
        beforeImage: d.before_image_url,
        afterImage: d.after_image_url,
        specs: {
          material: d.material_spec || '',
          hardware: d.hardware_spec || '',
          delivery: d.delivery_spec || '',
        },
        quote: d.quote || '',
        quoteAuthor: d.quote_author || '',
        quoteAuthorHindi: d.quote_author_hindi || '',
        warranty: d.warranty || '',
      }))
    } catch (err) {
      console.warn('Supabase transformations fetch error, using static defaults:', err)
      return TRANSFORMATIONS
    }
  },

  async fetchVillagePins(): Promise<VillagePin[]> {
    if (!supabase) return VILLAGE_PINS
    try {
      const { data, error } = await supabase
        .from('village_pins')
        .select('*')
        .order('created_at', { ascending: false })

      if (error || !data || data.length === 0) {
        return VILLAGE_PINS
      }

      return data.map((d: any) => ({
        id: String(d.id),
        name: d.name,
        nameHindi: d.name_hindi,
        distanceKm: Number(d.distance_km) || 0,
        lat: Number(d.lat),
        lng: Number(d.lng),
        workCount: Number(d.work_count) || 0,
        rating: Number(d.rating) || 5.0,
        featuredWorkTitle: d.featured_work_title,
        featuredWorkTitleHindi: d.featured_work_title_hindi,
        image: d.image_url,
        videoUrl: d.video_url || '',
        quote: d.quote || '',
        quoteAuthor: d.quote_author || '',
        workType: d.work_type || '',
        deliveryTime: d.delivery_time || '',
        materials: d.materials || '',
        warranty: d.warranty || '',
      }))
    } catch (err) {
      console.warn('Supabase village pins fetch error, using static defaults:', err)
      return VILLAGE_PINS
    }
  },

  // =========================================================================
  // ASYNC SUPABASE WRITE METHODS
  // =========================================================================

  async addGalleryItem(item: {
    category: string
    title: string
    titleHindi: string
    village: string
    material: string
    imageUrl: string
    approxPrice: number
  }): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized. Check .env' }
    }

    try {
      const { error } = await supabase.from('gallery').insert([
        {
          category: item.category,
          title: item.title,
          title_hindi: item.titleHindi,
          village: item.village,
          material: item.material,
          image_url: item.imageUrl,
          approx_price: item.approxPrice,
        },
      ])

      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) }
    }
  },

  async addTransformation(item: {
    village: string
    villageHindi: string
    title: string
    titleHindi: string
    type: 'wood' | 'aluminium'
    beforeImageUrl: string
    afterImageUrl: string
    material: string
    hardware: string
    delivery: string
    warranty: string
    quote: string
    quoteAuthor: string
    quoteAuthorHindi: string
  }): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized. Check .env' }
    }

    try {
      const { error } = await supabase.from('transformations').insert([
        {
          village: item.village,
          village_hindi: item.villageHindi,
          title: item.title,
          title_hindi: item.titleHindi,
          type: item.type,
          before_image_url: item.beforeImageUrl,
          after_image_url: item.afterImageUrl,
          material_spec: item.material,
          hardware_spec: item.hardware,
          delivery_spec: item.delivery,
          warranty: item.warranty,
          quote: item.quote,
          quote_author: item.quoteAuthor,
          quote_author_hindi: item.quoteAuthorHindi,
        },
      ])

      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) }
    }
  },

  async addVillagePin(pin: {
    name: string
    nameHindi: string
    distanceKm: number
    lat: number
    lng: number
    workCount: number
    rating: number
    featuredWorkTitle: string
    featuredWorkTitleHindi: string
    imageUrl: string
    videoUrl?: string
    quote: string
    quoteAuthor: string
    workType: string
    deliveryTime: string
    materials: string
    warranty: string
  }): Promise<{ success: boolean; error?: string }> {
    if (!supabase) {
      return { success: false, error: 'Supabase client not initialized. Check .env' }
    }

    try {
      const { error } = await supabase.from('village_pins').insert([
        {
          name: pin.name,
          name_hindi: pin.nameHindi,
          distance_km: pin.distanceKm,
          lat: pin.lat,
          lng: pin.lng,
          work_count: pin.workCount,
          rating: pin.rating,
          featured_work_title: pin.featuredWorkTitle,
          featured_work_title_hindi: pin.featuredWorkTitleHindi,
          image_url: pin.imageUrl,
          video_url: pin.videoUrl || '',
          quote: pin.quote,
          quote_author: pin.quoteAuthor,
          work_type: pin.workType,
          delivery_time: pin.deliveryTime,
          materials: pin.materials,
          warranty: pin.warranty,
        },
      ])

      if (error) {
        return { success: false, error: error.message }
      }
      return { success: true }
    } catch (err: any) {
      return { success: false, error: err?.message || String(err) }
    }
  },
}
