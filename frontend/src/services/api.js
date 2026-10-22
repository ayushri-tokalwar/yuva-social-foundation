import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper to resolve image paths (supports static asset folder & backend media)
export const resolveImageUrl = (imgName) => {
  if (!imgName) return '/images/YSFLogo.jpg';
  if (imgName.startsWith('http://') || imgName.startsWith('https://')) return imgName;
  if (imgName.startsWith('/media/')) {
    const backendBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '');
    return `${backendBase}${imgName}`;
  }
  if (imgName.startsWith('/')) return imgName;
  return `/images/${imgName}`;
};

// ==========================================
// FOUNDATION & TEAM
// ==========================================
export const getFoundationOverview = async () => {
  try {
    const response = await apiClient.get('/foundation/overview/');
    return response.data;
  } catch (error) {
    console.warn('Backend connection notice - loading fallback overview:', error.message);
    return getFallbackOverview();
  }
};

export const getFoundationProfile = async () => {
  try {
    const response = await apiClient.get('/foundation/profile/');
    return response.data;
  } catch (error) {
    console.warn('API error - getFoundationProfile:', error);
    return getFallbackOverview().profile;
  }
};

export const getTeamMembers = async () => {
  try {
    const response = await apiClient.get('/foundation/team/');
    return response.data;
  } catch (error) {
    console.warn('API error - getTeamMembers:', error);
    return getFallbackOverview().team;
  }
};

export const getAchievements = async () => {
  try {
    const response = await apiClient.get('/foundation/achievements/');
    return response.data;
  } catch (error) {
    console.warn('API error - getAchievements:', error);
    return getFallbackOverview().achievements;
  }
};

export const getImpactMetrics = async () => {
  try {
    const response = await apiClient.get('/foundation/metrics/');
    return response.data;
  } catch (error) {
    console.warn('API error - getImpactMetrics:', error);
    return getFallbackOverview().metrics;
  }
};

// ==========================================
// CAMPAIGNS
// ==========================================
export const getCampaigns = async (params = {}) => {
  try {
    const response = await apiClient.get('/campaigns/', { params });
    return response.data;
  } catch (error) {
    console.warn('API error - getCampaigns:', error);
    return getFallbackCampaigns(params);
  }
};

export const getFeaturedCampaigns = async () => {
  try {
    const response = await apiClient.get('/campaigns/featured/');
    return response.data;
  } catch (error) {
    console.warn('API error - getFeaturedCampaigns:', error);
    return getFallbackCampaigns().filter(c => c.is_featured);
  }
};

export const getCampaignCategories = async () => {
  try {
    const response = await apiClient.get('/campaigns/categories/');
    return response.data;
  } catch (error) {
    console.warn('API error - getCampaignCategories:', error);
    return getFallbackCategories();
  }
};

