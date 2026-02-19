import { useEffect, useState } from "react";
import api from "../../service/api_Authorization";
import { Settings, Search, Edit, Trash2, Sliders } from "lucide-react";
import SettingsModal from "./SettingsModal";

const keyTranslations = {
    company_name: "Nombre de la Empresa",
    company_address: "Dirección",
    company_email: "Correo Electrónico",
    company_phone: "Teléfono de Contacto",
    default_currency: "Moneda Principal",
    iva_rate: "Tasa de IVA",
    exchange_rate_usd: "Tasa de Cambio (USD)",
    exchange_rate_ves: "Tasa de Cambio (VES)"
};

export default function SettingsPage() {
    const [settings, setSettings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSetting, setSelectedSetting] = useState(null);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await api.get("/settings");
            setSettings(response.data?.data ?? response.data ?? []);
        } catch (err) {
            setError(err?.response?.status === 401 ? "Sesión expirada" : "Error al cargar configuraciones");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const openModal = (setting = null ) => {
        setSelectedSetting(setting);
        setIsModalOpen(true);
    }

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-workshop-red"></div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* HEADER SECTION */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-gray-900 uppercase">
                        Configuraciones <span className="text-workshop-red">Del Local</span>
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">
                        Arreglo de manejos diarios del programa.
                    </p>
                </div>

                {error && (
                    <div className="text-[10px] font-black uppercase tracking-widest text-workshop-red bg-red-50 px-3 py-2 rounded-lg border border-red-100">
                        {error}
                    </div>
                )}
            </div>

            {/* MOBILE LIST VIEW (Visible solo en < lg) */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
                {settings.map((setting) => (
                    <div key={setting.key} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-start">
                            <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">
                                {keyTranslations[setting.key] || setting.key}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(setting)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit size={16} /></button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-lg font-bold text-workshop-red tracking-tighter uppercase italic">
                                {setting.value}
                            </div>
                            <div className="text-xs text-gray-500 font-medium leading-tight">
                                {setting.description || "Sin descripción disponible."}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* DESKTOP TABLE VIEW (Oculta en móviles) */}
            <div className="grid grid-cols-3 gap-3 lg:grid">
                {settings.map((setting) => (
                    <div key={setting.key} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center">
                            <h3 className="font-black text-gray-900 uppercase tracking-tight text-sm">
                                {keyTranslations[setting.key] || setting.key}
                            </h3>
                            <div className="flex gap-2">
                                <button onClick={() => openModal(setting)} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit size={16} /></button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-lg font-bold text-workshop-red tracking-tighter uppercase">
                                {setting.value}
                            </div>
                            <div className="text-xs text-gray-500 font-medium leading-tight">
                                {setting.description || "Sin descripción disponible."}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* EMPTY STATE */}
            {settings.length === 0 && !loading && (
                <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-400 mb-4">
                        <Sliders size={32} />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-tighter">No hay configuraciones disponibles.</p>
                </div>
            )}

            {isModalOpen && (
                <SettingsModal
                    settingData={selectedSetting}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => {
                    setIsModalOpen(false);
                    fetchSettings();
                    }}
                />
            )}
        </div>
    );
}