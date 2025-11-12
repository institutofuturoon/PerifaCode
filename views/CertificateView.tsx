import React, { useRef, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Logo } from '../assets/Logo';
import { useAppContext } from '../App';

const CertificateView: React.FC = () => {
  const { courses, user, instructors } = useAppContext();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const course = useMemo(() => courses.find(c => c.id === courseId), [courses, courseId]);
  const instructor = useMemo(() => {
    if (!course) return null;
    return instructors.find(inst => inst.id === course.instructorId);
  }, [course, instructors]);

  const certificateRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!course || !user) {
    return <div className="text-center py-20">Informações do certificado indisponíveis.</div>;
  }

  const completionDate = new Date().toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const handleDownload = () => {
    if (!certificateRef.current) return;
    setIsDownloading(true);

    html2canvas(certificateRef.current, { 
        backgroundColor: '#1a1a1a', // Um fundo similar, caso haja transparências
        scale: 2 // Aumenta a resolução da imagem gerada
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `Certificado-FuturoOn-${course.title.replace(/ /g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(false);
    }).catch(err => {
        console.error("Erro ao gerar certificado: ", err);
        alert("Ocorreu um erro ao tentar baixar o certificado.");
        setIsDownloading(false);
    });
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center p-4 aurora-background">
      <div 
        ref={certificateRef}
        className="w-full max-w-4xl bg-gray-900/50 backdrop-blur-xl rounded-lg border border-[#8a4add]/30 shadow-2xl shadow-[#8a4add]/20 p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-50"></div>
        <div className="relative z-10 text-center">
          <div className="flex justify-center mb-6">
            <Logo className="h-12" />
          </div>
          
          <h1 className="text-4xl font-black text-white">Certificado de Conclusão</h1>
          <p className="mt-4 text-lg text-gray-300">Este certificado é concedido a</p>

          <p className="my-8 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#8a4add] to-[#c4b5fd]">
            {user.name}
          </p>

          <p className="text-lg text-gray-300">por ter concluído com sucesso o curso</p>
          <h2 className="mt-2 mb-8 text-3xl font-bold text-white">{course.title}</h2>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-12 border-t border-white/10 pt-8">
              {instructor && (
                <div className="text-left">
                    <p className="font-bold text-white">{instructor.name}</p>
                    <p className="text-sm text-gray-400">{instructor.title}</p>
                </div>
              )}
               <div className="text-center my-4 sm:my-0">
                  <p className="font-bold text-white">{completionDate}</p>
                  <p className="text-sm text-gray-400">Data de Emissão</p>
              </div>
              <div className="text-right">
                  <p className="font-mono text-xs text-gray-500">ID: CERT-{course.id.toUpperCase()}-{user.id.toUpperCase()}</p>
              </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex gap-4">
        <button
            onClick={() => navigate('/dashboard')}
            className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/20 transition-all duration-300"
        >
            &larr; Voltar ao Painel
        </button>
         <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
            {isDownloading ? 'Baixando...' : 'Baixar Certificado'}
        </button>
      </div>
    </div>
  );
};

export default CertificateView;