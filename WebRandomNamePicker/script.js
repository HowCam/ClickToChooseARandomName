/**
 * 点名大师 - 极简随机点名器
 * 版本 2.1
 * 功能：文件导入、直接抽取、极简UI
 */

class NamePicker {
    constructor() {
        // 应用状态
        this.state = {
            groups: this.loadGroups(),
            currentGroupId: 'default',
            history: this.loadHistory(),
            stats: this.loadStats(),
            isPicking: false,
            isDirectMode: false,
            isDarkTheme: this.loadThemePreference(),
            settings: this.loadSettings()
        };

        // DOM元素引用
        this.elements = {};

        // 动画相关
        this.pickAnimation = null;
        this.animationInterval = null;

        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.applyTheme();
        this.renderGroups();
        this.renderHistoryPreview();
        this.updateStats();
        this.updateUI();
        
        // 初始化默认小组
        if (!this.state.groups.default) {
            this.createDefaultGroup();
        }
    }

    /**
     * 缓存DOM元素
     */
    cacheElements() {
        // 头部元素
        this.elements.settingsToggle = document.getElementById('settingsToggle');
        this.elements.themeToggle = document.getElementById('themeToggle');
        
        // 小组信息
        this.elements.currentGroupName = document.getElementById('currentGroupName');
        this.elements.memberCount = document.getElementById('memberCount');
        this.elements.quickImportBtn = document.getElementById('quickImportBtn');
        this.elements.quickSwitchBtn = document.getElementById('quickSwitchBtn');
        
        // 抽取区域
        this.elements.directModeToggle = document.getElementById('directModeToggle');
        this.elements.nameDisplay = document.getElementById('nameDisplay');
        this.elements.pickButton = document.getElementById('pickButton');
        this.elements.quickPickBtn = document.getElementById('quickPickBtn');
        
        // 统计区域
        this.elements.quickTotalPicks = document.getElementById('quickTotalPicks');
        this.elements.quickUniquePicks = document.getElementById('quickUniquePicks');
        this.elements.quickRemaining = document.getElementById('quickRemaining');
        
        // 设置面板
        this.elements.settingsOverlay = document.getElementById('settingsOverlay');
        this.elements.closeSettings = document.getElementById('closeSettings');
        
        // 文件导入
        this.elements.txtFileInput = document.getElementById('txtFileInput');
        this.elements.browseTxtBtn = document.getElementById('browseTxtBtn');
        
        // 小组管理
        this.elements.groupList = document.getElementById('groupList');
        this.elements.createGroupBtn = document.getElementById('createGroupBtn');
        this.elements.editGroupBtn = document.getElementById('editGroupBtn');
        this.elements.deleteGroupBtn = document.getElementById('deleteGroupBtn');
        
        // 历史记录
        this.elements.historyPreview = document.getElementById('historyPreview');
        this.elements.viewHistoryBtn = document.getElementById('viewHistoryBtn');
        this.elements.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.elements.historyPanelOverlay = document.getElementById('historyPanelOverlay');
        this.elements.closeHistoryPanel = document.getElementById('closeHistoryPanel');
        this.elements.fullHistoryList = document.getElementById('fullHistoryList');
        this.elements.exportHistoryBtn = document.getElementById('exportHistoryBtn');
        this.elements.clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');
        
        // 设置选项
        this.elements.autoSaveToggle = document.getElementById('autoSaveToggle');
        this.elements.notifyToggle = document.getElementById('notifyToggle');
        
        // 小组编辑面板
        this.elements.groupEditOverlay = document.getElementById('groupEditOverlay');
        this.elements.closeGroupEdit = document.getElementById('closeGroupEdit');
        this.elements.editGroupName = document.getElementById('editGroupName');
        this.elements.editGroupMembers = document.getElementById('editGroupMembers');
        this.elements.pasteNamesBtn = document.getElementById('pasteNamesBtn');
        this.elements.clearNamesBtn = document.getElementById('clearNamesBtn');
        this.elements.saveGroupBtn = document.getElementById('saveGroupBtn');
        this.elements.cancelGroupEdit = document.getElementById('cancelGroupEdit');
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 头部操作
        this.elements.settingsToggle.addEventListener('click', () => this.showSettings());
        this.elements.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // 小组操作
        this.elements.quickImportBtn.addEventListener('click', () => this.importFromFile());
        this.elements.quickSwitchBtn.addEventListener('click', () => this.showSettings());
        
        // 抽取操作
        this.elements.directModeToggle.addEventListener('change', () => this.toggleDirectMode());
        this.elements.pickButton.addEventListener('click', () => this.startPicking());
        this.elements.quickPickBtn.addEventListener('click', () => this.quickPick());
        
        // 设置面板
        this.elements.closeSettings.addEventListener('click', () => this.hideSettings());
        this.elements.settingsOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsOverlay) this.hideSettings();
        });
        
        // 文件导入
        this.elements.browseTxtBtn.addEventListener('click', () => this.elements.txtFileInput.click());
        this.elements.txtFileInput.addEventListener('change', (e) => this.handleFileImport(e));
        
        // 小组管理
        this.elements.createGroupBtn.addEventListener('click', () => this.createNewGroup());
        this.elements.editGroupBtn.addEventListener('click', () => this.editCurrentGroup());
        this.elements.deleteGroupBtn.addEventListener('click', () => this.deleteCurrentGroup());
        
        // 历史记录
        this.elements.viewHistoryBtn.addEventListener('click', () => this.showHistoryPanel());
        this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistoryConfirm());
        this.elements.closeHistoryPanel.addEventListener('click', () => this.hideHistoryPanel());
        this.elements.historyPanelOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.historyPanelOverlay) this.hideHistoryPanel();
        });
        this.elements.exportHistoryBtn.addEventListener('click', () => this.exportHistory());
        this.elements.clearAllHistoryBtn.addEventListener('click', () => this.clearAllHistory());
        
        // 设置选项
        this.elements.autoSaveToggle.addEventListener('change', () => this.updateSettings());
        this.elements.notifyToggle.addEventListener('change', () => this.updateSettings());
        
        // 小组编辑面板
        this.elements.closeGroupEdit.addEventListener('click', () => this.hideGroupEdit());
        this.elements.groupEditOverlay.addEventListener('click', (e) => {
            if (e.target === this.elements.groupEditOverlay) this.hideGroupEdit();
        });
        this.elements.pasteNamesBtn.addEventListener('click', () => this.pasteNames());
        this.elements.clearNamesBtn.addEventListener('click', () => this.clearEditForm());
        this.elements.saveGroupBtn.addEventListener('click', () => this.saveGroup());
        this.elements.cancelGroupEdit.addEventListener('click', () => this.hideGroupEdit());
    }

    /**
     * 加载小组数据
     */
    loadGroups() {
        const saved = localStorage.getItem('namePickerGroups');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('解析小组数据失败:', e);
            }
        }
        return {};
    }

    /**
     * 加载历史记录
     */
    loadHistory() {
        const saved = localStorage.getItem('namePickerHistory');
        return saved ? JSON.parse(saved) : [];
    }

    /**
     * 加载统计信息
     */
    loadStats() {
        const saved = localStorage.getItem('namePickerStats');
        return saved ? JSON.parse(saved) : {
            totalPicks: 0,
            uniqueNames: new Set()
        };
    }

    /**
     * 加载主题偏好
     */
    loadThemePreference() {
        const saved = localStorage.getItem('namePickerDarkTheme');
        if (saved !== null) return saved === 'true';
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    /**
     * 加载设置
     */
    loadSettings() {
        const saved = localStorage.getItem('namePickerSettings');
        return saved ? JSON.parse(saved) : {
            autoSave: true,
            notifications: true
        };
    }

    /**
     * 保存小组数据
     */
    saveGroups() {
        localStorage.setItem('namePickerGroups', JSON.stringify(this.state.groups));
    }

    /**
     * 保存历史记录
     */
    saveHistory() {
        localStorage.setItem('namePickerHistory', JSON.stringify(this.state.history));
    }

    /**
     * 保存统计信息
     */
    saveStats() {
        const statsToSave = {
            totalPicks: this.state.stats.totalPicks,
            uniqueNames: Array.from(this.state.stats.uniqueNames)
        };
        localStorage.setItem('namePickerStats', JSON.stringify(statsToSave));
    }

    /**
     * 保存主题偏好
     */
    saveThemePreference() {
        localStorage.setItem('namePickerDarkTheme', this.state.isDarkTheme.toString());
    }

    /**
     * 保存设置
     */
    saveSettings() {
        localStorage.setItem('namePickerSettings', JSON.stringify(this.state.settings));
    }

    /**
     * 创建默认小组
     */
    createDefaultGroup() {
        this.state.groups.default = {
            id: 'default',
            name: '默认小组',
            members: ['张三', '李四', '王五', '赵六', '钱七'],
            createdAt: Date.now()
        };
        this.saveGroups();
    }

    /**
     * 更新UI显示
     */
    updateUI() {
        const currentGroup = this.state.groups[this.state.currentGroupId];
        
        if (currentGroup) {
            this.elements.currentGroupName.textContent = currentGroup.name;
            this.elements.memberCount.textContent = `${currentGroup.members.length} 人`;
            
            // 更新剩余人数
            const pickedNames = new Set(this.state.history
                .filter(item => item.groupId === this.state.currentGroupId)
                .map(item => item.name));
            const remaining = currentGroup.members.length - pickedNames.size;
            this.elements.quickRemaining.textContent = Math.max(0, remaining);
        }
        
        // 更新统计
        this.elements.quickTotalPicks.textContent = this.state.stats.totalPicks;
        this.elements.quickUniquePicks.textContent = this.state.stats.uniqueNames.size;
        
        // 更新设置选项
        this.elements.autoSaveToggle.checked = this.state.settings.autoSave;
        this.elements.notifyToggle.checked = this.state.settings.notifications;
    }

    /**
     * 渲染小组列表
     */
    renderGroups() {
        this.updateUI();
        
        // 渲染设置面板中的小组列表
        if (this.elements.groupList) {
            this.elements.groupList.innerHTML = '';
            
            Object.values(this.state.groups).forEach(group => {
                const isActive = group.id === this.state.currentGroupId;
                const groupItem = document.createElement('div');
                groupItem.className = `compact-group-item ${isActive ? 'active' : ''}`;
                groupItem.dataset.groupId = group.id;
                
                groupItem.innerHTML = `
                    <div>
                        <div class="compact-group-name">${group.name}</div>
                        <div class="compact-group-members">${group.members.length} 人</div>
                    </div>
                    ${group.id !== 'default' ? '<button class="icon-button btn-xs"><i class="fas fa-times"></i></button>' : ''}
                `;
                
                // 点击切换小组
                groupItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.icon-button')) {
                        this.switchGroup(group.id);
                        this.hideSettings();
                    }
                });
                
                // 删除按钮（非默认小组）
                const deleteBtn = groupItem.querySelector('.icon-button');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.deleteGroupConfirm(group.id);
                    });
                }
                
                this.elements.groupList.appendChild(groupItem);
            });
        }
    }

    /**
     * 渲染完整历史记录
     */
    renderFullHistory() {
        if (!this.elements.fullHistoryList) return;
        
        const history = [...this.state.history].reverse();
        
        if (history.length === 0) {
            this.elements.fullHistoryList.innerHTML = `
                <div class="empty-history">
                    <i class="fas fa-clock"></i>
                    <p>暂无抽取记录</p>
                </div>
            `;
            return;
        }
        
        this.elements.fullHistoryList.innerHTML = history.map((item, index) => {
            const group = this.state.groups[item.groupId];
            const time = new Date(item.timestamp).toLocaleString('zh-CN', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            return `
                <div class="history-item">
                    <div class="history-item-content">
                        <div class="history-index">${history.length - index}</div>
                        <div class="history-name">${item.name}</div>
                        ${group ? `<div class="history-group">${group.name}</div>` : ''}
                    </div>
                    <div class="history-time">${time}</div>
                </div>
            `;
        }).join('');
    }

    /**
     * 开始随机点名
     */
    startPicking() {
        if (this.state.isPicking) {
            this.stopPicking();
            return;
        }
        
        const currentGroup = this.state.groups[this.state.currentGroupId];
        if (!currentGroup || currentGroup.members.length === 0) {
            this.showNotification('小组中没有成员，请先添加成员', 'warning');
            return;
        }
        
        this.state.isPicking = true;
        this.elements.nameDisplay.closest('.name-display-card').classList.add('picking');
        this.elements.pickButton.innerHTML = '<i class="fas fa-stop"></i><span>停止抽取</span>';
        
        if (this.state.isDirectMode) {
            // 直接模式：立即显示结果
            this.pickRandomName();
            this.state.isPicking = false;
            this.elements.nameDisplay.closest('.name-display-card').classList.remove('picking');
            this.elements.pickButton.innerHTML = '<i class="fas fa-random"></i><span>开始抽取</span>';
        } else {
            // 动画模式：开始滚动动画
            this.startPickAnimation(currentGroup.members);
        }
    }

    /**
     * 停止抽取
     */
    stopPicking() {
        if (!this.state.isPicking || !this.pickAnimation) return;
        
        this.state.isPicking = false;
        clearInterval(this.animationInterval);
        
        const selectedName = this.pickAnimation.currentName;
        if (selectedName) {
            this.displaySelectedName(selectedName);
            this.addToHistory(selectedName);
            this.updateStatistics();
        }
        
        this.elements.nameDisplay.closest('.name-display-card').classList.remove('picking');
        this.elements.pickButton.innerHTML = '<i class="fas fa-random"></i><span>开始抽取</span>';
    }

    /**
     * 开始抽取动画
     */
    startPickAnimation(members) {
        let animationSpeed = 50;
        let duration = 3000;
        let startTime = Date.now();
        
        this.pickAnimation = {
            members: members,
            currentName: members[Math.floor(Math.random() * members.length)],
            startTime: startTime
        };
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;
            
            if (progress >= 1) {
                this.stopPicking();
                return;
            }
            
            const currentSpeed = Math.max(50, animationSpeed * (1 + progress * 10));
            this.pickAnimation.currentName = members[Math.floor(Math.random() * members.length)];
            
            this.elements.nameDisplay.innerHTML = `
                <div class="selected-name">
                    ${this.pickAnimation.currentName}
                </div>
            `;
            
            setTimeout(animate, currentSpeed);
        };
        
        this.animationInterval = setTimeout(animate, animationSpeed);
    }

    /**
     * 快速点名（直接模式）
     */
    quickPick() {
        const currentGroup = this.state.groups[this.state.currentGroupId];
        if (!currentGroup || currentGroup.members.length === 0) {
            this.showNotification('小组中没有成员，请先添加成员', 'warning');
            return;
        }
        
        this.pickRandomName();
    }

    /**
     * 随机选择名字
     */
    pickRandomName() {
        const currentGroup = this.state.groups[this.state.currentGroupId];
        const randomIndex = Math.floor(Math.random() * currentGroup.members.length);
        const selectedName = currentGroup.members[randomIndex];
        
        this.displaySelectedName(selectedName);
        this.addToHistory(selectedName);
        this.updateStatistics();
    }

    /**
     * 显示选中的名字
     */
    displaySelectedName(name) {
        this.elements.nameDisplay.innerHTML = `
            <div class="selected-name animate-in">
                ${name}
            </div>
        `;
        
        // 添加庆祝效果
        this.createCelebrationEffects();
    }

    /**
     * 添加到历史记录
     */
    addToHistory(name) {
        const historyItem = {
            id: Date.now().toString(),
            name: name,
            groupId: this.state.currentGroupId,
            timestamp: Date.now()
        };
        
        this.state.history.push(historyItem);
        if (this.state.history.length > 100) {
            this.state.history = this.state.history.slice(-100);
        }
        
        this.saveHistory();
        this.renderHistoryPreview();
        this.renderFullHistory();
        this.updateUI();
        
        if (this.state.settings.notifications) {
            this.showNotification(`已抽取: ${name}`, 'success');
        }
    }

    /**
     * 更新统计信息
     */
    updateStatistics() {
        const currentGroup = this.state.groups[this.state.currentGroupId];
        const lastHistoryItem = this.state.history[this.state.history.length - 1];
        
        if (lastHistoryItem && currentGroup) {
            this.state.stats.totalPicks++;
            this.state.stats.uniqueNames.add(lastHistoryItem.name);
            this.saveStats();
            this.updateUI();
        }
    }

    /**
     * 切换小组
     */
    switchGroup(groupId) {
        if (!this.state.groups[groupId]) return;
        
        this.state.currentGroupId = groupId;
        this.updateUI();
        this.renderGroups();
        
        this.showNotification(`已切换到 ${this.state.groups[groupId].name}`, 'success');
    }

    /**
     * 导入文件
     */
    importFromFile() {
        this.elements.txtFileInput.click();
    }

    /**
     * 处理文件导入
     */
    handleFileImport(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                const names = this.parseFileContent(content);
                
                if (names.length > 0) {
                    // 询问是否创建新小组或添加到当前小组
                    const action = confirm(`从文件中读取到 ${names.length} 个名字。\n\n点击"确定"创建新小组，点击"取消"添加到当前小组。`);
                    
                    if (action) {
                        // 创建新小组
                        this.showGroupEditForImport(names);
                    } else {
                        // 添加到当前小组
                        this.addNamesToCurrentGroup(names);
                    }
                } else {
                    this.showNotification('文件中没有找到有效的名字', 'warning');
                }
            } catch (error) {
                this.showNotification('文件读取失败: ' + error.message, 'error');
            }
            
            // 清空文件输入
            event.target.value = '';
        };
        
        reader.onerror = () => {
            this.showNotification('文件读取失败', 'error');
            event.target.value = '';
        };
        
        if (file.type === 'text/plain' || file.name.endsWith('.txt')) {
            reader.readAsText(file, 'UTF-8');
        } else {
            this.showNotification('只支持TXT文本文件', 'warning');
            event.target.value = '';
        }
    }

    /**
     * 解析文件内容
     */
    parseFileContent(content) {
        // 按行分割，过滤空行和空格
        return content.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'))
            .filter(line => {
                // 过滤掉纯数字和特殊字符
                const hasChinese = /[\u4e00-\u9fff]/.test(line);
                const hasLetter = /[a-zA-Z]/.test(line);
                return hasChinese || hasLetter;
            });
    }

    /**
     * 为导入显示小组编辑面板
     */
    showGroupEditForImport(names) {
        this.elements.editGroupName.value = `导入小组_${new Date().toLocaleDateString('zh-CN')}`;
        this.elements.editGroupMembers.value = names.join('\n');
        this.showGroupEdit();
    }

    /**
     * 添加名字到当前小组
     */
    addNamesToCurrentGroup(names) {
        const currentGroup = this.state.groups[this.state.currentGroupId];
        if (!currentGroup) return;
        
        const originalLength = currentGroup.members.length;
        const newNames = names.filter(name => !currentGroup.members.includes(name));
        
        currentGroup.members.push(...newNames);
        this.saveGroups();
        this.updateUI();
        this.renderGroups();
        
        this.showNotification(`已添加 ${newNames.length} 个新名字到当前小组`, 'success');
    }

    /**
     * 创建新小组
     */
    createNewGroup() {
        this.elements.editGroupName.value = '';
        this.elements.editGroupMembers.value = '';
        this.showGroupEdit();
    }

    /**
     * 编辑当前小组
     */
    editCurrentGroup() {
        const currentGroup = this.state.groups[this.state.currentGroupId];
        if (!currentGroup) return;
        
        this.elements.editGroupName.value = currentGroup.name;
        this.elements.editGroupMembers.value = currentGroup.members.join('\n');
        this.showGroupEdit();
    }

    /**
     * 保存小组
     */
    saveGroup() {
        const name = this.elements.editGroupName.value.trim();
        const membersText = this.elements.editGroupMembers.value.trim();
        
        if (!name) {
            this.showNotification('请输入小组名称', 'warning');
            return;
        }
        
        if (!membersText) {
            this.showNotification('请输入成员名单', 'warning');
            return;
        }
        
        const members = membersText.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        if (members.length === 0) {
            this.showNotification('请输入有效的成员名单', 'warning');
            return;
        }
        
        // 检查是否在编辑现有小组
        const currentGroup = this.state.groups[this.state.currentGroupId];
        const isEditingCurrent = currentGroup && 
            this.elements.editGroupName.value === currentGroup.name;
        
        let groupId;
        if (isEditingCurrent) {
            // 更新当前小组
            groupId = this.state.currentGroupId;
            currentGroup.name = name;
            currentGroup.members = members;
        } else {
            // 创建新小组
            groupId = 'group_' + Date.now();
            this.state.groups[groupId] = {
                id: groupId,
                name: name,
                members: members,
                createdAt: Date.now()
            };
        }
        
        this.saveGroups();
        this.renderGroups();
        
        if (!isEditingCurrent) {
            this.switchGroup(groupId);
        }
        
        this.hideGroupEdit();
        this.showNotification(`小组 "${name}" 已保存`, 'success');
    }

    /**
     * 删除当前小组确认
     */
    deleteCurrentGroup() {
        if (this.state.currentGroupId === 'default') {
            this.showNotification('默认小组不能删除', 'warning');
            return;
        }
        
        const currentGroup = this.state.groups[this.state.currentGroupId];
        if (!currentGroup) return;
        
        if (confirm(`确定要删除小组 "${currentGroup.name}" 吗？`)) {
            this.deleteGroup(this.state.currentGroupId);
        }
    }

    /**
     * 删除小组确认
     */
    deleteGroupConfirm(groupId) {
        const group = this.state.groups[groupId];
        if (!group || groupId === 'default') return;
        
        if (confirm(`确定要删除小组 "${group.name}" 吗？`)) {
            this.deleteGroup(groupId);
        }
    }

    /**
     * 删除小组
     */
    deleteGroup(groupId) {
        delete this.state.groups[groupId];
        
        // 如果删除的是当前小组，切换到默认小组
        if (this.state.currentGroupId === groupId) {
            this.state.currentGroupId = 'default';
        }
        
        this.saveGroups();
        this.renderGroups();
        this.updateUI();
        
        this.showNotification('小组已删除', 'success');
    }

    /**
     * 清空历史记录确认
     */
    clearHistoryConfirm() {
        if (this.state.history.length === 0) {
            this.showNotification('历史记录为空', 'info');
            return;
        }
        
        if (confirm('确定要清空历史记录吗？')) {
            this.clearHistory();
        }
    }

    /**
     * 清空历史记录
     */
    clearHistory() {
        this.state.history = [];
        this.saveHistory();
        this.renderHistoryPreview();
        this.renderFullHistory();
        this.showNotification('历史记录已清空', 'success');
    }

    /**
     * 清空全部历史记录
     */
    clearAllHistory() {
        this.clearHistory();
        this.hideHistoryPanel();
    }

    /**
     * 导出历史记录
     */
    exportHistory() {
        if (this.state.history.length === 0) {
            this.showNotification('没有历史记录可导出', 'info');
            return;
        }
        
        const content = this.state.history.map((item, index) => {
            const group = this.state.groups[item.groupId];
            const time = new Date(item.timestamp).toLocaleString('zh-CN');
            return `${index + 1}. ${item.name} - ${group ? group.name : '未知小组'} (${time})`;
        }).join('\n');
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        
        a.href = url;
        a.download = `点名历史_${new Date().toLocaleDateString('zh-CN')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('历史记录已导出', 'success');
    }

    /**
     * 粘贴名字
     */
    pasteNames() {
        navigator.clipboard.readText()
            .then(text => {
                this.elements.editGroupMembers.value = text;
                this.showNotification('已从剪贴板粘贴', 'success');
            })
            .catch(() => {
                this.showNotification('无法读取剪贴板内容', 'error');
            });
    }

    /**
     * 清空编辑表单
     */
    clearEditForm() {
        this.elements.editGroupMembers.value = '';
    }

    /**
     * 切换直接模式
     */
    toggleDirectMode() {
        this.state.isDirectMode = this.elements.directModeToggle.checked;
        
        if (this.state.isDirectMode) {
            this.showNotification('已切换到直接抽取模式', 'info');
        } else {
            this.showNotification('已切换到动画抽取模式', 'info');
        }
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        this.state.isDarkTheme = !this.state.isDarkTheme;
        this.applyTheme();
        this.saveThemePreference();
        
        const icon = this.elements.themeToggle.querySelector('i');
        icon.className = this.state.isDarkTheme ? 'fas fa-sun' : 'fas fa-moon';
        
        this.showNotification(
            this.state.isDarkTheme ? '已切换到暗色主题' : '已切换到亮色主题',
            'success'
        );
    }

    /**
     * 应用主题
     */
    applyTheme() {
        if (this.state.isDarkTheme) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }

    /**
     * 更新设置
     */
    updateSettings() {
        this.state.settings = {
            autoSave: this.elements.autoSaveToggle.checked,
            notifications: this.elements.notifyToggle.checked
        };
        
        this.saveSettings();
        this.showNotification('设置已保存', 'success');
    }

    /**
     * 显示设置面板
     */
    showSettings() {
        this.elements.settingsOverlay.classList.add('active');
    }

    /**
     * 隐藏设置面板
     */
    hideSettings() {
        this.elements.settingsOverlay.classList.remove('active');
    }

    /**
     * 显示小组编辑面板
     */
    showGroupEdit() {
        this.elements.groupEditOverlay.classList.add('active');
        this.elements.editGroupName.focus();
    }

    /**
     * 隐藏小组编辑面板
     */
    hideGroupEdit() {
        this.elements.groupEditOverlay.classList.remove('active');
    }

    /**
     * 显示历史记录面板
     */
    showHistoryPanel() {
        this.renderFullHistory();
        this.elements.historyPanelOverlay.classList.add('active');
    }

    /**
     * 隐藏历史记录面板
     */
    hideHistoryPanel() {
        this.elements.historyPanelOverlay.classList.remove('active');
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        let icon = 'info-circle';
        switch (type) {
            case 'success': icon = 'check-circle'; break;
            case 'error': icon = 'exclamation-circle'; break;
            case 'warning': icon = 'exclamation-triangle'; break;
        }
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <div class="notification-content">
                <div class="notification-title">${this.getNotificationTitle(type)}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;
        
        container.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * 获取通知标题
     */
    getNotificationTitle(type) {
        switch (type) {
            case 'success': return '成功';
            case 'error': return '错误';
            case 'warning': return '警告';
            default: return '提示';
        }
    }

    /**
     * 创建庆祝特效
     */
    createCelebrationEffects() {
        const display = this.elements.nameDisplay;
        
        // 创建一些随机粒子特效
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.left = '50%';
            particle.style.top = '50%';
            particle.style.width = `${Math.random() * 8 + 4}px`;
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = this.getRandomColor();
            particle.style.borderRadius = '50%';
            particle.style.position = 'absolute';
            particle.style.zIndex = '1000';
            particle.style.animation = `celebrate ${Math.random() * 1 + 0.5}s ease-out forwards`;
            
            display.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    /**
     * 获取随机颜色
     */
    getRandomColor() {
        const colors = [
            '#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444',
            '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

/**
 * 添加CSS动画
 */
function addCustomAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes celebrate {
            0% { transform: translate(0, 0) scale(1); opacity: 1; }
            100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0); opacity: 0; }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .selected-name {
            font-size: 4rem;
            font-weight: 800;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            animation: bounceIn 0.5s ease;
        }
        
        .celebration-particle {
            position: absolute;
            pointer-events: none;
            z-index: 1000;
        }
        
        .animate-in {
            animation: fadeIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    addCustomAnimations();
    window.namePicker = new NamePicker();
    
    // 显示欢迎通知
    setTimeout(() => {
        window.namePicker.showNotification('欢迎使用点名大师！点击"开始抽取"按钮开始随机点名', 'success');
    }, 1000);
});