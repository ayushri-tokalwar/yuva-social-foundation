from django.core.management.base import BaseCommand
from apps.foundation.models import FoundationProfile, TeamMember, Achievement, ImpactMetric
from apps.campaigns.models import CampaignCategory, Campaign
from apps.services.models import Service
from apps.gallery.models import GalleryCategory, GalleryItem

class Command(BaseCommand):
    help = 'Seeds database with authentic Yuva Social Foundation data, team members, campaigns, services, and gallery items'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.NOTICE("Starting database seeding for Yuva Social Foundation..."))

        # 1. Foundation Profile
        profile, created = FoundationProfile.objects.update_or_create(
            id=1,
            defaults={
                "name": "Yuva Social Foundation",
                "tagline": "Empowering Lives Through Community Engagement & Social Welfare",
                "description": (
                    "Yuva Social Foundation is a community-driven non-profit organization dedicated to helping poor "
                    "and needy people by providing food, shelter, clothing, financial assistance, medicines, and essential "
                    "support. Established in 2017 in Chandrapur, Maharashtra, India, and officially registered in 2021, "
                    "our team works tirelessly to bring hope and relief to those in distress."
                ),
                "about_text": (
                    "Yuva Social Foundation is dedicated to transforming lives through impactful initiatives in healthcare, "
                    "education, emergency medical support, and humanitarian aid. Over the years, we have served society "
                    "selflessly—from providing medical aid to accident victims and running ambulance assistance, organizing "
                    "frequent blood donation drives, distributing food to the hungry, to empowering youth and children in need. "
                    "Our commitment to transparency and accountability ensures that every contribution creates lasting positive change."
                ),
                "mission": (
                    "To create a compassionate and inclusive society where no one suffers from hunger, homelessness, or lack "
                    "of medical care, and where every underprivileged individual receives the support they need to lead a "
                    "healthy, dignified, and empowered life."
                ),
                "vision": (
                    "To enhance human wellbeing through accessible healthcare initiatives, educational empowerment, and "
                    "timely humanitarian aid, fostering a society where every individual thrives and no one is left behind."
                ),
                "established_year": 2017,
                "registered_year": 2021,
                "headquarters": "Chandrapur, Maharashtra, India",
                "official_email": "yuvasocialch34@gmail.com",
                "official_phone": "+91 8669264943",
                "ambulance_contact": "+91 8669264943",
                "address": "Chandrapur, Maharashtra 442401, India",
                "founder_name": "Anush Raju Bhagat",
                "founder_title": "President & Founder",
                "founder_bio": (
                    "In 2017, Anush Raju Bhagat founded Yuva Social Foundation with a dedicated team of passionate youth. "
                    "Under his leadership, the foundation has organized dozens of campaigns across Chandrapur, serving slum "
                    "communities, running emergency ambulance logistics with the government hospital, feeding the underprivileged, "
                    "and mobilizing young citizens for social welfare."
                ),
                "founder_image": "anush.jpg",
                "facebook_url": "https://facebook.com",
                "instagram_url": "https://instagram.com",
                "twitter_url": "https://twitter.com",
                "youtube_url": "https://youtube.com",
                "linkedin_url": "https://linkedin.com",
            }
        )
        self.stdout.write(self.style.SUCCESS("[OK] Foundation profile seeded."))

        # 2. Team Members
        team_members_data = [
            {
                "name": "Anush Bhagat",
                "role": "Founder & President",
                "phone": "+91 8669264934",
                "photo": "anush.jpg",
                "is_leader": True,
                "order": 1,
                "bio": "Founder and President leading welfare missions, community outreach, and organization operations since 2017."
            },
            {
                "name": "Vansh Persingwar",
                "role": "Vice President",
                "phone": "+91 9370580375",
                "photo": "vanshp.jpg",
                "is_leader": True,
                "order": 2,
                "bio": "Vice President overseeing strategic execution, volunteer coordination, and emergency response programs."
            },
            {
                "name": "Chinmay Walke",
                "role": "Secretary",
                "phone": "+91 7796318145",
                "photo": "chinmay.jpg",
                "is_leader": True,
                "order": 3,
                "bio": "Secretary managing official communications, documentation, legal compliance, and partner engagements."
            },
            {
                "name": "Vansh Nikose",
                "role": "Treasurer",
                "phone": "+91 9657347199",
                "photo": "vanshnikose.jpg",
                "is_leader": True,
                "order": 4,
                "bio": "Treasurer managing donation allocations, financial transparency, and accounts auditing."
            },
            {
                "name": "Ritik Pachbhai",
                "role": "Vice Secretary",
                "phone": "+91 9284556346",
                "photo": "ritik.jpg",
                "is_leader": False,
                "order": 5,
                "bio": "Assisting secretarial duties, community coordination, and drive logistics."
            },
            {
                "name": "Lavanyu Munthamalla",
                "role": "Vice Treasurer",
                "phone": "+91 7498779570",
                "photo": "lavanyu.jpg",
                "is_leader": False,
                "order": 6,
                "bio": "Supporting financial records, budget tracking for campaigns, and transparency reports."
            },
            {
                "name": "Taufik Pathan",
                "role": "Executive Chief",
                "phone": "+91 9359788920",
                "photo": "taufik.jpg",
                "is_leader": False,
                "order": 7,
                "bio": "Leading ground team operations, field distribution, and on-site event management."
            },
            {
                "name": "Manthan Nagrale",
                "role": "Vice Organizer",
                "phone": "+91 8055955391",
                "photo": "manthan.jpg",
                "is_leader": False,
                "order": 8,
                "bio": "Coordinating volunteer mobilization and drive venue setups across Chandrapur."
            },
            {
                "name": "Vedant Gedam",
                "role": "Urjanagar Division Chief",
                "phone": "+91 8329151341",
                "photo": "vedant.jpg",
                "is_leader": False,
                "order": 9,
                "bio": "Managing neighborhood outreach and community programs in the Urjanagar division."
            },
            {
                "name": "Vikas Tajne",
                "role": "Vice Executive Chief",
                "phone": "+91 9021007039",
                "photo": "vikas.jpg",
                "is_leader": False,
                "order": 10,
                "bio": "Supporting operational readiness for emergency assistance and distribution drives."
            },
            {
                "name": "Harshal Meshram",
                "role": "Social Media Handler",
                "phone": "+91 8554947837",
                "photo": "harshal.jpg",
                "is_leader": False,
                "order": 11,
                "bio": "Amplifying foundation campaigns, social awareness content, and community stories."
            },
            {
                "name": "Ishwar Pendam",
                "role": "Organizer",
                "phone": "+91 7767026331",
                "photo": "ishwar.jpg",
                "is_leader": False,
                "order": 12,
                "bio": "Organizing ground activities, blood donation camps, and cleanliness initiatives."
            },
        ]

        for member_info in team_members_data:
            TeamMember.objects.update_or_create(
                name=member_info["name"],
                defaults=member_info
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(team_members_data)} team members seeded."))

        # 3. Achievements / Media Recognition
        achievements_data = [
            {
                "title": "Community Welfare Recognition in Regional Press",
                "publication_name": "Chandrapur Local News",
                "date": "2023",
                "description": "Appreciation of Yuva Social Foundation's persistent food distribution drives and emergency ambulance aid during critical community periods.",
                "clipping_image": "acheive 1.jpeg",
                "order": 1
            },
            {
                "title": "Youth Leadership & Social Impact Commendation",
                "publication_name": "Maharashtra Daily News",
                "date": "2022",
                "description": "Coverage highlighting our team of young volunteers delivering medicines and rations to underprivileged households.",
                "clipping_image": "acheive 2.jpeg",
                "order": 2
            },
            {
                "title": "Emergency Response & COVID Relief Effort",
                "publication_name": "Vidarbha Samachar",
                "date": "2021",
                "description": "Featured article acknowledging YSF's volunteer brigade for coordinating hospital beds, oxygen support, and meal distribution during the pandemic.",
                "clipping_image": "acheive 3.jpeg",
                "order": 3
            },
            {
                "title": "Cleanliness & Environmental Awareness Drive Recognition",
                "publication_name": "City Express",
                "date": "2024",
                "description": "Local media feature on our city-wide tree plantation drives, water conservation drives, and youth awareness rallies.",
                "clipping_image": "acheive 4.jpeg",
                "order": 4
            },
        ]

        for ach_info in achievements_data:
            Achievement.objects.update_or_create(
                title=ach_info["title"],
                defaults=ach_info
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(achievements_data)} achievements seeded."))

        # 4. Impact Metrics
        metrics_data = [
            {
                "label": "Emergency Ambulance Service",
                "value": "24/7",
                "prefix": "",
                "suffix": " Availability",
                "description": "Operating in coordination with the Government Hospital in Chandrapur.",
                "icon": "Ambulance",
                "order": 1
            },
            {
                "label": "Welfare & Relief Campaigns",
                "value": "50+",
                "prefix": "",
                "suffix": " Drives",
                "description": "Covering food donation, medical aid, education, and sports tournaments.",
                "icon": "Layers",
                "order": 2
            },
            {
                "label": "Active Community Volunteers",
                "value": "100+",
                "prefix": "",
                "suffix": " Members",
                "description": "Dedicated youth actively serving on the ground for humanitarian causes.",
                "icon": "Users",
                "order": 3
            },
            {
                "label": "Years of Selfless Service",
                "value": "8+",
                "prefix": "Since ",
                "suffix": " (2017)",
                "description": "Uninterrupted community upliftment and emergency support in Maharashtra.",
                "icon": "Heart",
                "order": 4
            },
        ]

        for m_info in metrics_data:
            ImpactMetric.objects.update_or_create(
                label=m_info["label"],
                defaults=m_info
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(metrics_data)} impact metrics seeded."))

        # 5. Campaign Categories
        categories_data = [
            {"name": "Healthcare & Medical Aid", "slug": "healthcare", "description": "Free checkups, blood donation camps, medicine aid, and emergency hospital assistance.", "icon": "Activity"},
            {"name": "Emergency & Ambulance", "slug": "emergency", "description": "24/7 ambulance transportation for accident victims and critical patients.", "icon": "Ambulance"},
            {"name": "Food Relief & Nutrition", "slug": "food-relief", "description": "Nutritious meal distribution and ration kits for slum areas and destitute families.", "icon": "Utensils"},
            {"name": "Child Welfare & Education", "slug": "education", "description": "Study kits, learning sessions, and school supplies for underprivileged students.", "icon": "BookOpen"},
            {"name": "Community & Environment", "slug": "community", "description": "Cleanliness drives, tree plantations, drinking water supply, and youth sports events.", "icon": "TreePine"},
            {"name": "COVID-19 Relief", "slug": "covid-relief", "description": "Pandemic emergency support, hospital coordination, and food aid.", "icon": "ShieldAlert"},
        ]

        category_map = {}
        for cat_info in categories_data:
            cat, _ = CampaignCategory.objects.update_or_create(
                slug=cat_info["slug"],
                defaults=cat_info
            )
            category_map[cat_info["slug"]] = cat
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(categories_data)} campaign categories seeded."))

        # 6. Campaigns
        campaigns_data = [
            {
                "title": "Emergency Ambulance & Accident Assistance",
                "slug": "emergency-ambulance-accident-assistance",
                "category": category_map["emergency"],
                "subtitle": "24/7 dedicated ambulance service for patients and road accident victims in Chandrapur",
                "description": "We operate a dedicated ambulance under the government hospital in Chandrapur, ensuring that critical patients and road accident victims receive immediate medical transport without financial barrier.",
                "story": "In medical emergencies, every minute is decisive. Yuva Social Foundation provides immediate transport and first aid assistance in coordination with local healthcare authorities.",
                "location": "Government Hospital & Chandrapur District",
                "featured_image": "aambulance.jpeg",
                "banner_image": "Emergency.jpg",
                "target_beneficiaries": "24/7 On-Call Support",
                "beneficiaries_helped": "Active On-Call",
                "status": "active",
                "is_featured": True,
                "order": 1
            },
            {
                "title": "Community Food Donation & Hunger Relief Camps",
                "slug": "community-food-donation-hunger-relief",
                "category": category_map["food-relief"],
                "subtitle": "Regular hot meals and dry ration distribution to destitute families and slum areas",
                "description": "Regular food donation drives organized across Chandrapur to ensure that no needy individual or child goes to sleep hungry.",
                "story": "Our volunteer brigade prepares and packages fresh, nutritious meals and dry food kits, delivering directly to impoverished localities and daily wage laborers.",
                "location": "Slum Localities & Public Areas, Chandrapur",
                "featured_image": "FoodDonation.jpg",
                "banner_image": "YSF46.jpeg",
                "target_beneficiaries": "500+ Families Weekly",
                "beneficiaries_helped": "Continuous Food Relief",
                "status": "active",
                "is_featured": True,
                "order": 2
            },
            {
                "title": "COVID-19 Relief, Hospital Beds & Medical Aid",
                "slug": "covid19-relief-hospital-beds-medical-aid",
                "category": category_map["covid-relief"],
                "subtitle": "Comprehensive crisis support including hospital beds, medicines, and food distribution during pandemic",
                "description": "During the COVID-19 pandemic, Yuva Social Foundation worked on the frontlines to assist patients with hospital beds, oxygen, essential medicines, and distributed thousands of food packets.",
                "story": "Our members courageously stepped forward during peak crisis periods to serve COVID patients, organize helpline support, and feed stranded families.",
                "location": "Chandrapur District, Maharashtra",
                "featured_image": "c19-1.jpeg",
                "banner_image": "covid1.jpg",
                "target_beneficiaries": "Thousands of Citizens",
                "beneficiaries_helped": "Successfully Completed",
                "status": "completed",
                "is_featured": True,
                "order": 3
            },
            {
                "title": "Child Welfare & Study Material Distribution",
                "slug": "child-welfare-study-material-distribution",
                "category": category_map["education"],
                "subtitle": "Empowering students in need with books, school bags, stationery, and learning sessions",
                "description": "Promoting literacy and school retention among underprivileged children through free educational kits, stationery, and mentor sessions.",
                "story": "Every child deserves quality education and encouragement. We provide school bags, notebooks, and learning tools to ignite a brighter future.",
                "location": "Local Government Schools & Slum Centers",
                "featured_image": "Education.jpg",
                "banner_image": "YSF39.jpeg",
                "target_beneficiaries": "200+ Students per Drive",
                "beneficiaries_helped": "Annual Drive",
                "status": "active",
                "is_featured": True,
                "order": 4
            },
            {
                "title": "Voluntary Blood Donation & Health Checkup Camps",
                "slug": "voluntary-blood-donation-health-camps",
                "category": category_map["healthcare"],
                "subtitle": "Mobilizing donors to support regional blood banks and providing free general health checkups",
                "description": "Frequent blood donation drives in partnership with certified medical professionals to maintain emergency blood supply for surgeries and critical cases.",
                "story": "Voluntary blood donation saves lives every single day. YSF actively conducts community awareness and camp drives.",
                "location": "Community Halls & Medical Centers, Chandrapur",
                "featured_image": "Blood1.jpg",
                "banner_image": "Hospital.jpg",
                "target_beneficiaries": "Blood Banks & Patients",
                "beneficiaries_helped": "Multiple Drives Organised",
                "status": "active",
                "is_featured": False,
                "order": 5
            },
            {
                "title": "Youth Sports Tournaments & Community Fitness",
                "slug": "youth-sports-tournaments-fitness",
                "category": category_map["community"],
                "subtitle": "Engaging youth in healthy physical activities, team building, and sports competitions",
                "description": "Organizing cricket, football, and athletic tournaments to promote sportsmanship, keep youth positively engaged, and build community cohesion.",
                "story": "Sports foster discipline, mutual respect, and physical fitness among young individuals in our towns.",
                "location": "Chandrapur Sports Grounds",
                "featured_image": "Sports.jpg",
                "banner_image": "YSF5.jpeg",
                "target_beneficiaries": "Youth & Local Teams",
                "beneficiaries_helped": "Annual Tournament",
                "status": "completed",
                "is_featured": False,
                "order": 6
            },
        ]

        for camp_info in campaigns_data:
            Campaign.objects.update_or_create(
                slug=camp_info["slug"],
                defaults=camp_info
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(campaigns_data)} campaigns seeded."))

        # 7. Services (All 15 Authentic Services from original project)
        services_data = [
            {
                "title": "Healthcare Initiatives",
                "slug": "healthcare-initiatives",
                "icon": "Stethoscope",
                "short_description": "Delivering vital healthcare support through free checkups, basic treatments, and health education sessions for underserved communities.",
                "detailed_description": "We organize free medical camps with qualified doctors, distribute necessary medicines, and provide preventive health counseling to rural and slum residents.",
                "image": "Health4.jpg",
                "key_points": "Free basic doctor consultations\nEssential medicine distribution\nHealth awareness and hygiene guidance\nReferrals for critical hospital care",
                "is_highlighted": True,
                "order": 1
            },
            {
                "title": "Blood Donation Drives",
                "slug": "blood-donation-drives",
                "icon": "HeartPulse",
                "short_description": "Frequent blood donation camps to encourage voluntary contributions and maintain vital supplies for hospital emergency units.",
                "detailed_description": "We conduct organized blood donation camps in coordination with licensed blood banks and certified medical teams to support trauma, surgical, and thalassemic patients.",
                "image": "Blood1.jpg",
                "key_points": "Voluntary donor registration\nLicensed blood bank partnerships\nEmergency donor on-call network\nAwareness on safe donation",
                "is_highlighted": True,
                "order": 2
            },
            {
                "title": "Emergency Support & Ambulance",
                "slug": "emergency-support-ambulance",
                "icon": "Ambulance",
                "short_description": "Immediate transport and assistance during medical crises and road accidents through our dedicated ambulance in Chandrapur.",
                "detailed_description": "Operating in direct liaison with the government hospital in Chandrapur, our ambulance delivers rapid transit and basic stabilization support for emergency cases.",
                "image": "aambulance.jpeg",
                "key_points": "24/7 emergency response liaison\nGovernment hospital coordination\nAccident victim rescue assistance\nRapid transit to critical care",
                "is_highlighted": True,
                "order": 3
            },
            {
                "title": "Food Donation & Hunger Relief",
                "slug": "food-donation-hunger-relief",
                "icon": "Utensils",
                "short_description": "Nutritious meals and grocery essential kits distributed to underprivileged communities to fight hunger and foster well-being.",
                "detailed_description": "Regular distribution of hygienic hot meals, grain supplies, and festival rations to destitute individuals, footpath dwellers, and underprivileged families.",
                "image": "FoodDonation.jpg",
                "key_points": "Regular cooked meal distribution\nDry grain & grocery kit drives\nTargeted support for destitute seniors\nEmergency food relief during crises",
                "is_highlighted": True,
                "order": 4
            },
            {
                "title": "Educational Programs & Child Welfare",
                "slug": "educational-programs-child-welfare",
                "icon": "BookOpen",
                "short_description": "Supporting child education through learning sessions, study materials, notebooks, and awareness to promote literacy.",
                "detailed_description": "We distribute school bags, books, stationery, and facilitate mentoring programs to prevent school dropouts among children from financially challenged backgrounds.",
                "image": "Education.jpg",
                "key_points": "Free study kits and school bags\nBasic foundational learning sessions\nEncouraging girl child education\nCareer guidance for youth",
                "is_highlighted": True,
                "order": 5
            },
            {
                "title": "Awareness Campaigns",
                "slug": "awareness-campaigns",
                "icon": "Megaphone",
                "short_description": "Community events to spread awareness on key social, health, and civic issues, aiming to inspire informed positive change.",
                "detailed_description": "We organize street rallies, workshops, and informational sessions on public health, civic duties, drug abuse prevention, and road safety.",
                "image": "Aware3.jpg",
                "key_points": "Public health awareness\nRoad safety & traffic compliance\nSubstance abuse prevention\nCivic participation drives",
                "is_highlighted": False,
                "order": 6
            },
            {
                "title": "Humanitarian Aid & Crisis Relief",
                "slug": "humanitarian-aid-crisis-relief",
                "icon": "ShieldCheck",
                "short_description": "Relief through the distribution of essential supplies, clothing, and active involvement in rebuilding lives during difficult times.",
                "detailed_description": "Providing blankets during winters, emergency clothing, shelter aid, and immediate rehabilitation help to families experiencing unexpected tragedies.",
                "image": "YSF51.jpeg",
                "key_points": "Winter blanket distributions\nEmergency clothing and shelter supplies\nImmediate disaster relief assistance\nDestitute family rehabilitation",
                "is_highlighted": False,
                "order": 7
            },
            {
                "title": "Women's Safety & Empowerment",
                "slug": "womens-safety-empowerment",
                "icon": "UserCheck",
                "short_description": "Awareness programs, self-defense workshops, and community engagement to ensure the safety and empowerment of women in society.",
                "detailed_description": "We conduct awareness sessions on women rights, safety helplines, self-defense training, and skill development to build self-reliance.",
                "image": "YSF34.jpeg",
                "key_points": "Self-defense demonstration sessions\nLegal rights and safety helpline awareness\nSkill training for economic independence\nCommunity safety advocacy",
                "is_highlighted": False,
                "order": 8
            },
            {
                "title": "Water Supply & Hygiene Access",
                "slug": "water-supply-hygiene-access",
                "icon": "Droplets",
                "short_description": "Ensuring access to clean and safe drinking water through installation drives and awareness campaigns on hygiene and conservation.",
                "detailed_description": "Setting up public drinking water kiosks (Piyav) during scorching summers and promoting safe drinking water practices in underserved settlements.",
                "image": "YSF15.jpeg",
                "key_points": "Summer drinking water kiosks\nWater conservation awareness\nClean storage guidance\nSanitation hygiene campaigns",
                "is_highlighted": False,
                "order": 9
            },
            {
                "title": "Sports Tournaments & Youth Fitness",
                "slug": "sports-tournaments-youth-fitness",
                "icon": "Trophy",
                "short_description": "Organizing sports tournaments to promote physical fitness, teamwork, sportsmanship, and a healthy lifestyle within the community.",
                "detailed_description": "We host cricket and sports competitions that unite youth from diverse backgrounds, promoting active lifestyles and constructive engagement.",
                "image": "Sports.jpg",
                "key_points": "Youth sports tournaments\nEquipment support for young athletes\nEncouraging healthy living and fitness\nTeamwork and positive recreation",
                "is_highlighted": False,
                "order": 10
            },
            {
                "title": "Cleanliness & Sanitation Drives",
                "slug": "cleanliness-sanitation-drives",
                "icon": "Sparkles",
                "short_description": "Cleanliness drives to encourage hygiene, improve public health, and maintain a clean, green surrounding.",
                "detailed_description": "Organizing community clean-up operations in public spaces, hospitals, and parks in support of Swachh Bharat and environmental health.",
                "image": "YSF13.jpeg",
                "key_points": "Public area cleanliness initiatives\nWaste segregation awareness\nSanitation drives in slum areas\nPromoting civic hygiene habits",
                "is_highlighted": False,
                "order": 11
            },
            {
                "title": "Environmental Care & Tree Plantation",
                "slug": "environmental-care-tree-plantation",
                "icon": "TreePine",
                "short_description": "Tree plantation drives and eco-awareness campaigns to protect natural resources and promote sustainable living.",
                "detailed_description": "Planting native trees across Chandrapur to expand green cover, along with workshops on plastic reduction and environmental stewardship.",
                "image": "YSF30.jpeg",
                "key_points": "Native tree sapling plantation\nPlastic pollution awareness\nGreen campus drives\nCare and watering follow-ups",
                "is_highlighted": False,
                "order": 12
            },
            {
                "title": "Empowering Citizens & Skill Building",
                "slug": "empowering-citizens-skill-building",
                "icon": "Award",
                "short_description": "Conducting skill-building sessions, awareness programs, and support services to foster self-reliance and active civic participation.",
                "detailed_description": "Assisting citizens with knowledge of welfare schemes, vocational skills, and encouraging active civic responsibility.",
                "image": "YSF37.jpeg",
                "key_points": "Government welfare scheme guidance\nVocational skill workshops\nYouth mentorship programs\nCivic literacy facilitation",
                "is_highlighted": False,
                "order": 13
            },
            {
                "title": "Public Welfare & Social Issues",
                "slug": "public-welfare-social-issues",
                "icon": "ShieldAlert",
                "short_description": "Addressing community health, education, equal rights, and inclusive development for the underprivileged.",
                "detailed_description": "Advocating for underprivileged groups and bridging gap between government welfare provisions and needy beneficiaries.",
                "image": "YSF50.jpeg",
                "key_points": "Public grievance representation\nSupporting marginalized communities\nRights and entitlement assistance\nInclusive social development",
                "is_highlighted": False,
                "order": 14
            },
            {
                "title": "Festive Giving & Joy Sharing",
                "slug": "festive-giving-joy-sharing",
                "icon": "Gift",
                "short_description": "Sharing joy and festival gifts with underprivileged children and destitute families to ensure everyone celebrates with dignity.",
                "detailed_description": "Distributing sweets, clothes, and festive hampers during Diwali, Eid, and national holidays to orphanages, shelter homes, and poor families.",
                "image": "YSF20.jpeg",
                "key_points": "Festival gift and clothes distribution\nSharing celebrations with orphanages\nBringing joy to shelter residents\nPromoting communal harmony",
                "is_highlighted": False,
                "order": 15
            },
        ]

        for s_info in services_data:
            Service.objects.update_or_create(
                slug=s_info["slug"],
                defaults=s_info
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(services_data)} welfare services seeded."))

        # 8. Gallery Categories & Items
        gallery_cats_data = [
            {"name": "COVID-19 Relief", "slug": "covid-relief", "description": "Frontline relief and pandemic emergency drives"},
            {"name": "Food Distribution", "slug": "food-distribution", "description": "Meals and food kit distributions"},
            {"name": "Medical & Health", "slug": "medical-health", "description": "Ambulance assistance and medical checkups"},
            {"name": "Community & Drives", "slug": "community-drives", "description": "Community events, sports, and cleanliness"},
            {"name": "Media & Achievements", "slug": "media-recognition", "description": "Press coverage and newspaper recognitions"},
        ]

        gallery_cat_map = {}
        for gcat_info in gallery_cats_data:
            gcat, _ = GalleryCategory.objects.update_or_create(
                slug=gcat_info["slug"],
                defaults=gcat_info
            )
            gallery_cat_map[gcat_info["slug"]] = gcat

        gallery_items_data = [
            {"title": "Food Distribution Drive in Slum Area", "category": gallery_cat_map["food-distribution"], "image": "ysf.2.jpeg", "caption": "Volunteers distributing packed food to families in need.", "location": "Chandrapur", "event_date": "2023", "is_featured": True, "order": 1},
            {"title": "Ambulance Emergency Operations", "category": gallery_cat_map["medical-health"], "image": "aambulance.jpeg", "caption": "YSF Ambulance vehicle supporting Chandrapur Government Hospital.", "location": "Chandrapur Govt Hospital", "event_date": "2024", "is_featured": True, "order": 2},
            {"title": "COVID-19 Frontline Relief Service", "category": gallery_cat_map["covid-relief"], "image": "c19-1.jpeg", "caption": "YSF team assisting with essential groceries and medical supplies during COVID-19.", "location": "Chandrapur", "event_date": "2021", "is_featured": True, "order": 3},
            {"title": "COVID Support Volunteer Brigade", "category": gallery_cat_map["covid-relief"], "image": "covid1.jpg", "caption": "Team of volunteers preparing relief packets during lockdown.", "location": "Chandrapur", "event_date": "2021", "is_featured": False, "order": 4},
            {"title": "Community Meal Distribution Camp", "category": gallery_cat_map["food-distribution"], "image": "FoodDonation.jpg", "caption": "Feeding hungry and daily wage workers.", "location": "Chandrapur", "event_date": "2023", "is_featured": True, "order": 5},
            {"title": "Blood Donation Camp Volunteers", "category": gallery_cat_map["medical-health"], "image": "Blood1.jpg", "caption": "Voluntary blood donation camp organized by Yuva Social Foundation.", "location": "Chandrapur", "event_date": "2023", "is_featured": True, "order": 6},
            {"title": "Health Checkup & Medical Camp", "category": gallery_cat_map["medical-health"], "image": "Health4.jpg", "caption": "Free medical examinations and health counseling for underprivileged residents.", "location": "Chandrapur", "event_date": "2023", "is_featured": False, "order": 7},
            {"title": "Study Material & Book Distribution", "category": gallery_cat_map["community-drives"], "image": "YSF39.jpeg", "caption": "Distributing school kits and books to children in need.", "location": "Chandrapur", "event_date": "2023", "is_featured": True, "order": 8},
            {"title": "Drinking Water Supply Initiative", "category": gallery_cat_map["community-drives"], "image": "YSF15.jpeg", "caption": "Safe drinking water facilities installed during summer season.", "location": "Chandrapur", "event_date": "2023", "is_featured": False, "order": 9},
            {"title": "Tree Plantation & Green Environment", "category": gallery_cat_map["community-drives"], "image": "YSF30.jpeg", "caption": "Planting trees across the city to build a greener future.", "location": "Chandrapur", "event_date": "2024", "is_featured": False, "order": 10},
            {"title": "Sports Tournament for Youth", "category": gallery_cat_map["community-drives"], "image": "YSF5.jpeg", "caption": "Promoting sports and fitness among young citizens.", "location": "Chandrapur", "event_date": "2023", "is_featured": False, "order": 11},
            {"title": "Cleanliness & Sanitation Campaign", "category": gallery_cat_map["community-drives"], "image": "YSF13.jpeg", "caption": "Volunteer drive for cleaner streets and public spaces.", "location": "Chandrapur", "event_date": "2023", "is_featured": False, "order": 12},
            {"title": "Winter Blanket & Humanitarian Relief", "category": gallery_cat_map["community-drives"], "image": "YSF51.jpeg", "caption": "Distributing warm clothes and blankets to needy people.", "location": "Chandrapur", "event_date": "2023", "is_featured": False, "order": 13},
            {"title": "Press Coverage & Recognition", "category": gallery_cat_map["media-recognition"], "image": "acheive 1.jpeg", "caption": "Local news recognition for community welfare initiatives.", "location": "Chandrapur", "event_date": "2023", "is_featured": True, "order": 14},
            {"title": "Media Clippings of YSF Activities", "category": gallery_cat_map["media-recognition"], "image": "acheive 2.jpeg", "caption": "Newspaper article highlighting COVID relief by our foundation.", "location": "Chandrapur", "event_date": "2022", "is_featured": False, "order": 15},
            {"title": "Social Service Commendation in Newspaper", "category": gallery_cat_map["media-recognition"], "image": "acheive 3.jpeg", "caption": "Recognized by regional publications for emergency medical assistance.", "location": "Chandrapur", "event_date": "2021", "is_featured": False, "order": 16},
        ]

        for item_info in gallery_items_data:
            GalleryItem.objects.update_or_create(
                title=item_info["title"],
                defaults=item_info
            )
        self.stdout.write(self.style.SUCCESS(f"[OK] {len(gallery_items_data)} gallery items seeded."))

        self.stdout.write(self.style.SUCCESS("All Yuva Social Foundation seed data successfully populated!"))

