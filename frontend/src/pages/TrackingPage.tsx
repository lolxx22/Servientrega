import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Package, MapPin, Clock, Calendar, FileText, Truck, CheckCircle, CircleDot, AlertCircle } from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { shipmentService } from '../services/shipment.service';
import type { TrackingInfo } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';

export const TrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('guia') || '');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsLoading(true);
    setError('');
    setTrackingInfo(null);

    try {
      const info = await shipmentService.trackByNumber(trackingNumber);
      setTrackingInfo(info);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } };
      setError(axiosError.response?.data?.error?.message || 'Guía no encontrada');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'PENDING':
        return {
          label: 'Pendiente',
          variant: 'warning' as const,
          icon: Clock,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          dotColor: 'bg-warning',
        };
      case 'IN_TRANSIT':
        return {
          label: 'En Tránsito',
          variant: 'info' as const,
          icon: Truck,
          color: 'text-info',
          bgColor: 'bg-info/10',
          dotColor: 'bg-info',
        };
      case 'DELIVERED':
        return {
          label: 'Entregado',
          variant: 'success' as const,
          icon: CheckCircle,
          color: 'text-success',
          bgColor: 'bg-success/10',
          dotColor: 'bg-success',
        };
      case 'CANCELLED':
        return {
          label: 'Cancelado',
          variant: 'danger' as const,
          icon: AlertCircle,
          color: 'text-danger',
          bgColor: 'bg-danger/10',
          dotColor: 'bg-danger',
        };
      default:
        return {
          label: status,
          variant: 'default' as const,
          icon: CircleDot,
          color: 'text-neutral-500',
          bgColor: 'bg-neutral-100',
          dotColor: 'bg-neutral-400',
        };
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-green-600/10 text-brand-green-600 text-xs font-semibold tracking-wider uppercase mb-4">
              <Package className="w-3.5 h-3.5" />
              Rastreo
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight mb-3 font-display">
              Rastreo de Envíos
            </h1>
            <p className="text-neutral-500 text-lg">
              Ingresa tu número de guía para conocer el estado de tu envío
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-2 flex gap-2">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Ej: SV-123456"
                className="flex-1 h-12 px-4 bg-transparent text-neutral-900 placeholder-neutral-400 text-sm outline-none font-mono"
              />
              <Button
                type="submit"
                size="lg"
                isLoading={isLoading}
                leftIcon={!isLoading ? <Search className="w-4 h-4" /> : undefined}
                className="rounded-xl"
              >
                {isLoading ? 'Buscando...' : 'Rastrear'}
              </Button>
            </div>
          </motion.form>

          {/* Loading */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center py-16"
              >
                <Spinner size="lg" />
                <p className="mt-4 text-sm text-neutral-400">Buscando información del envío...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center gap-3 bg-danger/5 border border-danger/20 text-danger px-5 py-4 rounded-2xl mb-6"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{error}</p>
                  <p className="text-xs text-danger/70 mt-0.5">Verifica el número de guía e intenta nuevamente.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tracking Result */}
          <AnimatePresence>
            {trackingInfo && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Status Header Card */}
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 ${getStatusConfig(trackingInfo.estado).bgColor} rounded-2xl flex items-center justify-center`}>
                          {(() => {
                            const StatusIcon = getStatusConfig(trackingInfo.estado).icon;
                            return <StatusIcon className={`w-7 h-7 ${getStatusConfig(trackingInfo.estado).color}`} />;
                          })()}
                        </div>
                        <div>
                          <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Número de guía</p>
                          <h2 className="text-xl font-bold text-neutral-900 tracking-tight font-mono">
                            {trackingInfo.numeroGuia}
                          </h2>
                        </div>
                      </div>
                      <Badge variant={getStatusConfig(trackingInfo.estado).variant} size="md" dot>
                        {getStatusConfig(trackingInfo.estado).label}
                      </Badge>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="px-6 pb-6 grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                      <div className="w-9 h-9 bg-brand-green-600/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-brand-green-600" />
                      </div>
                      <div>
                        <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Ubicación Actual</p>
                        <p className="text-sm font-semibold text-neutral-900 mt-0.5">{trackingInfo.ubicacion}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                      <div className="w-9 h-9 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-info" />
                      </div>
                      <div>
                        <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Última Actualización</p>
                        <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                          {new Date(trackingInfo.fechaUltimaActualizacion).toLocaleDateString('es-EC', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    {trackingInfo.fechaEstimadaEntrega && (
                      <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                        <div className="w-9 h-9 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-4 h-4 text-success" />
                        </div>
                        <div>
                          <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Entrega Estimada</p>
                          <p className="text-sm font-semibold text-neutral-900 mt-0.5">
                            {new Date(trackingInfo.fechaEstimadaEntrega).toLocaleDateString('es-EC', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl">
                      <div className="w-9 h-9 bg-brand-fuchsia-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-4 h-4 text-brand-fuchsia-500" />
                      </div>
                      <div>
                        <p className="text-[11px] text-neutral-400 font-medium uppercase tracking-wider">Descripción</p>
                        <p className="text-sm font-semibold text-neutral-900 mt-0.5">{trackingInfo.descripcion}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-6">Historial de Movimientos</h3>

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-green-600 via-neutral-200 to-neutral-100" />

                    {/* Timeline items */}
                    <div className="space-y-6">
                      {[
                        {
                          status: trackingInfo.estado,
                          location: trackingInfo.ubicacion,
                          date: trackingInfo.fechaUltimaActualizacion,
                          description: trackingInfo.descripcion,
                          isLatest: true,
                        },
                      ].map((item, index) => {
                        const config = getStatusConfig(item.status);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-4"
                          >
                            {/* Dot */}
                            <div className={`relative z-10 w-[38px] h-[38px] ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0 ${item.isLatest ? 'ring-4 ring-white shadow-md' : ''}`}>
                              <div className={`w-3 h-3 ${config.dotColor} rounded-full ${item.isLatest ? 'animate-pulse' : ''}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                                {item.isLatest && (
                                  <span className="text-[10px] font-bold text-brand-green-600 bg-brand-green-600/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    Actual
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-neutral-600">{item.description}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {item.location}
                                </span>
                                <span className="text-xs text-neutral-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(item.date).toLocaleDateString('es-EC', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!trackingInfo && !isLoading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 bg-brand-green-400/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
                <Package className="w-10 h-10 text-brand-green-400" />
              </div>
              <p className="text-neutral-500 font-medium">Ingresa un número de guía para comenzar</p>
              <p className="text-sm text-neutral-400 mt-1 font-mono">Ejemplo: SV-123456</p>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
