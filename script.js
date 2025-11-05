// SleepSynncc - Sistema Inteligente de Monitoramento de Sono
class SleepSynncc {
    constructor() {
        this.isMonitoring = false;
        this.currentSection = 'dashboard';
        this.sleepData = {
            currentSession: null,
            sessions: [],
            patterns: {},
            anomalies: [],
            recommendations: []
        };
        this.sensors = {
            heartRate: { value: 72, status: 'normal', connected: true },
            breathingRate: { value: 16, status: 'normal', connected: true },
            bodyTemp: { value: 36.5, status: 'normal', connected: true },
            movement: { value: 'low', status: 'sleeping', connected: true },
            oxygen: { value: 98, status: 'normal', connected: true },
            noise: { value: 35, status: 'normal', connected: true }
        };
        this.mlModel = null;
        this.charts = {};
        this.notifications = [];
        this.pendingImageData = null;
        
        this.init();
    }

    async init() {
        this.showLoading();
        await this.initializeMLModel();
        await this.loadUserData();
        this.setupEventListeners();
        this.initializeCharts();
        this.startRealTimeUpdates();
        this.loadProfileImage();
        this.hideLoading();
    }

    showLoading() {
        const loadingScreen = document.getElementById('loadingScreen');
        const progressBar = document.getElementById('loadingProgress');
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = `${progress}%`;
        }, 200);
    }

    hideLoading() {
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
            document.getElementById('appContainer').style.display = 'block';
        }, 3000);
    }

    async initializeMLModel() {
        // Simular inicialização do modelo de ML
        console.log('Inicializando modelo de Machine Learning...');
        
        // Criar modelo simples para classificação de padrões de sono
        this.mlModel = {
            predictSleepStage: (data) => {
                // Simulação de classificação de estágios do sono
                const stages = ['awake', 'light', 'deep', 'rem'];
                const weights = [0.1, 0.4, 0.3, 0.2];
                return this.weightedRandomChoice(stages, weights);
            },
            detectAnomalies: (data) => {
                // Simulação de detecção de anomalias
                const anomalies = [];
                if (data.heartRate > 100) {
                    anomalies.push({
                        type: 'high_heart_rate',
                        severity: 'high',
                        message: 'Frequência cardíaca elevada detectada',
                        timestamp: new Date()
                    });
                }
                if (data.movement === 'high') {
                    anomalies.push({
                        type: 'excessive_movement',
                        severity: 'medium',
                        message: 'Movimento excessivo durante o sono',
                        timestamp: new Date()
                    });
                }
                return anomalies;
            },
            generateRecommendations: (data) => {
                // Simulação de geração de recomendações
                const recommendations = [];
                if (data.sleepEfficiency < 80) {
                    recommendations.push({
                        type: 'environment',
                        priority: 'high',
                        title: 'Melhorar Ambiente do Quarto',
                        description: 'Ajustar temperatura e reduzir ruído',
                        impact: '+15 pontos no score'
                    });
                }
                return recommendations;
            }
        };
    }

    weightedRandomChoice(items, weights) {
        const random = Math.random();
        let weightSum = 0;
        for (let i = 0; i < items.length; i++) {
            weightSum += weights[i];
            if (random <= weightSum) {
                return items[i];
            }
        }
        return items[items.length - 1];
    }

    async loadUserData() {
        // Simular carregamento de dados do usuário
        this.sleepData.sessions = [
            {
                id: 1,
                date: new Date(Date.now() - 86400000),
                duration: 7.5,
                efficiency: 92,
                deepSleep: 2.2,
                remSleep: 1.8,
                lightSleep: 3.5,
                score: 85
            },
            {
                id: 2,
                date: new Date(Date.now() - 172800000),
                duration: 8.1,
                efficiency: 88,
                deepSleep: 2.5,
                remSleep: 2.0,
                lightSleep: 3.6,
                score: 78
            }
        ];

        this.sleepData.anomalies = [
            {
                id: 1,
                type: 'prolonged_awakening',
                severity: 'high',
                message: 'Despertar noturno prolongado detectado',
                timestamp: new Date(Date.now() - 172800000),
                duration: 45
            }
        ];

        this.sleepData.recommendations = [
            {
                id: 1,
                category: 'environment',
                priority: 'high',
                title: 'Reduzir Temperatura do Quarto',
                description: 'Sua temperatura corporal está elevada durante o sono',
                impact: '+15 pontos no score',
                completed: false
            },
            {
                id: 2,
                category: 'lifestyle',
                priority: 'medium',
                title: 'Evitar Telas 1h Antes de Dormir',
                description: 'O uso de dispositivos está afetando sua qualidade de sono',
                impact: '+8 pontos no score',
                completed: false
            }
        ];
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });

        // Controles do dashboard
        document.getElementById('startSleepBtn').addEventListener('click', () => {
            this.startSleepMonitoring();
        });

        document.getElementById('stopSleepBtn').addEventListener('click', () => {
            this.stopSleepMonitoring();
        });

        document.getElementById('emergencyBtn').addEventListener('click', () => {
            this.showEmergencyAlert();
        });

        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });

        // Controles de análise
        document.querySelectorAll('.analysis-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const type = e.currentTarget.dataset.type;
                this.switchAnalysisType(type);
            });
        });

        // Filtros de recomendações
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.filterRecommendations(category);
            });
        });

        // Controles de gráficos
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.currentTarget.dataset.period;
                this.updateChartPeriod(period);
    });
});

        // FAB
        document.getElementById('fab').addEventListener('click', () => {
            this.toggleSleepMode();
        });

        // Modal
        document.getElementById('closeAlertBtn').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('alertConfirmBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Profile Image Change
        document.getElementById('profileImage').addEventListener('click', () => {
            document.getElementById('profileImageInput').click();
        });

        document.getElementById('avatarOverlay').addEventListener('click', () => {
            document.getElementById('profileImageInput').click();
        });

        document.getElementById('profileImageInput').addEventListener('change', (e) => {
            this.handleProfileImageChange(e);
        });

        // Image Preview Modal
        document.getElementById('closeImagePreviewBtn').addEventListener('click', () => {
            this.closeImagePreviewModal();
        });

        document.getElementById('cancelImageBtn').addEventListener('click', () => {
            this.closeImagePreviewModal();
        });

        document.getElementById('confirmImageBtn').addEventListener('click', () => {
            this.confirmProfileImageChange();
        });

        // Atualizar hora atual
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 1000);
    }

    switchSection(section) {
        // Atualizar navegação
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Atualizar seções
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(section).classList.add('active');

        this.currentSection = section;

        // Carregar conteúdo específico da seção
        if (section === 'monitoring') {
            this.updateMonitoringDisplay();
        } else if (section === 'analysis') {
            this.updateAnalysisDisplay();
        } else if (section === 'recommendations') {
            this.updateRecommendationsDisplay();
        } else if (section === 'profile') {
            this.updateProfileDisplay();
        }
    }

    updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('currentTime').textContent = timeString;
    }

    initializeCharts() {
        // Gráfico de padrão de sono
        const ctx = document.getElementById('sleepChart').getContext('2d');
        this.charts.sleepChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.generateLast7DaysLabels(),
                datasets: [
                    {
                        label: 'Score do Sono',
                        data: [78, 82, 85, 79, 88, 85, 85],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Duração (horas)',
                        data: [7.2, 7.8, 8.1, 7.5, 8.3, 7.9, 7.5],
                        borderColor: '#8b5cf6',
                        backgroundColor: 'rgba(139, 92, 246, 0.1)',
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#cbd5e1'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#475569'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#475569'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }

    generateLast7DaysLabels() {
        const labels = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
        }
        return labels;
    }

    startRealTimeUpdates() {
        // Atualizar métricas em tempo real
        setInterval(() => {
            this.updateSensorData();
            this.updateDashboardMetrics();
            if (this.isMonitoring) {
                this.updateMonitoringDisplay();
            }
        }, 2000);

        // Atualizar status de conexão
        setInterval(() => {
            this.updateConnectionStatus();
        }, 5000);
    }

    updateSensorData() {
        // Simular variações nos sensores
        Object.keys(this.sensors).forEach(sensor => {
            if (this.sensors[sensor].connected) {
                const sensorData = this.sensors[sensor];
                
                switch (sensor) {
                    case 'heartRate':
                        sensorData.value = Math.max(60, Math.min(100, sensorData.value + (Math.random() - 0.5) * 4));
                        sensorData.status = sensorData.value > 90 ? 'warning' : 'normal';
                        break;
                    case 'breathingRate':
                        sensorData.value = Math.max(12, Math.min(20, sensorData.value + (Math.random() - 0.5) * 2));
                        sensorData.status = sensorData.value > 18 ? 'warning' : 'normal';
                        break;
                    case 'bodyTemp':
                        sensorData.value = Math.max(36.0, Math.min(37.0, sensorData.value + (Math.random() - 0.5) * 0.2));
                        sensorData.status = sensorData.value > 36.8 ? 'warning' : 'normal';
                        break;
                    case 'movement':
                        const movements = ['low', 'medium', 'high'];
                        sensorData.value = this.weightedRandomChoice(movements, [0.7, 0.2, 0.1]);
                        sensorData.status = sensorData.value === 'high' ? 'warning' : 'normal';
                        break;
                    case 'oxygen':
                        sensorData.value = Math.max(95, Math.min(100, sensorData.value + (Math.random() - 0.5) * 2));
                        sensorData.status = sensorData.value < 97 ? 'warning' : 'normal';
                        break;
                    case 'noise':
                        sensorData.value = Math.max(20, Math.min(60, sensorData.value + (Math.random() - 0.5) * 10));
                        sensorData.status = sensorData.value > 50 ? 'warning' : 'normal';
                        break;
                }
            }
        });
    }

    updateDashboardMetrics() {
        // Atualizar métricas do dashboard
        const latestSession = this.sleepData.sessions[0];
        if (latestSession) {
            document.getElementById('sleepScore').textContent = latestSession.score;
            document.getElementById('sleepDuration').textContent = `${Math.floor(latestSession.duration)}h ${Math.round((latestSession.duration % 1) * 60)}m`;
            document.getElementById('sleepEfficiency').textContent = `${latestSession.efficiency}%`;
            document.getElementById('deepSleep').textContent = `${Math.floor(latestSession.deepSleep)}h ${Math.round((latestSession.deepSleep % 1) * 60)}m`;
        }
    }

    updateMonitoringDisplay() {
        // Atualizar métricas em tempo real
        document.getElementById('heartRate').textContent = `${Math.round(this.sensors.heartRate.value)} BPM`;
        document.getElementById('breathingRate').textContent = `${Math.round(this.sensors.breathingRate.value)} RPM`;
        document.getElementById('bodyTemp').textContent = `${this.sensors.bodyTemp.value.toFixed(1)}°C`;
        document.getElementById('movement').textContent = this.sensors.movement.value;

        // Atualizar status dos sensores
        this.updateSensorsStatus();
        
        // Atualizar timeline de estágios do sono
        this.updateSleepStagesTimeline();
    }

    updateSensorsStatus() {
        const sensorsGrid = document.getElementById('sensorsGrid');
        sensorsGrid.innerHTML = '';

        Object.keys(this.sensors).forEach(sensor => {
            const sensorData = this.sensors[sensor];
            const sensorItem = document.createElement('div');
            sensorItem.className = 'sensor-item';
            
            const iconClass = this.getSensorIcon(sensor);
            const statusColor = sensorData.status === 'normal' ? 'var(--success-color)' : 'var(--warning-color)';
            
            sensorItem.innerHTML = `
                <div class="sensor-icon" style="background: ${statusColor}">
                    <i class="${iconClass}"></i>
                </div>
                <div class="sensor-info">
                    <h4>${this.getSensorName(sensor)}</h4>
                    <div class="sensor-status">${sensorData.connected ? 'Conectado' : 'Desconectado'}</div>
                </div>
            `;
            
            sensorsGrid.appendChild(sensorItem);
        });
    }

    getSensorIcon(sensor) {
        const icons = {
            heartRate: 'fas fa-heartbeat',
            breathingRate: 'fas fa-lungs',
            bodyTemp: 'fas fa-thermometer-half',
            movement: 'fas fa-running',
            oxygen: 'fas fa-wind',
            noise: 'fas fa-volume-up'
        };
        return icons[sensor] || 'fas fa-sensor';
    }

    getSensorName(sensor) {
        const names = {
            heartRate: 'Frequência Cardíaca',
            breathingRate: 'Taxa Respiratória',
            bodyTemp: 'Temperatura',
            movement: 'Movimento',
            oxygen: 'Saturação O₂',
            noise: 'Ruído Ambiente'
        };
        return names[sensor] || sensor;
    }

    updateSleepStagesTimeline() {
        const timeline = document.getElementById('stagesTimeline');
        timeline.innerHTML = '';

        // Simular timeline de estágios do sono
        const stages = [
            { stage: 'awake', duration: 15, label: 'Acordado' },
            { stage: 'light', duration: 45, label: 'Leve' },
            { stage: 'deep', duration: 30, label: 'Profundo' },
            { stage: 'rem', duration: 20, label: 'REM' },
            { stage: 'light', duration: 35, label: 'Leve' },
            { stage: 'deep', duration: 25, label: 'Profundo' },
            { stage: 'rem', duration: 15, label: 'REM' }
        ];

        stages.forEach(stage => {
            const stageBar = document.createElement('div');
            stageBar.className = `stage-bar ${stage.stage}`;
            stageBar.textContent = stage.label;
            stageBar.title = `${stage.label}: ${stage.duration} min`;
            timeline.appendChild(stageBar);
        });
    }

    updateAnalysisDisplay() {
        // Atualizar análise de padrões
        this.updatePatternAnalysis();
        
        // Atualizar detecção de anomalias
        this.updateAnomalyDetection();
        
        // Atualizar insights de ML
        this.updateMLInsights();
    }

    updatePatternAnalysis() {
        // Simular análise de padrões
        const patterns = [
            {
                title: 'Padrão de Sono Regular',
                description: 'Seu horário de dormir é consistente, com variação média de apenas 15 minutos.',
                confidence: 94
            },
            {
                title: 'Qualidade do Sono Profundo',
                description: 'Você atinge sono profundo de forma eficiente, geralmente em 20-30 minutos.',
                confidence: 87
            }
        ];

        // Atualizar interface com os padrões detectados
        console.log('Padrões detectados:', patterns);
    }

    updateAnomalyDetection() {
        // Detectar novas anomalias usando ML
        const currentData = {
            heartRate: this.sensors.heartRate.value,
            breathingRate: this.sensors.breathingRate.value,
            bodyTemp: this.sensors.bodyTemp.value,
            movement: this.sensors.movement.value
        };

        const newAnomalies = this.mlModel.detectAnomalies(currentData);
        
        if (newAnomalies.length > 0) {
            newAnomalies.forEach(anomaly => {
                this.sleepData.anomalies.push(anomaly);
                this.showNotification(`Anomalia detectada: ${anomaly.message}`, 'warning');
            });
        }
    }

    updateMLInsights() {
        // Gerar insights baseados em ML
        const insights = [
            {
                icon: 'fas fa-chart-line',
                title: 'Predição de Qualidade',
                description: 'Baseado nos últimos 30 dias, sua qualidade de sono deve melhorar 12% na próxima semana.'
            },
            {
                icon: 'fas fa-clock',
                title: 'Horário Ideal',
                description: 'Seu horário ideal para dormir é entre 22:30 e 23:00 para máxima eficiência.'
            },
            {
                icon: 'fas fa-leaf',
                title: 'Fatores Ambientais',
                description: 'Temperatura ideal detectada: 18-20°C. Umidade: 45-55%.'
            }
        ];

        console.log('Insights de ML:', insights);
    }

    updateRecommendationsDisplay() {
        // Atualizar recomendações personalizadas
        const recommendations = this.sleepData.recommendations;
        
        // Filtrar recomendações por categoria se necessário
        const filteredRecommendations = this.filterRecommendationsByCategory(recommendations, 'all');
        
        console.log('Recomendações atualizadas:', filteredRecommendations);
    }

    filterRecommendationsByCategory(recommendations, category) {
        if (category === 'all') return recommendations;
        return recommendations.filter(rec => rec.category === category);
    }

    updateProfileDisplay() {
        // Atualizar informações do perfil
        const userStats = this.calculateUserStats();
        
        document.getElementById('userName').textContent = 'Usuário SleepSynncc';
        document.getElementById('userEmail').textContent = 'usuario@sleepsynncc.com';
        
        // Atualizar estatísticas
        const statItems = document.querySelectorAll('.stat-item');
        if (statItems.length >= 3) {
            statItems[0].querySelector('.stat-value').textContent = userStats.daysMonitored;
            statItems[1].querySelector('.stat-value').textContent = userStats.averageScore;
            statItems[2].querySelector('.stat-value').textContent = userStats.recommendationsFollowed;
        }
    }

    calculateUserStats() {
        return {
            daysMonitored: this.sleepData.sessions.length,
            averageScore: Math.round(this.sleepData.sessions.reduce((sum, session) => sum + session.score, 0) / this.sleepData.sessions.length),
            recommendationsFollowed: this.sleepData.recommendations.filter(rec => rec.completed).length
        };
    }

    startSleepMonitoring() {
        this.isMonitoring = true;
        this.sleepData.currentSession = {
            startTime: new Date(),
            stages: [],
            metrics: []
        };
        
        this.showNotification('Monitoramento de sono iniciado', 'success');
        this.updateMonitoringStatus(true);
        
        // Iniciar coleta de dados
        this.startDataCollection();
    }

    stopSleepMonitoring() {
        if (!this.isMonitoring) {
            this.showNotification('Nenhum monitoramento ativo', 'warning');
            return;
        }

        this.isMonitoring = false;
        
        // Finalizar sessão atual
        if (this.sleepData.currentSession) {
            this.sleepData.currentSession.endTime = new Date();
            this.sleepData.currentSession.duration = (this.sleepData.currentSession.endTime - this.sleepData.currentSession.startTime) / (1000 * 60 * 60);
            
            // Calcular métricas da sessão
            this.calculateSessionMetrics();
            
            // Adicionar à lista de sessões
            this.sleepData.sessions.unshift(this.sleepData.currentSession);
            this.sleepData.currentSession = null;
        }
        
        this.showNotification('Monitoramento de sono finalizado', 'info');
        this.updateMonitoringStatus(false);
    }

    calculateSessionMetrics() {
        const session = this.sleepData.currentSession;
        if (!session) return;

        // Simular cálculos de métricas
        session.efficiency = Math.random() * 20 + 80; // 80-100%
        session.deepSleep = session.duration * 0.3; // 30% do tempo total
        session.remSleep = session.duration * 0.2; // 20% do tempo total
        session.lightSleep = session.duration * 0.5; // 50% do tempo total
        session.score = Math.round(session.efficiency * 0.8 + Math.random() * 20);
    }

    updateMonitoringStatus(isMonitoring) {
        const statusElement = document.getElementById('monitoringStatus');
        const indicator = statusElement.querySelector('.status-indicator');
        const text = statusElement.querySelector('span');
        
        if (isMonitoring) {
            indicator.classList.add('active');
            text.textContent = 'Monitorando';
        } else {
            indicator.classList.remove('active');
            text.textContent = 'Parado';
        }
    }

    startDataCollection() {
        if (!this.isMonitoring) return;

        // Coletar dados a cada 30 segundos
        const dataInterval = setInterval(() => {
            if (!this.isMonitoring) {
                clearInterval(dataInterval);
                return;
            }

            const dataPoint = {
                timestamp: new Date(),
                heartRate: this.sensors.heartRate.value,
                breathingRate: this.sensors.breathingRate.value,
                bodyTemp: this.sensors.bodyTemp.value,
                movement: this.sensors.movement.value,
                stage: this.mlModel.predictSleepStage(this.sensors)
            };

            this.sleepData.currentSession.metrics.push(dataPoint);
            
            // Detectar anomalias em tempo real
            const anomalies = this.mlModel.detectAnomalies(dataPoint);
            if (anomalies.length > 0) {
                anomalies.forEach(anomaly => {
                    this.showNotification(`Alerta: ${anomaly.message}`, 'warning');
                });
            }
        }, 30000);
    }

    updateConnectionStatus() {
        const connectionStatus = document.getElementById('connectionStatus');
        const icon = connectionStatus.querySelector('i');
        const text = connectionStatus.querySelector('span');
        
        // Simular status de conexão
        const isConnected = Math.random() > 0.1; // 90% de chance de estar conectado
        
        if (isConnected) {
            connectionStatus.classList.remove('disconnected');
            icon.className = 'fas fa-wifi';
            text.textContent = 'Conectado';
        } else {
            connectionStatus.classList.add('disconnected');
            icon.className = 'fas fa-wifi-slash';
            text.textContent = 'Desconectado';
        }
    }

    switchAnalysisType(type) {
        // Atualizar botões de análise
        document.querySelectorAll('.analysis-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('active');
        
        // Atualizar conteúdo baseado no tipo
        console.log(`Mudando para análise: ${type}`);
    }

    filterRecommendations(category) {
        // Atualizar botões de filtro
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Filtrar recomendações
        const filtered = this.filterRecommendationsByCategory(this.sleepData.recommendations, category);
        console.log(`Recomendações filtradas por ${category}:`, filtered);
    }

    updateChartPeriod(period) {
        // Atualizar botões de período
        document.querySelectorAll('.chart-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        // Atualizar dados do gráfico
        console.log(`Atualizando gráfico para período: ${period}`);
    }

    toggleSleepMode() {
        if (this.isMonitoring) {
            this.stopSleepMonitoring();
        } else {
            this.startSleepMonitoring();
        }
    }

    showEmergencyAlert() {
        this.showModal('Alerta Médico', 'Um alerta médico foi enviado. Contate seu médico imediatamente se necessário.');
    }

    exportData() {
        const data = {
            sessions: this.sleepData.sessions,
            anomalies: this.sleepData.anomalies,
            recommendations: this.sleepData.recommendations,
            exportDate: new Date()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sleepsync-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Dados exportados com sucesso', 'success');
    }

    showModal(title, message) {
        document.getElementById('alertTitle').textContent = title;
        document.getElementById('alertMessage').textContent = message;
        document.getElementById('alertModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('alertModal').classList.remove('active');
    }

    handleProfileImageChange(event) {
        const file = event.target.files[0];
        
        if (!file) {
            return;
        }

        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
            this.showNotification('Por favor, selecione apenas arquivos de imagem', 'error');
            return;
        }

        // Validar tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('A imagem deve ter no máximo 5MB', 'error');
            return;
        }

        // Criar URL da imagem e mostrar pré-visualização
        const reader = new FileReader();
        reader.onload = (e) => {
            this.pendingImageData = e.target.result;
            this.showImagePreviewModal(e.target.result);
        };

        reader.onerror = () => {
            this.showNotification('Erro ao carregar a imagem', 'error');
        };

        reader.readAsDataURL(file);
    }

    showImagePreviewModal(imageData) {
        const previewImage = document.getElementById('imagePreview');
        previewImage.src = imageData;
        document.getElementById('imagePreviewModal').classList.add('active');
    }

    closeImagePreviewModal() {
        document.getElementById('imagePreviewModal').classList.remove('active');
        this.pendingImageData = null;
        // Limpar o input file
        document.getElementById('profileImageInput').value = '';
    }

    confirmProfileImageChange() {
        if (this.pendingImageData) {
            const profileImage = document.getElementById('profileImage');
            profileImage.src = this.pendingImageData;
            
            // Salvar no localStorage para persistir a mudança
            localStorage.setItem('sleepsynncc_profile_image', this.pendingImageData);
            
            this.showNotification('Foto do perfil atualizada com sucesso!', 'success');
            this.closeImagePreviewModal();
        }
    }

    loadProfileImage() {
        // Carregar imagem salva do localStorage
        const savedImage = localStorage.getItem('sleepsynncc_profile_image');
        if (savedImage) {
            document.getElementById('profileImage').src = savedImage;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Adicionar estilos
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: 'var(--success-color)',
            warning: 'var(--warning-color)',
            error: 'var(--error-color)',
            info: 'var(--info-color)'
        };
        return colors[type] || 'var(--info-color)';
    }
}

// Inicializar aplicativo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new SleepSynncc();
});

// Adicionar animações CSS para notificações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    .notification-content i {
        font-size: 1.25rem;
    }
    .status-indicator {
        width: 0.75rem;
        height: 0.75rem;
        border-radius: 50%;
        background: var(--text-muted);
        transition: all var(--transition-normal);
    }
    .status-indicator.active {
        background: var(--success-color);
        box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        animation: pulse 2s infinite;
    }
`;
document.head.appendChild(style);
