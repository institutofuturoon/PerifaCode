import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../contexts/AppContextAdapter';
import {
  getOrCreatePreferences,
  updatePreferences,
  NotificationPreferences,
} from '../utils/smartNotificationService';

interface NotificationPreferencesProps {
  closeModal?: () => void;
}

const NotificationPreferencesComponent: React.FC<NotificationPreferencesProps> = ({ closeModal }) => {
  const { user, showToast } = useAppContext();
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadPrefs = async () => {
      try {
        const preferences = await getOrCreatePreferences(user.id);
        setPrefs(preferences);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
        showToast('❌ Erro ao carregar preferências');
      } finally {
        setLoading(false);
      }
    };

    loadPrefs();
  }, [user?.id]);

  const handleToggle = (key: keyof NotificationPreferences) => {
    if (!prefs) return;
    setPrefs({
      ...prefs,
      [key]: !prefs[key],
    });
  };

  const handleSave = async () => {
    if (!user?.id || !prefs) return;

    setSaving(true);
    try {
      await updatePreferences(user.id, prefs);
      showToast('✅ Preferências salvas com sucesso!');
      closeModal?.();
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      showToast('❌ Erro ao salvar preferências');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !prefs) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#8a4add] border-t-transparent rounded-full mx-auto"></div>
      </div>
    );
  }

  const preferenceOptions = [
    {
      key: 'inAppNotifications' as const,
      label: '📲 Notificações no App',
      description: 'Alertas flutuantes na plataforma',
      icon: '🔔',
    },
    {
      key: 'emailNotifications' as const,
      label: '📧 Notificações por Email',
      description: 'Resumos e alertas importantes',
      icon: '✉️',
    },
    {
      key: 'streakReminders' as const,
      label: '🔥 Lembretes de Streak',
      description: 'Manter sua sequência viva',
      icon: '🔥',
    },
    {
      key: 'lessonReminders' as const,
      label: '📚 Lembretes de Aulas',
      description: 'Não esqueça suas aulas pendentes',
      icon: '📚',
    },
    {
      key: 'badgeNotifications' as const,
      label: '🏆 Notificações de Badges',
      description: 'Quando você desbloquear conquistas',
      icon: '🏆',
    },
    {
      key: 'levelUpNotifications' as const,
      label: '⬆️ Notificações de Level Up',
      description: 'Subir de nível e novas metas',
      icon: '⬆️',
    },
    {
      key: 'inactivityAlerts' as const,
      label: '👋 Alertas de Inatividade',
      description: 'Quando fico sem aprender',
      icon: '👋',
    },
    {
      key: 'weeklyDigest' as const,
      label: '📊 Resumo Semanal',
      description: 'Estatísticas e progresso da semana',
      icon: '📊',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h2 className="text-2xl font-bold text-white mb-2">🔔 Preferências de Notificações</h2>
        <p className="text-gray-400 text-sm">Controle como você recebe atualizações e lembretes</p>
      </div>

      {/* Notification Options */}
      <div className="space-y-3">
        {preferenceOptions.map((option) => (
          <motion.div
            key={option.key}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
              prefs[option.key]
                ? 'bg-[#8a4add]/10 border-[#8a4add]/30'
                : 'bg-white/5 border-white/10 opacity-50'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{option.icon}</span>
              <div>
                <p className="font-semibold text-white">{option.label}</p>
                <p className="text-xs text-gray-400 mt-1">{option.description}</p>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              onClick={() => handleToggle(option.key)}
              className={`relative w-12 h-6 rounded-full transition-all flex-shrink-0 ${
                prefs[option.key] ? 'bg-[#8a4add]' : 'bg-gray-700'
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  left: prefs[option.key] ? '24px' : '2px',
                }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
              />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Time Preference */}
      <div className="border-t border-white/10 pt-6">
        <h3 className="font-semibold text-white mb-4">⏰ Horário Preferido para Lembretes</h3>
        <div className="flex gap-4">
          <input
            type="time"
            value={prefs.reminderTime}
            onChange={(e) => setPrefs({ ...prefs, reminderTime: e.target.value })}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          />
          <select
            value={prefs.timezone}
            onChange={(e) => setPrefs({ ...prefs, timezone: e.target.value })}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
          >
            <option value="America/Sao_Paulo">São Paulo (BRT)</option>
            <option value="America/Brasilia">Brasília (BRT)</option>
            <option value="America/Bahia">Bahia (BRT)</option>
            <option value="America/Porto_Velho">Porto Velho (AMT)</option>
            <option value="America/Manaus">Manaus (AMT)</option>
            <option value="America/Belem">Belém (AMT)</option>
            <option value="America/Fortaleza">Fortaleza (BRT)</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-white/10 pt-6 flex gap-3 justify-end">
        {closeModal && (
          <button
            onClick={closeModal}
            className="px-6 py-2 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-all"
          >
            Cancelar
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 rounded-lg bg-[#8a4add] text-white font-semibold hover:bg-[#7c3aed] transition-all disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar Preferências'}
        </button>
      </div>
    </div>
  );
};

export default NotificationPreferencesComponent;
