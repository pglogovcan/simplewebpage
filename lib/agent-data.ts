export interface AgentReview {
  id: string
  clientName: string
  rating: number // 1-5
  comment: string
  date: string
}

export interface Agent {
  id: string
  name: string
  title: string
  email: string
  phone: string
  photo: string
  bio: string
  specializations: string[]
  languages: string[]
  certifications: string[]
  experience: number // years
  socialMedia: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
  }
  activeListings: number
  soldProperties: number
  areas: string[] // Areas/neighborhoods they specialize in
  reviews: AgentReview[]
  averageRating: number
}

// Mock data for agents
export const agents: Agent[] = [
  {
    id: "1",
    name: "Ana Marić",
    title: "Senior Real Estate Agent",
    email: "ana.maric@nekretnine.com",
    phone: "+385 91 234 5678",
    photo: "/placeholder.svg?height=400&width=400",
    bio: "Ana je agent s više od 10 godina iskustva na tržištu nekretnina u Zagrebu. Specijalizirana je za luksuzne stanove u centru grada i poznata po izvrsnoj usluzi klijentima.",
    specializations: ["Luksuzne nekretnine", "Stanovi u centru", "Investicijske nekretnine"],
    languages: ["Hrvatski", "Engleski", "Njemački"],
    certifications: ["Licencirani agent za nekretnine", "Certificirani stručnjak za luksuzne nekretnine"],
    experience: 10,
    socialMedia: {
      facebook: "https://facebook.com/anamaric",
      instagram: "https://instagram.com/anamaric_nekretnine",
      linkedin: "https://linkedin.com/in/anamaric",
    },
    activeListings: 12,
    soldProperties: 87,
    areas: ["Centar", "Gornji grad", "Donji grad", "Maksimir"],
    reviews: [
      {
        id: "r1",
        clientName: "Marko Kovač",
        rating: 5,
        comment:
          "Ana je bila izvanredna u pronalaženju savršenog stana za našu obitelj. Vrlo profesionalna i temeljita.",
        date: "2023-11-15",
      },
      {
        id: "r2",
        clientName: "Ivana Horvat",
        rating: 5,
        comment: "Prodala je moj stan u rekordnom roku i po odličnoj cijeni. Preporučujem!",
        date: "2023-09-22",
      },
      {
        id: "r3",
        clientName: "Petar Novak",
        rating: 4,
        comment: "Dobra komunikacija i poznavanje tržišta. Proces je trajao malo duže nego očekivano.",
        date: "2023-07-10",
      },
    ],
    averageRating: 4.7,
  },
  {
    id: "2",
    name: "Ivan Kovačić",
    title: "Voditelj prodaje",
    email: "ivan.kovacic@nekretnine.com",
    phone: "+385 98 765 4321",
    photo: "/placeholder.svg?height=400&width=400",
    bio: "Ivan je stručnjak za obiteljske kuće i vikendice s posebnim fokusom na Istru i Dalmaciju. Sa 15 godina iskustva, Ivan je pomogao stotinama obitelji pronaći savršen dom.",
    specializations: ["Obiteljske kuće", "Vikendice", "Nekretnine uz more"],
    languages: ["Hrvatski", "Engleski", "Talijanski"],
    certifications: ["Licencirani agent za nekretnine", "Specijalist za procjenu vrijednosti nekretnina"],
    experience: 15,
    socialMedia: {
      facebook: "https://facebook.com/ivankovacic",
      instagram: "https://instagram.com/ivan_nekretnine",
      linkedin: "https://linkedin.com/in/ivankovacic",
      twitter: "https://twitter.com/ivankovacic",
    },
    activeListings: 18,
    soldProperties: 143,
    areas: ["Istra", "Dalmacija", "Kvarner", "Zagorje"],
    reviews: [
      {
        id: "r4",
        clientName: "Josip Perić",
        rating: 5,
        comment: "Ivan nam je pomogao pronaći savršenu vikendicu na moru. Izuzetno profesionalan i posvećen.",
        date: "2023-12-05",
      },
      {
        id: "r5",
        clientName: "Marija Jurić",
        rating: 4,
        comment: "Vrlo temeljit u pristupu i odličan u pregovorima. Preporučujem za prodaju nekretnina.",
        date: "2023-10-18",
      },
    ],
    averageRating: 4.5,
  },
  {
    id: "3",
    name: "Maja Novak",
    title: "Agent za nekretnine",
    email: "maja.novak@nekretnine.com",
    phone: "+385 95 123 4567",
    photo: "/placeholder.svg?height=400&width=400",
    bio: "Maja je specijalizirana za novogradnju i moderne stanove. Poznata je po detaljnom poznavanju tržišta i odličnim odnosima s developerima.",
    specializations: ["Novogradnja", "Moderni stanovi", "Poslovni prostori"],
    languages: ["Hrvatski", "Engleski"],
    certifications: ["Licencirani agent za nekretnine"],
    experience: 5,
    socialMedia: {
      facebook: "https://facebook.com/majanovak",
      instagram: "https://instagram.com/maja_nekretnine",
    },
    activeListings: 15,
    soldProperties: 42,
    areas: ["Novi Zagreb", "Trešnjevka", "Vrbani", "Jarun"],
    reviews: [
      {
        id: "r6",
        clientName: "Ana Perić",
        rating: 5,
        comment: "Maja je bila izuzetno profesionalna i pomogla nam je pronaći savršen stan u novogradnji.",
        date: "2023-11-28",
      },
      {
        id: "r7",
        clientName: "Tomislav Horvat",
        rating: 3,
        comment: "Dobra usluga, ali proces je trajao duže nego što smo očekivali.",
        date: "2023-08-15",
      },
    ],
    averageRating: 4.0,
  },
  {
    id: "4",
    name: "Damir Jurić",
    title: "Specijalist za luksuzne nekretnine",
    email: "damir.juric@nekretnine.com",
    phone: "+385 99 876 5432",
    photo: "/placeholder.svg?height=400&width=400",
    bio: "Damir se specijalizirao za luksuzne nekretnine na ekskluzivnim lokacijama. S više od 20 godina iskustva, Damir je prvi izbor za klijente koji traže vrhunske nekretnine.",
    specializations: ["Luksuzne vile", "Penthouse apartmani", "Ekskluzivne lokacije"],
    languages: ["Hrvatski", "Engleski", "Njemački", "Francuski"],
    certifications: [
      "Licencirani agent za nekretnine",
      "Međunarodni specijalist za luksuzne nekretnine",
      "Certificirani pregovarač",
    ],
    experience: 20,
    socialMedia: {
      facebook: "https://facebook.com/damirjuric",
      instagram: "https://instagram.com/damir_luxury_estates",
      linkedin: "https://linkedin.com/in/damirjuric",
      twitter: "https://twitter.com/damirjuric",
    },
    activeListings: 8,
    soldProperties: 215,
    areas: ["Pantovčak", "Tuškanac", "Šalata", "Brijuni", "Hvar"],
    reviews: [
      {
        id: "r8",
        clientName: "Robert Kralj",
        rating: 5,
        comment: "Damir je izvanredan agent. Njegova diskrecija i profesionalnost su na najvišoj razini.",
        date: "2023-12-10",
      },
      {
        id: "r9",
        clientName: "Helena Matić",
        rating: 5,
        comment: "Impresivno poznavanje tržišta luksuznih nekretnina i izvrsna usluga.",
        date: "2023-10-05",
      },
      {
        id: "r10",
        clientName: "Nikola Babić",
        rating: 4,
        comment: "Vrlo profesionalan pristup i odlični savjeti tijekom cijelog procesa kupnje.",
        date: "2023-07-22",
      },
    ],
    averageRating: 4.7,
  },
]

// Function to get agent by ID
export function getAgentById(id: string): Agent | undefined {
  return agents.find((agent) => agent.id === id)
}

// Function to get all agents
export function getAllAgents(): Agent[] {
  return agents
}

// Function to get agent's active listings
export function getAgentActiveListings(agentId: string) {
  // In a real application, this would fetch from your property database
  // For now, we'll return mock data
  const agent = getAgentById(agentId)
  if (!agent) return []

  // This would normally return actual property listings
  return Array(agent.activeListings)
    .fill(null)
    .map((_, index) => ({
      id: `property-${agentId}-${index}`,
      title: `Property ${index + 1}`,
      price: 100000 + Math.floor(Math.random() * 900000),
      location: agent.areas[Math.floor(Math.random() * agent.areas.length)],
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      size: 50 + Math.floor(Math.random() * 200),
      image: `/placeholder.svg?height=200&width=300`,
    }))
}
