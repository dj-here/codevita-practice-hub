import prisma from './prisma';

export interface ExtractedFilters {
  matchedRitualName?: string;
  matchedRitualSlug?: string;
  language?: string;
  locality?: string;
  samagriPreference?: 'CUSTOMER_ARRANGED' | 'FULL_SAMAGRI_INCLUDED';
  timingPreference?: string;
  summary: string;
}

export class AiDiscoveryService {
  private geminiApiKey: string;

  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY || '';
  }

  /**
   * Deterministic rule-based NLP parser for Indian religious ceremonies.
   * Guarantees 100% offline uptime and zero API failures.
   */
  private parseDeterministic(query: string): ExtractedFilters {
    const text = query.toLowerCase();

    // 1. Ritual detection
    let matchedRitualName: string | undefined;
    let matchedRitualSlug: string | undefined;

    if (text.includes('griha') || text.includes('housewarm') || text.includes('house warming')) {
      matchedRitualName = 'Griha Pravesh';
      matchedRitualSlug = 'griha-pravesh';
    } else if (text.includes('satyanarayan') || text.includes('satyanarayana') || text.includes('katha')) {
      matchedRitualName = 'Satyanarayan Puja';
      matchedRitualSlug = 'satyanarayan-puja';
    } else if (text.includes('ganesh') || text.includes('ganapati') || text.includes('vinayaka')) {
      matchedRitualName = 'Ganesh Puja';
      matchedRitualSlug = 'ganesh-puja';
    } else if (text.includes('lakshmi') || text.includes('laxmi') || text.includes('vaibhav')) {
      matchedRitualName = 'Lakshmi Puja';
      matchedRitualSlug = 'lakshmi-puja';
    } else if (text.includes('rudrabhishek') || text.includes('shiva') || text.includes('abhishekam')) {
      matchedRitualName = 'Rudrabhishek';
      matchedRitualSlug = 'rudrabhishek';
    } else if (text.includes('navagraha') || text.includes('graha shanti')) {
      matchedRitualName = 'Navagraha Puja';
      matchedRitualSlug = 'navagraha-puja';
    } else if (text.includes('havan') || text.includes('homam') || text.includes('homa') || text.includes('yagya')) {
      matchedRitualName = 'Havan and Homam';
      matchedRitualSlug = 'havan-homam';
    } else if (text.includes('naming') || text.includes('namakaran') || text.includes('barse') || text.includes('namakaranam')) {
      matchedRitualName = 'Naming Ceremony (Namakaran)';
      matchedRitualSlug = 'naming-ceremony';
    } else if (text.includes('wedding') || text.includes('vivah') || text.includes('marriage') || text.includes('kalyanam')) {
      matchedRitualName = 'Vedic Wedding Ceremony';
      matchedRitualSlug = 'vedic-wedding';
    }

    // 2. Language detection
    let language: string | undefined;
    if (text.includes('telugu')) language = 'Telugu';
    else if (text.includes('hindi')) language = 'Hindi';
    else if (text.includes('tamil')) language = 'Tamil';
    else if (text.includes('kannada')) language = 'Kannada';
    else if (text.includes('marathi')) language = 'Marathi';
    else if (text.includes('sanskrit')) language = 'Sanskrit';

    // 3. Locality detection (Hyderabad)
    let locality: string | undefined;
    const localities = [
      'kukatpally', 'madhapur', 'gachibowli', 'banjara hills', 'jubilee hills',
      'secunderabad', 'miyapur', 'kondapur', 'hitec city', 'dilsukhnagar',
      'ameerpet', 'uppal', 'begumpet', 'lingampally', 'manikonda'
    ];
    for (const loc of localities) {
      if (text.includes(loc)) {
        locality = loc.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      }
    }

    // 4. Samagri preference
    let samagriPreference: 'CUSTOMER_ARRANGED' | 'FULL_SAMAGRI_INCLUDED' = 'FULL_SAMAGRI_INCLUDED';
    if (text.includes('without samagri') || text.includes('arrange own') || text.includes('my own samagri')) {
      samagriPreference = 'CUSTOMER_ARRANGED';
    }

    // 5. Timing
    let timingPreference: string | undefined;
    if (text.includes('morning')) timingPreference = 'Morning (06:00 - 11:00)';
    else if (text.includes('evening')) timingPreference = 'Evening (16:00 - 20:00)';

    const parts = [];
    if (matchedRitualName) parts.push(`Ritual: ${matchedRitualName}`);
    if (language) parts.push(`Language: ${language}`);
    if (locality) parts.push(`Locality: ${locality}`);
    parts.push(`Samagri: ${samagriPreference === 'FULL_SAMAGRI_INCLUDED' ? 'Pandit-Supplied' : 'Customer-Arranged'}`);

    return {
      matchedRitualName,
      matchedRitualSlug,
      language,
      locality,
      samagriPreference,
      timingPreference,
      summary: parts.join(' | '),
    };
  }

  /**
   * Main discovery entrypoint with AI + deterministic fallback.
   */
  async discoverServices(query: string, city: string = 'Hyderabad') {
    let filters: ExtractedFilters;

    if (this.geminiApiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.geminiApiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an expert Hindu ritual assistant. Extract ritual intent from the user query into JSON format with keys: matchedRitualName, matchedRitualSlug, language, locality, samagriPreference, timingPreference, summary.
User Query: "${query}". Return ONLY JSON.`
                    }
                  ]
                }
              ]
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          filters = JSON.parse(cleaned);
        } else {
          filters = this.parseDeterministic(query);
        }
      } catch {
        filters = this.parseDeterministic(query);
      }
    } else {
      filters = this.parseDeterministic(query);
    }

    // Now validate filters against real database records
    let matchingRituals: any[] = [];
    if (filters.matchedRitualSlug) {
      matchingRituals = await prisma.ritual.findMany({
        where: {
          slug: filters.matchedRitualSlug,
          isPublished: true,
        },
        include: {
          packages: true,
          category: true,
        },
      });
    }

    if (matchingRituals.length === 0) {
      // Return top published rituals matching category or general
      matchingRituals = await prisma.ritual.findMany({
        where: { isPublished: true },
        take: 3,
        include: { packages: true, category: true },
      });
    }

    // Match verified pandits in the locality/language
    const matchingPandits = await prisma.panditProfile.findMany({
      where: {
        verificationStatus: 'APPROVED',
        isAvailable: true,
        ...(filters.language ? { languages: { contains: filters.language } } : {}),
        ...(filters.locality ? { serviceLocalities: { contains: filters.locality } } : {}),
      },
      include: {
        user: { select: { name: true, avatarUrl: true, email: true } },
      },
      take: 4,
    });

    return {
      interpretedFilters: filters,
      suggestedRituals: matchingRituals,
      matchingPandits,
    };
  }

  /**
   * Provides verified ritual preparation instructions.
   */
  getPreparationGuide(ritualSlug: string) {
    const guides: Record<string, {
      title: string;
      spiritualSignificance: string;
      householdPrerequisites: string[];
      dosAndDonts: string[];
      notes: string;
    }> = {
      'griha-pravesh': {
        title: 'Griha Pravesh (Housewarming Ceremony) Preparation',
        spiritualSignificance: 'Purifies the new dwelling of negative vibrations (Vastu doshas) and invites Lord Ganesha, Goddess Lakshmi, and the Navagrahas into the home.',
        householdPrerequisites: [
          'Clean, swept home with main entrance decorated with mango leaves (Toran) and rangoli.',
          'Milk boiling setup: New vessel, raw unpasteurized milk, and jaggery/sugar for milk boiling ritual.',
          'Kalash setup: Copper/brass pot, coconut with husk, and 5 mango leaves.',
          'Puja mat / clean wool or cotton asana for the house owners facing East or North-East.',
          'Fresh flowers (marigold, jasmine), garland, tulsi leaves, and betel leaves (paan) with supari.',
        ],
        dosAndDonts: [
          'Do enter with the right foot first while holding the sacred Kalash.',
          'Do boil milk until it gently overflows, signifying prosperity.',
          'Do not leave the house empty on the night of the Griha Pravesh.',
          'Avoid consuming non-vegetarian food or alcohol in the house prior to the puja.',
        ],
        notes: 'Specific regional traditions (Telugu, Tamil, North Indian) have nuances regarding auspicious muhurat times. Confirm exact timing with your assigned pandit.',
      },
      'satyanarayan-puja': {
        title: 'Shri Satyanarayan Swami Puja Preparation',
        spiritualSignificance: 'Offers gratitude to Lord Vishnu as Satyanarayan, blessing the family with peace, righteousness, and removal of obstacles.',
        householdPrerequisites: [
          'Prasad (Sheera / Panchamrit): Sooji (semolina), pure ghee, milk, banana, sugar, and cardamom.',
          'Chowki (wooden pedestal) with clean red or yellow cloth.',
          'Photo or idol of Lord Satyanarayan / Vishnu.',
          '4 banana stalks to tie to the corners of the puja mandap.',
          'Panchamrit: Milk, curd, honey, sugar, and ghee mixed together with fresh tulsi.',
        ],
        dosAndDonts: [
          'Observe a light vegetarian fast until the Katha (sacred story) concludes and prasad is distributed.',
          'All family members should listen to the five chapters of the Katha with devotion.',
          'Distribute prasad to all guests and neighbors after the aarti.',
        ],
        notes: 'Usually performed on Purnima (full moon day), Sankranti, or any auspicious weekend.',
      },
      'rudrabhishek': {
        title: 'Maha Rudrabhishek Preparation',
        spiritualSignificance: 'Sacred bathing of the Shiva Linga accompanied by the chanting of the Sri Rudram to eliminate negativity, sickness, and karmic burdens.',
        householdPrerequisites: [
          'Shiva Linga with water drainage plate (Argha / Thali).',
          'Panchamrit items: Raw cow milk, fresh curd, pure honey, cow ghee, sugarcane juice, and holy water (Gangajal).',
          'Bilva leaves (Bel patra) - minimum 11 or 21 clean tripartite leaves.',
          'Vibhuti (sacred ash), sandalwood paste (chandan), and white flowers (dhatura or aak if available).',
        ],
        dosAndDonts: [
          'Do wear clean traditional attire (dhoti/kurta, saree).',
          'Sit facing North or East during the abhishekam.',
          'Do not use turmeric (haldi) or tulsi leaves on the Shiva Linga.',
        ],
        notes: 'Chanting of Sri Rudram requires trained Vedic priests. Our verified priests perform the complete Chamakam recitation.',
      },
    };

    return guides[ritualSlug] || {
      title: 'Vedic Ritual Preparation Guide',
      spiritualSignificance: 'Vedic ceremonies invoke divine cosmic energies to harmonize personal well-being, home environment, and spiritual progress.',
      householdPrerequisites: [
        'Clean home and designated East/North-East altar space.',
        'Brass or silver deepam (lamps) with cow ghee or sesame oil and cotton wicks.',
        'Fresh fruits (5 varieties), coconuts, betel leaves, and flowers.',
        'Clean asanas (sitting mats) for participants and the pandit.',
      ],
      dosAndDonts: [
        'Take a head bath before beginning the ceremony.',
        'Wear traditional unstitched or freshly washed clothes.',
        'Keep mobile devices on silent to preserve sacred atmosphere.',
      ],
      notes: 'Every ceremony has distinct family gotra customs. Please confirm specifics with your assigned pandit.',
    };
  }
}

export const aiDiscovery = new AiDiscoveryService();
export default aiDiscovery;
