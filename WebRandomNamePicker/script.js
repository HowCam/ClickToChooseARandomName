class NameModel {
    constructor() {
        this.groups = {
            '默认组': []
        };
        this.currentGroup = '默认组';
        this.currentName = null;
        this.isRollingMode = false;
        this.isRolling = false;
        this.scrollInterval = null;
        this.speed = 50;
        this.acceleration = 0.95;
    }

    get names() {
        return this.groups[this.currentGroup] || [];
    }

    pickRandomName() {
        if (this.names.length === 0) return;
        this.currentName = this.names[Math.floor(Math.random() * this.names.length)];
        this.playSound();
        return this.currentName;
    }

    startRolling() {
        if (this.names.length === 0 || this.isRolling) return;
        
        this.isRolling = true;
        this.speed = 50;
        let counter = 0;
        
        this.scrollInterval = setInterval(() => {
            this.pickRandomName();
            updateNameDisplay();
            
            counter++;
            this.speed *= this.acceleration;
            
            if (counter > 30 || this.speed < 5) {
                this.stopRolling();
            }
        }, this.speed);
    }

    stopRolling() {
        clearInterval(this.scrollInterval);
        this.isRolling = false;
    }

    playSound() {
        const audio = new Audio('click.wav');
        audio.play().catch(e => console.log('无法播放音效:', e));
    }

    importNames(text, groupName = this.currentGroup) {
        if (!this.groups[groupName]) {
            this.groups[groupName] = [];
        }
        this.groups[groupName] = text.split('\n')
            .filter(name => name.trim() !== '');
        this.currentGroup = groupName;
        this.saveNames();
        this.pickRandomName();
        updateNameDisplay();
        this.updateGroupSelector();
        // 确保文本框内容更新为当前组名单
        document.getElementById('nameInput').value = this.groups[groupName].join('\n');
    }

    updateGroupSelector() {
        const select = document.getElementById('groupSelect');
        if (!select) return;
        
        select.innerHTML = '';
        Object.keys(this.groups).forEach(group => {
            const option = document.createElement('option');
            option.value = group;
            option.textContent = group;
            option.selected = group === this.currentGroup;
            select.appendChild(option);
        });
    }

    addGroup(groupName) {
        if (!groupName.trim()) return false;
        if (this.groups[groupName]) return false;
        
        this.groups[groupName] = [];
        this.currentGroup = groupName;
        this.saveNames();
        return true;
    }

    saveNames() {
        localStorage.setItem('randomNamePickerGroups', JSON.stringify({
            groups: this.groups,
            currentGroup: this.currentGroup
        }));
    }

    loadNames() {
        const savedData = localStorage.getItem('randomNamePickerGroups');
        if (savedData) {
            const { groups, currentGroup } = JSON.parse(savedData);
            this.groups = groups;
            this.currentGroup = currentGroup;
            this.pickRandomName();
            updateNameDisplay();
            this.updateGroupSelector();
            return true;
        }
        return false;
    }
}

const nameModel = new NameModel();
let isRollingMode = false;

// DOM元素
const currentNameEl = document.getElementById('currentName');
const pickButton = document.getElementById('pickButton');
const modeButton = document.getElementById('modeButton');
const importButton = document.getElementById('importButton');

// 初始化
function init() {
    pickButton.addEventListener('click', () => {
        if (isRollingMode) {
            nameModel.startRolling();
        } else {
            nameModel.pickRandomName();
            updateNameDisplay();
        }
    });

    modeButton.addEventListener('click', () => {
        isRollingMode = !isRollingMode;
        updateModeButton();
    });

    // 导入按钮点击事件
    importButton.addEventListener('click', () => {
        document.getElementById('importPanel').style.display = 'block';
        // 显示当前选中组的名单
        document.getElementById('nameInput').value = nameModel.groups[nameModel.currentGroup]?.join('\n') || '';
    });

    // 确认导入按钮
    document.getElementById('confirmImport').addEventListener('click', () => {
        const names = document.getElementById('nameInput').value;
        const groupName = document.getElementById('groupSelect').value;
        if (names.trim()) {
            nameModel.importNames(names, groupName);
            document.getElementById('importPanel').style.display = 'none';
            return true; // 确保操作完成
        }
        return false;
    });

    // 取消导入按钮
    document.getElementById('cancelImport').addEventListener('click', () => {
        document.getElementById('importPanel').style.display = 'none';
    });

    // 新建组按钮
    document.getElementById('addGroupBtn').addEventListener('click', () => {
        const groupName = prompt('请输入新组名:');
        if (groupName && nameModel.addGroup(groupName)) {
            // 确保下拉菜单更新
            const select = document.getElementById('groupSelect');
            select.value = groupName;
            document.getElementById('nameInput').value = ''; // 清空文本框
        }
    });

    // 移除重复的updateGroupSelector函数

    // 尝试加载本地存储的名单
    if (!nameModel.loadNames()) {
        // 如果没有本地数据，加载测试数据
        nameModel.importNames("张三\n李四\n王五\n赵六\n钱七");
    }
    updateNameDisplay();
    updateModeButton();

    // 切换小组按钮事件
    document.getElementById('switchGroupButton').addEventListener('click', () => {
        const select = document.getElementById('groupSelect');
        const currentIndex = Array.from(select.options).findIndex(opt => opt.selected);
        const nextIndex = (currentIndex + 1) % select.options.length;
        select.selectedIndex = nextIndex;
        select.dispatchEvent(new Event('change'));
    });

    // 组选择器变更事件
    document.getElementById('groupSelect').addEventListener('change', (e) => {
        nameModel.currentGroup = e.target.value;
        nameModel.saveNames(); // 保存当前组选择
        nameModel.pickRandomName();
        updateNameDisplay();
        // 切换组时关闭导入面板并更新文本框内容
        document.getElementById('importPanel').style.display = 'none';
        document.getElementById('nameInput').value = nameModel.groups[nameModel.currentGroup]?.join('\n') || '';
    });
}

function updateNameDisplay() {
    currentNameEl.textContent = nameModel.currentName || '点击抽取';
}

function updateModeButton() {
    const icon = modeButton.querySelector('.button-icon');
    const text = modeButton.querySelector('.button-text');
    
    icon.textContent = isRollingMode ? '🔄' : '🔀';
    text.textContent = isRollingMode ? '滚动模式' : '直接模式';
}

// 启动应用
document.addEventListener('DOMContentLoaded', init);
