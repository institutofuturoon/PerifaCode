

import React from 'react';

const PrivacyPolicyView: React.FC = () => {
    const sectionClasses = "mb-10";
    const h2Classes = "text-2xl font-bold text-white mb-4";
    const pClasses = "text-gray-300 leading-relaxed mb-4";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto prose prose-invert">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Política de Privacidade
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        Seu corre é seu. Entenda como cuidamos dos seus dados.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Última atualização: 20 de Julho, 2024</p>
                </header>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>1. Nosso Compromisso</h2>
                    <p className={pClasses}>
                        O Instituto FuturoOn ("nós", "nosso") leva sua privacidade a sério. Esta política explica de forma clara e direta quais informações coletamos, como as usamos e como as mantemos seguras. Nosso objetivo é ser a ponte para o seu futuro na tecnologia, e a confiança é a base dessa construção.
                    </p>
                </div>
                
                <div className={sectionClasses}>
                    <h2 className={h2Classes}>2. Quais Dados Coletamos?</h2>
                    <p className={pClasses}>
                        Para te oferecer a melhor experiência na plataforma, coletamos algumas informações:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li><strong>Informações que você nos fornece:</strong> Nome, email, senha, e informações do seu perfil (bio, foto, links de redes sociais, etc.) quando você cria sua conta.</li>
                        <li><strong>Informações do seu progresso:</strong> Cursos que você inicia, aulas que completa, exercícios que faz e projetos que submete. Isso nos ajuda a entender sua jornada e a melhorar a plataforma.</li>
                        <li><strong>Informações de uso:</strong> Como você interage com a plataforma, quais páginas visita e por quanto tempo. Usamos isso para tornar a PerifaCode mais intuitiva e eficaz.</li>
                    </ul>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>3. Como Usamos Seus Dados?</h2>
                    <p className={pClasses}>
                        Seus dados são usados para:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li>Personalizar sua experiência de aprendizado, como recomendar cursos e mostrar seu progresso.</li>
                        <li>Comunicar com você sobre novidades, eventos e oportunidades relevantes.</li>
                        <li>Operar, manter e melhorar a plataforma PerifaCode.</li>
                        <li>Conectar você a oportunidades de emprego com nossas empresas parceiras, mas <strong>somente com a sua autorização explícita</strong>.</li>
                    </ul>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>4. Compartilhamento de Informações</h2>
                    <p className={pClasses}>
                        A regra é clara: <strong>não vendemos seus dados.</strong> O compartilhamento é feito de forma responsável e apenas quando necessário:
                    </p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li><strong>Com a Comunidade:</strong> Seu nome, foto e projetos submetidos são visíveis para outros usuários no Showcase da Comunidade para promover a interação e inspiração.</li>
                        <li><strong>Com Empresas Parceiras:</strong> Com seu consentimento, podemos compartilhar seu perfil com empresas que buscam talentos como você. Você sempre terá o controle sobre esse processo.</li>
                        <li><strong>Para Cumprir a Lei:</strong> Se formos obrigados por lei ou por uma ordem judicial, podemos ter que compartilhar informações.</li>
                    </ul>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>5. Segurança</h2>
                    <p className={pClasses}>
                        Usamos as melhores práticas e tecnologias para proteger suas informações contra acesso não autorizado, alteração ou destruição. A segurança do seu corre é a nossa prioridade.
                    </p>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>6. Seus Direitos</h2>
                    <p className={pClasses}>
                        Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento. Você pode gerenciar a maioria das suas informações diretamente na página do seu perfil.
                    </p>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>7. Contato</h2>
                    <p className={pClasses}>
                        Se tiver qualquer dúvida sobre esta política, mande a real pra gente. Nosso email de contato é:
                        <a href="mailto:privacidade@futuroon.com" className="text-purple-400 hover:underline ml-2">privacidade@futuroon.com</a>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyView;