import React from 'react';
import { useAppContext } from '../App';

const TermsOfUseView: React.FC = () => {
    const { navigate } = useAppContext();
    const sectionClasses = "mb-10";
    const h2Classes = "text-2xl font-bold text-white mb-4";
    const pClasses = "text-gray-300 leading-relaxed mb-4";

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto prose prose-invert">
                <header className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                        Termos de Uso
                    </h1>
                    <p className="mt-4 text-lg text-gray-400">
                        As regras do jogo para a gente construir um futuro gigante juntos.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">Última atualização: 20 de Julho, 2024</p>
                </header>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>1. Bem-vindo(a) à PerifaCode!</h2>
                    <p className={pClasses}>
                        Ao criar sua conta e usar nossa plataforma, você concorda com estes termos. Eles são importantes porque protegem tanto você quanto o nosso projeto. A PerifaCode é um espaço de aprendizado e respeito, e contamos com você para mantê-lo assim.
                    </p>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>2. Sua Conta</h2>
                    <p className={pClasses}>Você é responsável por sua conta e por tudo que acontece nela. Mantenha sua senha segura e não a compartilhe. A PerifaCode é para seu uso pessoal e de aprendizado.</p>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>3. Código de Conduta da Comunidade</h2>
                    <p className={pClasses}>Nossa comunidade é nosso maior ativo. Ao interagir nos fóruns, projetos e eventos, você concorda em:</p>
                    <ul className="list-disc list-inside text-gray-300 space-y-2">
                        <li><strong>Ser Respeitoso(a):</strong> Trate todos com respeito. Não toleramos assédio, discriminação, discurso de ódio ou qualquer tipo de intimidação.</li>
                        <li><strong>Colaborar, não Copiar:</strong> Incentive a troca de ideias, mas não plagie o trabalho de outros. O objetivo é aprender. Publique apenas projetos e códigos que você criou.</li>
                        <li><strong>Manter o Foco:</strong> Use os canais para discutir tecnologia, carreira e os cursos da plataforma. Evite spam ou publicidade.</li>
                        <li><strong>Ser Verdadeiro(a):</strong> Não se passe por outra pessoa nem forneça informações falsas.</li>
                    </ul>
                    <p className={`${pClasses} mt-4`}>
                        A violação deste código de conduta pode levar à suspensão ou exclusão da sua conta, pois a segurança e o respeito em nossa comunidade são inegociáveis.
                    </p>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>4. Conteúdo e Propriedade Intelectual</h2>
                    <p className={pClasses}>
                        Todo o conteúdo dos cursos, textos, vídeos e materiais da plataforma pertence ao Instituto FuturoOn e nossos instrutores. Você tem uma licença para usar esse conteúdo para seu aprendizado pessoal, mas não pode reproduzi-lo, distribuí-lo ou vendê-lo.
                    </p>
                    <p className={pClasses}>
                        Os projetos que você cria e posta no Showcase são seus, mas ao publicá-los, você nos dá permissão para exibi-los na plataforma como exemplo e inspiração para a comunidade.
                    </p>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>5. Mudanças nos Termos</h2>
                    <p className={pClasses}>
                        O mundo da tecnologia muda rápido, e nossa plataforma também. Podemos atualizar estes termos de tempos em tempos. Quando isso acontecer, avisaremos você. Ao continuar usando a PerifaCode, você concorda com as novas regras.
                    </p>
                </div>

                <div className={sectionClasses}>
                    <h2 className={h2Classes}>6. Contato</h2>
                    <p className={pClasses}>
                        Se tiver qualquer dúvida sobre estes termos, entre em contato conosco. O papo é reto:
                        <a href="mailto:contato@futuroon.com" className="text-purple-400 hover:underline ml-2">contato@futuroon.com</a>.
                    </p>
                    <p className={pClasses}>
                        Para entender como lidamos com seus dados, por favor, leia nossa {' '}
                        <button onClick={() => navigate('privacy')} className="text-purple-400 hover:underline">
                            Política de Privacidade
                        </button>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfUseView;