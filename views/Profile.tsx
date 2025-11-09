import React from 'react';
import { useAppContext } from '../App';

const Profile: React.FC = () => {
  const { user, handleLogout } = useAppContext();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-3xl mx-auto bg-black/20 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl shadow-[#8a4add]/10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          <div className="flex-shrink-0">
            <img className="h-32 w-32 rounded-full border-4 border-[#8a4add]" src={user.avatarUrl} alt={user.name} />
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-white">{user.name}</h1>
            <p className="text-md text-[#c4b5fd]">{user.email}</p>
            <p className="mt-4 text-gray-300">{user.bio}</p>
             <div className="mt-4 flex items-center justify-center sm:justify-start gap-4">
                {user.githubUrl && (
                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                        </svg>
                    </a>
                )}
                 {user.linkedinUrl && (
                    <a href={user.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                        </svg>
                    </a>
                )}
            </div>
          </div>
        </div>
        
        <div className="mt-10 border-t border-white/10 pt-8">
            <h2 className="text-xl font-bold text-white mb-4">Configurações da Conta</h2>
            <form className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome Completo</label>
                    <input type="text" name="name" id="name" defaultValue={user.name} className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all" />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input type="email" name="email" id="email" defaultValue={user.email} className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all" />
                </div>
                 <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1">Sua Bio</label>
                    <textarea rows={3} name="bio" id="bio" defaultValue={user.bio} className="appearance-none relative block w-full px-4 py-3 border border-white/10 bg-white/5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8a4add] focus:border-[#8a4add] sm:text-sm transition-all" />
                </div>
                <div className="flex justify-end">
                     <button type="submit" className="bg-gradient-to-r from-[#6d28d9] to-[#8a4add] text-white font-bold py-2 px-6 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg shadow-[#8a4add]/20 hover:shadow-[#8a4add]/40">
                        Salvar Alterações
                    </button>
                </div>
            </form>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                 <h3 className="text-lg font-bold text-red-400">Desconectar Conta</h3>
                 <p className="text-sm text-gray-400 max-w-md">Ao sair, você precisará inserir suas credenciais novamente para acessar seu painel.</p>
            </div>
            <button
                onClick={handleLogout}
                className="w-full sm:w-auto flex-shrink-0 bg-red-500/10 text-red-400 font-semibold py-2 px-6 rounded-lg border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-colors"
            >
                Sair
            </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;