
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import SimplifiedTimeline from '../components/SimplifiedTimeline';
import TeamMemberPreviewCard from '../components/TeamMemberPreviewCard';
import SEO from '../components/SEO';
import { Partner, User } from '../types';
import Badge from '../components/Badge';
import { useStatistics, useActivePartners, useFeaturedTestimonials } from '../hooks/useOngData';

const AnimatedNumber: React.FC<{ finalStat: string; duration?: number }> = ({ finalStat, duration = 2000 }) => {
    const [currentValue, setCurrentValue] = React.useState(0);
    const ref = React.useRef<HTMLSpanElement>(null);

    const endValue = parseInt(finalStat.replace(/\D/g, ''), 10);
    const prefix = finalStat.match(/^\D*/)?.[0] || '';
    const suffix = finalStat.match(/\D*$/)?.[0] || '';


    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    let startTime: number | null = null;
                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;
                        const percentage = Math.min(progress / duration, 1);
                        const animatedValue = Math.floor(percentage * endValue);

                        setCurrentValue(animatedValue);

                        if (progress < duration) {
                            requestAnimationFrame(animate);
                        }
                    };
                    requestAnimationFrame(animate);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [endValue, duration]);

    return <span ref={ref}>{prefix}{currentValue.toLocaleString('pt-BR')}{suffix}</span>;
};


const ImpactCard: React.FC<{ icon: React.ReactNode, stat: string; title: string; text: string; }> = ({ icon, stat, title, text }) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm p-6 md:p-8 rounded-3xl border border-white/10 text-center transform transition-transform duration-300 hover:-translate-y-2 h-full flex flex-col items-center hover:border-[#8a4add]/30 hover:shadow-2xl hover:shadow-[#8a4add]/10">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-[#8a4add] to-[#f27983] text-white mb-4 shadow-lg shadow-[#8a4add]/20">
                <div className="transform scale-110">{icon}</div>
            </div>
            <p className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
                <AnimatedNumber finalStat={stat} />
            </p>
            <p className="text-sm font-bold text-white uppercase tracking-wider mb-2">{title}</p>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{text}</p>
        </div>
    );
};

import senacLogo from '../assets/images/parceiros/senac-rj-logo-branco.webp';
import senaiLogo from '../assets/images/parceiros/senai.png';
import hostingerLogo from '../assets/images/parceiros/hostinger-seeklogo.svg';
import inJuniorLogo from '../assets/images/parceiros/in_junior_logo.jpg';
import way2Logo from '../assets/images/parceiros/wai2-logo.webp';
import craqueDoAmanhaLogo from '../assets/images/parceiros/batata-crac-logo.jpg';

