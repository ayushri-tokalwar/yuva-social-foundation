import React, { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import TeamCard from '../components/TeamCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { getFoundationOverview, getTeamMembers } from '../services/api';
import { 
  Heart, 
  ShieldCheck, 
  Award, 
  Users, 
  Target, 
  Eye, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Sparkles,
  Phone
} from 'lucide-react';

export default function About({ onOpenVolunteerModal, onOpenDonationModal }) {
  const [overview, setOverview] = useState(null);
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ovData, teamData] = await Promise.all([
          getFoundationOverview(),
          getTeamMembers()
        ]);
        setOverview(ovData);
        setTeam(teamData || ovData.team || []);
      } catch (err) {
        console.error('Error fetching about data:', err);
        setError('Failed to fetch full data from backend.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const coreValues = [
    {
      title: "Service to Humanity",
      desc: "Believing that selfless aid to those in distress is the highest civic duty.",
      icon: Heart
    },
    {
      title: "Youth Leadership",
      desc: "Mobilizing the energy, skills, and compassion of young citizens for social change.",
      icon: Users
    },
    {
      title: "Integrity & Transparency",
      desc: "Ensuring every rupee and resource is channeled directly to vulnerable beneficiaries.",
      icon: ShieldCheck
    },
    {
      title: "Immediate Action",
      desc: "Providing rapid response during medical emergencies, accidents, and crises.",
      icon: Award
    }
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* =========================================================
          HERO BANNER
          ========================================================= */}
      <section className="bg-slate-950 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/YSF51.jpeg"
            alt="Yuva Social Foundation Community"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/60" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4">
            Our History & Purpose
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            About Yuva Social Foundation
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Founded by local youth in 2017 in Chandrapur, Maharashtra, and officially registered in 2021 to build an empowered, healthy, and compassionate society.
          </p>
        </div>
      </section>

      {/* =========================================================
          FOUNDATION STORY & BACKGROUND
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              Established in 2017 • Registered in 2021
            </span>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              A Legacy of Grassroots Care and Community Solidarity
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Yuva Social Foundation is a community-driven non-profit organization dedicated to helping poor and needy people by providing food, shelter, clothing, financial assistance, medicines, and essential support.
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Our foundation was established in 2017 in Chandrapur, Maharashtra, India, and officially registered in 2021. Over the years, we have been serving society selflessly, bringing hope and relief to those in distress. We believe that service to humanity is the greatest service of all.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-slate-900">Key Milestones:</h4>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>2017:</strong> Foundation formed by Anush Bhagat and youth team in Chandrapur.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>2020-2021:</strong> Frontline COVID-19 relief, hospital beds, oxygen, and ration distribution.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>2021:</strong> Official NGO Registration & Expansion of Ambulance Services.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span><strong>Present:</strong> Active 24/7 emergency response, blood drives, food camps, and youth tournaments.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/5] bg-slate-100">
                <img
                  src="/images/YSF13.jpeg"
                  alt="YSF Drive"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-card aspect-square bg-slate-100">
                <img
                  src="/images/Health4.jpg"
                  alt="Medical checkup"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="rounded-2xl overflow-hidden shadow-card aspect-square bg-slate-100">
                <img
                  src="/images/Blood1.jpg"
                  alt="Blood camp"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-card aspect-[4/5] bg-slate-100">
                <img
                  src="/images/YSF39.jpeg"
                  alt="Education drive"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================
          MISSION & VISION
          ========================================================= */}
      <section className="bg-slate-900 text-white py-16 sm:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Our Guiding Light"
            title="Building a Better Future Together"
            subtitle="Our vision and mission drive every action, campaign, and relief initiative we undertake."
            center={true}
            className="text-white"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Vision Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Vision</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                To enhance human wellbeing through accessible healthcare initiatives, educational support, and timely humanitarian aid, fostering a compassionate society where every individual thrives and no one is left behind.
              </p>
            </div>

            {/* Mission Card */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl bg-primary-500/20 text-primary-400 flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                To create a society where no one suffers from hunger, homelessness, or lack of emergency medical care, and where every underprivileged individual gets the help they need to lead a dignified, healthy, and empowered life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          PRESIDENT & FOUNDER SPOTLIGHT
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-brand-50 via-orange-50/50 to-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-brand-200/80 shadow-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-4 text-center">
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto bg-slate-100">
                <img
                  src="/images/anush.jpg"
                  alt="Anush Raju Bhagat"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/YSFLogo.jpg";
                  }}
                />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-4">
                ANUSH RAJU BHAGAT
              </h3>
              <p className="text-sm font-bold text-brand-600 uppercase tracking-wider mt-0.5">
                President & Founder
              </p>
              <div className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-600">
                <Phone className="w-3.5 h-3.5 text-brand-600" />
                <span>+91 8669264934</span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-extrabold text-brand-600 uppercase tracking-wider">
                Founder's Message
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                "Small acts of kindness multiply into life-changing transformations for our community."
              </h3>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                In 2017, Anush Bhagat founded Yuva Social Foundation with a committed group of youngsters in Chandrapur. Seeing the critical shortage of immediate medical transportation for accident victims and poor patients, the foundation mobilized an ambulance operating under the government hospital.
              </p>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Over the years, he and the team have organized continuous food donation camps, supported children in slum localities with notebooks and school bags, and mobilized dozens of voluntary blood donation camps.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          CORE VALUES
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Principles"
          title="Core Values We Uphold"
          subtitle="How we make decisions, organize relief, and maintain the trust of our communities."
          center={true}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft hover:shadow-card transition-all">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{val.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          MEET OUR DEDICATED TEAM
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our People"
          title="Meet Our Dedicated Team"
          subtitle="Our selfless volunteers and executive officers who make all these campaigns and relief operations possible."
          center={true}
        />

        {loading ? (
          <LoadingSpinner text="Loading team members..." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {team.map(member => (
              <TeamCard key={member.id} member={member} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
