/**
 * 📋 EXEMPLO DE USO DOS DADOS CENTRALIZADOS
 * 
 * Este componente mostra como usar os dados do ongData.json
 * Copie os exemplos para suas páginas!
 */

import React from 'react';
import { useOngData, useStatistics, useActivePartners, useFeaturedTestimonials } from '../hooks/useOngData';

const OngDataExample: React.FC = () => {
  // 1️⃣ USAR TODOS OS DADOS
  const allData = useOngData();
  
  // 2️⃣ USAR APENAS ESTATÍSTICAS
  const stats = useStatistics();
  
  // 3️⃣ USAR APENAS PARCEIROS ATIVOS
  const partners = useActivePartners();
  
  // 4️⃣ USAR DEPOIMENTOS EM DESTAQUE
  const testimonials = useFeaturedTestimonials();

  return (
    <div className="bg-[#09090B] text-white p-8 space-y-12">
      
      {/* EXEMPLO 1: Informações da Organização */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          1️⃣ Informações da Organização
        </h2>
        <div className="bg-white/5 p-6 rounded-xl">
          <h3 className="text-2xl font-bold">{allData.organization.name}</h3>
          <p className="text-gray-400 italic">{allData.organization.slogan}</p>
          <p className="mt-4">{allData.organization.mission}</p>
          
          <div className="mt-4">
            <h4 className="font-bold mb-2">Valores:</h4>
            <ul className="list-disc list-inside space-y-1">
              {allData.organization.values.map((value, i) => (
                <li key={i} className="text-gray-300">{value}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* EXEMPLO 2: Estatísticas */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          2️⃣ Estatísticas (para cards de impacto)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-4xl font-black text-[#8a4add]">+{stats.peopleImpacted}</p>
            <p className="text-sm text-gray-400">Pessoas Impactadas</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-4xl font-black text-[#f27983]">+{stats.graduatedStudents}</p>
            <p className="text-sm text-gray-400">Alunos Formados</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-4xl font-black text-[#4ade80]">{stats.employmentRate}%</p>
            <p className="text-sm text-gray-400">Taxa de Emprego</p>
          </div>
          <div className="bg-white/5 p-4 rounded-xl text-center">
            <p className="text-4xl font-black text-[#c4b5fd]">+{stats.activePartners}</p>
            <p className="text-sm text-gray-400">Parceiros Ativos</p>
          </div>
        </div>
      </section>

      {/* EXEMPLO 3: Parceiros */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          3️⃣ Parceiros (para carrossel)
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {partners.map(partner => (
            <div key={partner.id} className="flex-shrink-0 bg-white/5 p-6 rounded-xl border border-white/10 w-64">
              <img 
                src={partner.logo} 
                alt={partner.name}
                className="w-full h-20 object-contain mb-4"
              />
              <h3 className="font-bold">{partner.name}</h3>
              <p className="text-sm text-gray-400">{partner.sector}</p>
              <p className="text-xs text-gray-500 mt-2">{partner.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXEMPLO 4: Depoimentos de Alunos */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          4️⃣ Depoimentos de Alunos
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.students.map(student => (
            <div key={student.id} className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={student.photo} 
                  alt={student.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{student.name}</h3>
                  <p className="text-sm text-gray-400">{student.currentRole}</p>
                  <p className="text-xs text-[#8a4add]">{student.currentCompany}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{student.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXEMPLO 5: Depoimentos de Parceiros */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          5️⃣ Depoimentos de Parceiros
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {testimonials.partners.map(partner => (
            <div key={partner.id} className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={partner.photo} 
                  alt={partner.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{partner.name}</h3>
                  <p className="text-sm text-gray-400">{partner.role}</p>
                  <p className="text-xs text-[#8a4add]">{partner.company}</p>
                </div>
              </div>
              <p className="text-gray-300 italic">"{partner.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXEMPLO 6: Equipe */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          6️⃣ Fundadora e Equipe
        </h2>
        
        {/* Fundadora */}
        <div className="bg-gradient-to-br from-[#8a4add]/20 to-[#f27983]/20 p-6 rounded-xl mb-6 border border-[#8a4add]/30">
          <div className="flex items-center gap-6">
            <img 
              src={allData.founder.photo} 
              alt={allData.founder.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#8a4add]"
            />
            <div>
              <h3 className="text-2xl font-bold">{allData.founder.name}</h3>
              <p className="text-[#c4b5fd] font-semibold">{allData.founder.role}</p>
              <p className="text-sm text-gray-400">{allData.founder.specialty}</p>
            </div>
          </div>
          <p className="mt-4 text-gray-300">{allData.founder.bio}</p>
        </div>

        {/* Equipe */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allData.team.map(member => (
            <div key={member.id} className="bg-white/5 p-4 rounded-xl text-center">
              <img 
                src={member.photo} 
                alt={member.name}
                className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
              />
              <h3 className="font-bold">{member.name}</h3>
              <p className="text-sm text-[#8a4add]">{member.role}</p>
              <p className="text-xs text-gray-400 mt-2">{member.specialty}</p>
            </div>
          ))}
        </div>
      </section>

      {/* EXEMPLO 7: Contato */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          7️⃣ Informações de Contato
        </h2>
        <div className="bg-white/5 p-6 rounded-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-bold mb-2">Emails:</h4>
              <p className="text-sm text-gray-400">Geral: {allData.contact.emails.general}</p>
              <p className="text-sm text-gray-400">Parcerias: {allData.contact.emails.partnerships}</p>
              <p className="text-sm text-gray-400">Suporte: {allData.contact.emails.support}</p>
            </div>
            <div>
              <h4 className="font-bold mb-2">Telefones:</h4>
              <p className="text-sm text-gray-400">Principal: {allData.contact.phones.main}</p>
              <p className="text-sm text-gray-400">WhatsApp: {allData.contact.phones.whatsapp}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-bold mb-2">Redes Sociais:</h4>
            <div className="flex gap-4">
              <a href={allData.contact.socialMedia.instagram} className="text-[#8a4add] hover:text-[#c4b5fd]">Instagram</a>
              <a href={allData.contact.socialMedia.linkedin} className="text-[#8a4add] hover:text-[#c4b5fd]">LinkedIn</a>
              <a href={allData.contact.socialMedia.facebook} className="text-[#8a4add] hover:text-[#c4b5fd]">Facebook</a>
              <a href={allData.contact.socialMedia.youtube} className="text-[#8a4add] hover:text-[#c4b5fd]">YouTube</a>
            </div>
          </div>
        </div>
      </section>

      {/* EXEMPLO 8: Cases de Sucesso */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-[#8a4add]">
          8️⃣ Cases de Sucesso (para página Parcerias)
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {allData.successCases.map(caseItem => (
            <div key={caseItem.id} className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-bold mb-2">{caseItem.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{caseItem.companySize}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                {caseItem.stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-black text-[#8a4add]">{stat.value}</p>
                    <p className="text-xs text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-gray-300 italic mb-4">"{caseItem.testimonial}"</p>
              
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8a4add] to-[#f27983] flex items-center justify-center">
                  <span className="text-sm font-bold">{caseItem.authorName.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-sm font-bold">{caseItem.authorName}</p>
                  <p className="text-xs text-gray-400">{caseItem.authorRole}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CÓDIGO DE EXEMPLO */}
      <section className="bg-[#18181B] p-6 rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-[#4ade80]">
          💻 Como usar no seu código:
        </h2>
        <pre className="text-sm text-gray-300 overflow-x-auto">
{`import { useOngData, useStatistics } from '../hooks/useOngData';

function MeuComponente() {
  const data = useOngData();
  const stats = useStatistics();
  
  return (
    <div>
      <h1>{data.organization.name}</h1>
      <p>{stats.peopleImpacted} pessoas impactadas</p>
    </div>
  );
}`}
        </pre>
      </section>

    </div>
  );
};

export default OngDataExample;