const PartnerLogo: React.FC<{ name: string; logoUrl: string }> = ({ name, logoUrl }) => {
    // Check if it's a placeholder URL
    const isPlaceholder = logoUrl.includes('via.placeholder.com');

    // Extract color from placeholder URL or use default
    const getColorFromUrl = (url: string) => {
        const match = url.match(/\/([0-9a-fA-F]{6})\//);
        return match ? `#${match[1]}` : '#8a4add';
    };

    const bgColor = getColorFromUrl(logoUrl);

    return (
        <div className="relative flex-shrink-0 w-40 h-24 md:w-64 md:h-36 flex items-center justify-center p-3 md:p-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 group transition-all duration-500 transform hover:scale-110 hover:border-[#8a4add]/40 overflow-hidden">
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>

            {/* Glow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#8a4add]/10 via-transparent to-[#f27983]/10 blur-xl"></div>

            {/* Render Image or Fallback */}
            {!isPlaceholder ? (
                <img
                    src={logoUrl}
                    alt={name}
                    className="relative z-10 w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                />
            ) : (
                <div
                    className="relative z-10 w-full h-full flex items-center justify-center rounded-lg transition-all duration-500 group-hover:scale-105"
                    style={{ backgroundColor: `${bgColor}20` }}
                >
                    <span
                        className="text-sm md:text-base font-bold text-center px-2 transition-all duration-500 opacity-70 group-hover:opacity-100"
                        style={{ color: bgColor }}
                    >
                        {name}
                    </span>
                </div>
            )}
        </div>
    );
};

const TestimonialCard: React.FC<{
    name: string;
    role: string;
    company: string;
    photo: string;
    quote: string;
}> = ({ name, role, company, photo, quote }) => (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-8 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 transform hover:-translate-y-2 group relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#8a4add]/10 via-transparent to-[#f27983]/10 blur-xl"></div>

        {/* Quote icon */}
        <div className="relative z-10 text-[#8a4add] mb-4 opacity-50">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
        </div>

        {/* Quote */}
        <p className="relative z-10 text-gray-300 text-base leading-relaxed mb-6 italic">
            "{quote}"
        </p>

        {/* Author */}
        <div className="relative z-10 flex items-center gap-4">
            <img
                src={photo}
                alt={name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#8a4add]/30 group-hover:border-[#8a4add] transition-colors"
            />
            <div>
                <p className="font-bold text-white">{name}</p>
                <p className="text-sm text-gray-400">{role}</p>
                <p className="text-xs text-[#8a4add] font-semibold">{company}</p>
            </div>
        </div>
    </div>
);

const StepCard: React.FC<{
    number: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}> = ({ number, title, description, icon }) => (
    <div className="relative flex flex-col items-center text-center group">
        {/* Connector line (hidden on last item) */}
        <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#8a4add] to-transparent -z-10 group-last:hidden"></div>

        {/* Number badge */}
        <div className="relative mb-6">
            <div className="w-32 h-32 bg-gradient-to-br from-[#8a4add] to-[#f27983] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8a4add]/30 group-hover:scale-110 transition-transform duration-300">
                <div className="text-white">
                    {icon}
                </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-10 h-10 bg-[#8a4add] rounded-full flex items-center justify-center text-white font-black text-lg border-4 border-[#09090B]">
                {number}
            </div>
        </div>

        {/* Content */}
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#c4b5fd] transition-colors">
            {title}
        </h3>
        <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            {description}
        </p>
    </div>
);

const PartnerCarousel: React.FC<{ partners: Partner[] }> = ({ partners }) => {
    if (partners.length === 0) return null;

    // Usamos CSS puro para a animação infinita com duplicação do conteúdo
    // As classes animate-infinite-scroll são definidas no index.html / tailwind.config
    return (
        <div
            className="relative w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]"
            aria-label="Galeria de Parceiros"
            role="region"
        >
            {/* Lista Original */}
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
                {partners.map((partner) => (
                    <li key={partner.id}>
                        <PartnerLogo name={partner.name} logoUrl={partner.logoUrl} />
                    </li>
                ))}
            </ul>
            {/* Lista Duplicada para Loop Infinito */}
            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
                {partners.map((partner) => (
                    <li key={`${partner.id}-duplicate`}>
                        <PartnerLogo name={partner.name} logoUrl={partner.logoUrl} />
                    </li>
                ))}
            </ul>
        </div>
    )
}


const Home: React.FC = () => {
    const { partners, team, events, loadData } = useAppContext();
    const navigate = useNavigate();
    const [teamPreview, setTeamPreview] = useState<User[]>([]);
    const [hasShuffled, setHasShuffled] = useState(false); // A TRAVA: Garante que só roda 1 vez

    // 🎯 Dados centralizados do JSON
    const stats = useStatistics();
    const ongPartners = useActivePartners();
    const testimonials = useFeaturedTestimonials();

    useEffect(() => {
        loadData(['partners', 'users', 'events']); // Users needed for team preview, events for upcoming events
    }, [loadData]);

    // Randomize team on mount AND ensure it stops
    useEffect(() => {
        // Se já embaralhou ou não tem dados, PARE.
        if (hasShuffled || team.length === 0) return;

        const visibleTeam = team.filter(member => member.showOnTeamPage);

        // Fisher-Yates shuffle para garantir aleatoriedade total
        const shuffled = [...visibleTeam];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        // Seleciona os 4 primeiros
        setTeamPreview(shuffled.slice(0, 4));

        // ATIVA A TRAVA
        setHasShuffled(true);

    }, [team, hasShuffled]);

    // 📊 Estatísticas vindas do JSON
    const impactData = [
        { stat: `+${stats.graduatedStudents}`, title: "Jovens Formados", text: "Capacitados em tecnologia", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222 4 2.222V20M1 12v7a2 2 0 002 2h18a2 2 0 002-2v-7" /></svg> },
        { stat: `+${stats.projectsCompleted}`, title: "Turmas", text: "Do online ao presencial", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { stat: `+${stats.volunteers}`, title: "Voluntários", text: "Profissionais dedicados", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
        { stat: `+${stats.activePartners}`, title: "Parceiros", text: "Empresas que apoiam", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg> },
    ];

    // JSON-LD para Organização (SEO)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "NGO",
        "name": "Instituto FuturoOn",
        "url": window.location.origin,
        "logo": "https://ui73bvafvl0llamc.public.blob.vercel-storage.com/images/varied/futuroon-logo.svg",
        "foundingDate": "2021",
        "description": "ONG dedicada ao ensino de tecnologia e desenvolvimento profissional para jovens de comunidades periféricas.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua Silva Jardim, 689",
            "addressLocality": "São Gonçalo",
            "addressRegion": "RJ",
            "postalCode": "24440-000",
            "addressCountry": "BR"
        },
        "areaServed": {
            "@type": "City",
            "name": "São Gonçalo"
        },
        "sameAs": [
            "https://www.instagram.com/futuro.on/",
            "https://www.linkedin.com/company/instituto-futuroon/"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+55-21-97087-2194",
            "contactType": "customer support",
            "email": "futurooon@gmail.com"
        }
    };

    return (
        <>
            <SEO
                title="FuturoOn | Escola de Tecnologia Gratuita na Periferia"
                description="ONG em São Gonçalo/RJ oferecendo cursos gratuitos de programação (React, Node.js), design e robótica. Transformando vidas através da inclusão digital."
                keywords={['tecnologia', 'periferia', 'cursos gratuitos', 'programação', 'ong', 'inclusão digital', 'São Gonçalo', 'React', 'Desenvolvimento Web']}
                jsonLd={organizationSchema}
            />
            {/* Hero Section - Ajustado para maior impacto, com responsividade mobile */}
            <section className="py-20 md:py-32 text-center relative z-10 bg-grid-pattern">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <Badge text="Matrículas Abertas" />
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-tight max-w-5xl mx-auto">
                        Seu futuro na tecnologia<br />
                        começa <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#f27983]">na quebrada.</span>
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-base md:text-xl text-gray-300 leading-relaxed px-4 md:px-0">
                        Acreditamos no seu potencial. Nossa missão é abrir as portas do mercado de tecnologia para talentos da periferia, com educação de qualidade e gratuita.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4">
                        <button
                            onClick={() => navigate('/cadastro')}
                            className="w-full sm:w-auto bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-purple/30 text-base md:text-lg"
                        >
                            Inscreva-se Grátis
                        </button>
                        <button
                            onClick={() => navigate('/doar')}
                            className="w-full sm:w-auto bg-white/5 backdrop-blur-sm border border-white/10 text-white font-semibold py-3 px-8 rounded-xl hover:bg-white/10 transition-all duration-300 text-base md:text-lg"
                        >
                            Faça uma Doação
                        </button>
                    </div>
                </div>
            </section>

            {/* Banner de Conquista - Hostinger Start */}
            <section className="py-8 md:py-12 relative z-10 overflow-hidden border-y border-white/5">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#8a4add]/10 via-[#f27983]/10 to-[#8a4add]/10"></div>
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        {/* Badge de conquista */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30">
                                <span className="text-2xl">🏆</span>
                                <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider">Conquista Recente</span>
                            </div>
                        </div>

                        {/* Logo Hostinger */}
                        <div className="flex justify-center mb-6">
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#8a4add]/30 transition-all duration-300">
                                <img 
                                    src="data:image/webp;base64,UklGRmgGAABXRUJQVlA4IFwGAAAwLACdASo5AbQAPp1OpEylpKOiI1SoqLATiWVu4XKRC3oXhOZDvX5onh/6hzq/MA/UzpAeYDyjP2Z9xnm3f4DrIv239jDy1/Zg/vH/LysD7110/5X8cuSM5VDLD9Rw4ysbkH9e4jdK5NY8jJV7w92bO8h09/IdPfyHT38h09/IdPfrVDvPzHm4s5Y+Vf2UBeG43Vj3kOmBl93Gur5YHUJK3Q05ANXHcDQ+nv5DpdS0HNRas9o29G4lCbWL4I/Mk/xuN1Y95DpeQK61WNPnbs09T8F0XnwSID67ASi8h09/IdLzvROtlR6EXBM0uep1ElqNxurHvIVtn8RgQhrYPBsP/Ndkw+1N+XxvSQnvqawKM4vAsLGtuRoRhofT38ZubHiIKpZLEsyXykTttsvm7S31cG9JO0nvy6+fRT2qsdiNncsctm2IWrxUiOJ/IdPfy6iW8nIkppO8h09/IdPfyHJD0xYSbWlWPemK8AD+/Or3//ze7/6ff/LG29UHW27DEGECA1iOLts1Vj32qPmu4uEP70ezFtHMmvtlBhNJbhdhYL0Rzgh2V1kMP8I4fkhiel7tDZiRWvUi+n/8/VkuaSqvYMa4L0wcDaLzyQQP+o/v33VNCVLEjK2SEbtLw1u7tKV0ajHzqjQSLTfgto0uGJO7LElXVybExGXbRP7YcraDo56+I0woJ3mSlOpYBqtu+v/khwCxxHkvZd5DMXaCrvSJM0+7zzOtpRbfJiX+2dYhNbV/FtlJYBqSI18xyeQv01ZmgBRrDDo94QmMZe7bOmVykTtM9rjgq4e3g/3u9RFO+stFZo9P/Ga4PDY2gcEr138/9J6JjQb+Z+ugWksCIuL2w3/kWDwHBR3+WSBeh1sOXnRdyPs0MOV2XXH+Z/D+BZ57+IyX8jt5IboQoVAl4Hf7ptkSQlcqLGb2wkU3RCBWpqUDqiNEY5Ry6qPyfBbdMN73Uodzi6KoHczts1/IC8PqlUSWffIiA2tqoGkdO993cgXFPqw8MVvPcSWEqV/SvhRSAKU9Y9RCNsjZl9xHfoe0ZzAxwQpJNOV/dSsTaR+IeX8jW+BDIWoRNbENgw4xNVcDiHE5q2jk1aC2YodfJf92wvZQFe3ebDu/ghRvtx0uc2E6A80q3UMnv5xZR3e99M3oE/mnbYApS7aJ+RrvR68y6cAAD06hAACjBdrvdgP8i/DUUoAL4HHgjMv3c7I+1W3nl47kgXltMAdboXEG56aAUmAVXi/HQmsLvfV9eUX93r+etGYsIBW5LSS6/uZffo6MMwLcrzHG0RSzfRjevrwApEodWGSUHxYhftcxpx/3k9dua3qiHE+SS0xp4q0+bEt6Ye28bEeR/A6E8XcoZ57wpnkQRUH91UzjjN+2C5ZRaASoTXrTeg0l9ekcLvKBImZaai1n8OEw2ABTlsiWeI+EVclsG/JmlHfGlXaE8IkBdJVAmdW4gsVWvJzTFxSTpICSVImVJ/ez1rRpjBnaDRPDu1/TS0tQIEjS0G6/GtagnOEnojpiKrQtkjAd+XFgdJhekmYvSa+pH50C1gdGCWfdTxdU+4gM/fUM3BGNwUVy/XfSBD9LeayRyU4AA7jcoh07XpI6evYQ7wVRF69Emaezcf3NLdfi26jCs57r0wc8xDcEhDLGk5WJvek7qGf/Ip+ellIJfxjRDbliRKtSdJV3W4s6wMQ4EX8AFK8s33UonMJU9++tBdZ1qTvA6VavNa8/Wo5CTPVAd4Ps2BXt+OpDr+F0WM2JFNjDS4SssoX7etA/iHxzpW34Uw1Ab837XIjleaudGsZkIKfEoFDdoot97Cje191GHt/iBIrrr477KImov53Ht7G09u1QqLKj+BaKIbieLGtDKUdEoFvHClIe/r1wNwCFeXzbeLoZIhXaMaAfhqvqN8K96++i3iTQNSQMVpRvmXWL6eX4db6OzcAfimsXI1f3l+vloB4lDoubitWE40PG+vSrsQbH0x6N2Kqon4ApKrkNFAbHzIv9KIbj1hgpyRJYGvfYnb/7/IEnw13r0DrAxzN3bRwj2Pq0jt6FfSTYL5f2aOAMf4+NeJTIxZIxVSW+Wq8LWeaq+GG06hCxMQI8LjggVHW+DwxJ3N6s8EcFN4/t4EA9lpCQUsmcts0IwNL2rieDxpsQDgAADOX4XIDMAH0cAAAAAA==" 
                                    alt="Hostinger" 
                                    className="h-12 md:h-16 w-auto opacity-90 hover:opacity-100 transition-opacity"
                                />
                            </div>
                        </div>

                        {/* Título principal */}
                        <h2 className="text-2xl md:text-4xl font-black text-white text-center mb-3 leading-tight">
                            Vencemos o <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">Hostinger Start</span>
                        </h2>

                        {/* Descrição */}
                        <p className="text-base md:text-lg text-gray-300 text-center max-w-2xl mx-auto leading-relaxed">
                            Fomos reconhecidos por <span className="text-white font-bold">impulsionar sonhos de negócio online</span> e transformar vidas através da tecnologia. Esta conquista é de toda a nossa comunidade!
                        </p>

                        {/* Detalhes da conquista */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-8">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="font-semibold text-white">Prêmio Hostinger 2025</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <svg className="w-5 h-5 text-[#8a4add]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <span>Impacto Social Reconhecido</span>
                            </div>
                        </div>

                        {/* CTA opcional */}
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => navigate('/sobre')}
                                className="inline-flex items-center gap-2 text-sm font-semibold text-[#c4b5fd] hover:text-white transition-colors"
                            >
                                Conheça Nossa História
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quem Somos Section - Ajustado Padding */}
            <section className="py-16 md:py-24 relative z-10 border-b border-white/5 bg-black/20">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Quem Somos</h2>
                    <div className="w-20 h-1.5 bg-[#8a4add] mx-auto mt-4 mb-6 rounded-full"></div>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-8">
                        O Instituto FuturoON é um projeto social, no Complexo da Coruja, em São Gonçalo, que leva <strong className="text-[#c4b5fd] font-bold">educação e tecnologia</strong> para jovens e adultos da periferia. Não somos apenas uma escola, somos uma comunidade que impulsiona sonhos.
                    </p>
                    <div>
                        <button onClick={() => navigate('/sobre')} className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-white/20 transition-all duration-300 text-sm uppercase tracking-wide">
                            Conheça nossa história &rarr;
                        </button>
                    </div>
                </div>
            </section>

            {/* Social Impact Section - Cards Maiores */}
            <section className="py-16 md:py-24 bg-black/20 relative z-10" style={{ backgroundImage: 'radial-gradient(circle at center, #8a4add08, transparent 70%)' }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">Nosso Impacto</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-12">Números que representam vidas transformadas e novos futuros escritos.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {impactData.map((item, index) => (
                            <ImpactCard
                                key={index}
                                icon={item.icon}
                                stat={item.stat}
                                title={item.title}
                                text={item.text}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Expanded Statistics Section - NOVO! */}
            <section className="py-16 md:py-24 bg-gradient-to-b from-black/40 via-black/20 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#8a4add]/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#f27983]/10 rounded-full blur-[120px]"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#8a4add]/20 to-[#f27983]/20 border border-[#8a4add]/30 mb-6">
                            <span className="text-sm font-bold text-[#c4b5fd]">Estatísticas Detalhadas</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                            Nosso Ecossistema em Números
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Uma comunidade ativa e engajada construindo o futuro da tecnologia
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 max-w-7xl mx-auto">
                        {/* Comunidade */}
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 md:p-6 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 group">
                            <div className="text-2xl md:text-3xl font-black text-white mb-1">
                                <AnimatedNumber finalStat={`${stats.registeredMembers}`} />
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">Membros Registrados</div>
                            <div className="mt-2 text-[10px] md:text-xs text-[#8a4add] font-semibold">👥 Comunidade</div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 md:p-6 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 group">
                            <div className="text-2xl md:text-3xl font-black text-white mb-1">
                                <AnimatedNumber finalStat={`${stats.forumPosts}`} />
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">Posts no Fórum</div>
                            <div className="mt-2 text-[10px] md:text-xs text-[#f27983] font-semibold">💬 Discussões</div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 md:p-6 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 group">
                            <div className="text-2xl md:text-3xl font-black text-white mb-1">
                                <AnimatedNumber finalStat={`${stats.resolvedDiscussions}`} />
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">Discussões Resolvidas</div>
                            <div className="mt-2 text-[10px] md:text-xs text-[#10b981] font-semibold">✅ Soluções</div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 md:p-6 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 group">
                            <div className="text-2xl md:text-3xl font-black text-white mb-1">
                                <AnimatedNumber finalStat={`${stats.publishedArticles}`} />
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">Artigos Publicados</div>
                            <div className="mt-2 text-[10px] md:text-xs text-[#fbbf24] font-semibold">📝 Conteúdo</div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 md:p-6 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 group">
                            <div className="text-2xl md:text-3xl font-black text-white mb-1">
                                <AnimatedNumber finalStat={`${stats.eventsHeld}`} />
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">Eventos Realizados</div>
                            <div className="mt-2 text-[10px] md:text-xs text-[#c4b5fd] font-semibold">🎉 Eventos</div>
                        </div>

                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] p-4 md:p-6 rounded-2xl border border-white/10 hover:border-[#8a4add]/40 transition-all duration-300 group">
                            <div className="text-2xl md:text-3xl font-black text-white mb-1">
                                <AnimatedNumber finalStat={`${stats.contentHours}`} />
                            </div>
                            <div className="text-xs md:text-sm text-gray-400">Horas de Conteúdo</div>
                            <div className="mt-2 text-[10px] md:text-xs text-[#8a4add] font-semibold">⏱️ Aprendizado</div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate('/sobre')}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm"
                        >
                            Ver Mais Sobre Nós
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Próximos Eventos Section */}
            <section className="py-16 md:py-24 relative z-10 overflow-hidden border-t border-white/5">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8a4add]/5 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f27983]/10 rounded-full blur-[150px]"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-red-500/20 to-purple-500/20 border border-red-500/30 mb-6">
                            <span className="text-sm font-bold text-red-300">🔴 Ao Vivo</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                            Próximos Eventos
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
                            Lives, workshops e palestras com especialistas da comunidade tech
                        </p>
                    </div>

                    {/* Events Grid */}
                    {events.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
                            <div className="text-6xl mb-4">📅</div>
                            <p className="text-gray-400 mb-2">Nenhum evento agendado no momento</p>
                            <p className="text-sm text-gray-500">Fique ligado! Novos eventos em breve.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                                {events.slice(0, 3).map((event) => {
                                    const host = team.find(t => t.id === event.hostId);
                                    const eventTypeColors = {
                                        'Live': 'from-red-500/20 to-red-600/20 border-red-500/30 text-red-300',
                                        'Workshop': 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-300',
                                        'Palestra': 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-300'
                                    };

                                    return (
                                        <div 
                                            key={event.id}
                                            className="group bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 overflow-hidden hover:border-[#8a4add]/40 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#8a4add]/20"
                                        >
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                <img 
                                                    src={event.imageUrl} 
                                                    alt={event.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                                
                                                {/* Event Type Badge */}
                                                <div className="absolute top-3 left-3">
                                                    <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border backdrop-blur-sm bg-gradient-to-r ${eventTypeColors[event.eventType]}`}>
                                                        {event.eventType}
                                                    </span>
                                                </div>

                                                {/* Date Badge */}
                                                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/20">
                                                    <p className="text-xs font-bold text-white">{event.date}</p>
                                                    <p className="text-xs text-gray-400">{event.time}</p>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-[#c4b5fd] transition-colors">
                                                    {event.title}
                                                </h3>
                                                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                                    {event.description}
                                                </p>

                                                {/* Host */}
                                                {host && (
                                                    <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                                                        <img 
                                                            src={host.avatarUrl} 
                                                            alt={host.name}
                                                            className="w-8 h-8 rounded-full border border-white/20"
                                                        />
                                                        <div>
                                                            <p className="text-xs font-bold text-white">{host.name}</p>
                                                            <p className="text-xs text-gray-500">{host.title || 'Instrutor'}</p>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* CTA */}
                                                <button
                                                    onClick={() => navigate(`/eventos/${event.id}`)}
                                                    className="w-full bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 group/btn"
                                                >
                                                    Ver Detalhes
                                                    <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Ver Todos CTA */}
                            {events.length > 3 && (
                                <div className="text-center">
                                    <button
                                        onClick={() => navigate('/eventos')}
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-[#8a4add]/40 transition-all backdrop-blur-sm group"
                                    >
                                        Ver Todos os Eventos ({events.length})
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>

            {/* Como Funciona Section */}
            <section className="py-20 md:py-32 relative z-10 overflow-hidden">
                {/* Background effects */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8a4add]/5 rounded-full blur-[120px] -z-10"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Header */}
                    <div className="text-center mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-6">
                            <svg className="w-4 h-4 text-[#8a4add]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm font-bold text-[#8a4add] uppercase tracking-wider">Seu Caminho</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                            Como Funciona
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Do primeiro clique até sua primeira vaga em tech. Veja como é simples começar sua jornada.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 max-w-6xl mx-auto mb-12">
                        <StepCard
                            number="1"
                            title="Inscreva-se"
                            description="Preencha o formulário de inscrição com seus dados. É rápido, gratuito e sem pegadinhas."
                            icon={
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            }
                        />
                        <StepCard
                            number="2"
                            title="Comece a Estudar"
                            description="Aulas presenciais e online com mentores experientes. Aprenda fazendo projetos reais e construindo seu portfólio."
                            icon={
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            }
                        />
                        <StepCard
                            number="3"
                            title="Conquiste seu Futuro"
                            description="Receba certificado, monte seu portfólio e tenha acesso a vagas exclusivas em empresas parceiras."
                            icon={
                                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            }
                        />
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/cadastro')}
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full text-white font-bold text-lg uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#8a4add]/40 hover:scale-105 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            <span className="relative">Começar Agora</span>
                            <svg className="relative w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                        <p className="text-sm text-gray-500 mt-4">
                            Inscrições abertas • Cursos 100% gratuitos
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 md:py-32 bg-black/20 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-6">
                            <svg className="w-4 h-4 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-bold text-[#8a4add] uppercase tracking-wider">Histórias Reais</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                            Vozes da Quebrada
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Conheça quem já passou por aqui e hoje está construindo uma carreira em tech
                        </p>
                    </div>

                    {/* Testimonials Grid - Dados do JSON */}
                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {testimonials.students.map((student) => (
                            <TestimonialCard
                                key={student.id}
                                name={student.name}
                                role={student.currentRole}
                                company={student.currentCompany}
                                photo={student.photo}
                                quote={student.text}
                            />
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate('/sobre')}
                            className="text-sm font-bold text-[#c4b5fd] hover:text-white uppercase tracking-widest border-b border-[#c4b5fd] hover:border-white pb-1 transition-all"
                        >
                            Ver mais histórias
                        </button>
                    </div>
                </div>
            </section>

            {/* Simplified Timeline Section - Ajustado */}
            <section className="py-16 md:py-24 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Nossa Jornada</h2>
                        <p className="mt-4 text-lg text-gray-400">Passo a passo, construindo um legado.</p>
                    </div>
                    <div className="mt-6 max-w-6xl mx-auto">
                        <SimplifiedTimeline />
                    </div>
                </div>
            </section>

            {/* Team Preview Section - Responsivo: 1 col mobile, 2 col tablet, 4 col desktop */}
            <section className="py-16 md:py-24 bg-black/20 relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white">Nossa Tropa</h2>
                        <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">Os mentores, instrutores e voluntários que fazem a mágica acontecer todos os dias.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 sm:px-0">
                        {teamPreview.length > 0 ? teamPreview.map(member => (
                            <TeamMemberPreviewCard key={member.id} member={member} />
                        )) : (
                            <p className="text-center text-gray-500 col-span-full">Carregando a tropa...</p>
                        )}
                    </div>
                    <div className="text-center mt-12">
                        <button onClick={() => navigate('/equipe')} className="text-sm font-bold text-[#c4b5fd] hover:text-white uppercase tracking-widest border-b border-[#c4b5fd] hover:border-white pb-1 transition-all">
                            Ver equipe completa
                        </button>
                    </div>
                </div>
            </section>

            {/* Nossos Parceiros Section - Design Melhorado */}
            <section className="py-20 md:py-32 relative z-10 overflow-hidden">
                {/* Background com gradiente e efeitos */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-[#8a4add]/5 to-black/20"></div>
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(138, 74, 221, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(242, 121, 131, 0.08) 0%, transparent 50%)'
                }}></div>

                {/* Linha decorativa superior */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a4add]/30 to-transparent"></div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    {/* Header da seção */}
                    <div className="text-center mb-16 md:mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8a4add]/10 border border-[#8a4add]/20 mb-6">
                            <svg className="w-4 h-4 text-[#8a4add]" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-sm font-bold text-[#8a4add] uppercase tracking-wider">Nossos Parceiros</span>
                        </div>

                        <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                            Apoiadores
                        </h2>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            Empresas e organizações que acreditam no poder da educação e tornam este sonho possível
                        </p>
                    </div>

                    {/* Carrossel de logos - Dados do JSON */}
                    <div className="relative mb-16">
                        <PartnerCarousel partners={(partners.length > 0 ? partners : ongPartners.map(p => ({
                            id: p.id,
                            name: p.name,
                            logoUrl: p.logo
                        } as Partner))).map(p => {
                            // Map partner names to their actual logos
                            let logoUrl = p.logoUrl;
                            if (p.name === 'SENAC') logoUrl = senacLogo;
                            else if (p.name === 'SENAI') logoUrl = senaiLogo;
                            else if (p.name === 'Hostinger') logoUrl = hostingerLogo;
                            else if (p.name.includes('UFF') || p.name.includes('IN Junior')) logoUrl = inJuniorLogo;
                            else if (p.name === 'Way2') logoUrl = way2Logo;
                            else if (p.name === 'Craque do Amanhã') logoUrl = craqueDoAmanhaLogo;
                            return { ...p, logoUrl };
                        })} />
                    </div>

                    {/* CTA melhorado */}
                    <div className="text-center">
                        <button
                            onClick={() => navigate('/apoiadores')}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8a4add] to-[#f27983] rounded-full text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 hover:shadow-2xl hover:shadow-[#8a4add]/40 hover:scale-105 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            <span className="relative">Ver todos os parceiros</span>
                            <svg className="relative w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </button>

                        {/* Texto adicional */}
                        <p className="text-sm text-gray-500 mt-6">
                            Quer fazer parte dessa transformação?
                            <button
                                onClick={() => navigate('/parcerias')}
                                className="text-[#8a4add] hover:text-[#c4b5fd] font-semibold ml-2 underline decoration-[#8a4add]/30 hover:decoration-[#8a4add] transition-colors"
                            >
                                Seja um parceiro
                            </button>
                        </p>
                    </div>
                </div>

                {/* Linha decorativa inferior */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8a4add]/30 to-transparent"></div>
            </section>

            {/* CTA Donate Section - Ajustado Padding Mobile */}
            <section className="py-16 md:py-20 bg-black/20 relative z-10" style={{ backgroundImage: 'radial-gradient(circle at center, #8a4add15, transparent 70%)' }}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white mb-6">
                        Apoie essa causa
                    </h2>
                    <p className="mb-10 max-w-2xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed">
                        Invista no futuro. Sua contribuição ajuda a impulsionar a juventude por meio da educação digital.
                    </p>
                    <div>
                        <button
                            onClick={() => navigate('/doar')}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#8a4add] to-[#f27983] text-white font-bold py-4 px-10 rounded-2xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(138,74,221,0.6)] text-lg"
                        >
                            <span>Faça sua doação agora</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" /></svg>
                        </button>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Home;