export const getCampaignBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/campaigns/${slug}/`);
    return response.data;
  } catch (error) {
    console.warn(`API error - getCampaignBySlug (${slug}):`, error);
    return getFallbackCampaigns().find(c => c.slug === slug || String(c.id) === String(slug));
  }
};

// ==========================================
// WELFARE SERVICES
// ==========================================
export const getServices = async () => {
  try {
    const response = await apiClient.get('/services/');
    return response.data;
  } catch (error) {
    console.warn('API error - getServices:', error);
    return getFallbackServices();
  }
};

export const getServiceBySlug = async (slug) => {
  try {
    const response = await apiClient.get(`/services/${slug}/`);
    return response.data;
  } catch (error) {
    console.warn(`API error - getServiceBySlug (${slug}):`, error);
    return getFallbackServices().find(s => s.slug === slug);
  }
};

// ==========================================
// GALLERY
// ==========================================
export const getGalleryCategories = async () => {
  try {
    const response = await apiClient.get('/gallery/categories/');
    return response.data;
  } catch (error) {
    console.warn('API error - getGalleryCategories:', error);
    return getFallbackGalleryCategories();
  }
};

export const getGalleryItems = async (params = {}) => {
  try {
    const response = await apiClient.get('/gallery/', { params });
    return response.data;
  } catch (error) {
    console.warn('API error - getGalleryItems:', error);
    return getFallbackGalleryItems(params);
  }
};

// ==========================================
// FORM SUBMISSIONS (MUTATIONS)
// ==========================================
export const submitVolunteerForm = async (formData) => {
  const response = await apiClient.post('/volunteers/', formData);
  return response.data;
};

export const submitDonationRequest = async (formData) => {
  const response = await apiClient.post('/donations/', formData);
  return response.data;
};

export const submitContactForm = async (formData) => {
  const response = await apiClient.post('/contact/', formData);
  return response.data;
};

// ==========================================
// OBJECT NAMESPACES (CONVENIENCE EXPORTS)
// ==========================================
export const galleryApi = {
  getAll: async (params) => {
    const data = await getGalleryItems(params);
    return { data };
  },
  getCategories: async () => {
    const data = await getGalleryCategories();
    return { data };
  }
};

export const contactApi = {
  send: async (formData) => {
    return await submitContactForm(formData);
  }
};

export const servicesApi = {
  getAll: getServices,
  getBySlug: getServiceBySlug
};

export const campaignsApi = {
  getAll: getCampaigns,
  getFeatured: getFeaturedCampaigns,
  getBySlug: getCampaignBySlug,
  getCategories: getCampaignCategories
};

export const foundationApi = {
  getOverview: getFoundationOverview,
  getProfile: getFoundationProfile,
  getTeam: getTeamMembers,
  getAchievements: getAchievements,
  getMetrics: getImpactMetrics
};


export const checkBackendHealth = async () => {
  try {
    const response = await apiClient.get('/health/');
    return response.data;
  } catch (error) {
    return { status: 'offline', error: error.message };
  }
};

// ==========================================
// RESILIENT CLIENT-SIDE FALLBACK CACHE
// (Ensures smooth offline / demo availability)
// ==========================================
function getFallbackOverview() {
  return {
    profile: {
      name: "Yuva Social Foundation",
      tagline: "Empowering Lives Through Community Engagement & Social Welfare",
      description: "Yuva Social Foundation is a community-driven non-profit organization established in 2017 in Chandrapur, Maharashtra and registered in 2021, dedicated to helping needy people with medical aid, 24/7 ambulance support, food drives, and child education.",
      about_text: "We believe that service to humanity is the greatest service of all. Our team of dedicated members works tirelessly to uplift underprivileged communities and address social issues across Maharashtra.",
      mission: "To create a compassionate and inclusive society where no one suffers from hunger, homelessness, or lack of medical care, and where every underprivileged individual receives the support they need.",
      vision: "To enhance human wellbeing through accessible healthcare initiatives, educational empowerment, and timely humanitarian aid, ensuring no one is left behind.",
      established_year: 2017,
      registered_year: 2021,
      headquarters: "Chandrapur, Maharashtra, India",
      official_email: "yuvasocialch34@gmail.com",
      official_phone: "+91 8669264943",
      ambulance_contact: "+91 8669264943",
      address: "Chandrapur, Maharashtra 442401, India",
      founder_name: "Anush Raju Bhagat",
      founder_title: "President & Founder",
      founder_bio: "In 2017, Anush Bhagat founded Yuva Social Foundation with a dedicated team of passionate youth. Under his leadership, the foundation operates ambulance emergency support, food drives, and child welfare campaigns.",
      founder_image: "anush.jpg",
    },
    team: [
      { id: 1, name: "Anush Bhagat", role: "Founder & President", phone: "+91 8669264934", photo: "anush.jpg", is_leader: true, bio: "Founder & President leading welfare missions and organization operations." },
      { id: 2, name: "Vansh Persingwar", role: "Vice President", phone: "+91 9370580375", photo: "vanshp.jpg", is_leader: true, bio: "Vice President overseeing strategic execution and volunteer teams." },
      { id: 3, name: "Chinmay Walke", role: "Secretary", phone: "+91 7796318145", photo: "chinmay.jpg", is_leader: true, bio: "Secretary managing official communications and documentation." },
      { id: 4, name: "Vansh Nikose", role: "Treasurer", phone: "+91 9657347199", photo: "vanshnikose.jpg", is_leader: true, bio: "Treasurer managing accounts and financial transparency." },
      { id: 5, name: "Ritik Pachbhai", role: "Vice Secretary", phone: "+91 9284556346", photo: "ritik.jpg", is_leader: false },
      { id: 6, name: "Lavanyu Munthamalla", role: "Vice Treasurer", phone: "+91 7498779570", photo: "lavanyu.jpg", is_leader: false },
      { id: 7, name: "Taufik Pathan", role: "Executive Chief", phone: "+91 9359788920", photo: "taufik.jpg", is_leader: false },
      { id: 8, name: "Manthan Nagrale", role: "Vice Organizer", phone: "+91 8055955391", photo: "manthan.jpg", is_leader: false },
      { id: 9, name: "Vedant Gedam", role: "Urjanagar Division Chief", phone: "+91 8329151341", photo: "vedant.jpg", is_leader: false },
      { id: 10, name: "Vikas Tajne", role: "Vice Executive Chief", phone: "+91 9021007039", photo: "vikas.jpg", is_leader: false },
      { id: 11, name: "Harshal Meshram", role: "Social Media Handler", phone: "+91 8554947837", photo: "harshal.jpg", is_leader: false },
      { id: 12, name: "Ishwar Pendam", role: "Organizer", phone: "+91 7767026331", photo: "ishwar.jpg", is_leader: false },
    ],
    achievements: [
      { id: 1, title: "Community Welfare Recognition in Regional Press", publication_name: "Chandrapur Local News", date: "2023", description: "Appreciation of Yuva Social Foundation's persistent food distribution drives and emergency ambulance aid.", clipping_image: "acheive 1.jpeg" },
      { id: 2, title: "Youth Leadership & Social Impact Commendation", publication_name: "Maharashtra Daily News", date: "2022", description: "Coverage highlighting our team of young volunteers delivering medicines and rations.", clipping_image: "acheive 2.jpeg" },
      { id: 3, title: "Emergency Response & COVID Relief Effort", publication_name: "Vidarbha Samachar", date: "2021", description: "Featured article acknowledging YSF's volunteer brigade during the pandemic.", clipping_image: "acheive 3.jpeg" },
      { id: 4, title: "Cleanliness & Environmental Awareness Drive", publication_name: "City Express", date: "2024", description: "Local media feature on our city-wide tree plantation drives and water conservation.", clipping_image: "acheive 4.jpeg" },
    ],
    metrics: [
      { id: 1, label: "Emergency Ambulance Service", value: "24/7", suffix: " Availability", icon: "Ambulance", description: "Operating under Government Hospital Chandrapur" },
      { id: 2, label: "Welfare & Relief Campaigns", value: "50+", suffix: " Drives", icon: "Layers", description: "Food donation, medical aid, education" },
      { id: 3, label: "Active Community Volunteers", value: "100+", suffix: " Members", icon: "Users", description: "Dedicated youth on the ground" },
      { id: 4, label: "Years of Selfless Service", value: "8+", prefix: "Since ", suffix: " (2017)", icon: "Heart", description: "Continuous community welfare" },
    ]
  };
}

function getFallbackCampaigns(params = {}) {
  const all = [
    {
      id: 1,
      title: "Emergency Ambulance & Accident Assistance",
      slug: "emergency-ambulance-accident-assistance",
      category_name: "Emergency & Ambulance",
      category_slug: "emergency",
      subtitle: "24/7 dedicated ambulance service for patients and road accident victims in Chandrapur",
      description: "We operate a dedicated ambulance under the government hospital in Chandrapur, ensuring that critical patients and road accident victims receive immediate medical transport without financial barrier.",
      location: "Government Hospital & Chandrapur District",
      featured_image: "aambulance.jpeg",
      target_beneficiaries: "24/7 On-Call Support",
      beneficiaries_helped: "Active On-Call",
      status: "active",
      is_featured: true,
    },
    {
      id: 2,
      title: "Community Food Donation & Hunger Relief Camps",
      slug: "community-food-donation-hunger-relief",
      category_name: "Food Relief & Nutrition",
      category_slug: "food-relief",
      subtitle: "Regular hot meals and dry ration distribution to destitute families and slum areas",
      description: "Regular food donation drives organized across Chandrapur to ensure that no needy individual or child goes to sleep hungry.",
      location: "Slum Localities & Public Areas, Chandrapur",
      featured_image: "FoodDonation.jpg",
      target_beneficiaries: "500+ Families Weekly",
      beneficiaries_helped: "Continuous Food Relief",
      status: "active",
      is_featured: true,
    },
    {
      id: 3,
      title: "COVID-19 Relief, Hospital Beds & Medical Aid",
      slug: "covid19-relief-hospital-beds-medical-aid",
      category_name: "COVID-19 Relief",
      category_slug: "covid-relief",
      subtitle: "Comprehensive crisis support including hospital beds, medicines, and food distribution during pandemic",
      description: "During the COVID-19 pandemic, Yuva Social Foundation worked on the frontlines to assist patients with hospital beds, oxygen, essential medicines, and distributed thousands of food packets.",
      location: "Chandrapur District, Maharashtra",
      featured_image: "c19-1.jpeg",
      target_beneficiaries: "Thousands of Citizens",
      beneficiaries_helped: "Successfully Completed",
      status: "completed",
      is_featured: true,
    },
    {
      id: 4,
      title: "Child Welfare & Study Material Distribution",
      slug: "child-welfare-study-material-distribution",
      category_name: "Child Welfare & Education",
      category_slug: "education",
      subtitle: "Empowering students in need with books, school bags, stationery, and learning sessions",
      description: "Promoting literacy and school retention among underprivileged children through free educational kits, stationery, and mentor sessions.",
      location: "Local Government Schools & Slum Centers",
      featured_image: "Education.jpg",
      target_beneficiaries: "200+ Students per Drive",
      beneficiaries_helped: "Annual Drive",
      status: "active",
      is_featured: true,
    },
    {
      id: 5,
      title: "Voluntary Blood Donation & Health Checkup Camps",
      slug: "voluntary-blood-donation-health-camps",
      category_name: "Healthcare & Medical Aid",
      category_slug: "healthcare",
      subtitle: "Mobilizing donors to support regional blood banks and providing free general health checkups",
      description: "Frequent blood donation drives in partnership with certified medical professionals to maintain emergency blood supply for surgeries and critical cases.",
      location: "Community Halls & Medical Centers, Chandrapur",
      featured_image: "Blood1.jpg",
      target_beneficiaries: "Blood Banks & Patients",
      beneficiaries_helped: "Multiple Drives Organised",
      status: "active",
      is_featured: false,
    },
    {
      id: 6,
      title: "Youth Sports Tournaments & Community Fitness",
      slug: "youth-sports-tournaments-fitness",
      category_name: "Community & Environment",
      category_slug: "community",
      subtitle: "Engaging youth in healthy physical activities, team building, and sports competitions",
      description: "Organizing cricket, football, and athletic tournaments to promote sportsmanship, keep youth positively engaged, and build community cohesion.",
      location: "Chandrapur Sports Grounds",
      featured_image: "Sports.jpg",
      target_beneficiaries: "Youth & Local Teams",
      beneficiaries_helped: "Annual Tournament",
      status: "completed",
      is_featured: false,
    }
  ];

  if (params.category && params.category !== 'all') {
    return all.filter(c => c.category_slug === params.category);
  }
  if (params.status) {
    return all.filter(c => c.status === params.status);
  }
  return all;
}

function getFallbackCategories() {
  return [
    { id: 1, name: "Healthcare & Medical Aid", slug: "healthcare", icon: "Activity" },
    { id: 2, name: "Emergency & Ambulance", slug: "emergency", icon: "Ambulance" },
    { id: 3, name: "Food Relief & Nutrition", slug: "food-relief", icon: "Utensils" },
    { id: 4, name: "Child Welfare & Education", slug: "education", icon: "BookOpen" },
    { id: 5, name: "Community & Environment", slug: "community", icon: "TreePine" },
    { id: 6, name: "COVID-19 Relief", slug: "covid-relief", icon: "ShieldAlert" },
  ];
}

function getFallbackServices() {
  return [
    { id: 1, title: "Healthcare Initiatives", slug: "healthcare-initiatives", icon: "Stethoscope", short_description: "Delivering vital healthcare support through free medical checkups, basic treatments, and health education sessions for underserved communities.", image: "Health4.jpg", is_highlighted: true },
    { id: 2, title: "Blood Donation Drives", slug: "blood-donation-drives", icon: "HeartPulse", short_description: "Frequent blood donation camps to encourage voluntary contributions and maintain vital supplies for hospital emergency units.", image: "Blood1.jpg", is_highlighted: true },
    { id: 3, title: "Emergency Support & Ambulance", slug: "emergency-support-ambulance", icon: "Ambulance", short_description: "Immediate transport and assistance during medical crises and road accidents through our dedicated ambulance in Chandrapur.", image: "aambulance.jpeg", is_highlighted: true },
    { id: 4, title: "Food Donation & Hunger Relief", slug: "food-donation-hunger-relief", icon: "Utensils", short_description: "Nutritious meals and grocery essential kits distributed to underprivileged communities to fight hunger and promote well-being.", image: "FoodDonation.jpg", is_highlighted: true },
    { id: 5, title: "Educational Programs & Child Welfare", slug: "educational-programs-child-welfare", icon: "BookOpen", short_description: "Supporting child education through learning sessions, study materials, notebooks, and awareness to promote literacy.", image: "Education.jpg", is_highlighted: true },
    { id: 6, title: "Awareness Campaigns", slug: "awareness-campaigns", icon: "Megaphone", short_description: "Community events to spread awareness on key social, health, and civic issues, aiming to inspire informed positive change.", image: "Aware3.jpg", is_highlighted: false },
    { id: 7, title: "Humanitarian Aid & Crisis Relief", slug: "humanitarian-aid-crisis-relief", icon: "ShieldCheck", short_description: "Relief through the distribution of essential supplies, clothing, and active involvement in rebuilding lives during difficult times.", image: "YSF51.jpeg", is_highlighted: false },
    { id: 8, title: "Women's Safety & Empowerment", slug: "womens-safety-empowerment", icon: "UserCheck", short_description: "Awareness programs, self-defense workshops, and community engagement to ensure the safety and empowerment of women in society.", image: "YSF34.jpeg", is_highlighted: false },
    { id: 9, title: "Water Supply & Hygiene Access", slug: "water-supply-hygiene-access", icon: "Droplets", short_description: "Ensuring access to clean and safe drinking water through installation drives and awareness campaigns on hygiene and conservation.", image: "YSF15.jpeg", is_highlighted: false },
    { id: 10, title: "Sports Tournaments & Youth Fitness", slug: "sports-tournaments-youth-fitness", icon: "Trophy", short_description: "Organizing sports tournaments to promote physical fitness, teamwork, sportsmanship, and a healthy lifestyle within the community.", image: "Sports.jpg", is_highlighted: false },
    { id: 11, title: "Cleanliness & Sanitation Drives", slug: "cleanliness-sanitation-drives", icon: "Sparkles", short_description: "Cleanliness drives to encourage hygiene, improve public health, and maintain a clean, green surrounding.", image: "YSF13.jpeg", is_highlighted: false },
    { id: 12, title: "Environmental Care & Tree Plantation", slug: "environmental-care-tree-plantation", icon: "TreePine", short_description: "Tree plantation drives and eco-awareness campaigns to protect natural resources and promote sustainable living.", image: "YSF30.jpeg", is_highlighted: false },
    { id: 13, title: "Empowering Citizens & Skill Building", slug: "empowering-citizens-skill-building", icon: "Award", short_description: "Conducting skill-building sessions, awareness programs, and support services to foster self-reliance and active civic participation.", image: "YSF37.jpeg", is_highlighted: false },
    { id: 14, title: "Public Welfare & Social Issues", slug: "public-welfare-social-issues", icon: "ShieldAlert", short_description: "Addressing community health, education, equal rights, and inclusive development for the underprivileged.", image: "YSF50.jpeg", is_highlighted: false },
    { id: 15, title: "Festive Giving & Joy Sharing", slug: "festive-giving-joy-sharing", icon: "Gift", short_description: "Sharing joy and festival gifts with underprivileged children and destitute families to ensure everyone celebrates with dignity.", image: "YSF20.jpeg", is_highlighted: false },
  ];
}

function getFallbackGalleryCategories() {
  return [
    { id: 1, name: "COVID-19 Relief", slug: "covid-relief" },
    { id: 2, name: "Food Distribution", slug: "food-distribution" },
    { id: 3, name: "Medical & Health", slug: "medical-health" },
    { id: 4, name: "Community & Drives", slug: "community-drives" },
    { id: 5, name: "Media & Achievements", slug: "media-recognition" },
  ];
}

function getFallbackGalleryItems(params = {}) {
  const all = [
    { id: 1, title: "Food Distribution Drive in Slum Area", category_slug: "food-distribution", category_name: "Food Distribution", image: "ysf.2.jpeg", caption: "Volunteers distributing packed food to families in need.", location: "Chandrapur", event_date: "2023", is_featured: true },
    { id: 2, title: "Ambulance Emergency Operations", category_slug: "medical-health", category_name: "Medical & Health", image: "aambulance.jpeg", caption: "YSF Ambulance vehicle supporting Chandrapur Government Hospital.", location: "Govt Hospital", event_date: "2024", is_featured: true },
    { id: 3, title: "COVID-19 Frontline Relief Service", category_slug: "covid-relief", category_name: "COVID-19 Relief", image: "c19-1.jpeg", caption: "YSF team assisting with essential groceries and medical supplies.", location: "Chandrapur", event_date: "2021", is_featured: true },
    { id: 4, title: "COVID Support Volunteer Brigade", category_slug: "covid-relief", category_name: "COVID-19 Relief", image: "covid1.jpg", caption: "Team of volunteers preparing relief packets during lockdown.", location: "Chandrapur", event_date: "2021", is_featured: false },
    { id: 5, title: "Community Meal Distribution Camp", category_slug: "food-distribution", category_name: "Food Distribution", image: "FoodDonation.jpg", caption: "Feeding hungry and daily wage workers.", location: "Chandrapur", event_date: "2023", is_featured: true },
    { id: 6, title: "Blood Donation Camp Volunteers", category_slug: "medical-health", category_name: "Medical & Health", image: "Blood1.jpg", caption: "Voluntary blood donation camp organized by Yuva Social Foundation.", location: "Chandrapur", event_date: "2023", is_featured: true },
    { id: 7, title: "Health Checkup & Medical Camp", category_slug: "medical-health", category_name: "Medical & Health", image: "Health4.jpg", caption: "Free medical examinations and health counseling.", location: "Chandrapur", event_date: "2023", is_featured: false },
    { id: 8, title: "Study Material & Book Distribution", category_slug: "community-drives", category_name: "Community & Drives", image: "YSF39.jpeg", caption: "Distributing school kits and books to children in need.", location: "Chandrapur", event_date: "2023", is_featured: true },
    { id: 9, title: "Drinking Water Supply Initiative", category_slug: "community-drives", category_name: "Community & Drives", image: "YSF15.jpeg", caption: "Safe drinking water facilities installed during summer season.", location: "Chandrapur", event_date: "2023", is_featured: false },
    { id: 10, title: "Tree Plantation & Green Environment", category_slug: "community-drives", category_name: "Community & Drives", image: "YSF30.jpeg", caption: "Planting trees across the city to build a greener future.", location: "Chandrapur", event_date: "2024", is_featured: false },
    { id: 11, title: "Sports Tournament for Youth", category_slug: "community-drives", category_name: "Community & Drives", image: "YSF5.jpeg", caption: "Promoting sports and fitness among young citizens.", location: "Chandrapur", event_date: "2023", is_featured: false },
    { id: 12, title: "Cleanliness & Sanitation Campaign", category_slug: "community-drives", category_name: "Community & Drives", image: "YSF13.jpeg", caption: "Volunteer drive for cleaner streets and public spaces.", location: "Chandrapur", event_date: "2023", is_featured: false },
    { id: 13, title: "Winter Blanket & Humanitarian Relief", category_slug: "community-drives", category_name: "Community & Drives", image: "YSF51.jpeg", caption: "Distributing warm clothes and blankets to needy people.", location: "Chandrapur", event_date: "2023", is_featured: false },
    { id: 14, title: "Press Coverage & Recognition", category_slug: "media-recognition", category_name: "Media & Achievements", image: "acheive 1.jpeg", caption: "Local news recognition for community welfare initiatives.", location: "Chandrapur", event_date: "2023", is_featured: true },
    { id: 15, title: "Media Clippings of YSF Activities", category_slug: "media-recognition", category_name: "Media & Achievements", image: "acheive 2.jpeg", caption: "Newspaper article highlighting COVID relief by our foundation.", location: "Chandrapur", event_date: "2022", is_featured: false },
    { id: 16, title: "Social Service Commendation in Newspaper", category_slug: "media-recognition", category_name: "Media & Achievements", image: "acheive 3.jpeg", caption: "Recognized by regional publications for emergency medical assistance.", location: "Chandrapur", event_date: "2021", is_featured: false },
  ];

  if (params.category && params.category !== 'all') {
    return all.filter(item => item.category_slug === params.category);
  }
  return all;
}

export default apiClient;
