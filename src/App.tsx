import React, { useState } from 'react';
import { ShoppingCart, Package, Bell, Send, Info, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [catalogStatus, setCatalogStatus] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const createOrder = async () => {
    setLoading(true);
    setOrderStatus(null);
    setCatalogStatus(null);
    setNotificationStatus(null);
    
    try {
      console.log('[UI] Triggering order creation...');
      
      // Simulating the API call to Order Service
      setTimeout(() => {
        setOrderStatus('Pedido Criado! Enviando para o RabbitMQ...');
        setLoading(false);

        // Simulating Catalog Service receiving the event
        setTimeout(() => {
          setCatalogStatus('Pedido recebido');
        }, 800);

        // Simulating Notification Service receiving the event
        setTimeout(() => {
          setNotificationStatus('Pedido recebido');
        }, 1200);

      }, 1000);
    } catch (error) {
      console.error('Error creating order:', error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            Microservices Lab: E-commerce
          </motion.h1>
          <p className="text-slate-500 max-w-2xl mx-auto">
            Aprenda como serviços independentes se comunicam usando RabbitMQ e mensageria assíncrona.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Order Service Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4 text-indigo-600">
              <ShoppingCart size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Order Service</h3>
            <p className="text-sm text-slate-500 mb-4">
              Recebe pedidos e publica eventos no RabbitMQ.
            </p>
            <button 
              onClick={createOrder}
              disabled={loading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={16} />
              {loading ? 'Processando...' : 'Criar Pedido'}
            </button>
          </div>

          {/* Catalog Service Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-4 text-emerald-600">
              <Package size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Catalog Service</h3>
            <p className="text-sm text-slate-500">
              Escuta eventos de pedido e atualiza o estoque local.
            </p>
            {catalogStatus && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-4 py-1 px-3 bg-emerald-500 text-white text-xs font-bold rounded-full inline-block"
              >
                {catalogStatus}
              </motion.div>
            )}
          </div>

          {/* Notification Service Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4 text-amber-600">
              <Bell size={24} />
            </div>
            <h3 className="font-semibold text-lg mb-2">Notification Service</h3>
            <p className="text-sm text-slate-500">
              Escuta eventos e envia alertas/emails aos clientes.
            </p>
            {notificationStatus && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mt-4 py-1 px-3 bg-amber-500 text-white text-xs font-bold rounded-full inline-block"
              >
                {notificationStatus}
              </motion.div>
            )}
          </div>
        </div>

        {orderStatus && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-center font-medium"
          >
            {orderStatus}
          </motion.div>
        )}

        <section className="bg-slate-900 text-white p-8 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Info className="text-indigo-400" />
            <h2 className="text-2xl font-bold">Diagrama de Fluxo</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-semibold text-indigo-300">Criação do Pedido</h4>
                <p className="text-slate-400 text-sm">O <strong>Order Service</strong> recebe uma requisição HTTP POST, salva o pedido em memória e publica uma mensagem no exchange <code>order_events</code> do RabbitMQ.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-semibold text-slate-300">Distribuição (Fanout)</h4>
                <p className="text-slate-400 text-sm">O RabbitMQ recebe a mensagem e a replica para todas as filas conectadas ao exchange <code>order_events</code>.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-semibold text-emerald-300">Processamento Assíncrono</h4>
                <p className="text-slate-400 text-sm">O <strong>Catalog Service</strong> e o <strong>Notification Service</strong> recebem a mensagem simultaneamente. Um atualiza o estoque e o outro envia o email, sem que o Order Service precise esperar por eles.</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-800">
            <h4 className="text-sm font-mono text-indigo-400 mb-2 uppercase tracking-widest">Como Rodar Localmente</h4>
            <code className="block bg-black p-4 rounded-lg text-xs font-mono text-slate-300">
              docker-compose up --build
            </code>
          </div>
        </section>

        <section className="mt-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Package className="text-indigo-600" />
            Esquema de Testes e Consistência
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">1. Testes de Integração (Order)</h4>
              <p className="text-slate-500 text-sm mb-4">
                Garante que o endpoint de pedidos não apenas salva o dado, mas também interage corretamente com o driver do RabbitMQ.
              </p>
              <ul className="text-xs font-mono bg-slate-50 p-3 rounded-lg space-y-1">
                <li>• Mock amqplib</li>
                <li>• Supertest POST /orders</li>
                <li>• Expect channel.publish()</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-3">2. Testes de Consistência Eventual</h4>
              <p className="text-slate-500 text-sm mb-4">
                Valida se a lógica de negócio (estoque e notificações) reage corretamente aos payloads de eventos recebidos.
              </p>
              <ul className="text-xs font-mono bg-slate-50 p-3 rounded-lg space-y-1">
                <li>• Unit: Stock reduction logic</li>
                <li>• Unit: Email formatting</li>
                <li>• Integration: Message ACK handling</li>
              </ul>
            </div>
          </div>

            <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-sm text-amber-800 italic">
              "Em sistemas distribuídos, a consistência é garantida pelo <strong>ACK (Acknowledgment)</strong> do RabbitMQ. Se um serviço falha ao processar, a mensagem volta para a fila."
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
              <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Próximo Nível: Testes de Contrato</h5>
              <p className="text-xs text-slate-600">Garante que mudanças no Order Service não quebrem o Catalog Service através de validação de esquema rigorosa.</p>
            </div>
            <div className="p-4 border border-slate-100 rounded-xl bg-slate-50">
              <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Próximo Nível: Chaos Testing</h5>
              <p className="text-xs text-slate-600">Simula a queda do RabbitMQ para testar se a lógica de reconexão e retentativa (Retry) funciona em tempo real.</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
            <h4 className="text-sm font-bold text-emerald-800 mb-2 flex items-center gap-2">
              <Activity size={16} /> Como monitorar a saúde do RabbitMQ:
            </h4>
            <ul className="text-xs text-emerald-700 space-y-2">
              <li><strong>1. Endpoint de Saúde:</strong> Acesse <code>/health</code> no Order Service para ver o status da conexão em tempo real.</li>
              <li><strong>2. Painel de Controle:</strong> Acesse <code>http://localhost:15672</code> (usuário: <code>guest</code> / senha: <code>guest</code>) para ver filas e mensagens.</li>
              <li><strong>3. Logs do Docker:</strong> Use <code>docker logs rabbitmq_broker</code> para ver o log de inicialização e erros.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
